import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, ChevronLeft, Send, Bot, CheckCircle, Lock, Wallet, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { MNEE_CONTRACT_ADDRESS, MNEE_ABI } from '../../lib/wagmi';
import { MNEE_CONFIG } from '../../lib/mnee';
import { useLearning } from '../../hooks/useLearning';
import { LearningModule } from '../../lib/supabase';

// Treasury Address for receiving payments (Mock address for hackathon)
const TREASURY_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

const CHAT_INITIAL_STATE = [
  { id: 1, sender: 'ai', text: "Hi! I'm your AI Mentor for this course. I can help you understand the concepts or give you feedback on your work. What would you like to focus on today?" }
];

export const ModuleViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getModuleById } = useLearning();
  const [module, setModule] = useState<LearningModule | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState(CHAT_INITIAL_STATE);
  const [newMessage, setNewMessage] = useState('');
  const [isMentorActive, setIsMentorActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Web3 State
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: MNEE_CONTRACT_ADDRESS,
  } as any);
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (id) {
        getModuleById(id).then(data => {
            if (data) setModule(data);
        });
    }
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isConfirmed) {
        setIsMentorActive(true);
        toast.success('Mentor Mode Activated!');
        setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'ai',
            text: "I'm now in Mentor Mode! I'll guide you step-by-step and track your progress. Let's start with the first concept."
        }]);
    }
  }, [isConfirmed]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: newMessage };
    setMessages(prev => [...prev, userMsg]);
    setNewMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "That's a great question! In vibe coding, we focus on the feeling first.",
        "Try adjusting the hex code to a cooler tone, that usually helps with the atmosphere.",
        "I can review your code if you paste it here!",
        "Remember, less is often more when designing virtual spaces."
      ];
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: randomResponse }]);
    }, 1000);
  };

  const activateMentor = () => {
    if (!isConnected) {
        toast.error('Please connect your wallet first');
        navigate('/wallet');
        return;
    }

    const cost = 1.0;
    const requiredAmount = parseUnits(cost.toString(), MNEE_CONFIG.decimals);

    if (!balance || balance.value < requiredAmount) {
      toast.error(`Insufficient MNEE. You need ${cost} MNEE.`);
      navigate('/wallet');
      return;
    }

    try {
        writeContract({
            address: MNEE_CONTRACT_ADDRESS,
            abi: MNEE_ABI,
            functionName: 'transfer',
            args: [TREASURY_ADDRESS, requiredAmount],
            account: address,
            chain: undefined,
        });
    } catch (error) {
        console.error('Payment failed:', error);
        toast.error('Payment failed to initiate.');
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }
  };

  if (!module) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-gray-950 text-white">
      {/* Left Column: Content */}
      <div className="flex-1 flex flex-col border-r border-gray-800">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center gap-4">
          <button onClick={() => navigate('/learning')} className="p-2 hover:bg-gray-800 rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg">{module.title}</h1>
            <p className="text-sm text-gray-400">Lesson 1 of {module.steps?.length || 0}</p>
          </div>
        </div>

        {/* Video Player Placeholder */}
        <div className="aspect-video bg-black relative group cursor-pointer" onClick={togglePlay}>
          <video
            ref={videoRef}
            src={module.video_url || ''}
            className="w-full h-full object-contain"
            loop
          />
          <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
             <button className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all">
                {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
             </button>
          </div>
        </div>

        {/* Steps */}
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="font-bold mb-4 text-gray-300">Course Steps</h2>
          <div className="space-y-3">
            {module.steps?.sort((a, b) => a.order - b.order).map((step, index) => (
              <div key={step.id} className={`p-4 rounded-xl border bg-gray-900 border-gray-800 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-gray-800 text-gray-500`}>
                    <span className="text-xs">{step.order}</span>
                  </div>
                  <span className="text-gray-300">{step.title}</span>
                </div>
                <button className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full transition-colors">Start</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: AI Mentor Chat */}
      <div className="w-full md:w-96 flex flex-col bg-gray-900">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 z-10">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            <span className="font-bold">AI Mentor</span>
          </div>
          {!isMentorActive && (
            <button
                onClick={activateMentor}
                disabled={isPending || isConfirming}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-xs font-bold hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50"
            >
                {isPending || isConfirming ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wallet className="w-3 h-3" />}
                {isPending ? 'Confirming...' : 'Hire (1 MNEE)'}
            </button>
          )}
           {isMentorActive && (
             <span className="text-xs text-green-400 flex items-center gap-1">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               Active
             </span>
           )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-3 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-gray-800 text-gray-200 rounded-tl-none'
              }`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {!isMentorActive && messages.length > 2 && (
             <div className="flex justify-center my-4">
                 <div className="bg-gray-800/80 backdrop-blur p-4 rounded-xl border border-purple-500/30 max-w-[90%] text-center">
                    <Lock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300 mb-2">Unlock full mentorship to get personalized feedback and code reviews.</p>
                    <button
                        onClick={activateMentor}
                        disabled={isPending || isConfirming}
                        className="w-full py-2 bg-purple-600 rounded-lg text-sm font-bold hover:bg-purple-500 disabled:opacity-50"
                    >
                        {isPending ? 'Confirming Transaction...' : 'Unlock for 1.00 MNEE'}
                    </button>
                 </div>
             </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 bg-gray-900">
          <div className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isMentorActive ? "Ask your mentor anything..." : "Ask a quick question..."}
              className="w-full bg-gray-800 border-none rounded-full py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-purple-600 rounded-full text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-center">
             <span className="text-[10px] text-gray-500">
                Balance: {balance ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(2)} MNEE` : 'Connect Wallet'}
             </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModuleViewerPage;
