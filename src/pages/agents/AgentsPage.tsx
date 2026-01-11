import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ECONOMY_LAYERS, FAVORITISM_TIERS, MNEE_CONFIG, generatePaymentLink } from '../../lib/mnee';
import { Bot, Zap, Star, Clock, DollarSign, Users, Briefcase, Search, Plus, X, Wallet, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAgentJobs, AgentJob } from '../../hooks/useAgentJobs';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { MNEE_CONTRACT_ADDRESS, MNEE_ABI } from '../../lib/wagmi';

// Treasury Address for receiving payments (Mock address for hackathon)
const TREASURY_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Example generic address

interface Agent {
  id: string;
  name: string;
  description: string | null;
  type: string;
  agent_type: string;
  avatar_url: string | null;
  hourly_rate: number;
  skills: string[];
  performance_score: number;
  total_jobs: number;
  is_available: boolean;
}

const AI_SERVICES = [
  { id: 'minimax', name: 'MiniMax', costPerHour: 50, description: 'Multimodal AI for creative tasks' },
  { id: 'claude', name: 'Claude', costPerHour: 80, description: 'Advanced reasoning and analysis' },
  { id: 'gpt4', name: 'GPT-4', costPerHour: 60, description: 'General purpose AI assistant' },
  { id: 'dalle', name: 'DALL-E', costPerHour: 40, description: 'Image generation' },
  { id: 'midjourney', name: 'Midjourney', costPerHour: 55, description: 'Artistic image creation' },
  { id: 'whisper', name: 'Whisper', costPerHour: 25, description: 'Audio transcription' },
  { id: 'eleven', name: 'ElevenLabs', costPerHour: 45, description: 'Voice synthesis' },
];

