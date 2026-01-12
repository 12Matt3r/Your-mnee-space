// ===========================================
// OPENROUTER AI SERVICE
// ===========================================
// OpenRouter API - Unified access to 100+ AI models
// Compatible with OpenAI API format

export const OPENROUTER_CONFIG = {
  name: 'OpenRouter AI',
  description: 'OpenRouter - Unified API for 100+ AI models from top providers',
  
  // OpenRouter API key provided by user
  apiKey: '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',
  
  // OpenRouter API endpoint
  apiBase: 'https://openrouter.ai/api/v1',
  
  // Supported models (OpenRouter hosts many models)
  models: {
    'anthropic/claude-sonnet-4-20250514': {
      type: 'chat',
      contextWindow: 200000,
      maxOutputTokens: 8192,
      capabilities: ['text', 'code', 'reasoning', 'analysis'],
      description: 'Claude 4 Sonnet - Anthropic\'s latest model',
      provider: 'Anthropic',
    },
    'anthropic/claude-haiku-4-20250514': {
      type: 'chat',
      contextWindow: 200000,
      maxOutputTokens: 8192,
      capabilities: ['text', 'code'],
      description: 'Claude 4 Haiku - Fast and efficient',
      provider: 'Anthropic',
    },
    'openai/gpt-4.5': {
      type: 'chat',
      contextWindow: 128000,
      maxOutputTokens: 16384,
      capabilities: ['text', 'code', 'reasoning', 'analysis'],
      description: 'GPT-4.5 - OpenAI\'s latest model',
      provider: 'OpenAI',
    },
    'openai/gpt-4o': {
      type: 'chat',
      contextWindow: 128000,
      maxOutputTokens: 16384,
      capabilities: ['text', 'code', 'reasoning', 'analysis', 'vision'],
      description: 'GPT-4o - Omni model with vision',
      provider: 'OpenAI',
    },
    'meta-llama/llama-3.3-70b-instruct': {
      type: 'chat',
      contextWindow: 128000,
      maxOutputTokens: 8192,
      capabilities: ['text', 'code'],
      description: 'Llama 3.3 70B Instruct - Meta\'s open model',
      provider: 'Meta',
    },
    'google/gemini-2.5-pro': {
      type: 'chat',
      contextWindow: 1048576,
      maxOutputTokens: 8192,
      capabilities: ['text', 'code', 'reasoning', 'analysis'],
      description: 'Gemini 2.5 Pro - Google\'s advanced model',
      provider: 'Google',
    },
    'deepseek/deepseek-chat': {
      type: 'chat',
      contextWindow: 128000,
      maxOutputTokens: 8192,
      capabilities: ['text', 'code', 'reasoning'],
      description: 'DeepSeek Chat - Advanced reasoning model',
      provider: 'DeepSeek',
    },
    'mistralai/mistral-small-3.1-24b': {
      type: 'chat',
      contextWindow: 128000,
      maxOutputTokens: 8192,
      capabilities: ['text', 'code'],
      description: 'Mistral Small 3.1 - Efficient model',
      provider: 'Mistral AI',
    },
  },
  
  // Provider routing options
  routingPreference: 'auto', // 'auto', 'price', 'speed', 'balanced'
};

interface OpenRouterResponse {
  success: boolean;
  output?: string;
  code?: string;
  explanation?: string;
  error?: string;
  model?: string;
  provider?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost?: string;
  };
}

class OpenRouterAIService {
  private apiKey: string;
  private baseUrl: string;
  private isConfigured: boolean;

  constructor() {
    this.apiKey = OPENROUTER_CONFIG.apiKey;
    this.baseUrl = OPENROUTER_CONFIG.apiBase;
    this.isConfigured = !!this.apiKey && this.apiKey.startsWith('sk-or-v1-');
    
    if (this.isConfigured) {
      console.log('✅ OpenRouter AI configured successfully!');
      console.log('   Access to 100+ models from top AI providers');
    } else {
      console.log('⚠️ OpenRouter AI not configured (invalid API key format)');
    }
  }

  isAvailable(): boolean {
    return this.isConfigured;
  }

  // Get available models
  getModels() {
    return Object.entries(OPENROUTER_CONFIG.models).map(([id, model]) => ({
      id,
      ...model,
    }));
  }

  // Get models by provider
  getModelsByProvider() {
    const byProvider: Record<string, typeof OPENROUTER_CONFIG.models[string][]> = {};
    
    Object.entries(OPENROUTER_CONFIG.models).forEach(([id, model]) => {
      if (!byProvider[model.provider]) {
        byProvider[model.provider] = [];
      }
      byProvider[model.provider].push({ id, ...model });
    });
    
    return byProvider;
  }

