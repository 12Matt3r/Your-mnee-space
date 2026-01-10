import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, History, CreditCard, Copy, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { MNEE_CONFIG, formatMNEE } from '../../lib/mnee';

// Mock data for demonstration
const MOCK_TRANSACTIONS = [
  { id: 'tx_1', type: 'received', amount: 100, from: 'Platform Airdrop', date: '2025-01-15T10:00:00Z', status: 'completed' },
  { id: 'tx_2', type: 'sent', amount: 50, to: 'Agent: DesignBot', date: '2025-01-16T14:30:00Z', status: 'completed' },
  { id: 'tx_3', type: 'sent', amount: 25, to: 'Agent: ContentAI', date: '2025-01-17T09:15:00Z', status: 'completed' },
];

export const WalletPage = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(100); // Initial demo balance
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Simulate loading balance from local storage or API
    const storedBalance = localStorage.getItem('mnee_balance');
    if (storedBalance) {
      setBalance(parseFloat(storedBalance));
    }
  }, []);

  const copyAddress = () => {
    // Mock user wallet address
    const address = "0x71C...9A21";
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Wallet className="w-8 h-8 text-blue-500" />
            My Wallet
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage your MNEE tokens and transaction history
          </p>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 font-medium mb-1">Total Balance</p>
            <h2 className="text-5xl font-bold mb-2">{formatMNEE(balance)} MNEE</h2>
            <p className="text-blue-200">≈ ${balance.toFixed(2)} USD</p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button className="flex-1 bg-white text-blue-600 py-3 px-6 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
            <ArrowDownLeft className="w-5 h-5" />
            Deposit
          </button>
          <button className="flex-1 bg-blue-500/50 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-500/60 transition-colors flex items-center justify-center gap-2">
            <ArrowUpRight className="w-5 h-5" />
            Send
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-blue-200 bg-black/20 py-2 px-4 rounded-full w-fit">
          <span>Contract: {MNEE_CONFIG.address.slice(0, 6)}...{MNEE_CONFIG.address.slice(-4)}</span>
          <button onClick={copyAddress} className="hover:text-white transition-colors">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5" />
            Transaction History
          </h3>
          <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">View All</button>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'received'
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {tx.type === 'received' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {tx.type === 'received' ? 'Received from' : 'Sent to'} {tx.type === 'received' ? tx.from : tx.to}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  tx.type === 'received' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                }`}>
                  {tx.type === 'received' ? '+' : '-'}{formatMNEE(tx.amount)} MNEE
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
