import { v4 as uuidv4 } from 'uuid';
import { 
  AITask, 
  AITaskResult, 
  AITaskType, 
  aiServiceManager,
  AI_SERVICES_CONFIG 
} from './ai-services';

// Agent Types and Interfaces
export interface Agent {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  avatar_url?: string;
  hourly_rate: number;
  skills: string[];
  personality?: AgentPersonality;
  system_prompt?: string;
  performance_score: number;
  total_jobs: number;
  completed_jobs: number;
  is_available: boolean;
  created_by: string;
  created_at: Date;
}

export type AgentType = 
  | 'designer'
  | 'developer'
  | 'writer'
  | 'analyst'
  | 'multimodal'
  | 'custom';

export interface AgentPersonality {
  tone: 'professional' | 'casual' | 'creative' | 'technical';
  detail_level: 'concise' | 'balanced' | 'detailed';
  creativity: number; // 0-1
  urgency: 'patient' | 'normal' | 'urgent';
}

// Job Types
export interface AgentJob {
  id: string;
  agent_id: string;
  requester_id: string;
  title: string;
  description: string;
  status: JobStatus;
  budget: number;
  payment_status: 'pending' | 'processing' | 'completed' | 'failed';
  tasks: JobTask[];
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
  transaction_hash?: string;
}

export type JobStatus = 
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'review'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface JobTask {
  id: string;
  job_id: string;
  type: AITaskType;
  input: Record<string, any>;
  output?: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: AITaskResult;
  ai_service?: string;
  model?: string;
  cost?: number;
  created_at: Date;
  completed_at?: Date;
}

// Agent Execution Engine
export class AgentExecutionEngine {
  private agentPromises: Map<string, Promise<AITaskResult>> = new Map();

