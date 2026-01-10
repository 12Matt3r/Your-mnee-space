// YourSpace Creative Labs - Streaming Session Hook
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useStreaming, StreamSession as UseStreamingSession, StreamParticipant as UseStreamingParticipant } from './useStreaming';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { RealtimeChannel } from '@supabase/supabase-js';

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

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useStreamingSession = (roomId: string) => {
  const { user } = useAuth();
  const {
    currentStream,
    participants: streamParticipants,
    isLoading,
    participants: realParticipants,
    createStream,
    joinStream,
    leaveStream,
    endStream,
    fetchActiveStreams,
  } = useStreaming();

  const [session, setSession] = useState<StreamingSession | null>(null);
  const [participants, setParticipants] = useState<StreamParticipant[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const hostConnection = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const viewerIdRef = useRef<string>(crypto.randomUUID());

  // Cleanup function
  const cleanup = useCallback(() => {
    // Close all peer connections
    peerConnections.current.forEach((pc) => pc.close());
    peerConnections.current.clear();

    if (hostConnection.current) {
      hostConnection.current.close();
      hostConnection.current = null;
    }
  }, []);

  // Derived state
  const isStreaming = !!currentStream && currentStream.status === 'live';

  useEffect(() => {
    if (currentStream && user) {
        setIsHost(currentStream.created_by === user.id);
    }
  }, [currentStream, user]);

  useEffect(() => {
    if (!currentStream) {
        setSession(null);
        return;
    }
    setSession({
      id: currentStream.id,
      roomId: currentStream.room_id,
      title: currentStream.title,
      isActive: currentStream.status === 'live',
      startTime: currentStream.started_at || currentStream.created_at,
      started_at: currentStream.started_at || currentStream.created_at,
      participants: streamParticipants.map(p => p.user_id),
      profiles: currentStream.host,
    });
  }, [currentStream, streamParticipants]);

  // Map streamParticipants to StreamParticipant interface
  useEffect(() => {
    const parts = realParticipants.map(p => ({
      id: p.id,
      userId: p.user_id,
      username: p.profiles?.username || 'Unknown',
      isHost: p.role === 'host',
      isStreaming: p.is_camera_on || p.is_screen_sharing,
      joinedAt: p.joined_at,
    }));
    setParticipants(parts);
  }, [realParticipants]);


  const handleStartStreaming = async (title: string, description: string) => {
    try {
      setStreamError(null);
      setIsConnecting(true);
      await createStream({
        roomId,
        title,
        description,
        streamType: 'social', // Default
      });
    } catch (err: any) {
      setStreamError(err.message);
    } finally {
        setIsConnecting(false);
    }
  };

  const handleStopStreaming = async () => {
    if (currentStream) {
      await endStream(currentStream.id);
    }
    // Unsubscribe from channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    setIsConnecting(false);
    setRemoteStream(null);
    cleanup();
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const handleJoinSession = async () => {
    console.log('Joining session:', roomId);
    cleanup();
    setIsConnecting(true);
    setStreamError(null);
    try {
        // We need to get the active stream for this room
        const streams = await fetchActiveStreams(roomId);
        const activeStream = streams.find(s => s.status === 'live');

        if (activeStream) {
            await joinStream(activeStream.id, 'viewer');
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

  const handleLeaveSession = async () => {
    if (currentStream) {
      await leaveStream(currentStream.id);
    }
    setIsHost(false);
    setRemoteStream(null);
    cleanup();
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
    remoteStream,
  };
};
