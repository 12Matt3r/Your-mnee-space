import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Coins, Zap, Shield, TrendingUp, CreditCard, Wallet, ArrowRight } from 'lucide-react';

const packages = [
  { amount: 100, price: 10, bonus: 0, popular: false },
  { amount: 500, price: 45, bonus: 50, popular: false },
  { amount: 1000, price: 85, bonus: 150, popular: true },
  { amount: 5000, price: 400, bonus: 1000, popular: false },
  { amount: 10000, price: 750, bonus: 2500, popular: false },
];

const BuyMNEE: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl mb-6">
            <Coins className="h-10 w-10 text-black" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Buy MNEE Tokens</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Power your YourSpace experience with MNEE. Tip artists, unlock content, and access premium features.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
            <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Instant Delivery</h3>
            <p className="text-gray-400 text-sm">MNEE tokens are added to your wallet immediately</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
            <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Secure Transactions</h3>
            <p className="text-gray-400 text-sm">Bank-level encryption protects your payment</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
            <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Bonus MNEE</h3>
            <p className="text-gray-400 text-sm">Get extra tokens on larger purchases</p>
          </div>
        </div>

        {/* Packages */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Your Package</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {packages.map((pkg) => (
            <div
              key={pkg.amount}
              className={`relative bg-gray-900 border rounded-xl p-6 text-center transition-all hover:scale-105 hover:shadow-xl ${
                pkg.popular 
                  ? 'border-yellow-500 shadow-yellow-500/20' 
                  : 'border-gray-800 hover:border-yellow-500/50'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full text-black text-xs font-bold">
                  BEST VALUE
                </div>
              )}
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="h-6 w-6 text-yellow-400" />
                <span className="text-2xl font-bold text-white">{pkg.amount.toLocaleString()}</span>
              </div>
              {pkg.bonus > 0 && (
                <div className="text-green-400 text-sm mb-2">+{pkg.bonus} bonus MNEE</div>
              )}
              <div className="text-3xl font-bold text-white mb-4">${pkg.price}</div>
              <button className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg text-black font-bold hover:from-yellow-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2">
                <CreditCard className="h-5 w-5" />
                Buy Now
              </button>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Accepted Payment Methods</h3>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-gray-400">
              <CreditCard className="h-6 w-6" />
              <span>Credit/Debit Card</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Wallet className="h-6 w-6" />
              <span>Crypto Wallet</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
              </svg>
              <span>PayPal</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Want unlimited access instead?</p>
          <a
            href="/subscribe"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            View Subscription Plans
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default BuyMNEE;
