import React, { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { MNEE_CONTRACT_ADDRESS } from '../../lib/wagmi';
import { formatUnits } from 'viem';
import { Vote, Lock, TrendingUp, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PROPOSALS = [
  {
    id: 1,
    title: 'YGP-12: Increase Creator Revenue Share',
    description: 'Proposal to increase the creator revenue share from 90% to 92.5% by reducing platform fees.',
    status: 'Active',
    votes_for: 154200,
    votes_against: 42000,
    end_date: '2026-02-01',
    tags: ['Treasury', 'Economics']
  },
  {
    id: 2,
    title: 'YGP-13: Add Solana Integration',
    description: 'Integrate Solana wallets to support cross-chain agent payments.',
    status: 'Active',
    votes_for: 89000,
    votes_against: 92000,
    end_date: '2026-02-05',
    tags: ['Technical', 'Integration']
  },
  {
    id: 3,
    title: 'YGP-11: Fund "Neon City" Asset Pack',
    description: 'Allocate 50,000 MNEE from treasury to commission a high-quality asset pack for all users.',
    status: 'Passed',
    votes_for: 450000,
    votes_against: 12000,
    end_date: '2026-01-10',
    tags: ['Content', 'Grant']
  }
];

export const GovernancePage = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: MNEE_CONTRACT_ADDRESS,
  } as any);

  const [stakedAmount, setStakedAmount] = useState('0');
  const [isStaking, setIsStaking] = useState(false);

  const handleVote = (proposalId: number, support: boolean) => {
    toast.success(`Vote ${support ? 'FOR' : 'AGAINST'} recorded!`);
  };

  const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
    setIsStaking(true);
    setTimeout(() => {
        setIsStaking(false);
        setStakedAmount(prev => (parseFloat(prev) + 100).toString()); // Mock increase
        toast.success('Successfully staked MNEE!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center gap-3">
            <Vote className="w-10 h-10 text-orange-400" />
            Governance DAO
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Shape the future of YourSpace. 1 MNEE = 1 Vote.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Staking */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900/50 border border-yellow-500/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-yellow-500" />
                    Staking Pool
                </h2>

                <div className="bg-black/40 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">APY</span>
                        <span className="text-green-400 font-bold">12.5%</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">Total Staked</span>
                        <span className="text-white font-bold">2.4M MNEE</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">My Stake</span>
                        <span className="text-yellow-400 font-bold">{stakedAmount} MNEE</span>
                    </div>
                </div>

                <form onSubmit={handleStake} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Amount to Stake</label>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 pr-16 text-white focus:border-yellow-500 outline-none"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-gray-800 px-2 py-1 rounded text-gray-300 hover:text-white"
                            >
                                MAX
                            </button>
                        </div>
                        <div className="text-right mt-1 text-xs text-gray-500">
                            Balance: {balance ? formatUnits(balance.value, balance.decimals) : '0.00'} MNEE
                        </div>
                    </div>
                    <button
                        disabled={isStaking}
                        className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {isStaking ? 'Staking...' : 'Stake MNEE'}
                        {!isStaking && <TrendingUp className="w-4 h-4" />}
                    </button>
                </form>
                <p className="text-xs text-gray-500 mt-4 text-center">
                    Staked MNEE grants voting power and earns yield. Unstaking takes 7 days.
                </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold mb-4 text-gray-300">Governance Stats</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">DAO Members</p>
                            <p className="font-bold">12,405</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Vote className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Proposals Passed</p>
                            <p className="font-bold">84</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Right Column: Proposals */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Active Proposals</h2>
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                    + New Proposal
                </button>
            </div>

            {PROPOSALS.map((proposal) => {
                const totalVotes = proposal.votes_for + proposal.votes_against;
                const percentFor = (proposal.votes_for / totalVotes) * 100;

                return (
                    <div key={proposal.id} className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex gap-2 mb-2">
                                    {proposal.tags.map(tag => (
                                        <span key={tag} className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-400">
                                            {tag}
                                        </span>
                                    ))}
                                    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                                        proposal.status === 'Active' ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'
                                    }`}>
                                        {proposal.status === 'Active' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                                        {proposal.status}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{proposal.title}</h3>
                                <p className="text-gray-400 text-sm">{proposal.description}</p>
                            </div>
                        </div>

                        {/* Voting Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>For: {proposal.votes_for.toLocaleString()}</span>
                                <span>Against: {proposal.votes_against.toLocaleString()}</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden flex">
                                <div className="bg-green-500 h-full" style={{ width: `${percentFor}%` }} />
                                <div className="bg-red-500 h-full flex-1" />
                            </div>
                        </div>

                        {proposal.status === 'Active' && (
                            <div className="flex gap-3 pt-4 border-t border-gray-800">
                                <button
                                    onClick={() => handleVote(proposal.id, true)}
                                    className="flex-1 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm font-medium transition-colors border border-green-500/30"
                                >
                                    Vote For
                                </button>
                                <button
                                    onClick={() => handleVote(proposal.id, false)}
                                    className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/30"
                                >
                                    Vote Against
                                </button>
                            </div>
                        )}
                        {proposal.status === 'Passed' && (
                             <div className="pt-2 text-sm text-green-400 font-medium flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Passed on {proposal.end_date}
                             </div>
                        )}
                    </div>
                );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernancePage;