  // Create a new agent
  async createAgent(data: {
    name: string;
    description: string;
    type: AgentType;
    hourly_rate: number;
    skills: string[];
    personality?: AgentPersonality;
    system_prompt?: string;
    created_by: string;
  }): Promise<Agent> {
    const agent: Agent = {
      id: uuidv4(),
      ...data,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${data.name}`,
      performance_score: 100,
      total_jobs: 0,
      completed_jobs: 0,
      is_available: true,
      created_at: new Date(),
    };

    // In production, save to database
    // await supabase.from('agents').insert(agent);

    return agent;
  }

  // Execute a task for an agent
  async executeAgentTask(
    agent: Agent,
    taskType: AITaskType,
    input: Record<string, any>,
    options?: {
      priority?: 'low' | 'normal' | 'high' | 'urgent';
      specificService?: keyof typeof AI_SERVICES_CONFIG;
      specificModel?: string;
    }
  ): Promise<AITaskResult> {
    // Build system prompt based on agent personality
    const systemPrompt = this.buildSystemPrompt(agent, taskType, input);

    // Determine best AI service based on task type and agent skills
    const { service, model } = this.selectBestService(agent, taskType, options);

    // Create task
    const task: AITask = {
      id: uuidv4(),
      service,
      model,
      taskType,
      input: {
        ...input,
        systemPrompt,
      },
      userId: agent.id,
      priority: options?.priority || 'normal',
      createdAt: new Date(),
    };

    // Execute task
    const result = await aiServiceManager.executeTaskWithFallback(task);

    // Update agent stats
    if (result.success) {
      agent.total_jobs++;
      agent.completed_jobs++;
    }

    return result;
  }

  // Execute a complete job
  async executeJob(job: AgentJob, agent: Agent): Promise<JobTask[]> {
    const results: JobTask[] = [];

    for (const task of job.tasks) {
      task.status = 'processing';
      task.ai_service = agent.type;

      try {
        const result = await this.executeAgentTask(
          agent,
          task.type,
          task.input,
          { priority: 'high' }
        );

        task.result = result;
        task.status = result.success ? 'completed' : 'failed';
        task.completed_at = new Date();
        task.cost = result.cost || 0;

        if (result.tokensUsed) {
          task.output = { 
            ...result.output,
            _metadata: {
              tokens: result.tokensUsed,
              cost: result.cost,
              executionTime: result.executionTime,
              model: task.model,
            }
          };
        }
      } catch (error: any) {
        task.status = 'failed';
        task.result = {
          taskId: task.id,
          success: false,
          error: error.message,
        };
      }

      results.push(task);
    }

    return results;
  }

  // Build system prompt for agent
  private buildSystemPrompt(
    agent: Agent,
    taskType: AITaskType,
    taskInput: Record<string, any>
  ): string {
    let prompt = agent.system_prompt || `You are ${agent.name}, an AI assistant specialized in ${agent.skills.join(', ')}.`;

    // Add personality
    if (agent.personality) {
      prompt += `\n\nYour communication style is ${agent.personality.tone}. `;
      prompt += `You provide ${agent.personality.detail_level} responses. `;
      prompt += `Creativity level: ${Math.round(agent.personality.creativity * 100)}%.`;
    }

    // Add task-specific instructions
    prompt += `\n\nCurrent task: ${taskInput.prompt || 'Help the user with their request.'}`;

    // Add context
    if (taskInput.context) {
      prompt += `\n\nContext: ${taskInput.context}`;
    }

    return prompt;
  }

  // Select best AI service for task
  private selectBestService(
    agent: Agent,
    taskType: AITaskType,
    options?: { specificService?: keyof typeof AI_SERVICES_CONFIG; specificModel?: string }
  ): { service: keyof typeof AI_SERVICES_CONFIG; model: string } {
    // Use specific service if provided
    if (options?.specificService && AI_SERVICES_CONFIG[options.specificService]) {
      const serviceConfig = AI_SERVICES_CONFIG[options.specificService];
      const model = options.specificModel || Object.keys(serviceConfig.models)[0];
      return { service: options.specificService, model };
    }

    // Select based on task type and agent skills
    const taskServiceMap: Record<AITaskType, (keyof typeof AI_SERVICES_CONFIG)[]> = {
      text_generation: ['openai', 'anthropic', 'minimax'],
      code_generation: ['anthropic', 'openai'],
      reasoning: ['anthropic'],
      image_generation: ['openai'],
      audio_transcription: ['openai'],
      voice_synthesis: ['elevenlabs'],
      data_analysis: ['openai', 'anthropic'],
      multimodal: ['openai', 'anthropic'],
    };

    const preferredServices = taskServiceMap[taskType] || ['openai'];

    // Find first available service
    for (const serviceId of preferredServices) {
      if (aiServiceManager.getAvailableServices().find(s => s.id === serviceId)) {
        const serviceConfig = AI_SERVICES_CONFIG[serviceId];
        
        // Find best model for task
        const model = Object.entries(serviceConfig.models).find(([_, m]) =>
          m.capabilities.includes(taskType)
        )?.[0] || Object.keys(serviceConfig.models)[0];

        return { service: serviceId, model };
      }
    }

    // Fallback to first available service
    const available = aiServiceManager.getAvailableServices()[0];
    if (available) {
      const serviceConfig = AI_SERVICES_CONFIG[available.id as keyof typeof AI_SERVICES_CONFIG];
      const model = Object.keys(serviceConfig.models)[0];
      return { service: available.id as keyof typeof AI_SERVICES_CONFIG, model };
    }

    // Last resort fallback
    return { service: 'openai', model: 'gpt-4' };
  }

  // Verify task completion
  verifyTaskCompletion(task: JobTask, criteria?: {
    minLength?: number;
    maxLength?: number;
    requiredFields?: string[];
    keywords?: string[];
  }): { valid: boolean; score: number; feedback: string } {
    let score = 100;
    const feedback: string[] = [];

    if (!task.result?.success) {
      return { valid: false, score: 0, feedback: ['Task execution failed'] };
    }

    const output = task.result.output;
    if (!output) {
      return { valid: false, score: 0, feedback: ['No output generated'] };
    }

    // Check length
    const outputText = typeof output === 'string' ? output : JSON.stringify(output);
    if (criteria?.minLength && outputText.length < criteria.minLength) {
      score -= 20;
      feedback.push(`Output too short (${outputText.length} < ${criteria.minLength})`);
    }
    if (criteria?.maxLength && outputText.length > criteria.maxLength) {
      score -= 10;
      feedback.push(`Output exceeds max length`);
    }

    // Check required fields
    if (criteria?.requiredFields) {
      for (const field of criteria.requiredFields) {
        if (!output[field]) {
          score -= 15;
          feedback.push(`Missing required field: ${field}`);
        }
      }
    }

    // Check keywords
    if (criteria?.keywords) {
      const outputLower = outputText.toLowerCase();
      const foundKeywords = criteria.keywords.filter(k => outputLower.includes(k.toLowerCase()));
      const missingKeywords = criteria.keywords.length - foundKeywords.length;
      
      if (missingKeywords > 0) {
        score -= missingKeywords * 5;
        feedback.push(`Missing keywords: ${criteria.keywords.slice(0, missingKeywords).join(', ')}`);
      }
    }

    const valid = score >= 70;
    return { valid, score, feedback: feedback.length > 0 ? feedback : ['Task completed successfully'] };
  }
}

// Export singleton
export const agentEngine = new AgentExecutionEngine();

// Helper functions for common agent tasks
export async function generateWithAgent(
  agent: Agent,
  prompt: string,
  options?: {
    maxTokens?: number;
    temperature?: number;
    service?: keyof typeof AI_SERVICES_CONFIG;
  }
): Promise<AITaskResult> {
  return agentEngine.executeAgentTask(agent, 'text_generation', {
    prompt,
    maxTokens: options?.maxTokens,
    temperature: options?.temperature,
  }, { specificService: options?.service });
}

export async function generateImageWithAgent(
  agent: Agent,
  prompt: string,
  options?: {
    size?: '1024x1024' | '1024x1792' | '1792x1024';
    count?: number;
    style?: 'vivid' | 'natural';
  }
): Promise<AITaskResult> {
  return agentEngine.executeAgentTask(agent, 'image_generation', {
    prompt,
    size: options?.size || '1024x1024',
    count: options?.count || 1,
    style: options?.style || 'vivid',
  });
}

export async function analyzeDataWithAgent(
  agent: Agent,
  data: any,
  analysisType: 'summary' | 'insights' | 'predictions' | 'full',
  context?: string
): Promise<AITaskResult> {
  return agentEngine.executeAgentTask(agent, 'data_analysis', {
    data,
    analysisType,
    context,
  });
}
