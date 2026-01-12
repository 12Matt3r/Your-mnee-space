import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// ===========================================
// POLLINATIONS.AI - FREE AI SERVICE (Primary)
// No API key required - works out of the box!
// ===========================================
export const POLLINATIONS_CONFIG = {
  name: 'Pollinations.ai',
  baseUrl: 'https://pollinations.ai',
  textUrl: 'https://text.pollinations.ai',
  imageUrl: 'https://image.pollinations.ai',
  visionUrl: 'https://vision.pollinations.ai',
  
  // Text models (free!)
  textModels: {
    'openai': { cost: 0, context: 128000, description: 'GPT-4 style responses' },
    'deepseek': { cost: 0, context: 128000, description: 'DeepSeek reasoning model' },
    'qwen': { cost: 0, context: 128000, description: 'Qwen multilingual model' },
    'mistral': { cost: 0, context: 128000, description: 'Mistral fast model' },
    'llama': { cost: 0, context: 128000, description: 'Meta Llama model' },
  },
  
  // Image models (free!)
  imageModels: {
    'flux': { cost: 0, description: 'High quality realistic images' },
    'realism': { cost: 0, description: 'Photorealistic images' },
    'anime': { cost: 0, description: 'Anime style images' },
    'pixel': { cost: 0, description: 'Pixel art style' },
    'disney': { cost: 0, description: 'Disney/Pixar style' },
    'ghibli': { cost: 0, description: 'Studio Ghibli style' },
    'portrait': { cost: 0, description: 'Portrait photography style' },
    'landscape': { cost: 0, description: 'Landscape photography style' },
    'cyberpunk': { cost: 0, description: 'Cyberpunk/sci-fi style' },
    'fantasy': { cost: 0, description: 'Fantasy art style' },
    'abstract': { cost: 0, description: 'Abstract art style' },
    'minimalist': { cost: 0, description: 'Minimalist design style' },
  },
  
  // Vision/image analysis (free!)
  visionModels: {
    'general': { cost: 0, description: 'General image analysis' },
    'ocr': { cost: 0, description: 'Text extraction from images' },
    'objects': { cost: 0, description: 'Object detection' },
    'scene': { cost: 0, description: 'Scene understanding' },
  },
};

// Pollinations AI Service Implementation
class PollinationsAIService {
  name = 'Pollinations.ai';
  private defaultTextModel = 'openai';
  private defaultImageModel = 'flux';
  private defaultVisionModel = 'general';

  isAvailable(): boolean {
    return true; // Always available - no API key needed!
  }

