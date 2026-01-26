import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Crown, Check, Zap, Star, Infinity as InfinityIcon, Users, Music, Video, Coins, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Get started with basic features',
    features: [
      'Browse Discovery feed',
      'View artist profiles',
      'Basic music player',
      'Limited daily tips (10 MNEE/day)',
    ],
    notIncluded: [
      'Unlimited tipping',
      'Exclusive content access',
      'Virtual room creation',
      'Ad-free experience',
    ],
    cta: 'Current Plan',
    popular: false,
    gradient: 'from-gray-600 to-gray-700',
  },
  {
    name: 'Fan',
    price: 9.99,
    period: 'month',
    description: 'Support your favorite artists',
    features: [
      'Everything in Free',
      '500 MNEE/month included',
      'Unlimited tipping',
      'Exclusive fan content',
      'Ad-free experience',
      'Early access to drops',
    ],
    notIncluded: [
      'Virtual room creation',
      'Priority support',
    ],
    cta: 'Subscribe',
    popular: false,
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    name: 'Creator',
    price: 24.99,
    period: 'month',
    description: 'Everything you need to create',
    features: [
      'Everything in Fan',
      '2000 MNEE/month included',
      'Create virtual rooms',
      'Upload unlimited content',
      'Analytics dashboard',
      'Priority support',
      'Verified badge',
      'Custom profile themes',
    ],
    notIncluded: [],
    cta: 'Subscribe',
    popular: true,
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    name: 'Pro',
    price: 49.99,
    period: 'month',
    description: 'Maximum power for professionals',
    features: [
      'Everything in Creator',
      '5000 MNEE/month included',
      'Unlimited virtual rooms',
      'API access',
      'White-label options',
      'Dedicated account manager',
      'Revenue share boost (+5%)',
      'Featured placement',
    ],
    notIncluded: [],
    cta: 'Subscribe',
    popular: false,
    gradient: 'from-yellow-500 to-amber-600',
  },
];

const Subscribe: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Subscribe to YourSpace</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Unlock the full potential of YourSpace. Get MNEE tokens, exclusive features, and support the creator economy.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-gray-900 border rounded-2xl p-6 transition-all hover:scale-[1.02] ${
                plan.popular 
                  ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                  : 'border-gray-800 hover:border-purple-500/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-xs font-bold flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  MOST POPULAR
                </div>
              )}
              
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${plan.gradient} rounded-xl mb-4`}>
                <Crown className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400">/{plan.period}</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm opacity-50">
                    <div className="h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-500 line-through">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.price === 0
                    ? 'bg-gray-800 text-gray-400 cursor-default'
                    : `bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90`
                }`}
                disabled={plan.price === 0}
              >
                {plan.cta}
                {plan.price > 0 && <ArrowRight className="h-5 w-5" />}
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Why Subscribe?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-2xl mb-4">
                <Coins className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Monthly MNEE</h3>
              <p className="text-gray-400">Get MNEE tokens included with your subscription to tip artists and unlock content</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-2xl mb-4">
                <InfinityIcon className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Unlimited Access</h3>
              <p className="text-gray-400">No limits on tipping, viewing, or creating content on the platform</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500/20 rounded-2xl mb-4">
                <Users className="h-8 w-8 text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Support Creators</h3>
              <p className="text-gray-400">Your subscription helps fund the creator economy and supports artists directly</p>
            </div>
          </div>
        </div>

        {/* Buy MNEE CTA */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">Just want to buy MNEE tokens without subscribing?</p>
          <a
            href="/buy-mnee"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg text-black font-bold hover:from-yellow-400 hover:to-amber-500 transition-all"
          >
            <Coins className="h-5 w-5" />
            Buy MNEE Tokens
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default Subscribe;