export function AgentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { jobs: myJobs, addJob } = useAgentJobs();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedTab, setSelectedTab] = useState<'marketplace' | 'post-job' | 'my-jobs' | 'economy'>('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Web3 State
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: MNEE_CONTRACT_ADDRESS,
  } as any);
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Job posting form state
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobBudget, setJobBudget] = useState('50');
  const [selectedAgentType, setSelectedAgentType] = useState('any');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Hire modal state
  const [showHireModal, setShowHireModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [hireHours, setHireHours] = useState('1');

  useEffect(() => {
    loadAgents();
  }, [user]);

  useEffect(() => {
    if (isConfirmed && selectedAgent) {
        toast.success(`Payment confirmed! You have successfully hired ${selectedAgent.name}.`);
        setShowHireModal(false);

        // Add job to "My Jobs"
        const newJob = {
            agent_id: selectedAgent.id,
            requester_id: user?.id || 'anon',
            title: `Task for ${selectedAgent.name}`,
            description: `Hired via Web3 payment (Tx: ${hash})`,
            status: 'in_progress' as const, // Active immediately
            budget: selectedAgent.hourly_rate * parseFloat(hireHours),
            transaction_hash: hash
        };

        // Use hook to update shared state
        addJob(newJob);
    }
  }, [isConfirmed, selectedAgent, user, hash, hireHours, addJob]);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('is_listed', true)
        .order('performance_score', { ascending: false });
      
      if (error) throw error;
      if (data && data.length > 0) {
        setAgents(data);
      }
    } catch (err) {
      console.error('Error loading agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to post a job');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('agent_jobs').insert({
        requester_id: user.id,
        title: jobTitle,
        description: jobDescription,
        budget: parseFloat(jobBudget),
        status: 'open',
        agent_type_required: selectedAgentType === 'any' ? null : selectedAgentType,
      });
      
      if (error) throw error;
      
      toast.success('Job posted successfully!');
      setJobTitle('');
      setJobDescription('');
      setJobBudget('50');
      setSelectedAgentType('any');
      loadMyJobs();
      setSelectedTab('my-jobs');
    } catch (err: any) {
      toast.error(err.message || 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHireAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowHireModal(true);
  };

  const confirmHire = () => {
    if (!selectedAgent) return;

    if (!isConnected) {
        toast.error('Please connect your wallet first');
        navigate('/wallet');
        return;
    }

    const totalCost = selectedAgent.hourly_rate * parseFloat(hireHours);
    const requiredAmount = parseUnits(totalCost.toString(), MNEE_CONFIG.decimals);

    if (!balance || balance.value < requiredAmount) {
        toast.error(`Insufficient MNEE balance. You need ${totalCost} MNEE.`);
        navigate('/wallet');
        return;
    }

    try {
        writeContract({
            address: MNEE_CONTRACT_ADDRESS,
            abi: MNEE_ABI,
            functionName: 'transfer',
            args: [TREASURY_ADDRESS, requiredAmount],
            account: address,
            chain: undefined,
        });
    } catch (error) {
        console.error('Payment failed:', error);
        toast.error('Payment failed to initiate.');
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || agent.agent_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Agent Marketplace
              </h1>
              <p className="text-gray-400 mt-2">
                Hire AI agents with MNEE tokens. Agents earn, grow, and can even hire other AI or humans.
              </p>
              <p className="text-sm text-purple-400 mt-1">
                MNEE Contract: {MNEE_CONFIG.address}
              </p>
            </div>
             <button
                onClick={() => navigate('/wallet')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
              >
                <Wallet className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-mono">
                   {balance ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(2)} MNEE` : 'Connect Wallet'}
                </span>
              </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700 pb-4">
          <button
            type="button"
            onClick={() => setSelectedTab('marketplace')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              selectedTab === 'marketplace' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Bot className="w-4 h-4" />
            Marketplace
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('post-job')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              selectedTab === 'post-job' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            Post Job
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('my-jobs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              selectedTab === 'my-jobs' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            My Jobs
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('economy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              selectedTab === 'economy' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Zap className="w-4 h-4" />
            4-Layer Economy
          </button>
        </div>

        {/* Marketplace Tab */}
        {selectedTab === 'marketplace' && (
          <div>
            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="developer">Developers</option>
                <option value="designer">Designers</option>
                <option value="writer">Writers</option>
                <option value="musician">Musicians</option>
              </select>
            </div>

            {/* Agent Grid */}
            {loading ? (
              <div className="text-center py-16 text-gray-400">Loading agents...</div>
            ) : filteredAgents.length === 0 ? (
              <div className="text-center py-16 text-gray-400">No agents found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map(agent => (
                  <div
                    key={agent.id}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Bot className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{agent.name}</h3>
                        <span className={`text-sm ${agent.is_available ? 'text-green-400' : 'text-yellow-400'}`}>
                          {agent.is_available ? 'Available' : 'Busy'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{agent.performance_score}%</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">{agent.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {agent.skills?.slice(0, 3).map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Briefcase className="w-4 h-4" />
                        <span>{agent.total_jobs} jobs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-400">{agent.hourly_rate} MNEE</span>
                        <span className="text-gray-500">/hr</span>
                        <span className="text-xs text-gray-500 ml-1">(~${agent.hourly_rate} USD)</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleHireAgent(agent)}
                      disabled={!agent.is_available}
                      className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Zap className="w-5 h-5" />
                      {agent.is_available ? 'Hire Agent' : 'Currently Busy'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Post Job Tab */}
        {selectedTab === 'post-job' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
              <p className="text-gray-400 mb-6">
                Describe your task and let AI agents or humans bid to complete it. Pay with MNEE tokens.
              </p>
              
              <form onSubmit={handlePostJob} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Build a landing page"
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Describe what you need done in detail..."
                    rows={5}
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Budget (MNEE)</label>
                    <input
                      type="number"
                      value={jobBudget}
                      onChange={(e) => setJobBudget(e.target.value)}
                      min="1"
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Agent Type</label>
                    <select
                      value={selectedAgentType}
                      onChange={(e) => setSelectedAgentType(e.target.value)}
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="any">Any Agent</option>
                      <option value="developer">Developer</option>
                      <option value="designer">Designer</option>
                      <option value="writer">Writer</option>
                      <option value="musician">Musician</option>
                      <option value="human">Human Only</option>
                    </select>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !user}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold text-lg hover:from-green-400 hover:to-emerald-500 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : user ? 'Post Job' : 'Sign in to Post'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* My Jobs Tab */}
        {selectedTab === 'my-jobs' && (
          <div>
            {!user ? (
              <div className="text-center py-16 text-gray-400">
                <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Sign In Required</h3>
                <p>Please sign in to view your jobs.</p>
              </div>
            ) : myJobs.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Jobs Yet</h3>
                <p>Post a job or hire an agent from the marketplace.</p>
                <button
                  onClick={() => setSelectedTab('post-job')}
                  className="mt-4 px-6 py-3 bg-purple-600 rounded-lg font-semibold hover:bg-purple-500"
                >
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myJobs.map(job => (
                  <div
                    key={job.id}
                    className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex items-center gap-6"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{job.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        job.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                        job.status === 'in_progress' ? 'bg-blue-900/50 text-blue-400' :
                        job.status === 'open' ? 'bg-yellow-900/50 text-yellow-400' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {job.status}
                      </span>
                      <p className="text-green-400 font-bold mt-2">{job.budget} MNEE <span className="text-xs text-gray-400">(~${job.budget} USD)</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Economy Tab */}
        {selectedTab === 'economy' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Layer 1 */}
              <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-300">Layer 1: Users to Agents</h3>
                    <p className="text-gray-400 text-sm">Users pay MNEE to hire AI agents</p>
                  </div>
                </div>
                <p className="text-gray-300">Users browse the marketplace and hire agents for tasks like coding, design, content creation.</p>
              </div>

              {/* Layer 2 */}
              <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-300">Layer 2: Agents Earn Credits</h3>
                    <p className="text-gray-400 text-sm">Quality multiplier up to 5.94x</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {Object.entries(ECONOMY_LAYERS.AGENT_EARNS.qualityMultipliers).map(([level, mult]) => (
                    <div key={level} className="flex justify-between text-sm">
                      <span className="text-gray-400 capitalize">{level}</span>
                      <span className="text-green-400 font-mono">{mult}x</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layer 3 */}
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-300">Layer 3: Agents Hire AI</h3>
                    <p className="text-gray-400 text-sm">7 specialized AI services</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {AI_SERVICES.map(service => (
                    <div key={service.id} className="flex justify-between">
                      <span className="text-gray-300">{service.name}</span>
                      <span className="text-purple-400">{service.costPerHour} MNEE</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layer 4 */}
              <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border border-orange-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-300">Layer 4: Agents Hire Humans</h3>
                    <p className="text-gray-400 text-sm">Revolutionary role reversal</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  AI agents can post jobs for human specialists when tasks require creativity, judgment, or physical presence.
                </p>
              </div>
            </div>

            {/* Favoritism Tiers */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-6">5-Tier Favoritism System</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(FAVORITISM_TIERS).map(([key, tier]) => (
                  <div key={key} className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 text-center">
                    <h4 className="font-bold mb-2">{tier.name}</h4>
                    <div className="text-green-400 text-2xl font-bold mb-1">{tier.discount}%</div>
                    <p className="text-gray-500 text-xs">discount</p>
                    <div className="mt-2 flex items-center justify-center gap-1 text-gray-400 text-xs">
                      <Clock className="w-3 h-3" />
                      {tier.waitTime}
                    </div>
                    <p className="text-gray-600 text-xs mt-1">{tier.minSpend}+ MNEE</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hire Modal */}
      {showHireModal && selectedAgent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowHireModal(false)}>
          <div className="bg-gray-800 p-8 rounded-2xl max-w-md w-full mx-4 border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Hire {selectedAgent.name}</h2>
              <button onClick={() => setShowHireModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-gray-400 mb-6">{selectedAgent.description}</p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Hours Needed</label>
              <input
                type="number"
                value={hireHours}
                onChange={(e) => setHireHours(e.target.value)}
                min="1"
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg"
              />
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Rate</span>
                <span>{selectedAgent.hourly_rate} MNEE/hr</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Hours</span>
                <span>{hireHours}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700">
                <span>Total</span>
                <div className="text-right">
                  <span className="text-green-400">{(selectedAgent.hourly_rate * parseFloat(hireHours || '0')).toFixed(2)} MNEE</span>
                  <span className="block text-xs text-gray-400">(~${(selectedAgent.hourly_rate * parseFloat(hireHours || '0')).toFixed(2)} USD)</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={confirmHire}
              disabled={isPending || isConfirming}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2"
            >
              {isPending || isConfirming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {isPending ? 'Confirming in Wallet...' : isConfirming ? 'Processing...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgentsPage;
