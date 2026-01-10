// YourSpace Creative Labs - Streaming Session Hook (Placeholder)
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface StreamingSession {
  id: string;
  roomId: string;
  title: string;
  isActive: boolean;
  startTime: string;
  started_at: string;
  participants: string[];
  profiles?: any;
}

export interface StreamParticipant {
  id: string;
  userId: string;
  username: string;
  isHost: boolean;
  isStreaming: boolean;
  joinedAt: string;
}

export const useStreamingSession = (roomId: string) => {
  const { user } = useAuth();
  const [session, setSession] = useState<StreamingSession | null>(null);
  const [participants, setParticipants] = useState<StreamParticipant[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  const startStreaming = async (title: string, description: string) => {
    console.log('Starting stream:', { roomId, title, description });
    setIsStreaming(true);
    // TODO: Implement actual streaming logic
  };

  const stopStreaming = async () => {
    console.log('Stopping stream:', roomId);
    setIsStreaming(false);
    // TODO: Implement actual stop streaming logic
  };

  const joinSession = async () => {
    console.log('Joining session:', roomId);
    setIsConnecting(true);
    // TODO: Implement actual join session logic
    setTimeout(() => {
      setIsConnecting(false);
    }, 1000);
  };

  const leaveSession = async () => {
    console.log('Leaving session:', roomId);

    // Attempt to close the visit record if user is authenticated
    if (user && roomId) {
      try {
        // Find the most recent open visit for this room and user
        const { data: visits, error: fetchError } = await supabase
          .from('room_visits')
          .select('id, created_at')
          .eq('room_id', roomId)
          .eq('visitor_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!fetchError && visits && visits.length > 0) {
          const visit = visits[0];
          const duration = Math.floor((Date.now() - new Date(visit.created_at).getTime()) / 1000);

          // Update the visit with duration
          await supabase
            .from('room_visits')
            .update({ visit_duration: duration })
            .eq('id', visit.id);

          console.log('Updated visit duration:', duration);
        }
      } catch (error) {
        console.error('Error leaving session:', error);
      }
    }

    setSession(null);
    setParticipants([]);
    setIsStreaming(false);
  };

  return {
    session,
    participants,
    isHost,
    isConnecting,
    isStreaming,
    startStreaming,
    stopStreaming,
    joinSession,
    leaveSession,
    streamError,
  };
};
