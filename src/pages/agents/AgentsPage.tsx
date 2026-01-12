import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ECONOMY_LAYERS, FAVORITISM_TIERS, MNEE_CONFIG, generatePaymentLink } from '../../lib/mnee';
import { Bot, Zap, Star, Clock, DollarSign, Users, Briefcase, Search, Plus, X, Wallet, Loader2, Code, Terminal, Bug, Wand2, Sparkles, Rocket, Globe } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAgentJobs, AgentJob } from '../../hooks/useAgentJobs';
import { useJulesAI } from '../../hooks/useJulesAI';
import { useMiniMaxAI } from '../../hooks/useMiniMaxAI';
import { useGroqAI } from '../../hooks/useGroqAI';
import { useOpenRouterAI } from '../../hooks/useOpenRouterAI';
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
  { id: 'pollinations', name: 'Pollinations.ai', costPerHour: 0, description: 'FREE - Universal AI for any task', icon: '🌐' },
  { id: 'minimax', name: 'MiniMax M2.1', costPerHour: 50, description: 'Latest multimodal AI - Coding & creative', icon: '⚡' },
  { id: 'claude', name: 'Claude', costPerHour: 80, description: 'Advanced reasoning and analysis', icon: '🧠' },
  { id: 'gpt4', name: 'GPT-4', costPerHour: 60, description: 'General purpose AI assistant', icon: '🔮' },
  { id: 'dalle', name: 'DALL-E', costPerHour: 40, description: 'Image generation', icon: '🎨' },
  { id: 'midjourney', name: 'Midjourney', costPerHour: 55, description: 'Artistic image creation', icon: '✨' },
  { id: 'whisper', name: 'Whisper', costPerHour: 25, description: 'Audio transcription', icon: '🎤' },
  { id: 'eleven', name: 'ElevenLabs', costPerHour: 45, description: 'Voice synthesis', icon: '🔊' },
];

// Demo agents for hackathon showcase
const DEMO_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'CodeBot Pro',
    description: 'Expert TypeScript and React developer. Full-stack applications, APIs, and smart contracts.',
    type: 'developer',
    agent_type: 'developer',
    avatar_url: null,
    hourly_rate: 45,
    skills: ['TypeScript', 'React', 'Node.js', 'Solidity'],
    performance_score: 98,
    total_jobs: 342,
    is_available: true,
  },
  {
    id: 'agent-2',
    name: 'PixelForge AI',
    description: 'Digital art and UI/UX design specialist. Creates stunning visuals for web and mobile.',
    type: 'designer',
    agent_type: 'designer',
    avatar_url: null,
    hourly_rate: 35,
    skills: ['Figma', 'UI Design', 'Illustration', 'Branding'],
    performance_score: 96,
    total_jobs: 218,
    is_available: true,
  },
  {
    id: 'agent-3',
    name: 'MusicGen Studio',
    description: 'AI music composer and producer. Creates original tracks, beats, and soundscapes.',
    type: 'musician',
    agent_type: 'musician',
    avatar_url: null,
    hourly_rate: 50,
    skills: ['Lo-Fi', 'Synthwave', 'Hip-Hop', 'Ambient'],
    performance_score: 94,
    total_jobs: 156,
    is_available: true,
  },
  {
    id: 'agent-4',
    name: 'ContentCraft AI',
    description: 'Professional copywriter and content strategist. Blog posts, marketing copy, and scripts.',
    type: 'writer',
    agent_type: 'writer',
    avatar_url: null,
    hourly_rate: 30,
    skills: ['Copywriting', 'SEO', 'Scripts', 'Marketing'],
    performance_score: 97,
    total_jobs: 512,
    is_available: true,
  },
  {
    id: 'agent-5',
    name: 'DataMind Analytics',
    description: 'Data analysis and visualization expert. Transforms data into actionable insights.',
    type: 'developer',
    agent_type: 'developer',
    avatar_url: null,
    hourly_rate: 55,
    skills: ['Python', 'SQL', 'Tableau', 'Machine Learning'],
    performance_score: 95,
    total_jobs: 189,
    is_available: false,
  },
  {
    id: 'agent-6',
    name: 'VideoVerse Creator',
    description: 'Video editing and motion graphics artist. Creates engaging video content and animations.',
    type: 'designer',
    agent_type: 'designer',
    avatar_url: null,
    hourly_rate: 60,
    skills: ['Premiere Pro', 'After Effects', '3D Animation', 'VFX'],
    performance_score: 93,
    total_jobs: 124,
    is_available: true,
  },
];