  async executeTextTask(
    prompt: string,
    model: string = this.defaultTextModel,
    options?: {
      jsonMode?: boolean;
      systemPrompt?: string;
      seed?: number;
      markdown?: boolean;
    }
  ): Promise<{ success: boolean; output?: string; error?: string; model?: string }> {
    const startTime = Date.now();
    
    try {
      // Build URL with parameters
      const params = new URLSearchParams();
      params.set('prompt', prompt);
      params.set('model', model);
      
      if (options?.jsonMode) params.set('json', 'true');
      if (options?.systemPrompt) params.set('system', options.systemPrompt);
      if (options?.seed) params.set('seed', options.seed.toString());
      if (options?.markdown !== false) params.set('markdown', 'true');
      
      const url = `${POLLINATIONS_CONFIG.textUrl}/${encodeURIComponent(prompt)}?model=${model}&markdown=true`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain, text/html',
        },
      });

      if (!response.ok) {
        throw new Error(`Pollinations API error: ${response.status}`);
      }

      const text = await response.text();
      
      return {
        success: true,
        output: text,
        model,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        model,
      };
    }
  }

  async executeImageTask(
    prompt: string,
    model: string = this.defaultImageModel,
    options?: {
      width?: number;
      height?: number;
      seed?: number;
      nologo?: boolean;
      private?: boolean;
      enhance?: boolean;
    }
  ): Promise<{ success: boolean; output?: { url: string; imageUrl: string }; error?: string; model?: string }> {
    try {
      // Build image URL
      // Format: https://image.pollinations.ai/prompt/{prompt}?model={model}&width={w}&height={h}&seed={s}
      
      const encodedPrompt = encodeURIComponent(prompt);
      const imageModel = POLLINATIONS_CONFIG.imageModels[model as keyof typeof POLLINATIONS_CONFIG.imageModels] 
        ? model 
        : this.defaultImageModel;
      
      let url = `${POLLINATIONS_CONFIG.imageUrl}/${encodedPrompt}?model=${imageModel}`;
      
      if (options?.width) url += `&width=${options.width}`;
      if (options?.height) url += `&height=${options.height}`;
      if (options?.seed) url += `&seed=${options.seed}`;
      if (options?.nologo !== false) url += `&nologo=true`;
      if (options?.private) url += `&private=true`;
      if (options?.enhance) url += `&enhance=true`;
      
      return {
        success: true,
        output: {
          url,
          imageUrl: url,
        },
        model: imageModel,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        model,
      };
    }
  }

  async executeVisionTask(
    imageUrl: string,
    prompt: string,
    model: string = this.defaultVisionModel
  ): Promise<{ success: boolean; output?: string; error?: string; model?: string }> {
    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const encodedImage = encodeURIComponent(imageUrl);
      
      const url = `${POLLINATIONS_CONFIG.visionUrl}/${encodedImage}?prompt=${encodedPrompt}&model=${model}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Vision API error: ${response.status}`);
      }

      const text = await response.text();
      
      return {
        success: true,
        output: text,
        model,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        model,
      };
    }
  }

  getAvailableModels(type: 'text' | 'image' | 'vision') {
    switch (type) {
      case 'text':
        return Object.entries(POLLINATIONS_CONFIG.textModels).map(([id, data]) => ({
          id,
          ...data,
        }));
      case 'image':
        return Object.entries(POLLINATIONS_CONFIG.imageModels).map(([id, data]) => ({
          id,
          ...data,
        }));
      case 'vision':
        return Object.entries(POLLINATIONS_CONFIG.visionModels).map(([id, data]) => ({
          id,
          ...data,
        }));
      default:
        return [];
    }
  }
}

// Export Pollinations service
export const pollinationsAI = new PollinationsAIService();

