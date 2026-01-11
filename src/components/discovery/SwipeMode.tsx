import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { X, Heart, Info, DollarSign } from 'lucide-react';
import { formatMNEE } from '../../lib/mnee';

// Mock Data for Swipe Cards
const CARDS = [
  {
    id: 1,
    title: 'Neon City Ambience',
    creator: 'VibeMaster',
    type: 'Video',
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    reward: 0.5
  },
  {
    id: 2,
    title: 'Cyberpunk Character Model',
    creator: '3D_Wizard',
    type: '3D Model',
    image: 'https://images.unsplash.com/photo-1614728853913-1e2211d0d99b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    reward: 0.3
  },
  {
    id: 3,
    title: 'Synthwave Beats Vol. 1',
    creator: 'AudioNinja',
    type: 'Audio',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    reward: 0.2
  },
];

export const SwipeMode = () => {
  const [cards, setCards] = useState(CARDS);
  const [lastDirection, setLastDirection] = useState<string | null>(null);
  const [earned, setEarned] = useState(0);

  const removeCard = (id: number) => {
    setCards(cards => cards.filter(card => card.id !== id));
  };

  const swipe = (dir: string) => {
    if (cards.length === 0) return;
    const currentCard = cards[0]; // Simple queue logic for demo
    setLastDirection(dir);

    if (dir === 'right') {
        setEarned(prev => prev + currentCard.reward);
    }

    // Animate out (simplified for React/DOM without complex gesture lib setup in this snippet)
    setTimeout(() => removeCard(currentCard.id), 200);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-md mx-auto relative">
        <div className="absolute top-0 right-0 p-4 bg-green-900/30 border border-green-500/30 rounded-full flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-mono">+{formatMNEE(earned)} MNEE</span>
        </div>

      {cards.length > 0 ? (
        <div className="relative w-full h-[500px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
            <img
                src={cards[0].image}
                alt={cards[0].title}
                className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-20">
                <div className="flex justify-between items-end">
                    <div>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full mb-2 inline-block">
                            {cards[0].type}
                        </span>
                        <h2 className="text-2xl font-bold text-white">{cards[0].title}</h2>
                        <p className="text-gray-400">by {cards[0].creator}</p>
                    </div>
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                        <Info className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Action Buttons Overlay */}
            <div className="absolute bottom-24 w-full flex justify-center gap-8 pointer-events-none">
                 {/* Visual indicators only, actual interaction handled below */}
            </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-900 rounded-3xl border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
            <p className="text-gray-400 mb-4">You've swiped through all available content.</p>
            <button
                onClick={() => setCards(CARDS)}
                className="px-6 py-2 bg-blue-600 rounded-full text-white hover:bg-blue-500"
            >
                Reset Stack
            </button>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-6 mt-8">
        <button
            onClick={() => swipe('left')}
            className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center border border-red-500/30 text-red-500 hover:bg-red-500/10 hover:scale-110 transition-all shadow-lg shadow-red-500/10"
        >
            <X className="w-8 h-8" />
        </button>
        <button
            onClick={() => swipe('right')}
            className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center border border-green-500/30 text-green-500 hover:bg-green-500/10 hover:scale-110 transition-all shadow-lg shadow-green-500/10"
        >
            <Heart className="w-8 h-8 fill-current" />
        </button>
      </div>

      {lastDirection && cards.length > 0 && (
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-black uppercase tracking-widest ${
              lastDirection === 'right' ? 'text-green-500 rotate-12' : 'text-red-500 -rotate-12'
          } animate-fade-out pointer-events-none`}>
              {lastDirection === 'right' ? 'LIKE' : 'NOPE'}
          </div>
      )}
    </div>
  );
};
