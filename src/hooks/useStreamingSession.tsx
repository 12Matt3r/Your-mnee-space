// YourSpace Creative Labs - Streaming Session Hook
import { useState, useMemo } from 'react';
import { useStreaming } from './useStreaming';
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
    participants: realParticipants,
    createStream,
    joinStream,
    leaveStream,
    endStream,
    fetchActiveStreams,
    isLoading
  } = useStreaming();

  const [isConnecting, setIsConnecting] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  // Derived state
  const isStreaming = !!currentStream && currentStream.status === 'live';

  const isHost = useMemo(() => {
    return currentStream?.created_by === user?.id;
  }, [currentStream, user]);

  const session: StreamingSession | null = useMemo(() => {
    if (!currentStream) return null;
    return {
      id: currentStream.id,
      roomId: currentStream.room_id,
      title: currentStream.title,
      isActive: currentStream.status === 'live',
      startTime: currentStream.scheduled_start || currentStream.created_at,
      started_at: currentStream.started_at || currentStream.created_at,
      participants: realParticipants.map(p => p.user_id),
      profiles: currentStream.host
    };
  }, [currentStream, realParticipants]);

  const participants: StreamParticipant[] = useMemo(() => {
    return realParticipants.map(p => ({
      id: p.id,
      userId: p.user_id,
      username: p.profiles?.username || 'Unknown',
      isHost: p.role === 'host',
      isStreaming: p.is_camera_on || p.is_screen_sharing,
      joinedAt: p.joined_at
    }));
  }, [realParticipants]);

  const handleStartStreaming = async (title: string, description: string) => {
    try {
      setStreamError(null);
      await createStream({
        roomId,
        title,
        description,
        streamType: 'social', // Default
      });
    } catch (err: any) {
      setStreamError(err.message);
    }
  };

  const handleStopStreaming = async () => {
    if (currentStream) {
      await endStream(currentStream.id);
    }
  };

  const handleJoinSession = async () => {
    console.log('Joining session:', roomId);
    setIsConnecting(true);
    setStreamError(null);
    try {
      const streams = await fetchActiveStreams(roomId);
      const activeStream = streams.find(s => s.status === 'live');

      if (activeStream) {
        await joinStream(activeStream.id, 'viewer');
      } else {
        console.log('No active stream found in room:', roomId);
        setStreamError('No active stream found');
      }
    } catch (err: any) {
      console.error('Failed to join session:', err);
      setStreamError('Failed to join session');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLeaveSession = async () => {
    if (currentStream) {
      await leaveStream(currentStream.id);
    }
  };

  return {
    session,
    participants,
    isHost,
    isConnecting: isConnecting || isLoading,
    isStreaming,
    startStreaming: handleStartStreaming,
    stopStreaming: handleStopStreaming,
    joinSession: handleJoinSession,
    leaveSession: handleLeaveSession,
    streamError,
  };
};
