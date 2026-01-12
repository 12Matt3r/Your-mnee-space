import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, Sparkles, Crown, Zap } from 'lucide-react';

interface BuyMNEEButtonProps {
  variant?: 'header' | 'inline' | 'card' | 'banner';
  showSubscribe?: boolean;
  className?: string;
}

export const BuyMNEEButton: React.FC<BuyMNEEButtonProps> = ({ 
  variant = 'header', 
  showSubscribe = true,
  className = '' 
}) => {
  if (variant === 'header') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Link
          to="/buy-mnee"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg text-black font-bold hover:from-yellow-400 hover:to-amber-500 transition-all shadow-lg hover:shadow-yellow-500/30 animate-pulse hover:animate-none"
        >
          <Coins className="h-5 w-5" />
          <span>Buy MNEE</span>
        </Link>
        {showSubscribe && (
          <Link
            to="/subscribe"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            <Crown className="h-5 w-5" />
            <span>Subscribe</span>
          </Link>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Link
          to="/buy-mnee"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full text-black text-sm font-semibold hover:from-yellow-400 hover:to-amber-500 transition-all"
        >
          <Coins className="h-4 w-4" />
          <span>Get MNEE</span>
        </Link>
        {showSubscribe && (
          <Link
            to="/subscribe"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-semibold hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            <Crown className="h-4 w-4" />
            <span>Subscribe</span>
          </Link>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 border border-yellow-500/30 rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
            <Coins className="h-6 w-6 text-black" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Need More MNEE?</h3>
            <p className="text-yellow-300 text-sm">Unlock premium features & content</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/buy-mnee"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg text-black font-bold hover:from-yellow-400 hover:to-amber-500 transition-all"
          >
            <Zap className="h-5 w-5" />
            <span>Buy MNEE</span>
          </Link>
          <Link
            to="/subscribe"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            <Crown className="h-5 w-5" />
            <span>Subscribe</span>
          </Link>
        </div>
      </div>
    );
  }

  // Banner variant
  return (
    <div className={`bg-gradient-to-r from-yellow-500/10 via-purple-500/10 to-pink-500/10 border border-yellow-500/20 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-yellow-400" />
          <div>
            <p className="text-white font-semibold">Power up your experience with MNEE!</p>
            <p className="text-gray-400 text-sm">Buy MNEE tokens or subscribe for unlimited access</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/buy-mnee"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg text-black font-bold hover:from-yellow-400 hover:to-amber-500 transition-all"
          >
            <Coins className="h-5 w-5" />
            <span>Buy MNEE</span>
          </Link>
          <Link
            to="/subscribe"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            <Crown className="h-5 w-5" />
            <span>Subscribe</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Floating Buy Button for mobile/prominent display
export const FloatingBuyMNEE: React.FC = () => {
  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-2">
      <Link
        to="/subscribe"
        className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-110"
        title="Subscribe"
      >
        <Crown className="h-6 w-6" />
      </Link>
      <Link
        to="/buy-mnee"
        className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full text-black shadow-lg hover:shadow-yellow-500/50 transition-all hover:scale-110 animate-bounce"
        title="Buy MNEE"
      >
        <Coins className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default BuyMNEEButton;
