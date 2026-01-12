import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { 
  Agent, 
  AgentJob, 
  JobTask, 
  AgentType,
  agentEngine,
  AITaskType 
} from '../lib/agent-engine';
import { aiServiceManager } from '../lib/ai-services';
import { v4 as uuidv4 } from 'uuid';

// Demo agents for when no real agents exist
const DEMO_AGENTS: Agent[] = [
  {
    id: 'demo-designer-1',
    name: 'DesignMaster Pro',
    description: 'Expert UI/UX designer specializing in modern, clean interfaces',
    type: 'designer',
    hourly_rate: 75,
    skills: ['UI Design', 'UX Research', 'Figma', 'Prototyping', 'Branding'],
    personality: { tone: 'creative', detail_level: 'detailed', creativity: 0.9, urgency: 'normal' },
    performance_score: 98,
    total_jobs: 150,
    completed_jobs: 145,
    is_available: true,
    created_by: 'system',
    created_at: new Date('2024-01-01'),
  },
  {
    id: 'demo-developer-1',
    name: 'CodeWizard AI',
    description: 'Full-stack developer with expertise in React, Node.js, and AI integration',
    type: 'developer',
    hourly_rate: 100,
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AI/ML'],
    personality: { tone: 'professional', detail_level: 'detailed', creativity: 0.7, urgency: 'urgent' },
    performance_score: 99,
    total_jobs: 200,
    completed_jobs: 198,
    is_available: true,
    created_by: 'system',
    created_at: new Date('2024-01-01'),
  },
  {
    id: 'demo-writer-1',
    name: 'ContentCreator',
    description: 'Versatile content writer for blogs, marketing, and technical documentation',
    type: 'writer',
    hourly_rate: 50,
    skills: ['Copywriting', 'Technical Writing', 'SEO', 'Blog Posts', 'Marketing'],
    personality: { tone: 'professional', detail_level: 'balanced', creativity: 0.8, urgency: 'normal' },
    performance_score: 95,
    total_jobs: 300,
    completed_jobs: 290,
    is_available: true,
    created_by: 'system',
    created_at: new Date('2024-01-01'),
  },
  {
    id: 'demo-analyst-1',
    name: 'DataInsight AI',
    description: 'Data analyst specializing in trends, predictions, and business intelligence',
    type: 'analyst',
    hourly_rate: 85,
    skills: ['Data Analysis', 'Visualization', 'Statistics', 'Machine Learning', 'Reporting'],
    personality: { tone: 'technical', detail_level: 'detailed', creativity: 0.6, urgency: 'normal' },
    performance_score: 97,
    total_jobs: 120,
    completed_jobs: 115,
    is_available: true,
    created_by: 'system',
    created_at: new Date('2024-01-01'),
  },
  {
    id: 'demo-minimax-1',
    name: 'MiniMax Assistant',
    description: 'Multimodal AI assistant powered by MiniMax for comprehensive task handling',
    type: 'multimodal',
    hourly_rate: 45,
    skills: ['Text Generation', 'Code Analysis', 'Image Understanding', 'Reasoning', 'Planning'],
    personality: { tone: 'casual', detail_level: 'balanced', creativity: 0.8, urgency: 'normal' },
    performance_score: 96,
    total_jobs: 500,
    completed_jobs: 490,
    is_available: true,
    created_by: 'system',
    created_at: new Date('2024-01-01'),
  },
];

interface UseAIAgentsReturn {
  agents: Agent[];
  jobs: AgentJob[];
  loading: boolean;
  error: string | null;
  availableServices: { id: string; name: string; capabilities: string[] }[];
  
  // Agent actions
  loadAgents: () => Promise<void>;
  getAgent: (id: string) => Promise<Agent | null>;
  createAgent: (data: Partial<Agent>) => Promise<Agent>;
  hireAgent: (agentId: string, task: string, budget: number) => Promise<AgentJob>;
  
