import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { PlayIcon, UsersIcon, ShareIcon, VideoCameraIcon } from '@heroicons/react/24/solid';
import { MneeTransactionButton } from '../../components/web3/MneeTransactionButton';
import { MNEE_CONFIG } from '../../lib/mnee';
import { Loader2, Heart } from 'lucide-react';

export const LivePage = () => {
  const { user } = useAuth();
  const [isLive, setIsLive] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleStart = async () => {
    setLoading(true);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        setIsLive(true);
        setViewers(12); // Initial mock viewer count
    } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access camera/microphone. Please check permissions.");
    } finally {
        setLoading(false);
    }
  };

  const handleEnd = () => {
      if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
      }
      if (videoRef.current) {
          videoRef.current.srcObject = null;
      }
      setIsLive(false);
      setViewers(0);
  };

  // Cleanup on unmount
  useEffect(() => {
      return () => {
          if (streamRef.current) {
               streamRef.current.getTracks().forEach(track => track.stop());
          }
      }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left Column: Stream Player */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
            {isLive ? (
               <div className="absolute inset-0 bg-black">
                   <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                   />

                <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold animate-pulse">LIVE</span>
                    <span className="bg-black/50 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 backdrop-blur-md">
                        <UsersIcon className="w-4 h-4" /> {viewers}
                    </span>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <VideoCameraIcon className="w-10 h-10 text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-400 mb-2">Stream Offline</h2>
                <p className="text-gray-500 mb-6">Ready to share your creative process?</p>
                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl font-bold hover:from-red-500 hover:to-pink-500 transition-all shadow-lg shadow-red-900/20 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {loading ? 'Access Camera & Go Live' : 'Go Live Now'}
                </button>
              </div>
            )}
          </div>

          {/* Stream Info */}
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold mb-2">{isLive ? `${user?.email || 'User'}'s Live Session` : "Offline Session"}</h1>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">Creative</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">Vibe Coding</span>
                </div>
            </div>
            <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <ShareIcon className="w-5 h-5" /> Share
                </button>
                {isLive && (
                    <button
                        onClick={handleEnd}
                        className="flex items-center gap-2 px-4 py-2 bg-red-900/50 text-red-400 rounded-lg hover:bg-red-900/70 transition-colors border border-red-900"
                    >
                        End Stream
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
                {isLive ? (
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
                                        Sent 10 MNEE <Heart className="w-3 h-3 fill-current" />
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

            {/* Tipping & Chat Input */}
            <div className="p-4 bg-gray-900 border-t border-gray-800 space-y-3">
                {isLive && (
                    <div className="flex gap-2 justify-center pb-2 border-b border-gray-800">
                         <MneeTransactionButton
                            recipientAddress={MNEE_CONFIG.address} // Streamer address would go here
                            amount="5.0"
                            label="Tip 5 MNEE"
                            className="w-full text-xs py-2 bg-gradient-to-r from-purple-600 to-blue-600"
                        />
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Say something..."
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none"
                    disabled={!isLive}
                />
            </div>
        </div>

      </div>
    </div>
  );
};

export default LivePage;
