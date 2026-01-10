// YourSpace Creative Labs - Streaming Session Hook
import { useState, useEffect, useMemo } from 'react';
import { useStreaming, StreamSession as UseStreamingSession, StreamParticipant as UseStreamingParticipant } from './useStreaming';
import { useState, useMemo } from 'react';
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

  const [streamError, setStreamError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Map currentStream to StreamingSession interface
    isLoading
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
      startTime: currentStream.started_at || currentStream.created_at,
      started_at: currentStream.started_at || currentStream.created_at,
      participants: streamParticipants.map(p => p.user_id),
      profiles: currentStream.host,
    };
  }, [currentStream, streamParticipants]);

  // Map streamParticipants to StreamParticipant interface
  const participants: StreamParticipant[] = useMemo(() => {
    return streamParticipants.map(p => ({
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
    // Unsubscribe from channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    setIsStreaming(false);
    setIsConnecting(false);
    setRemoteStream(null);
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const startStreaming = async (title: string, description: string, stream: MediaStream) => {
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

    // Reset state
    cleanup();

    setIsHost(true);
    setIsStreaming(true);
    localStreamRef.current = stream;

    // Create a mock session object for UI
    setSession({
      id: crypto.randomUUID(),
      roomId,
      title,
      isActive: true,
      startTime: new Date().toISOString(),
      started_at: new Date().toISOString(),
      participants: [],
      profiles: { display_name: 'Host' } // Placeholder
    });

    try {
      // Initialize Supabase channel
      const channel = supabase.channel(`streaming:${roomId}`);
      channelRef.current = channel;

      channel
        .on('broadcast', { event: 'join-request' }, async (payload) => {
          console.log('Received join request:', payload);
          const { viewerId } = payload.payload;

          if (!viewerId) return;

          // Add participant to state
          setParticipants((prev) => {
            if (prev.find((p) => p.id === viewerId)) return prev;
            return [
              ...prev,
              {
                id: viewerId,
                userId: viewerId,
                username: `Viewer ${viewerId.slice(0, 4)}`,
                isHost: false,
                isStreaming: false,
                joinedAt: new Date().toISOString(),
              },
            ];
          });

          // Create PeerConnection for this viewer
          const pc = new RTCPeerConnection(ICE_SERVERS);
          peerConnections.current.set(viewerId, pc);

          // Add local tracks to PC
          if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
              pc.addTrack(track, localStreamRef.current!);
            });
          }

          // Handle ICE candidates
          pc.onicecandidate = (event) => {
            if (event.candidate) {
              channel.send({
                type: 'broadcast',
                event: 'ice-candidate',
                payload: {
                  candidate: event.candidate,
                  target: viewerId,
                },
              });
            }
          };

          // Create Offer
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          // Send Offer
          channel.send({
            type: 'broadcast',
            event: 'offer',
            payload: {
              sdp: offer,
              target: viewerId,
              hostId: 'host', // Simple host ID
            },
          });
        })
        .on('broadcast', { event: 'answer' }, async (payload) => {
          console.log('Received answer:', payload);
          const { sdp, viewerId } = payload.payload;
          const pc = peerConnections.current.get(viewerId);
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          }
        })
        .on('broadcast', { event: 'ice-candidate' }, async (payload) => {
          const { candidate, target } = payload.payload;
          // Host checks if the candidate is from a viewer (we might need a senderId in payload)
          // For simplicity, we assume if we are host, we only handle candidates meant for us if we were a viewer?
          // No, host receives candidates from viewer.
          // We need to know WHICH viewer sent it.
          // Let's update the payload to include senderId.
          // For now, let's assume we handle it if we find the PC?
          // But wait, the viewer sends candidate to host.
          // If we are host, we need to know who sent it.
          // Let's assume the payload includes `senderId`.
          if (payload.payload.senderId) {
             const pc = peerConnections.current.get(payload.payload.senderId);
             if (pc) {
               await pc.addIceCandidate(new RTCIceCandidate(candidate));
             }
          }
        })
        .on('broadcast', { event: 'leave' }, (payload) => {
           const { viewerId } = payload.payload;
           const pc = peerConnections.current.get(viewerId);
           if (pc) {
             pc.close();
             peerConnections.current.delete(viewerId);
             setParticipants(prev => prev.filter(p => p.id !== viewerId));
           }
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Host subscribed to signaling channel');
          }
        });

    } catch (error) {
      console.error('Error starting stream:', error);
      setStreamError(error instanceof Error ? error.message : 'Unknown error');
      setIsStreaming(false);
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
    if (channelRef.current) {
        channelRef.current.send({
            type: 'broadcast',
            event: 'stream-end',
            payload: {}
        });
    }
    cleanup();
  };

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
            await joinStream(activeStream.id);
        } else {
            setStreamError('No active stream found in this room');
        }
    } catch (error: any) {
        console.error('Failed to join session:', error);
        setStreamError(error.message || 'Failed to join session');
    } finally {
        setIsConnecting(false);
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
    setIsHost(false);

    // Reset remote stream
    setRemoteStream(null);

    try {
      const channel = supabase.channel(`streaming:${roomId}`);
      channelRef.current = channel;

      const viewerId = viewerIdRef.current;

      channel
        .on('broadcast', { event: 'offer' }, async (payload) => {
          const { sdp, target } = payload.payload;
          if (target !== viewerId) return;

          console.log('Received offer');

          const pc = new RTCPeerConnection(ICE_SERVERS);
          hostConnection.current = pc;

          pc.onicecandidate = (event) => {
            if (event.candidate) {
              channel.send({
                type: 'broadcast',
                event: 'ice-candidate',
                payload: {
                  candidate: event.candidate,
                  target: 'host', // Target the host
                  senderId: viewerId
                },
              });
            }
          };

          pc.ontrack = (event) => {
            console.log('Received remote track');
            setRemoteStream(event.streams[0]);
            setIsConnecting(false);
            setIsStreaming(true);
             // Mock session
            setSession({
                id: 'session-id',
                roomId,
                title: 'Live Stream',
                isActive: true,
                startTime: new Date().toISOString(),
                started_at: new Date().toISOString(),
                participants: [],
                profiles: { display_name: 'Host' }
            });
          };

          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          channel.send({
            type: 'broadcast',
            event: 'answer',
            payload: {
              sdp: answer,
              viewerId: viewerId,
            },
          });
        })
        .on('broadcast', { event: 'ice-candidate' }, async (payload) => {
           const { candidate, target } = payload.payload;
           if (target === viewerId && hostConnection.current) {
             await hostConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
           }
        })
        .on('broadcast', { event: 'stream-end' }, () => {
            console.log('Stream ended by host');
            cleanup();
            setSession(null);
            alert('The stream has ended.');
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Viewer subscribed, sending join request');
            // Request to join
            channel.send({
              type: 'broadcast',
              event: 'join-request',
              payload: { viewerId },
            });
          }
        });

    } catch (error) {
      console.error('Error joining session:', error);
      setIsConnecting(false);
      setStreamError(error instanceof Error ? error.message : 'Unknown error');
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