  // Job actions
  loadJobs: () => Promise<void>;
  postJob: (title: string, description: string, budget: number, agentType: AgentType) => Promise<AgentJob>;
  executeJob: (jobId: string) => Promise<JobTask[]>;
  verifyTask: (taskId: string, criteria?: any) => Promise<{ valid: boolean; score: number; feedback: string[] }>;
  
  // AI Task actions
  executeAITask: (taskType: AITaskType, input: any, options?: any) => Promise<any>;
  generateText: (prompt: string, options?: any) => Promise<any>;
  generateImage: (prompt: string, options?: any) => Promise<any>;
}

export function useAIAgents(): UseAIAgentsReturn {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>(DEMO_AGENTS);
  const [jobs, setJobs] = useState<AgentJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableServices = aiServiceManager.getAvailableServices();

  // Load agents from database or use demos
  const loadAgents = useCallback(async () => {
    setLoading(true);
    try {
      // Try to load from Supabase first
      const { data, error: dbError } = await supabase
        .from('agents')
        .select('*')
        .eq('is_available', true)
        .order('performance_score', { ascending: false });

      if (dbError || !data || data.length === 0) {
        // Use demo agents if no real ones exist
        setAgents(DEMO_AGENTS);
      } else {
        setAgents([...data, ...DEMO_AGENTS.filter(d => !data.find((a: any) => a.id === d.id))]);
      }
    } catch (err: any) {
      console.log('Using demo agents:', err.message);
      setAgents(DEMO_AGENTS);
    }
    setLoading(false);
  }, []);

  // Get single agent
  const getAgent = useCallback(async (id: string): Promise<Agent | null> => {
    const agent = agents.find(a => a.id === id);
    if (agent) return agent;
    
    // Try database
    const { data } = await supabase.from('agents').select('*').eq('id', id).single();
    return data;
  }, [agents]);

  // Create new agent
  const createAgent = useCallback(async (data: Partial<Agent>): Promise<Agent> => {
    setLoading(true);
    try {
      const newAgent = await agentEngine.createAgent({
        name: data.name || 'New Agent',
        description: data.description || '',
        type: data.type || 'custom',
        hourly_rate: data.hourly_rate || 50,
        skills: data.skills || [],
        personality: data.personality,
        system_prompt: data.system_prompt,
        created_by: user?.id || 'anonymous',
      });

      // Save to database
      await supabase.from('agents').insert(newAgent);
      
      setAgents(prev => [...prev, newAgent]);
      return newAgent;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Hire an agent
  const hireAgent = useCallback(async (
    agentId: string,
    task: string,
    budget: number
  ): Promise<AgentJob> => {
    const agent = await getAgent(agentId);
    if (!agent) throw new Error('Agent not found');

    const job: AgentJob = {
      id: uuidv4(),
      agent_id: agentId,
      requester_id: user?.id || 'anonymous',
      title: `Task for ${agent.name}`,
      description: task,
      status: 'pending',
      budget,
      payment_status: 'pending',
      tasks: [{
        id: uuidv4(),
        job_id: '',
        type: 'text_generation',
        input: { prompt: task },
        status: 'pending',
        created_at: new Date(),
      }],
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Save job
    await supabase.from('agent_jobs').insert(job);
    setJobs(prev => [...prev, job]);
    
    return job;
  }, [user, getAgent]);

  // Load jobs
  const loadJobs = useCallback(async () => {
    if (!user) return;
    
    const { data, error: dbError } = await supabase
      .from('agent_jobs')
      .select('*')
      .eq('requester_id', user.id)
      .order('created_at', { ascending: false });

    if (!dbError && data) {
      setJobs(data);
    }
  }, [user]);

  // Post a job to marketplace
  const postJob = useCallback(async (
    title: string,
    description: string,
    budget: number,
    agentType: AgentType
  ): Promise<AgentJob> => {
    const job: AgentJob = {
      id: uuidv4(),
      agent_id: 'marketplace',
      requester_id: user?.id || 'anonymous',
      title,
      description,
      status: 'pending',
      budget,
      payment_status: 'pending',
      tasks: [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    await supabase.from('marketplace_jobs').insert(job);
    return job;
  }, [user]);

  // Execute a job with real AI
  const executeJob = useCallback(async (jobId: string): Promise<JobTask[]> => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) throw new Error('Job not found');

    const agent = await getAgent(job.agent_id);
    if (!agent) throw new Error('Agent not found');

    // Update job status
    job.status = 'in_progress';
    job.updated_at = new Date();

    // Execute tasks
    const results = await agentEngine.executeJob(job, agent);
    
    // Update job with results
    job.tasks = results;
    job.status = results.every(t => t.status === 'completed') ? 'completed' : 'review';
    job.completed_at = new Date();

    // Save to database
    await supabase.from('agent_jobs').update({
      status: job.status,
      tasks: job.tasks,
      completed_at: job.completed_at,
    }).eq('id', jobId);

    setJobs(prev => prev.map(j => j.id === jobId ? job : j));
    
    return results;
  }, [jobs, getAgent]);

  // Verify task completion
  const verifyTask = useCallback(async (
    taskId: string,
    criteria?: any
  ): Promise<{ valid: boolean; score: number; feedback: string[] }> => {
    const job = jobs.find(j => j.tasks.find(t => t.id === taskId));
    const task = job?.tasks.find(t => t.id === taskId);
    
    if (!task || !task.result) {
      return { valid: false, score: 0, feedback: ['Task not found'] };
    }

    return agentEngine.verifyTaskCompletion(task, criteria);
  }, [jobs]);

  // Direct AI Task execution - Auto-selects best FREE service
  // Priority: MiniMax Lightning → Groq → Pollinations (all free!)
  const executeAITask = useCallback(async (
    taskType: AITaskType,
    input: any,
    options?: { priority?: string }
  ) => {
    // Auto-select best free service (user doesn't choose)
    // Priority order: MiniMax Lightning (fastest) → Groq → Pollinations
    const freeServices = [
      { service: 'minimax', model: 'abab6.5s-chat' },  // MiniMax Lightning - fastest
      { service: 'groq', model: 'llama-3.1-70b-versatile' },  // Groq - fast inference
      { service: 'pollinations', model: 'deepseek' },  // Pollinations - always available
    ];
    
    // Try each service in priority order
    for (const { service, model } of freeServices) {
      try {
        const result = await aiServiceManager.executeTaskWithFallback({
          id: uuidv4(),
          service: service as any,
          model,
          taskType,
          input,
          userId: user?.id || 'anonymous',
          priority: options?.priority as any,
          createdAt: new Date(),
        });
        
        if (result.success) {
          return result;
        }
      } catch (error) {
        console.log(`${service} unavailable, trying next...`);
        continue;
      }
    }
    
    // Final fallback - should always work with Pollinations
    return aiServiceManager.executeTaskWithFallback({
      id: uuidv4(),
      service: 'pollinations' as any,
      model: 'deepseek',
      taskType,
      input,
      userId: user?.id || 'anonymous',
      priority: options?.priority as any,
      createdAt: new Date(),
    });
  }, [user]);

  // Convenience methods - Auto-select best free service
  const generateText = useCallback(async (prompt: string) => {
    // Auto-selects MiniMax Lightning → Groq → Pollinations
    return executeAITask('text_generation', { prompt });
  }, [executeAITask]);

  const generateImage = useCallback(async (prompt: string, options?: { width?: number; height?: number }) => {
    // Use Pollinations.ai for images (best free option for images)
    return executeAITask('image_generation', { 
      prompt, 
      width: options?.width || 1024,
      height: options?.height || 1024,
    });
  }, [executeAITask]);

  // Initial load
  useEffect(() => {
    loadAgents();
    if (user) {
      loadJobs();
    }
  }, [user, loadAgents, loadJobs]);

  return {
    agents,
    jobs,
    loading,
    error,
    availableServices,
    loadAgents,
    getAgent,
    createAgent,
    hireAgent,
    loadJobs,
    postJob,
    executeJob,
    verifyTask,
    executeAITask,
    generateText,
    generateImage,
  };
}