export function AgentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { jobs: myJobs, addJob } = useAgentJobs();
  const {
    isAvailable: julesAvailable,
    isProcessing: julesProcessing,
    generateCode: generateWithJules,
    debugCode: debugWithJules,
    refactorCode: refactorWithJules,
    tasks: julesTasks,
    clearTasks: clearJulesTasks,
  } = useJulesAI();
  const {
    isAvailable: minimaxAvailable,
    isProcessing: minimaxProcessing,
    generateText: generateWithMiniMax,
    generateCode: generateCodeWithMiniMax,
    analyzeCode: analyzeWithMiniMax,
  } = useMiniMaxAI();
  const {
    isAvailable: groqAvailable,
    isProcessing: groqProcessing,
    generateText: generateWithGroq,
    generateCode: generateCodeWithGroq,
    debugCode: debugWithGroq,
    explainCode: explainWithGroq,
    models: groqModels,
  } = useGroqAI();
  const {
    isAvailable: openrouterAvailable,
    isProcessing: openrouterProcessing,
    generateText: generateWithOpenRouter,
    generateCode: generateCodeWithOpenRouter,
    models: openrouterModels,
  } = useOpenRouterAI();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedTab, setSelectedTab] = useState<'marketplace' | 'post-job' | 'my-jobs' | 'economy' | 'jules-studio' | 'minimax-studio' | 'groq-studio' | 'openrouter-studio' | 'pollinations-studio'>('marketplace');
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

  // Jules Studio State
  const [julesPrompt, setJulesPrompt] = useState('');
  const [julesCodeInput, setJulesCodeInput] = useState('');
  const [julesLanguage, setJulesLanguage] = useState('typescript');
  const [julesResult, setJulesResult] = useState<any>(null);
  const [julesMode, setJulesMode] = useState<'generate' | 'debug' | 'refactor'>('generate');
  const [julesRefactorGoal, setJulesRefactorGoal] = useState('');

  // MiniMax Studio State
  const [minimaxResult, setMinimaxResult] = useState<string | null>(null);

  // Groq Studio State
  const [groqResult, setGroqResult] = useState<string | null>(null);

  // OpenRouter Studio State
  const [openrouterResult, setOpenRouterResult] = useState<string | null>(null);

  // Pollinations Studio State
  const [pollinationsPrompt, setPollinationsPrompt] = useState('');
  const [pollinationsResult, setPollinationsResult] = useState<string | null>(null);
  const [pollinationsMode, setPollinationsMode] = useState<'text' | 'code' | 'image'>('text');
  const [pollinationsLanguage, setPollinationsLanguage] = useState('python');
  const [isPollinationsLoading, setIsPollinationsLoading] = useState(false);

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
      if (data) {
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

    // Demo mode - simulate successful hire without wallet
    if (!isConnected) {
        toast.success(`Demo: Successfully hired ${selectedAgent.name}!`);
        setShowHireModal(false);
        
        // Add to jobs for demo
        const newJob = {
            agent_id: selectedAgent.id,
            requester_id: user?.id || 'demo-user',
            title: `Task for ${selectedAgent.name}`,
            description: `Demo hire - ${hireHours} hour(s) of work`,
            status: 'in_progress' as const,
            budget: selectedAgent.hourly_rate * parseFloat(hireHours),
            transaction_hash: 'demo-tx-' + Date.now()
        };
        addJob(newJob);
        return;
    }

    const totalCost = selectedAgent.hourly_rate * parseFloat(hireHours);
    const requiredAmount = parseUnits(totalCost.toString(), MNEE_CONFIG.decimals);

    if (!balance || balance.value < requiredAmount) {
        // Demo fallback
        toast.success(`Demo: Successfully hired ${selectedAgent.name}!`);
        setShowHireModal(false);
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
            onClick={() => setSelectedTab('jules-studio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              selectedTab === 'jules-studio' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Code className="w-4 h-4" />
            Jules Studio
            {julesAvailable && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>}
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('minimax-studio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              selectedTab === 'minimax-studio' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            MiniMax Studio
            {minimaxAvailable && <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>}
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('groq-studio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              selectedTab === 'groq-studio' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Rocket className="w-4 h-4" />
            Groq Studio
            {groqAvailable && <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>}
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('openrouter-studio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              selectedTab === 'openrouter-studio' ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Globe className="w-4 h-4" />
            OpenRouter Studio
            {openrouterAvailable && <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>}
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('pollinations-studio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              selectedTab === 'pollinations-studio' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span className="text-lg">🌐</span>
            Pollinations Studio
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

        {/* Jules Studio Tab */}
        {selectedTab === 'jules-studio' && (
          <div className="max-w-6xl mx-auto">
            {/* Jules Header */}
            <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Jules Studio</h2>
                  <p className="text-green-300">Google's AI Coding Assistant powered by Jules</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${julesAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {julesAvailable ? '● Online' : '● Offline'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Wand2 className="w-4 h-4 text-purple-400" />
                  <span>Code Generation</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Bug className="w-4 h-4 text-red-400" />
                  <span>Bug Fixing</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>Refactoring</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Code className="w-4 h-4 text-green-400" />
                  <span>Documentation</span>
                </div>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => { setJulesMode('generate'); setJulesResult(null); setJulesCodeInput(''); }}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  julesMode === 'generate'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Wand2 className="w-5 h-5" />
                Generate Code
              </button>
              <button
                type="button"
                onClick={() => { setJulesMode('debug'); setJulesResult(null); }}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  julesMode === 'debug'
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Bug className="w-5 h-5" />
                Debug Code
              </button>
              <button
                type="button"
                onClick={() => { setJulesMode('refactor'); setJulesResult(null); }}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  julesMode === 'refactor'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Terminal className="w-5 h-5" />
                Refactor Code
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  {julesMode === 'generate' && <Wand2 className="w-5 h-5 text-purple-400" />}
                  {julesMode === 'debug' && <Bug className="w-5 h-5 text-red-400" />}
                  {julesMode === 'refactor' && <Terminal className="w-5 h-5 text-blue-400" />}
                  {julesMode === 'generate' ? 'What should I create?' : julesMode === 'debug' ? 'Paste your buggy code' : 'Paste code to refactor'}
                </h3>

                {julesMode === 'generate' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Programming Language</label>
                    <select
                      value={julesLanguage}
                      onChange={(e) => setJulesLanguage(e.target.value)}
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="typescript">TypeScript</option>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="rust">Rust</option>
                      <option value="go">Go</option>
                      <option value="ruby">Ruby</option>
                      <option value="php">PHP</option>
                    </select>
                  </div>
                )}

                {julesMode !== 'generate' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Code</label>
                    <textarea
                      value={julesCodeInput}
                      onChange={(e) => setJulesCodeInput(e.target.value)}
                      placeholder={julesMode === 'debug' ? 'Paste your buggy code here...' : 'Paste code to refactor...'}
                      className="w-full h-48 p-4 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                )}

                {julesMode === 'generate' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">What should I build?</label>
                    <textarea
                      value={julesPrompt}
                      onChange={(e) => setJulesPrompt(e.target.value)}
                      placeholder="e.g., Create a React component for a user profile card with avatar, name, and bio..."
                      className="w-full h-48 p-4 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                )}

                {julesMode === 'refactor' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Refactoring Goal</label>
                    <input
                      type="text"
                      value={julesRefactorGoal}
                      onChange={(e) => setJulesRefactorGoal(e.target.value)}
                      placeholder="e.g., Make it more efficient, use modern ES6+ features..."
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                )}

                <button
                  onClick={async () => {
                    if (julesMode === 'generate' && !julesPrompt.trim()) {
                      toast.error('Please describe what you want to build');
                      return;
                    }
                    if (julesMode !== 'generate' && !julesCodeInput.trim()) {
                      toast.error('Please provide code to process');
                      return;
                    }

                    setJulesResult(null);

                    let result;
                    if (julesMode === 'generate') {
                      result = await generateWithJules(julesPrompt, julesLanguage);
                    } else if (julesMode === 'debug') {
                      result = await debugWithJules(julesCodeInput, undefined, julesLanguage);
                    } else {
                      result = await refactorWithJules(julesCodeInput, julesLanguage, julesRefactorGoal);
                    }

                    setJulesResult(result);
                    if (result.success) {
                      toast.success('Code processed successfully!');
                    } else {
                      toast.error(result.error || 'Failed to process code');
                    }
                  }}
                  disabled={julesProcessing || !julesAvailable}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold text-lg hover:from-green-400 hover:to-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {julesProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing with Jules...
                    </>
                  ) : (
                    <>
                      <Code className="w-5 h-5" />
                      {julesMode === 'generate' ? 'Generate Code' : julesMode === 'debug' ? 'Debug Code' : 'Refactor Code'}
                    </>
                  )}
                </button>
              </div>

              {/* Output Section */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-green-400" />
                  Jules Output
                </h3>

                {!julesResult && !julesProcessing && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Code className="w-16 h-16 mb-4 opacity-50" />
                    <p>Ready to code with Jules</p>
                    <p className="text-sm mt-2">Describe what you need and click the button</p>
                  </div>
                )}

                {julesProcessing && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Loader2 className="w-16 h-16 mb-4 animate-spin text-green-400" />
                    <p>Jules is thinking...</p>
                    <p className="text-sm mt-2">Generating code for you</p>
                  </div>
                )}

                {julesResult && (
                  <div>
                    {julesResult.error ? (
                      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                        <h4 className="text-red-400 font-semibold mb-2">Error</h4>
                        <p className="text-gray-300">{julesResult.error}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {julesResult.explanation && (
                          <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4">
                            <h4 className="text-purple-400 font-semibold mb-2">Explanation</h4>
                            <p className="text-gray-300 text-sm">{julesResult.explanation}</p>
                          </div>
                        )}

                        {julesResult.code && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-green-400 font-semibold">Generated Code</h4>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(julesResult.code);
                                  toast.success('Copied to clipboard!');
                                }}
                                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                              >
                                Copy
                              </button>
                            </div>
                            <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                              <code className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                                {julesResult.code}
                              </code>
                            </pre>
                          </div>
                        )}

                        {julesResult.fixedCode && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-red-400 font-semibold">Fixed Code</h4>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(julesResult.fixedCode);
                                  toast.success('Copied to clipboard!');
                                }}
                                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                              >
                                Copy
                              </button>
                            </div>
                            <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                              <code className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                                {julesResult.fixedCode}
                              </code>
                            </pre>
                          </div>
                        )}

                        {julesResult.refactoredCode && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-blue-400 font-semibold">Refactored Code</h4>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(julesResult.refactoredCode);
                                  toast.success('Copied to clipboard!');
                                }}
                                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                              >
                                Copy
                              </button>
                            </div>
                            <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                              <code className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                                {julesResult.refactoredCode}
                              </code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Examples */}
            <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Quick Examples</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setJulesMode('generate');
                    setJulesLanguage('typescript');
                    setJulesPrompt('Create a React hook called useLocalStorage that persists state to localStorage');
                    setJulesResult(null);
                  }}
                  className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg hover:border-green-500 transition-colors text-left"
                >
                  <Code className="w-5 h-5 text-green-400 mb-2" />
                  <h4 className="font-medium text-white">Custom Hook</h4>
                  <p className="text-sm text-gray-400">useLocalStorage hook</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setJulesMode('debug');
                    setJulesLanguage('javascript');
                    setJulesCodeInput(`function addNumbers(a, b) {
  return a + b;
}

console.log(addNumbers("5", "5")); // Should be 10, but shows "55"`);
                    setJulesResult(null);
                  }}
                  className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg hover:border-red-500 transition-colors text-left"
                >
                  <Bug className="w-5 h-5 text-red-400 mb-2" />
                  <h4 className="font-medium text-white">Debug This</h4>
                  <p className="text-sm text-gray-400">String concatenation bug</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setJulesMode('refactor');
                    setJulesLanguage('typescript');
                    setJulesCodeInput(`interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

function printUserInfo(user: User): void {
  console.log("User ID: " + user.id);
  console.log("Name: " + user.name);
  console.log("Email: " + user.email);
  console.log("Age: " + user.age);
}`);
                    setJulesRefactorGoal('Use template literals and destructuring for cleaner code');
                    setJulesResult(null);
                  }}
                  className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg hover:border-blue-500 transition-colors text-left"
                >
                  <Terminal className="w-5 h-5 text-blue-400 mb-2" />
                  <h4 className="font-medium text-white">Refactor This</h4>
                  <p className="text-sm text-gray-400">Modern ES6+ patterns</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MiniMax Studio Tab */}
        {selectedTab === 'minimax-studio' && (
          <div className="max-w-6xl mx-auto">
            {/* MiniMax Header */}
            <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">MiniMax Studio</h2>
                  <p className="text-blue-300">M2.1 - Next-gen multimodal AI for coding & creativity</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${minimaxAvailable ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                    {minimaxAvailable ? '● Online' : '● Offline'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Code className="w-4 h-4 text-green-400" />
                  <span>M2.1 Coding</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Wand2 className="w-4 h-4 text-purple-400" />
                  <span>Multi-language</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>Agent/Tool Use</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Digital Employee</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  MiniMax AI Input
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">What would you like MiniMax to help with?</label>
                  <textarea
                    id="minimax-prompt"
                    placeholder="e.g., Write a creative story about a space explorer, or analyze this code for potential improvements..."
                    className="w-full h-48 p-4 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={async () => {
                    const prompt = (document.getElementById('minimax-prompt') as HTMLTextAreaElement)?.value;
                    if (!prompt?.trim()) {
                      toast.error('Please enter a prompt');
                      return;
                    }

                    const result = await generateWithMiniMax(prompt);
                    if (result.success) {
                      toast.success('Response generated!');
                      setMinimaxResult(result.output);
                    } else {
                      toast.error(result.error || 'Failed to generate response');
                    }
                  }}
                  disabled={minimaxProcessing || !minimaxAvailable}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg font-bold text-lg hover:from-blue-400 hover:to-indigo-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {minimaxProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing with MiniMax...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate with MiniMax
                    </>
                  )}
                </button>

                {/* Code Generation Quick Option */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Quick Code Generation</h4>
                  <input
                    id="minimax-code-prompt"
                    type="text"
                    placeholder="Describe the code you need..."
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg mb-2"
                  />
                  <button
                    onClick={async () => {
                      const prompt = (document.getElementById('minimax-code-prompt') as HTMLInputElement)?.value;
                      if (!prompt?.trim()) {
                        toast.error('Please enter a code description');
                        return;
                      }

                      const result = await generateCodeWithMiniMax(prompt);
                      if (result.success) {
                        toast.success('Code generated!');
                        setMinimaxResult(result.code || result.output);
                      } else {
                        toast.error(result.error || 'Failed to generate code');
                      }
                    }}
                    disabled={minimaxProcessing || !minimaxAvailable}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-semibold hover:from-green-400 hover:to-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Code className="w-5 h-5" />
                    Generate Code
                  </button>
                </div>
              </div>

              {/* Output Section */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  MiniMax Output
                </h3>

                {!minimaxResult && !minimaxProcessing && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Sparkles className="w-16 h-16 mb-4 opacity-50" />
                    <p>Ready to generate with MiniMax</p>
                    <p className="text-sm mt-2">Enter a prompt and click generate</p>
                  </div>
                )}

                {minimaxProcessing && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Loader2 className="w-16 h-16 mb-4 animate-spin text-blue-400" />
                    <p>MiniMax is thinking...</p>
                    <p className="text-sm mt-2">Generating response for you</p>
                  </div>
                )}

                {minimaxResult && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-blue-400 font-semibold">Generated Output</h4>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(minimaxResult);
                          toast.success('Copied to clipboard!');
                        }}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                      <code className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                        {minimaxResult}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* MiniMax Features */}
            <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">MiniMax Capabilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <Sparkles className="w-8 h-8 text-blue-400 mb-3" />
                  <h4 className="font-medium text-white mb-2">Natural Language</h4>
                  <p className="text-sm text-gray-400">Generate creative writing, summaries, and explanations with advanced language understanding.</p>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <Code className="w-8 h-8 text-green-400 mb-3" />
                  <h4 className="font-medium text-white mb-2">Code Generation</h4>
                  <p className="text-sm text-gray-400">Write clean, efficient code in multiple programming languages with proper documentation.</p>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <Terminal className="w-8 h-8 text-purple-400 mb-3" />
                  <h4 className="font-medium text-white mb-2">Analysis & Reasoning</h4>
                  <p className="text-sm text-gray-400">Analyze complex problems, provide reasoning, and suggest optimizations.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Groq Studio Tab */}
        {selectedTab === 'groq-studio' && (
          <div className="max-w-6xl mx-auto">
            {/* Groq Header */}
            <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border border-orange-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Groq Studio</h2>
                  <p className="text-orange-300">Ultra-fast AI inference with Llama & Mixtral models</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${groqAvailable ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
                    {groqAvailable ? '● Online' : '● Offline'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Rocket className="w-4 h-4 text-orange-400" />
                  <span>Ultra-Fast Inference</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Code className="w-4 h-4 text-green-400" />
                  <span>Llama 3.3 70B</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>Mixtral 8x7B</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Bug className="w-4 h-4 text-red-400" />
                  <span>Code & Debug</span>
                </div>
              </div>
            </div>

            {/* Model Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">Select Model</label>
              <div className="flex flex-wrap gap-2">
                {groqModels.slice(0, 4).map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm transition-colors"
                  >
                    {model.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-orange-400" />
                  Groq AI Input
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Your Prompt</label>
                  <textarea
                    id="groq-prompt"
                    placeholder="Ask Groq anything - from creative writing to complex code generation..."
                    className="w-full h-48 p-4 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <button
                  onClick={async () => {
                    const prompt = (document.getElementById('groq-prompt') as HTMLTextAreaElement)?.value;
                    if (!prompt?.trim()) {
                      toast.error('Please enter a prompt');
                      return;
                    }

                    const result = await generateWithGroq(prompt);
                    if (result.success) {
                      toast.success('Response generated!');
                      setGroqResult(result.output || '');
                    } else {
                      toast.error(result.error || 'Failed to generate response');
                    }
                  }}
                  disabled={groqProcessing || !groqAvailable}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-bold text-lg hover:from-orange-400 hover:to-red-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {groqProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing with Groq...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      Generate with Groq
                    </>
                  )}
                </button>

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        const prompt = 'Write a Python function to calculate the sum of a list with error handling';
                        const result = await generateCodeWithGroq(prompt, 'python');
                        if (result.success) {
                          setGroqResult(result.code || result.output || '');
                          toast.success('Code generated!');
                        } else {
                          toast.error(result.error || 'Failed');
                        }
                      }}
                      className="px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-600 rounded-lg text-sm flex items-center gap-2"
                    >
                      <Code className="w-4 h-4 text-green-400" />
                      Generate Code
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const prompt = 'Explain the benefits of Groq\'s ultra-fast inference architecture';
                        const result = await generateWithGroq(prompt);
                        if (result.success) {
                          setGroqResult(result.output || '');
                          toast.success('Explanation generated!');
                        } else {
                          toast.error(result.error || 'Failed');
                        }
                      }}
                      className="px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-600 rounded-lg text-sm flex items-center gap-2"
                    >
                      <Terminal className="w-4 h-4 text-blue-400" />
                      Explain
                    </button>
                  </div>
                </div>
              </div>

              {/* Output Section */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-orange-400" />
                  Groq Output
                </h3>

                {!groqResult && !groqProcessing && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Rocket className="w-16 h-16 mb-4 opacity-50" />
                    <p>Ready to generate with Groq</p>
                    <p className="text-sm mt-2">Known for ultra-fast inference</p>
                  </div>
                )}

                {groqProcessing && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Loader2 className="w-16 h-16 mb-4 animate-spin text-orange-400" />
                    <p>Groq is thinking...</p>
                    <p className="text-sm mt-2">Generating response at maximum speed</p>
                  </div>
                )}

                {groqResult && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-orange-400 font-semibold">Generated Output</h4>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(groqResult);
                          toast.success('Copied to clipboard!');
                        }}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                      <code className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                        {groqResult}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Groq Features */}
            <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Why Groq?</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <Rocket className="w-8 h-8 text-orange-400 mb-3" />
                  <h4 className="font-medium text-white mb-2">Speed</h4>
                  <p className="text-sm text-gray-400">Fastest inference in the industry - responses in milliseconds.</p>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <Code className="w-8 h-8 text-green-400 mb-3" />
                  <h4 className="font-medium text-white mb-2">Open Models</h4>
                  <p className="text-sm text-gray-400">Access to top open-source models like Llama and Mixtral.</p>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <Terminal className="w-8 h-8 text-blue-400 mb-3" />
                  <h4 className="font-medium text-white mb-2">OpenAI Compatible</h4>
                  <p className="text-sm text-gray-400">Drop-in replacement for OpenAI API - easy migration.</p>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <Zap className="w-8 h-8 text-yellow-400 mb-3" />
                  <h4 className="font-medium text-white mb-2">Efficiency</h4>
                  <p className="text-sm text-gray-400">Optimized for production workloads with high throughput.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OpenRouter Studio Tab */}
        {selectedTab === 'openrouter-studio' && (
          <div className="max-w-6xl mx-auto">
            {/* OpenRouter Header */}
            <div className="bg-gradient-to-r from-teal-900/50 to-cyan-900/50 border border-teal-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">OpenRouter Studio</h2>
                  <p className="text-teal-300">Access 100+ AI models through a single unified API</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${openrouterAvailable ? 'bg-teal-500/20 text-teal-400' : 'bg-red-500/20 text-red-400'}`}>
                    {openrouterAvailable ? '● Online' : '● Offline'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Globe className="w-4 h-4 text-teal-400" />
                  <span>100+ Models</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Best Price/Perf</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Code className="w-4 h-4 text-green-400" />
                  <span>OpenAI Compatible</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Rocket className="w-4 h-4 text-orange-400" />
                  <span>Flexible Routing</span>
                </div>
              </div>
            </div>

            {/* Model Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">Select Model</label>
              <div className="flex flex-wrap gap-2">
                {openrouterModels.slice(0, 6).map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm transition-colors"
                  >
                    {model.id.split('/').pop()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-teal-400" />
                  OpenRouter AI Input
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Your Prompt</label>
                  <textarea
                    id="openrouter-prompt"
                    placeholder="Ask OpenRouter anything - access Claude, GPT-4, Llama, and many more models..."
                    className="w-full h-48 p-4 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <button
                  onClick={async () => {
                    const prompt = (document.getElementById('openrouter-prompt') as HTMLTextAreaElement)?.value;
                    if (!prompt?.trim()) {
                      toast.error('Please enter a prompt');
                      return;
                    }

                    const result = await generateWithOpenRouter(prompt);
                    if (result.success) {
                      toast.success('Response generated!');
                      setOpenRouterResult(result.output || '');
                    } else {
                      toast.error(result.error || 'Failed to generate response');
                    }
                  }}
                  disabled={openrouterProcessing || !openrouterAvailable}
                  className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg font-bold text-lg hover:from-teal-400 hover:to-cyan-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {openrouterProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing with OpenRouter...
                    </>
                  ) : (
                    <>
                      <Globe className="w-5 h-5" />
                      Generate with OpenRouter
                    </>
                  )}
                </button>

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        const prompt = 'Write a React component for a todo list with add, toggle, and delete functionality';
                        const result = await generateCodeWithOpenRouter(prompt, 'react');
                        if (result.success) {
                          setOpenRouterResult(result.code || result.output || '');
                          toast.success('Code generated!');
                        } else {
                          toast.error(result.error || 'Failed');
                        }
                      }}
                      className="px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-600 rounded-lg text-sm flex items-center gap-2"
                    >
                      <Code className="w-4 h-4 text-green-400" />
                      Generate Code
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const prompt = 'Explain the benefits of using OpenRouter for AI model access';
                        const result = await generateWithOpenRouter(prompt);
                        if (result.success) {
                          setOpenRouterResult(result.output || '');
                          toast.success('Explanation generated!');
                        } else {
                          toast.error(result.error || 'Failed');
                        }
                      }}
                      className="px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-600 rounded-lg text-sm flex items-center gap-2"
                    >
                      <Terminal className="w-4 h-4 text-blue-400" />
                      Explain
                    </button>
                  </div>
                </div>
              </div>

              {/* Output Section */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-teal-400" />
                  OpenRouter Output
                </h3>

                {!openrouterResult && !openrouterProcessing && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <Globe className="w-16 h-16 mb-4 opacity-50" />
                    <p>Ready to generate with OpenRouter</p>
                    <p className="text-sm mt-2">Access 100+ models from one API</p>
                  </div>
                )}

                {openrouterProcessing && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Loader2 className="w-16 h-16 mb-4 animate-spin text-teal-400" />
                    <p>OpenRouter is thinking...</p>
                    <p className="text-sm mt-2">Routing to the best model</p>
                  </div>
                )}

                {openrouterResult && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-teal-400 font-semibold">Generated Output</h4>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(openrouterResult);
                          toast.success('Copied to clipboard!');
                        }}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                      <code className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                        {openrouterResult}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* OpenRouter Features */}
            <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Why OpenRouter?</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <Globe className="w-8 h-8 text-teal-400 mb-3" />
                  <h4 className="font-medium text-white mb-2">100+ Models</h4>
                  <p className="text-sm text-gray-400">Access Anthropic, OpenAI, Meta, and many more providers through one API.</p>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <Zap className="w-8 h-8 text-yellow-400 mb-3" />
                  <h4 className="font-medium text-white mb-2">Best Routing</h4>
                  <p className="text-sm text-gray-400">Automatically routes to the best model for your use case and budget.</p>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <Code className="w-8 h-8 text-green-400 mb-3" />
                  <h4 className="font-medium text-white mb-2">OpenAI Compatible</h4>
                  <p className="text-sm text-gray-400">Drop-in replacement for OpenAI SDK - no code changes needed.</p>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <DollarSign className="w-8 h-8 text-blue-400 mb-3" />
                  <h4 className="font-medium text-white mb-2">Unified Billing</h4>
                  <p className="text-sm text-gray-400">Single bill for all AI providers with consolidated usage tracking.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pollinations Studio Tab */}
        {selectedTab === 'pollinations-studio' && (
          <div className="max-w-6xl mx-auto">
            {/* Pollinations Header */}
            <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                  <span className="text-3xl">🌐</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Pollinations Studio</h2>
                  <p className="text-green-300">100% FREE - Universal AI for text, code & images</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                    ● Always Online
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Code className="w-4 h-4 text-blue-400" />
                  <span>Code Generation</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Wand2 className="w-4 h-4 text-purple-400" />
                  <span>Creative Writing</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>Image Generation</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>No API Key Needed</span>
                </div>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => { setPollinationsMode('text'); setPollinationsResult(null); }}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  pollinationsMode === 'text'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Wand2 className="w-5 h-5" />
                Text Generation
              </button>
              <button
                type="button"
                onClick={() => { setPollinationsMode('code'); setPollinationsResult(null); }}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  pollinationsMode === 'code'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Code className="w-5 h-5" />
                Code Generation
              </button>
              <button
                type="button"
                onClick={() => { setPollinationsMode('image'); setPollinationsResult(null); }}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  pollinationsMode === 'image'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                Image Generation
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  {pollinationsMode === 'text' && <Wand2 className="w-5 h-5 text-purple-400" />}
                  {pollinationsMode === 'code' && <Code className="w-5 h-5 text-blue-400" />}
                  {pollinationsMode === 'image' && <Sparkles className="w-5 h-5 text-pink-400" />}
                  {pollinationsMode === 'text' ? 'What would you like to create?' : pollinationsMode === 'code' ? 'Describe the code you need' : 'Describe the image you want'}
                </h3>

                {pollinationsMode === 'code' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">Programming Language</label>
                    <select
                      value={pollinationsLanguage}
                      onChange={(e) => setPollinationsLanguage(e.target.value)}
                      className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="python">Python</option>
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="go">Go</option>
                      <option value="rust">Rust</option>
                      <option value="html">HTML/CSS</option>
                    </select>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    {pollinationsMode === 'text' ? 'Your prompt' : pollinationsMode === 'code' ? 'What should the code do?' : 'Image description'}
                  </label>
                  <textarea
                    value={pollinationsPrompt}
                    onChange={(e) => setPollinationsPrompt(e.target.value)}
                    placeholder={
                      pollinationsMode === 'text' 
                        ? 'e.g., Write a creative story about a space explorer...' 
                        : pollinationsMode === 'code'
                        ? 'e.g., Create a Python function to calculate Fibonacci numbers...'
                        : 'e.g., A beautiful sunset over mountains with vibrant colors...'
                    }
                    className="w-full h-48 p-4 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <button
                  onClick={async () => {
                    if (!pollinationsPrompt.trim()) {
                      toast.error('Please enter a prompt');
                      return;
                    }

                    setIsPollinationsLoading(true);
                    setPollinationsResult(null);

                    try {
                      let result = '';
                      if (pollinationsMode === 'image') {
                        // Image generation via Pollinations
                        const encodedPrompt = encodeURIComponent(pollinationsPrompt);
                        result = `![Generated Image](https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nolog=true)`;
                        toast.success('Image generated!');
                      } else {
                        // Text/Code generation via Pollinations
                        const modePrefix = pollinationsMode === 'code' ? `Write ${pollinationsLanguage} code for: ` : '';
                        const encodedPrompt = encodeURIComponent(modePrefix + pollinationsPrompt);
                        const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}`, {
                          method: 'GET',
                          headers: { 'Accept': 'text/plain' },
                        });
                        
                        if (!response.ok) throw new Error('Generation failed');
                        result = await response.text();
                        toast.success('Response generated!');
                      }
                      
                      setPollinationsResult(result);
                    } catch (error: any) {
                      toast.error(error.message || 'Failed to generate');
                    } finally {
                      setIsPollinationsLoading(false);
                    }
                  }}
                  disabled={isPollinationsLoading}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold text-lg hover:from-green-400 hover:to-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPollinationsLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate with Pollinations
                    </>
                  )}
                </button>

                {/* Quick Examples */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">Quick Examples</h4>
                  <div className="space-y-2">
                    {pollinationsMode === 'text' && (
                      <button
                        type="button"
                        onClick={() => setPollinationsPrompt('Write a short poem about artificial intelligence')}
                        className="w-full px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-600 rounded-lg text-sm text-left"
                      >
                        "Write a short poem about AI"
                      </button>
                    )}
                    {pollinationsMode === 'code' && (
                      <button
                        type="button"
                        onClick={() => { setPollinationsPrompt('Create a REST API endpoint for user authentication'); setPollinationsLanguage('python'); }}
                        className="w-full px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-600 rounded-lg text-sm text-left"
                      >
                        "Create a REST API for authentication"
                      </button>
                    )}
                    {pollinationsMode === 'image' && (
                      <button
                        type="button"
                        onClick={() => setPollinationsPrompt('A cyberpunk city at night with neon lights and flying cars')}
                        className="w-full px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-600 rounded-lg text-sm text-left"
                      >
                        "Cyberpunk city at night with neon lights"
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Output Section */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-400" />
                  Pollinations Output
                </h3>

                {!pollinationsResult && !isPollinationsLoading && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <span className="text-6xl mb-4">🌐</span>
                    <p>Ready to generate with Pollinations</p>
                    <p className="text-sm mt-2">100% Free - No API key required</p>
                  </div>
                )}

                {isPollinationsLoading && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Loader2 className="w-16 h-16 mb-4 animate-spin text-green-400" />
                    <p>Pollinations is creating...</p>
                    <p className="text-sm mt-2">This is completely free!</p>
                  </div>
                )}

                {pollinationsResult && (
                  <div>
                    {pollinationsMode === 'image' ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-pink-400 font-semibold">Generated Image</h4>
                          <a
                            href={pollinationsResult.match(/!\[.*\]\((.*)\)/)?.[1] || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                          >
                            Open Full Size
                          </a>
                        </div>
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-2">
                          <img 
                            src={pollinationsResult.match(/!\[.*\]\((.*)\)/)?.[1] || ''} 
                            alt="Generated"
                            className="w-full rounded-lg"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-green-400 font-semibold">Generated Output</h4>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(pollinationsResult);
                              toast.success('Copied to clipboard!');
                            }}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                        <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto">
                          <code className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                            {pollinationsResult}
                          </code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Pollinations Features */}
            <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Why Pollinations.ai?</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <span className="text-3xl mb-3 block">💰</span>
                  <h4 className="font-medium text-white mb-2">100% Free</h4>
                  <p className="text-sm text-gray-400">No API keys, no credits, no limits. Always free to use.</p>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <span className="text-3xl mb-3 block">🌍</span>
                  <h4 className="font-medium text-white mb-2">Universal Access</h4>
                  <p className="text-sm text-gray-400">Text, code, and image generation in one place.</p>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <span className="text-3xl mb-3 block">⚡</span>
                  <h4 className="font-medium text-white mb-2">Fast Results</h4>
                  <p className="text-sm text-gray-400">Quick generation without authentication delays.</p>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <span className="text-3xl mb-3 block">🔒</span>
                  <h4 className="font-medium text-white mb-2">No Tracking</h4>
                  <p className="text-sm text-gray-400">Privacy-focused, no account required.</p>
                </div>
              </div>
            </div>
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
