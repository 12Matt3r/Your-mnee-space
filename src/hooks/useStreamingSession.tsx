// YourSpace Creative Labs - Streaming Session Hook (Placeholder)
import { useState, useEffect } from 'react';
import { useStreaming } from './useStreaming';

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
  const [session, setSession] = useState<StreamingSession | null>(null);
  const [participants, setParticipants] = useState<StreamParticipant[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  const { createStream, endStream } = useStreaming();

  const startStreaming = async (title: string, description: string) => {
    console.log('Starting stream:', { roomId, title, description });
    try {
      setIsConnecting(true);
      const stream = await createStream({
        roomId,
        title,
        description,
        streamType: 'teaching', // Default type, could be passed as arg
      });

      // Map StreamSession to StreamingSession
      const newSession: StreamingSession = {
        id: stream.id,
        roomId: stream.room_id,
        title: stream.title,
        isActive: stream.status === 'live',
        startTime: stream.started_at || new Date().toISOString(),
        started_at: stream.started_at || new Date().toISOString(),
        participants: [],
        profiles: stream.host ? {
          display_name: stream.host.display_name || stream.host.username,
          username: stream.host.username,
          avatar_url: stream.host.avatar_url
        } : undefined
      };

      setSession(newSession);
      setIsStreaming(true);
      setIsHost(true);
    } catch (error: any) {
      console.error('Error starting stream:', error);
      setStreamError(error.message || 'Failed to start stream');
      setIsStreaming(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const stopStreaming = async () => {
    console.log('Stopping stream:', roomId);

    if (session?.id) {
      try {
        await endStream(session.id);
      } catch (error) {
        console.error('Error stopping stream:', error);
      }
    }

    setIsStreaming(false);
    setIsHost(false);
    setSession(null);
    setParticipants([]);
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
    setSession(null);
    setParticipants([]);
    setIsStreaming(false);
    // TODO: Implement actual leave session logic
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
