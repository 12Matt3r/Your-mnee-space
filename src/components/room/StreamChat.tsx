// YourSpace Creative Labs - Stream Chat Component
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface StreamChatProps {
  sessionId?: string;
  roomId?: string;
  className?: string;
  onClose?: () => void;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: string;
}

const StreamChat: React.FC<StreamChatProps> = ({ sessionId, roomId, className }) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Determine the channel topic
  // Prioritize sessionId (stream specific), then roomId (room specific), then global fallback
  const channelTopic = sessionId || roomId || 'global-chat';

  useEffect(() => {
    // Create channel for real-time messaging
    const channel = supabase.channel(`room-chat:${channelTopic}`, {
      config: {
        broadcast: {
          self: false, // We will update local state immediately, so don't receive own messages
        },
      },
    });

    channel
      .on('broadcast', { event: 'chat-message' }, (payload) => {
        // console.log('Received message:', payload);
        if (payload.payload) {
          const incomingMessage = payload.payload as ChatMessage;
          setMessages((prev) => [...prev, incomingMessage]);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
           // console.log(`Subscribed to chat channel: ${channelTopic}`);
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelTopic]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user?.id || 'guest',
      username: profile?.display_name || profile?.username || 'Guest',
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    // Update local state immediately
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Broadcast message to other participants
    if (channelRef.current) {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'chat-message',
        payload: message,
      });
    }
  };

  return (
    <div className={cn('flex flex-col h-full bg-gray-900/50 backdrop-blur-sm border-l border-gray-700', className)}>
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Live Chat</h3>
        <p className="text-sm text-gray-400">{messages.length} messages</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No messages yet</p>
            <p className="text-sm">Be the first to say hello!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-purple-400">
                  {message.username}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-200">{message.message}</p>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <PaperAirplaneIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default StreamChat;