// AI Services Configuration
export const AI_SERVICES_CONFIG = {
  // Pollinations.ai - Free primary service (already exported as pollinationsAI)
  pollinations: {
    name: 'Pollinations.ai',
    models: {
      // Text models
      'openai-style': { cost: 0, contextWindow: 128000, capabilities: ['text', 'code', 'analysis'] },
      'deepseek': { cost: 0, contextWindow: 128000, capabilities: ['text', 'code', 'reasoning'] },
      'qwen': { cost: 0, contextWindow: 128000, capabilities: ['text', 'multilingual'] },
      'mistral': { cost: 0, contextWindow: 128000, capabilities: ['text', 'fast'] },
      'llama': { cost: 0, contextWindow: 128000, capabilities: ['text', 'code'] },
      // Image models
      'flux': { cost: 0, capabilities: ['image'] },
      'realism': { cost: 0, capabilities: ['image'] },
      'anime': { cost: 0, capabilities: ['image'] },
      'pixel': { cost: 0, capabilities: ['image'] },
      'disney': { cost: 0, capabilities: ['image'] },
      'ghibli': { cost: 0, capabilities: ['image'] },
      'cyberpunk': { cost: 0, capabilities: ['image'] },
      'fantasy': { cost: 0, capabilities: ['image'] },
    },
    apiKey: undefined, // No API key needed!
  },
  
  openai: {
    name: 'OpenAI',
    models: {
      'gpt-4': { costPerToken: 0.00006, contextWindow: 128000, capabilities: ['text', 'code', 'analysis'] },
      'gpt-4-turbo': { costPerToken: 0.00001, contextWindow: 128000, capabilities: ['text', 'code', 'analysis', 'vision'] },
      'gpt-3.5-turbo': { costPerToken: 0.0000005, contextWindow: 16000, capabilities: ['text', 'code'] },
      'dall-e-3': { costPerImage: 0.04, capabilities: ['image'] },
      'whisper': { costPerMinute: 0.006, capabilities: ['audio'] },
    },
    apiKey: process.env.OPENAI_API_KEY,
  },
  anthropic: {
    name: 'Anthropic',
    models: {
      'claude-sonnet-4-20250514': { costPerToken: 0.000003, contextWindow: 200000, capabilities: ['text', 'code', 'analysis', 'reasoning'] },
      'claude-sonnet-4': { costPerToken: 0.000003, contextWindow: 200000, capabilities: ['text', 'code', 'analysis', 'reasoning'] },
      'claude-3-5-sonnet': { costPerToken: 0.000003, contextWindow: 200000, capabilities: ['text', 'code', 'analysis'] },
      'claude-3-haiku': { costPerToken: 0.00000025, contextWindow: 200000, capabilities: ['text', 'fast'] },
    },
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
  google: {
    name: 'Google',
    models: {
      'gemini-pro': { costPerToken: 0.000000125, contextWindow: 2000000, capabilities: ['text', 'code', 'analysis', 'multimodal'] },
      'gemini-ultra': { costPerToken: 0.000001, contextWindow: 2000000, capabilities: ['text', 'code', 'analysis', 'reasoning'] },
    },
    apiKey: process.env.GOOGLE_API_KEY,
  },
  replicate: {
    name: 'Replicate',
    models: {
      'midjourney': { costPerImage: 0.027, capabilities: ['image'] },
      'stable-diffusion': { costPerImage: 0.002, capabilities: ['image'] },
      'music-gen': { costPerSecond: 0.0003, capabilities: ['audio'] },
    },
    apiKey: process.env.REPLICATE_API_KEY,
  },
  elevenlabs: {
    name: 'ElevenLabs',
    models: {
      'multilingual-v2': { costPerCharacter: 0.00003, capabilities: ['voice', 'audio'] },
      'english-v1': { costPerCharacter: 0.00001, capabilities: ['voice'] },
    },
    apiKey: process.env.ELEVENLABS_API_KEY,
  },
  minimax: {
    name: 'MiniMax',
    models: {
      'abab6.5s-chat': { costPerToken: 0.000002, contextWindow: 128000, capabilities: ['text', 'code', 'analysis'] },
      'abab6.5-chat': { costPerToken: 0.000002, contextWindow: 128000, capabilities: ['text', 'code', 'analysis'] },
      'abab5.5-chat': { costPerToken: 0.000001, contextWindow: 16000, capabilities: ['text', 'fast'] },
    },
    apiKey: process.env.MINIMAX_API_KEY,
  }
};

// AI Task Types
export type AITaskType = 
  | 'text_generation'
  | 'code_generation'
  | 'image_generation'
  | 'audio_transcription'
  | 'voice_synthesis'
  | 'data_analysis'
  | 'reasoning'
  | 'multimodal';

export interface AITask {
  id: string;
  service: keyof typeof AI_SERVICES_CONFIG;
  model: string;
  taskType: AITaskType;
  input: Record<string, any>;
  userId: string;
  jobId?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: Date;
}

export interface AITaskResult {
  taskId: string;
  success: boolean;
  output?: any;
  error?: string;
  tokensUsed?: number;
  cost?: number;
  executionTime?: number;
}

// AI Service Interface
export interface AIService {
  name: string;
  execute(task: AITask): Promise<AITaskResult>;
  estimateCost(task: AITask): number;
  isAvailable(): boolean;
}

// OpenAI Service Implementation
class OpenAIService implements AIService {
  name = 'OpenAI';
  private client: OpenAI | null = null;

  constructor() {
    if (AI_SERVICES_CONFIG.openai.apiKey) {
      this.client = new OpenAI({
        apiKey: AI_SERVICES_CONFIG.openai.apiKey,
      });
    }
  }

  isAvailable(): boolean {
    return !!this.client;
  }

  async execute(task: AITask): Promise<AITaskResult> {
    if (!this.client) {
      throw new Error('OpenAI API key not configured');
    }

    const startTime = Date.now();
    try {
      let output: any;
      let tokensUsed = 0;

      const model = AI_SERVICES_CONFIG.openai.models[task.model as keyof typeof AI_SERVICES_CONFIG.openai.models];
      if (!model) {
        throw new Error(`Unknown model: ${task.model}`);
      }

      switch (task.taskType) {
        case 'text_generation':
        case 'code_generation':
        case 'reasoning': {
          const completion = await this.client.chat.completions.create({
            model: task.model,
            messages: task.input.messages || [{ role: 'user', content: task.input.prompt }],
            max_tokens: task.input.maxTokens || 4000,
            temperature: task.input.temperature || 0.7,
            ...task.input.options,
          });
          output = completion.choices[0]?.message?.content;
          tokensUsed = completion.usage?.total_tokens || 0;
          break;
        }

        case 'image_generation': {
          const image = await this.client.images.generate({
            model: task.model,
            prompt: task.input.prompt,
            n: task.input.count || 1,
            size: task.input.size || '1024x1024',
            quality: task.input.quality || 'standard',
          });
          output = {
            images: image.data.map(img => img.url || img.b64_json),
            revised_prompt: image.data[0]?.revised_prompt,
          };
          break;
        }

        case 'audio_transcription': {
          const transcription = await this.client.audio.transcriptions.create({
            model: 'whisper-1',
            file: task.input.audioFile,
            language: task.input.language,
            response_format: task.input.format || 'json',
          });
          output = { text: transcription.text };
          break;
        }

        default:
          throw new Error(`Unsupported task type: ${task.taskType}`);
      }

      const executionTime = Date.now() - startTime;
      const cost = this.estimateCost({ ...task, output });

      return {
        taskId: task.id,
        success: true,
        output,
        tokensUsed,
        cost,
        executionTime,
      };
    } catch (error: any) {
      return {
        taskId: task.id,
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime,
      };
    }
  }

  estimateCost(task: AITask): number {
    const model = AI_SERVICES_CONFIG.openai.models[task.model as keyof typeof AI_SERVICES_CONFIG.openai.models];
    if (!model) return 0;

    switch (task.taskType) {
      case 'text_generation':
      case 'code_generation':
      case 'reasoning':
        return (task.input.maxTokens || 4000) * model.costPerToken;
      case 'image_generation':
        return (task.input.count || 1) * (model as any).costPerImage;
      case 'audio_transcription':
        return (task.input.duration || 60) * (model as any).costPerMinute;
      default:
        return 0;
    }
  }
}

// Anthropic Service Implementation
class AnthropicService implements AIService {
  name = 'Anthropic';
  private client: Anthropic | null = null;

  constructor() {
    if (AI_SERVICES_CONFIG.anthropic.apiKey) {
      this.client = new Anthropic({
        apiKey: AI_SERVICES_CONFIG.anthropic.apiKey,
      });
    }
  }

  isAvailable(): boolean {
    return !!this.client;
  }

  async execute(task: AITask): Promise<AITaskResult> {
    if (!this.client) {
      throw new Error('Anthropic API key not configured');
    }

    const startTime = Date.now();
    try {
      let output: any;
      let tokensUsed = 0;

      const model = AI_SERVICES_CONFIG.anthropic.models[task.model as keyof typeof AI_SERVICES_CONFIG.anthropic.models];
      if (!model) {
        throw new Error(`Unknown model: ${task.model}`);
      }

      const completion = await this.client.messages.create({
        model: task.model,
        max_tokens: task.input.maxTokens || 4000,
        messages: task.input.messages || [{ role: 'user', content: task.input.prompt }],
        ...task.input.options,
      });

      output = completion.content[0]?.type === 'text' ? completion.content[0].text : completion.content;
      tokensUsed = completion.usage?.input_tokens + completion.usage?.output_tokens || 0;

      const executionTime = Date.now() - startTime;
      const cost = this.estimateCost({ ...task, output });

      return {
        taskId: task.id,
        success: true,
        output,
        tokensUsed,
        cost,
        executionTime,
      };
    } catch (error: any) {
      return {
        taskId: task.id,
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime,
      };
    }
  }

  estimateCost(task: AITask): number {
    const model = AI_SERVICES_CONFIG.anthropic.models[task.model as keyof typeof AI_SERVICES_CONFIG.anthropic.models];
    if (!model) return 0;
    return (task.input.maxTokens || 4000) * model.costPerToken;
  }
}

// ElevenLabs Voice Service
class ElevenLabsService implements AIService {
  name = 'ElevenLabs';
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = AI_SERVICES_CONFIG.elevenlabs.apiKey;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async execute(task: AITask): Promise<AITaskResult> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    const startTime = Date.now();
    
    try {
      let output: any;

      if (task.taskType === 'voice_synthesis') {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${task.input.voiceId || '21m00Tcm4TlvDq8ikWAM'}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': this.apiKey,
            },
            body: JSON.stringify({
              text: task.input.text,
              model_id: task.input.modelId || 'eleven_multilingual_v2',
              voice_settings: {
                stability: task.input.stability || 0.5,
                similarity_boost: task.input.similarityBoost || 0.75,
                style: task.input.style || 0,
                use_speaker_boost: true,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`ElevenLabs API error: ${response.statusText}`);
        }

        const audioBuffer = await response.arrayBuffer();
        output = {
          audio: Buffer.from(audioBuffer).toString('base64'),
          format: 'audio/mpeg',
        };
      } else {
        throw new Error(`Unsupported task type: ${task.taskType}`);
      }

      const executionTime = Date.now() - startTime;
      const cost = this.estimateCost({ ...task, output });

      return {
        taskId: task.id,
        success: true,
        output,
        cost,
        executionTime,
      };
    } catch (error: any) {
      return {
        taskId: task.id,
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime,
      };
    }
  }

  estimateCost(task: AITask): number {
    const model = AI_SERVICES_CONFIG.elevenlabs.models[
      task.input.modelId === 'eleven_multilingual_v2' ? 'multilingual-v2' : 'english-v1'
    ];
    if (!model) return 0;
    return (task.input.text?.length || 100) * model.costPerCharacter;
  }
}