  // Generate text using OpenRouter
  async generateText(
    prompt: string,
    model: string = 'anthropic/claude-sonnet-4-20250514',
    options?: {
      maxTokens?: number;
      temperature?: number;
      systemPrompt?: string;
    }
  ): Promise<OpenRouterResponse> {
    if (!this.isConfigured) {
      return { success: false, error: 'OpenRouter API key not configured' };
    }

    try {
      const messages = [
        ...(options?.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
        { role: 'user', content: prompt },
      ];

      const response = await fetch(
        `${this.baseUrl}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'https://yournnee.space',
            'X-Title': 'YourSpace Platform',
          },
          body: JSON.stringify({
            model,
            messages,
            max_tokens: options?.maxTokens || 4096,
            temperature: options?.temperature ?? 0.7,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      const usage = data.usage;
      
      // Extract provider from model ID
      const provider = model.split('/')[0];

      return {
        success: true,
        output: text,
        model: data.model,
        provider,
        usage: usage ? {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
          cost: usage.cost || undefined,
        } : undefined,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Generate code using OpenRouter
  async generateCode(
    prompt: string,
    language?: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
      model?: string;
    }
  ): Promise<OpenRouterResponse> {
    if (!this.isConfigured) {
      return { success: false, error: 'OpenRouter API key not configured' };
    }

    const model = options?.model || 'anthropic/claude-sonnet-4-20250514';
    const systemPrompt = `You are an expert coding assistant. Write clean, efficient, well-documented ${language || 'code'}. Provide complete, working code with proper error handling.`;

    try {
      const response = await fetch(
        `${this.baseUrl}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'https://yournnee.space',
            'X-Title': 'YourSpace Platform',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Write ${language || 'code'} for: ${prompt}` },
            ],
            max_tokens: options?.maxTokens || 4096,
            temperature: options?.temperature ?? 0.1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      
      // Extract code blocks
      const codeBlockMatch = text.match(/```[\w]*\n([\s\S]*?)```/g);
      let code = '';
      
      if (codeBlockMatch) {
        code = codeBlockMatch
          .map(block => block.replace(/```[\w]*\n?/, '').replace(/```$/, ''))
          .join('\n\n');
      }

      const explanation = text.split(/```/)[0].trim();
      const provider = model.split('/')[0];

      return {
        success: true,
        code: code || text,
        explanation: explanation || 'Code generated successfully',
        model: data.model,
        provider,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Analyze code using OpenRouter
  async analyzeCode(
    code: string,
    language?: string
  ): Promise<OpenRouterResponse> {
    if (!this.isConfigured) {
      return { success: false, error: 'OpenRouter API key not configured' };
    }

    const prompt = `Analyze this ${language || 'code'}:\n\n\`\`\`\n${code}\n\`\`\`\n\nProvide: 1. Overview, 2. Key components, 3. Potential improvements, 4. Complexity assessment, 5. Security considerations.`;

    try {
      const response = await fetch(
        `${this.baseUrl}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'https://yournnee.space',
            'X-Title': 'YourSpace Platform',
          },
          body: JSON.stringify({
            model: 'anthropic/claude-sonnet-4-20250514',
            messages: [
              { role: 'system', content: 'You are an expert code analyst.' },
              { role: 'user', content: prompt },
            ],
            max_tokens: 4096,
            temperature: 0.3,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      const provider = 'anthropic';

      return {
        success: true,
        output: text,
        model: data.model,
        provider,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Creative writing using OpenRouter
  async creativeWriting(
    prompt: string,
    style?: string
  ): Promise<OpenRouterResponse> {
    if (!this.isConfigured) {
      return { success: false, error: 'OpenRouter API key not configured' };
    }

    const systemPrompt = style 
      ? `You are a creative writer. Write in the style of: ${style}. Be imaginative, engaging, and produce high-quality content.`
      : 'You are a creative writing assistant. Write imaginative, engaging content.';

    try {
      const response = await fetch(
        `${this.baseUrl}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': 'https://yournnee.space',
            'X-Title': 'YourSpace Platform',
          },
          body: JSON.stringify({
            model: 'anthropic/claude-sonnet-4-20250514',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
            ],
            max_tokens: 4096,
            temperature: 0.8,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';

      return {
        success: true,
        output: text,
        model: data.model,
        provider: 'anthropic',
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

// Export service
export const openRouterAI = new OpenRouterAIService();

// ===========================================
// CONVENIENCE FUNCTIONS
// ===========================================

export async function generateWithOpenRouter(
  prompt: string,
  model?: string
): Promise<OpenRouterResponse> {
  return openRouterAI.generateText(prompt, model);
}

export async function generateCodeWithOpenRouter(
  prompt: string,
  language?: string,
  model?: string
): Promise<OpenRouterResponse> {
  return openRouterAI.generateCode(prompt, language, { model });
}

export async function analyzeCodeWithOpenRouter(
  code: string,
  language?: string
): Promise<OpenRouterResponse> {
  return openRouterAI.analyzeCode(code, language);
}

export async function creativeWritingWithOpenRouter(
  prompt: string,
  style?: string
): Promise<OpenRouterResponse> {
  return openRouterAI.creativeWriting(prompt, style);
}
