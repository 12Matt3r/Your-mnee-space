import React, { useState } from 'react';
import { Check, Star, Zap, Crown, BuildingOffice2Icon, Sparkles } from 'lucide-react';
import { MNEE_CONFIG, formatMNEE } from '../../lib/mnee';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TIERS = [
  {
    id: 'free',
    name: 'Free Tier',
    price: 0,
    mnee_bonus: 2,
    features: [
      'Basic profile customization',
      'View public content',
      'Limited messages',
      'Earn MNEE through activity'
    ],
    color: 'gray'
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 5,
    mnee_bonus: 8,
    bonus_percent: 60,
    features: [
      'Enhanced room customization',
      'Basic analytics',
      'Unlimited uploads',
      'Priority support'
    ],
    color: 'blue'
  },
  {
    id: 'plus',
    name: 'Creator Plus',
    price: 10,
    mnee_bonus: 18,
    bonus_percent: 80,
    recommended: true,
    features: [
      'Full customization (Level 1-4)',
      'Collaboration tools',
      'Advanced analytics',
      'Zero platform fees on tips'
    ],
    color: 'purple'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 20,
    mnee_bonus: 40,
    bonus_percent: 100,
    features: [
      'Custom domain support',
      'API access',
      'White-label tools',
      'Dedicated success manager'
    ],
    color: 'pink'
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 50,
    mnee_bonus: 120,
    bonus_percent: 140,
    features: [
      'Team accounts (up to 5)',
      'Enterprise API limits',
      'Custom contracts',
      'SLA guarantee'
    ],
    color: 'orange'
  }
];

export const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = (tierId: string, bonus: number) => {
    setLoadingTier(tierId);

    // Simulate payment processing
    setTimeout(() => {
        // In a real app, this would redirect to Stripe
        // For the hackathon demo, we simulate success

        // Mock credit to wallet (using the same localStorage key as WalletPage)
        // Note: This is purely for demo continuity on the frontend.
        // Real implementation would have the backend credit the wallet after webhook.
        const currentBalance = parseFloat(localStorage.getItem('mnee_balance') || '100');
        const newBalance = currentBalance + bonus;
        localStorage.setItem('mnee_balance', newBalance.toString());

        toast.success(`Successfully subscribed! ${bonus} MNEE has been added to your wallet.`, {
            duration: 5000,
            icon: '🎉'
        });

        setLoadingTier(null);
        navigate('/wallet');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
            Unlock Your Creative Potential
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Subscribe to get premium features and instant MNEE token allocations.
            <br />
            <span className="text-green-400 font-bold">1 MNEE = $1 USD</span> value automatically credited.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-gray-900/50 border rounded-2xl p-6 flex flex-col hover:scale-105 transition-transform duration-300 ${
                tier.recommended ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-bold text-${tier.color}-400 mb-2`}>{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">${tier.price}</span>
                  <span className="text-gray-500">/mo</span>
                </div>
              </div>

              <div className="mb-6 bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="text-sm text-gray-400 mb-1">You receive:</div>
                <div className="text-2xl font-bold text-green-400 flex items-center gap-2">
                  <Zap className="w-5 h-5 fill-current" />
                  {tier.mnee_bonus} MNEE
                </div>
                {tier.bonus_percent && (
                  <div className="text-xs text-green-500 mt-1 font-semibold">
                    {tier.bonus_percent}% Bonus Value!
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(tier.id, tier.mnee_bonus)}
                disabled={!!loadingTier}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  tier.recommended
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loadingTier === tier.id ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Processing...
                    </span>
                ) : (
                    tier.price === 0 ? 'Get Started' : 'Subscribe Now'
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Why Subscribe?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div>
                    <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BuildingOffice2Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-white mb-2">Build Your Empire</h3>
                    <p className="text-gray-400 text-sm">Get the tools you need to customize your space and grow your brand.</p>
                </div>
                <div>
                    <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="font-bold text-white mb-2">Power the Economy</h3>
                    <p className="text-gray-400 text-sm">Your subscription fuels the MNEE economy, creating jobs for agents and humans.</p>
                </div>
                <div>
                    <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Crown className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="font-bold text-white mb-2">Exclusive Access</h3>
                    <p className="text-gray-400 text-sm">Unlock premium features, early access drops, and VIP community status.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