// ===========================================
// POLLINATIONS.AI SERVICE WRAPPER
// ===========================================
class PollinationsService implements AIService {
  name = 'Pollinations.ai';
  private pollinations = pollinationsAI;

  isAvailable(): boolean {
    return true; // Always available - no API key needed!
  }

  async execute(task: AITask): Promise<AITaskResult> {
    const startTime = Date.now();
    
    try {
      let output: any;
      
      switch (task.taskType) {
        case 'text_generation':
        case 'code_generation':
        case 'reasoning': {
          const result = await this.pollinations.executeTextTask(
            task.input.prompt || task.input.messages?.[0]?.content || '',
            task.model,
            {
              jsonMode: task.input.jsonMode,
              systemPrompt: task.input.systemPrompt,
              seed: task.input.seed,
              markdown: task.input.markdown,
            }
          );
          
          if (!result.success) {
            throw new Error(result.error);
          }
          
          output = result.output;
          break;
        }
        
        case 'image_generation': {
          const result = await this.pollinations.executeImageTask(
            task.input.prompt,
            task.model,
            {
              width: task.input.width || 1024,
              height: task.input.height || 1024,
              seed: task.input.seed,
              nologo: task.input.nologo !== false,
              private: task.input.private,
              enhance: task.input.enhance,
            }
          );
          
          if (!result.success) {
            throw new Error(result.error);
          }
          
          output = result.output;
          break;
        }
        
        case 'data_analysis':
        case 'multimodal': {
          // Use text generation for these tasks
          const result = await this.pollinations.executeTextTask(
            `Analyze this data: ${JSON.stringify(task.input.data || task.input)}\n\nProvide a comprehensive analysis.`,
            task.model || 'deepseek',
            { markdown: true }
          );
          
          if (!result.success) {
            throw new Error(result.error);
          }
          
          output = { analysis: result.output };
          break;
        }
        
        default:
          throw new Error(`Unsupported task type for Pollinations: ${task.taskType}`);
      }

      const executionTime = Date.now() - startTime;
      const cost = this.estimateCost({ ...task, output });

      return {
        taskId: task.id,
        success: true,
        output,
        cost,
        executionTime,
      };
    } catch (error: any) {
      return {
        taskId: task.id,
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime,
      };
    }
  }

