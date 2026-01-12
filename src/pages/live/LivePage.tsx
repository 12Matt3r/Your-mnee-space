import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { PlayIcon, UsersIcon, ChatBubbleLeftIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/solid';
import { MNEE_CONFIG, formatMNEE } from '../../lib/mnee';
import { StreamChat } from '../../components/room/StreamChat';
import { useLiveStream } from '../../hooks/useLiveStream';
import { Loader2 } from 'lucide-react';

export const LivePage = () => {
  const { user } = useAuth();
  const { currentStream, startStream, endStream, loading } = useLiveStream();
  const [viewers, setViewers] = useState(0);

  const handleStart = async () => {
      await startStream(`${user?.email}'s Creative Session`);
      setViewers(12); // Initial mock viewer count for feedback
  };

  const handleEnd = async () => {
      await endStream();
      setViewers(0);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left Column: Stream Player */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
            {currentStream ? (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-pulse w-32 h-32 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-24 h-24 bg-purple-500/40 rounded-full flex items-center justify-center">
                            <UsersIcon className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold">You are Live!</h2>
                    <p className="text-gray-400">Broadcasting to the YourSpace network</p>
                </div>

                <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold animate-pulse">LIVE</span>
                    <span className="bg-black/50 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1">
                        <UsersIcon className="w-4 h-4" /> {currentStream.viewer_count || viewers}
                    </span>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <PlayIcon className="w-10 h-10 text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-400 mb-2">Stream Offline</h2>
                <p className="text-gray-500 mb-6">Ready to share your creative process?</p>
                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl font-bold hover:from-red-500 hover:to-pink-500 transition-all shadow-lg shadow-red-900/20 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {loading ? 'Starting...' : 'Go Live Now'}
                </button>
              </div>
            )}
          </div>

          {/* Stream Info */}
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold mb-2">{currentStream ? currentStream.title : `${user?.email}'s Session`}</h1>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">Creative</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">Vibe Coding</span>
                </div>
            </div>
            <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <ShareIcon className="w-5 h-5" /> Share
                </button>
                {currentStream && (
                    <button
                        onClick={handleEnd}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-red-900/50 text-red-400 rounded-lg hover:bg-red-900/70 transition-colors border border-red-900"
                    >
                        {loading ? 'Ending...' : 'End Stream'}
                    </button>
                )}
            </div>
          </div>
        </div>

        {/* Right Column: Chat */}
        <div className="lg:col-span-1 h-[600px] lg:h-auto bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-800 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-800 font-bold flex justify-between items-center">
                <span>Live Chat</span>
                <span className="text-xs text-gray-500">MNEE Tips Enabled</span>
            </div>

            {/* Using mock chat for now or real component if it fits */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentStream ? (
                    <>
                        <div className="text-xs text-gray-500 text-center my-4">Welcome to the chat room!</div>
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0" />
                            <div>
                                <span className="font-bold text-sm text-gray-300">Fan123</span>
                                <p className="text-sm text-gray-400">This looks amazing! 🔥</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500 flex-shrink-0" />
                            <div>
                                <span className="font-bold text-sm text-gray-300">MNEE_Whale</span>
                                <div className="p-2 bg-green-900/30 border border-green-500/30 rounded-lg mt-1">
                                    <p className="text-sm text-green-400 font-bold flex items-center gap-1">
                                        Sent 10 MNEE <HeartIcon className="w-3 h-3" />
                                    </p>
                                    <p className="text-sm text-white">Keep up the great work!</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-600 text-sm">
                        Chat is offline
                    </div>
                )}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-gray-900 border-t border-gray-800">
                <input
                    type="text"
                    placeholder="Say something..."
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                    disabled={!currentStream}
                />
            </div>
        </div>

      </div>
    </div>
  );
};

export default LivePage;
