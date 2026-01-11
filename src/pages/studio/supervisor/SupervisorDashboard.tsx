import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { ArrowRight, Bot, CheckCircle, Clock, Zap, AlertCircle, FileText, User } from 'lucide-react';
import { MNEE_CONFIG, formatMNEE } from '../../../lib/mnee';

interface AgentJob {
  id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  agent_id: string;
  created_at: string;
}

// Mock Sub-Tasks for Visualization
const MOCK_SUBTASKS = [
  { id: 1, title: 'Analyze requirements', status: 'completed', agent: 'Supervisor AI' },
  { id: 2, title: 'Generate color palette', status: 'completed', agent: 'DesignBot' },
  { id: 3, title: 'Optimize assets', status: 'in_progress', agent: 'AssetOptimizer' },
  { id: 4, title: 'Review accessibility', status: 'pending', agent: 'Human Expert' },
];

export const SupervisorDashboard = () => {
  const { user } = useAuth();
  const [activeJobs, setActiveJobs] = useState<AgentJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<AgentJob | null>(null);

  useEffect(() => {
    // Load jobs from local storage mock (shared with AgentsPage)
    // In a real app, this would be a Supabase query
    const loadJobs = () => {
        // We need to fetch from the same source as AgentsPage
        // Since AgentsPage uses supabase for `myJobs` but we modified it to use local state for the demo flow...
        // Let's rely on the fact that we might have persisted it or just mock it if empty for the demo.
        // Wait, in the previous turn we only updated local state in AgentsPage, we didn't persist to localStorage "my_jobs".
        // Let's check if we can read from the same place.
        // Actually, for a robust demo, let's mock a "Live" project if none exists.

        const demoJob = {
            id: 'job_demo_123',
            title: 'Portfolio Site Redesign',
            description: 'Complete overhaul of the personal portfolio with neon theme.',
            status: 'in_progress',
            budget: 150,
            agent_id: 'supervisor_1',
            created_at: new Date().toISOString()
        };
        setActiveJobs([demoJob]);
        setSelectedJob(demoJob);
    };
    loadJobs();
  }, [user]);

  if (!user) return <div className="p-8 text-center text-gray-400">Please sign in to view the dashboard.</div>;

  return (
    <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
                    <Bot className="w-8 h-8 text-blue-400" />
                    Supervisor AI Dashboard
                </h1>
                <p className="text-gray-400 mt-2">Orchestrating your creative vision across the agent economy.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Active Projects */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-white mb-4">Active Projects</h2>
                    {activeJobs.map(job => (
                        <div
                            key={job.id}
                            onClick={() => setSelectedJob(job)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                selectedJob?.id === job.id
                                ? 'bg-blue-900/20 border-blue-500/50'
                                : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-white">{job.title}</h3>
                                <span className="text-xs px-2 py-1 bg-green-900/50 text-green-400 rounded-full">
                                    {job.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2 mb-3">{job.description}</p>
                            <div className="flex items-center gap-2 text-xs text-blue-300">
                                <Zap className="w-3 h-3" />
                                <span>Budget: {job.budget} MNEE</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Col: Visualization */}
                <div className="lg:col-span-2">
                    {selectedJob ? (
                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 h-full">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-white">Orchestration Flow</h2>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm border border-blue-500/30">
                                        Quality Score: 98/100
                                    </span>
                                </div>
                            </div>

                            {/* Tree Visualization */}
                            <div className="relative space-y-8">
                                {/* Root: User */}
                                <div className="flex justify-center">
                                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl flex items-center gap-3 w-48 shadow-lg z-10 relative">
                                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">You</p>
                                            <p className="text-xs text-gray-400">Client</p>
                                        </div>
                                        {/* Connector Line Down */}
                                        <div className="absolute top-full left-1/2 w-0.5 h-8 bg-gray-700 -translate-x-1/2"></div>
                                    </div>
                                </div>

                                {/* Level 1: Supervisor */}
                                <div className="flex justify-center">
                                    <div className="bg-blue-900/30 border border-blue-500/50 p-4 rounded-xl flex items-center gap-3 w-64 shadow-lg shadow-blue-900/20 z-10 relative animate-pulse-slow">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Supervisor AI</p>
                                            <p className="text-xs text-blue-300">Orchestrator</p>
                                        </div>
                                        {/* Connector Lines Down */}
                                        <div className="absolute top-full left-1/2 w-0.5 h-8 bg-gray-700 -translate-x-1/2"></div>
                                        <div className="absolute top-full left-1/4 w-0.5 h-8 bg-gray-700 -translate-x-1/2 rotate-12 origin-top"></div>
                                        <div className="absolute top-full right-1/4 w-0.5 h-8 bg-gray-700 translate-x-1/2 -rotate-12 origin-top"></div>
                                    </div>
                                </div>

                                {/* Level 2: Sub-Agents */}
                                <div className="flex justify-center gap-4 flex-wrap">
                                    {MOCK_SUBTASKS.map((task) => (
                                        <div key={task.id} className="bg-gray-800 border border-gray-700 p-3 rounded-xl flex flex-col gap-2 w-40 min-h-[120px]">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                    task.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-gray-700 text-gray-400'
                                                }`}>
                                                    {task.status === 'completed' ? <CheckCircle className="w-3 h-3" /> :
                                                     task.status === 'in_progress' ? <Clock className="w-3 h-3" /> :
                                                     <AlertCircle className="w-3 h-3" />}
                                                </div>
                                                <span className="text-xs text-gray-300 font-medium truncate">{task.agent}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 leading-tight">{task.title}</p>

                                            {task.status === 'completed' && (
                                                <div className="mt-auto pt-2 flex items-center gap-1 text-[10px] text-green-400">
                                                    <FileText className="w-3 h-3" />
                                                    <span>Output Ready</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Economy Log */}
                            <div className="mt-8 pt-6 border-t border-gray-800">
                                <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">MNEE Transaction Log</h3>
                                <div className="space-y-2 text-xs font-mono">
                                    <div className="flex justify-between text-gray-400">
                                        <span>[10:00:01] Supervisor initialized</span>
                                        <span className="text-red-400">-5.00 MNEE</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>[10:00:05] Hired DesignBot (Agent)</span>
                                        <span className="text-red-400">-15.00 MNEE</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>[10:05:22] DesignBot hired Human Expert (Review)</span>
                                        <span className="text-yellow-400">Escrow: 20.00 MNEE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Select a project to view details
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default SupervisorDashboard;