  estimateCost(task: AITask): number {
    // Pollinations is FREE!
    return 0;
  }
}

// AI Service Manager
class AIServiceManager {
  private services: Map<string, AIService> = new Map();
  private taskQueue: AITask[] = [];
  private processing: boolean = false;

  constructor() {
    // Initialize Pollinations FIRST (always available, free!)
    const pollinations = new PollinationsService();
    if (pollinations.isAvailable()) {
      this.services.set('pollinations', pollinations);
      console.log('✓ Pollinations.ai initialized (FREE - No API key needed!)');
    }

    // Initialize other services if API keys are available
    const openai = new OpenAIService();
    if (openai.isAvailable()) {
      this.services.set('openai', openai);
    }

    const anthropic = new AnthropicService();
    if (anthropic.isAvailable()) {
      this.services.set('anthropic', anthropic);
    }

    const elevenlabs = new ElevenLabsService();
    if (elevenlabs.isAvailable()) {
      this.services.set('elevenlabs', elevenlabs);
    }

    // Start processing queue
    this.processQueue();
  }

  getAvailableServices(): { id: string; name: string; capabilities: string[] }[] {
    return Array.from(this.services.entries()).map(([id, service]) => ({
      id,
      name: service.name,
      capabilities: AI_SERVICES_CONFIG[id as keyof typeof AI_SERVICES_CONFIG]?.models 
        ? Object.values(AI_SERVICES_CONFIG[id as keyof typeof AI_SERVICES_CONFIG].models)
            .flatMap((m: any) => m.capabilities || [])
        : [],
    }));
  }

