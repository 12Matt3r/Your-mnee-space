import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, User, Palette, CheckCircle, ArrowRight } from 'lucide-react';

const VIBES = [
  { id: 'chill', name: 'Chill', color: 'bg-blue-500' },
  { id: 'energetic', name: 'Energetic', color: 'bg-orange-500' },
  { id: 'dark', name: 'Dark', color: 'bg-gray-800' },
  { id: 'retro', name: 'Retro', color: 'bg-yellow-500' },
];

export const OnboardingPage = () => {
  const { user } = useAuth(); // Assuming auth context updates user profile
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('');

  const handleNext = () => {
    if (step === 3) {
      // Trigger confetti on MNEE claim
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      // Mock credit allocation
      localStorage.setItem('mnee_balance', '100');
    }

    if (step === 4) {
      navigate('/studio');
      return;
    }

    setStep(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex justify-center space-x-2">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? 'w-8 bg-white' : 'w-2 bg-gray-700'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode='wait'>
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/50">
                  <User className="w-8 h-8 text-purple-400" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Claim Your Identity</h1>
                <p className="text-gray-400">Choose a unique username for your space.</p>
              </div>
              <input
                type="text"
                placeholder="@username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
              />
              <button
                onClick={handleNext}
                disabled={!username}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-500/50">
                  <Palette className="w-8 h-8 text-pink-400" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Set Your Vibe</h1>
                <p className="text-gray-400">This defines your initial room aesthetic.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {VIBES.map(vibe => (
                  <button
                    key={vibe.id}
                    onClick={() => setSelectedVibe(vibe.id)}
                    className={`p-6 rounded-xl border transition-all ${
                      selectedVibe === vibe.id
                        ? 'border-white bg-white/10'
                        : 'border-gray-800 bg-gray-900/50 hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${vibe.color} mb-2`} />
                    <span className="font-medium">{vibe.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={!selectedVibe}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="space-y-8 text-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-[60px]" />
                <Sparkles className="w-24 h-24 text-green-400 mx-auto relative z-10 animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2 text-green-400">100 MNEE</h1>
                <p className="text-xl text-white font-medium">Welcome Bonus Claimed!</p>
                <p className="text-gray-400 mt-2 text-sm">
                  Use this to hire your first agent or customize your room.
                </p>
              </div>
              <button
                onClick={handleNext}
                className="w-full py-4 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
              >
                Awesome! <CheckCircle className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-center"
            >
              <h1 className="text-3xl font-bold">Ready for Launch 🚀</h1>
              <p className="text-gray-400">
                Your space is ready. Start by exploring the Creator Studio or hiring an agent to build your dream room.
              </p>
              <div className="bg-gray-900 rounded-xl p-6 text-left border border-gray-800">
                <h3 className="font-bold mb-4 text-gray-300 uppercase text-xs tracking-wider">Your Journey</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>Identity Claimed</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>Vibe Selected</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>Wallet Funded</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleNext}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:opacity-90 transition-all"
              >
                Enter YourSpace
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;
