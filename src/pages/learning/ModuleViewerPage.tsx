import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, ChevronLeft, Send, Bot, CheckCircle, Lock, Wallet } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

// Mock Data
const MODULE_DATA = {
  '1': {
    title: 'Vibe Coding 101: Atmospheric Design',
    videoUrl: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
    steps: [
      { id: 1, title: 'Understanding Atmosphere', completed: true },
      { id: 2, title: 'Color Theory for Mood', completed: false },
      { id: 3, title: 'Lighting Techniques', completed: false },
      { id: 4, title: 'Interactive Elements', completed: false },
    ]
  },
  '2': {
      title: '3D Room Architecture',
      videoUrl: 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4',
      steps: [
          { id: 1, title: 'Space Planning', completed: false },
          { id: 2, title: 'Asset Placement', completed: false },
      ]
  },
  '3': {
      title: 'Digital Music Production',
      videoUrl: 'https://archive.org/download/Sintel/sintel-2048-surround.mp4',
      steps: [
          { id: 1, title: 'Beat Basics', completed: false },
          { id: 2, title: 'Synth Waves', completed: false },
      ]
  }
};

const CHAT_INITIAL_STATE = [
  { id: 1, sender: 'ai', text: "Hi! I'm your AI Mentor for this course. I can help you understand the concepts or give you feedback on your work. What would you like to focus on today?" }
];

export const ModuleViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState(CHAT_INITIAL_STATE);
  const [newMessage, setNewMessage] = useState('');
  const [isMentorActive, setIsMentorActive] = useState(false);
  const [walletBalance, setWalletBalance] = useState('100');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const module = MODULE_DATA[id as keyof typeof MODULE_DATA] || MODULE_DATA['1'];

  useEffect(() => {
    const storedBalance = localStorage.getItem('mnee_balance');
    if (storedBalance) {
      setWalletBalance(storedBalance);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    const cost = 1.0; // 1 MNEE per session
    const currentBalance = parseFloat(walletBalance);

    if (currentBalance < cost) {
      toast.error(`Insufficient MNEE. You need ${cost} MNEE.`);
      return;
    }

    const newBalance = currentBalance - cost;
    localStorage.setItem('mnee_balance', newBalance.toString());
    setWalletBalance(newBalance.toString());
    setIsMentorActive(true);
    toast.success('Mentor Mode Activated! (-1.00 MNEE)');

    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'ai',
      text: "I'm now in Mentor Mode! I'll guide you step-by-step and track your progress. Let's start with the first concept."
    }]);
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
            <p className="text-sm text-gray-400">Lesson 1 of {module.steps.length}</p>
          </div>
        </div>

        {/* Video Player Placeholder */}
        <div className="aspect-video bg-black relative group cursor-pointer" onClick={togglePlay}>
          <video
            ref={videoRef}
            src={module.videoUrl}
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
            {module.steps.map((step) => (
              <div key={step.id} className={`p-4 rounded-xl border ${step.completed ? 'bg-green-900/20 border-green-800' : 'bg-gray-900 border-gray-800'} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                    {step.completed ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs">{step.id}</span>}
                  </div>
                  <span className={step.completed ? 'text-green-400' : 'text-gray-300'}>{step.title}</span>
                </div>
                {step.completed ? (
                    <span className="text-xs text-green-500 font-medium">Completed</span>
                ) : (
                    <button className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full transition-colors">Start</button>
                )}
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
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-xs font-bold hover:from-purple-500 hover:to-pink-500 transition-all"
            >
                <Wallet className="w-3 h-3" />
                Hire (1 MNEE)
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
                        className="w-full py-2 bg-purple-600 rounded-lg text-sm font-bold hover:bg-purple-500"
                    >
                        Unlock for 1.00 MNEE
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
             <span className="text-[10px] text-gray-500">Balance: {parseFloat(walletBalance).toFixed(2)} MNEE</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModuleViewerPage;