  async executeTask(task: AITask): Promise<AITaskResult> {
    const service = this.services.get(task.service);
    if (!service) {
      // Fallback to first available service
      const fallback = this.services.values().next().value;
      if (!fallback) {
        throw new Error('No AI services available');
      }
      task.service = Array.from(this.services.keys())[0] as keyof typeof AI_SERVICES_CONFIG;
    }

    return service!.execute(task);
  }

  async executeTaskWithFallback(task: AITask): Promise<AITaskResult> {
    const primaryService = this.services.get(task.service);
    
    if (primaryService?.isAvailable()) {
      return this.executeTask(task);
    }

    // Try fallback services
    for (const [id, service] of this.services) {
      if (service.isAvailable()) {
        task.service = id as keyof typeof AI_SERVICES_CONFIG;
        return this.executeTask(task);
      }
    }

    throw new Error('No AI services available with API keys configured');
  }

  addToQueue(task: AITask): void {
    // Priority ordering
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    const priority = task.priority || 'normal';
    
    const insertIndex = this.taskQueue.findIndex(t => {
      const tPriority = t.priority || 'normal';
      return priorityOrder[tPriority] > priorityOrder[priority];
    });

    if (insertIndex === -1) {
      this.taskQueue.push(task);
    } else {
      this.taskQueue.splice(insertIndex, 0, task);
    }

    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.taskQueue.length === 0) return;
    
    this.processing = true;
    
    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift()!;
      await this.executeTask(task);
    }
    
    this.processing = false;
  }
}

// Export singleton instance
export const aiServiceManager = new AIServiceManager();
export const pollinationsService = new PollinationsService();
export const openAIService = new OpenAIService();
export const anthropicService = new AnthropicService();
export const elevenLabsService = new ElevenLabsService();

// Export Pollinations AI helper
export { pollinationsAI } from './ai-services';
