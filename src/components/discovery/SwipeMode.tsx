import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import { X, Heart, Info, DollarSign, Loader2 } from 'lucide-react';
import { formatMNEE } from '../../lib/mnee';
import { supabase } from '../../lib/supabase';

interface SwipeCard {
    id: string;
    title: string;
    description: string;
    file_url: string;
    content_type: string;
    reward: number;
    creator?: {
        display_name: string;
    };
}

export const SwipeMode = () => {
  const [cards, setCards] = useState<SwipeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastDirection, setLastDirection] = useState<string | null>(null);
  const [earned, setEarned] = useState(0);

  useEffect(() => {
      const fetchContent = async () => {
          setLoading(true);
          // Fetch from content table or posts table? Let's use posts for now as it has images
          // Assuming 'posts' or 'content' exists. The useContent hook uses 'content'.
          // Let's assume there is a 'content' view or table.
          // Based on previous files, useContent hits 'content'.

          const { data, error } = await supabase
            .from('posts') // Fallback to posts if content view isn't set up yet, or check useContent.
            // Actually useContent fetched from 'content' which likely maps to posts+media
            .select(`
                id,
                content,
                image_url,
                created_at,
                profiles (display_name)
            `)
            .not('image_url', 'is', null)
            .limit(10);

          if (data) {
              const formatted = data.map((item: any) => ({
                  id: item.id,
                  title: item.content?.substring(0, 30) || 'Untitled',
                  description: item.content,
                  file_url: item.image_url,
                  content_type: 'Image',
                  reward: 0.1 + Math.random() * 0.5, // Random reward for demo
                  creator: item.profiles
              }));
              setCards(formatted);
          }
          setLoading(false);
      };
      fetchContent();
  }, []);

  const removeCard = (id: string) => {
    setCards(cards => cards.filter(card => card.id !== id));
  };

  const swipe = (dir: string) => {
    if (cards.length === 0) return;
    const currentCard = cards[0];
    setLastDirection(dir);

    if (dir === 'right') {
        setEarned(prev => prev + currentCard.reward);
    }

    setTimeout(() => removeCard(currentCard.id), 200);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-md mx-auto relative">
        <div className="absolute top-0 right-0 p-4 bg-green-900/30 border border-green-500/30 rounded-full flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-mono">+{formatMNEE(earned)} MNEE</span>
        </div>

      {cards.length > 0 ? (
        <div className="relative w-full h-[500px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
            <img
                src={cards[0].file_url}
                alt={cards[0].title}
                className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-20">
                <div className="flex justify-between items-end">
                    <div>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full mb-2 inline-block">
                            {cards[0].content_type}
                        </span>
                        <h2 className="text-2xl font-bold text-white">{cards[0].title}</h2>
                        <p className="text-gray-400">by {cards[0].creator?.display_name || 'Unknown'}</p>
                    </div>
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                        <Info className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-900 rounded-3xl border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
            <p className="text-gray-400 mb-4">You've swiped through all available content.</p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 rounded-full text-white hover:bg-blue-500"
            >
                Refresh
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
