// YourSpace Creative Labs - Streaming Session Hook
import { useState, useEffect, useMemo } from 'react';
import { useStreaming } from './useStreaming';
// YourSpace Creative Labs - Streaming Session Hook (Placeholder)
import { useState, useEffect } from 'react';
import { useStreaming } from './useStreaming';
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
  const {
    currentStream,
    participants: streamParticipants,
    isLoading,
    createStream,
    joinStream,
    leaveStream,
    endStream,
    fetchActiveStreams,
  } = useStreaming();

  const [streamError, setStreamError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Map currentStream to StreamingSession interface
  const session: StreamingSession | null = useMemo(() => {
    if (!currentStream) return null;
    return {
      id: currentStream.id,
      roomId: currentStream.room_id,
      title: currentStream.title,
      isActive: currentStream.status === 'live',
      startTime: currentStream.started_at || currentStream.created_at,
      started_at: currentStream.started_at || currentStream.created_at,
      participants: streamParticipants.map(p => p.user_id),
      profiles: currentStream.host,
    };
  }, [currentStream, streamParticipants]);

  // Map streamParticipants to StreamParticipant interface
  const participants: StreamParticipant[] = useMemo(() => {
    return streamParticipants.map(p => ({
      id: p.id,
      userId: p.user_id,
      username: p.profiles?.username || 'Unknown',
      isHost: p.role === 'host',
      isStreaming: p.is_camera_on || p.is_screen_sharing,
      joinedAt: p.joined_at,
    }));
  }, [streamParticipants]);

  const isHost = useMemo(() => {
    if (!currentStream || !user) return false;
    // Check if user is the creator/host of the stream
    return currentStream.created_by === user.id ||
           streamParticipants.some(p => p.user_id === user.id && p.role === 'host');
  }, [currentStream, user, streamParticipants]);

  const isStreaming = !!currentStream && currentStream.status === 'live';

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
  useEffect(() => {
    // Initial fetch of active streams for the room
    fetchActiveStreams(roomId).catch(console.error);
  }, [roomId]);

  const startStreaming = async (title: string, description: string) => {
    console.log('Starting stream:', { roomId, title, description });
    setIsConnecting(true);
    setStreamError(null);
    try {
      await createStream({
        roomId,
        title,
        description,
        streamType: 'social', // Default to social
      });
    } catch (error: any) {
      console.error('Failed to start stream:', error);
      setStreamError(error.message || 'Failed to start stream');
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
    if (!currentStream) return;

    setIsConnecting(true);
    setStreamError(null);
    try {
      await endStream(currentStream.id);
    } catch (error: any) {
      console.error('Failed to stop stream:', error);
      setStreamError(error.message || 'Failed to stop stream');
    } finally {
      setIsConnecting(false);
    }
  };

  const joinSession = async () => {
    console.log('Joining session:', roomId);
    setIsConnecting(true);
    setStreamError(null);
    try {
        // We need to get the active stream for this room
        const streams = await fetchActiveStreams(roomId);
        const activeStream = streams.find(s => s.status === 'live');

        if (activeStream) {
            await joinStream(activeStream.id);
        } else {
            setStreamError('No active stream found in this room');
        }
    } catch (error: any) {
        console.error('Failed to join session:', error);
        setStreamError(error.message || 'Failed to join session');
    } finally {
        setIsConnecting(false);
    }
  };

  const leaveSession = async () => {
    console.log('Leaving session:', roomId);
    if (!currentStream) return;

    try {
      await leaveStream(currentStream.id);
    } catch (error: any) {
      console.error('Failed to leave session:', error);
    }
  };

  return {
    session,
    participants,
    isHost,
    isConnecting: isConnecting || isLoading,
    isStreaming,
    startStreaming,
    stopStreaming,
    joinSession,
    leaveSession,
    streamError,
  };
};
