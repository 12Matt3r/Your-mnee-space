// ===========================================
// GROQ AI SERVICE
// ===========================================
// Groq API integration for fast text generation and coding
// Known for the fastest inference speeds for Llama models

export const GROQ_CONFIG = {
  name: 'Groq AI',
  description: 'Groq - Ultra-fast AI inference with Llama and other models',
  
  // Groq API key from environment
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  
  // Groq API endpoint
  apiBase: 'https://api.groq.com/openai/v1',
  
  // Supported models (Groq hosts many open-source models)
  models: {
    'llama-3.3-70b-versatile': {
      type: 'chat',
      contextWindow: 128000,
      maxOutputTokens: 8192,
      capabilities: ['text', 'code', 'reasoning', 'analysis'],
      description: 'Llama 3.3 70B - Versatile high-performance model',
    },
    'llama-3.1-8b-instant': {
      type: 'chat',
      contextWindow: 128000,
      maxOutputTokens: 8192,
      capabilities: ['text', 'code'],
      description: 'Llama 3.1 8B - Fast and efficient',
    },
    'llama-3.3-70b-specdec': {
      type: 'chat',
      contextWindow: 128000,
      maxOutputTokens: 8192,
      capabilities: ['text', 'reasoning'],
      description: 'Llama 3.3 70B Speculative Decoding',
    },
    'mixtral-8x7b-32768': {
      type: 'chat',
      contextWindow: 32768,
      maxOutputTokens: 8192,
      capabilities: ['text', 'code', 'analysis'],
      description: 'Mixtral 8x7B - Expert mixture model',
    },
    'gemma2-9b-it': {
      type: 'chat',
      contextWindow: 8192,
      maxOutputTokens: 8192,
      capabilities: ['text', 'reasoning'],
      description: 'Gemma 2 9B - Google\'s efficient model',
    },
  },
};

interface GroqResponse {
  success: boolean;
  output?: string;
  code?: string;
  explanation?: string;
  error?: string;
  model?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class GroqAIService {
  private apiKey: string;
  private baseUrl: string;
  private isConfigured: boolean;

  constructor() {
    this.apiKey = GROQ_CONFIG.apiKey;
    this.baseUrl = GROQ_CONFIG.apiBase;
    this.isConfigured = !!this.apiKey && this.apiKey.startsWith('gsk_');
    
    if (this.isConfigured) {
      console.log('✅ Groq AI configured successfully!');
      console.log('   Known for: Ultra-fast inference with open-source models');
    } else {
      console.log('⚠️ Groq AI not configured (invalid API key format)');
    }
  }

  isAvailable(): boolean {
    return this.isConfigured;
  }

  // Get available models
  getModels() {
    return Object.entries(GROQ_CONFIG.models).map(([id, model]) => ({
      id,
      ...model,
    }));
  }

  // Generate text using Groq
  async generateText(
    prompt: string,
    model: string = 'llama-3.3-70b-versatile',
    options?: {
      maxTokens?: number;
      temperature?: number;
      systemPrompt?: string;
    }
  ): Promise<GroqResponse> {
    if (!this.isConfigured) {
      return { success: false, error: 'Groq API key not configured' };
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
        throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      const usage = data.usage;

      return {
        success: true,
        output: text,
        model: data.model,
        usage: usage ? {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
        } : undefined,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Generate code using Groq
  async generateCode(
    prompt: string,
    language?: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<GroqResponse> {
    if (!this.isConfigured) {
      return { success: false, error: 'Groq API key not configured' };
    }

    const systemPrompt = `You are an expert coding assistant. Write clean, efficient, well-documented ${language || 'code'}. Provide complete, working code with proper error handling.`;

    try {
      const response = await fetch(
        `${this.baseUrl}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
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
        throw new Error(`Groq API error: ${response.status}`);
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

      return {
        success: true,
        code: code || text,
        explanation: explanation || 'Code generated successfully',
        model: data.model,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Debug code using Groq
  async debugCode(
    code: string,
    errorMessage?: string,
    language?: string
  ): Promise<GroqResponse> {
    if (!this.isConfigured) {
      return { success: false, error: 'Groq API key not configured' };
    }

    const prompt = `Debug this ${language || 'code'}:\n\n\`\`\`\n${code}\n\`\`\`\n\n${errorMessage ? `Error: ${errorMessage}` : 'Find and fix any bugs'}`;

    try {
      const response = await fetch(
        `${this.baseUrl}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: 'You are an expert debugging assistant. Find bugs and provide fixes with explanations.' },
              { role: 'user', content: prompt },
            ],
            max_tokens: 4096,
            temperature: 0.1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';

      // Extract fixed code
      const codeBlockMatch = text.match(/```[\w]*\n([\s\S]*?)```/g);
      let fixedCode = '';
      
      if (codeBlockMatch) {
        fixedCode = codeBlockMatch
          .map(block => block.replace(/```[\w]*\n?/, '').replace(/```$/, ''))
          .join('\n\n');
      }

      return {
        success: true,
        code: fixedCode,
        output: text,
        model: data.model,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Explain code using Groq
  async explainCode(
    code: string,
    language?: string
  ): Promise<GroqResponse> {
    if (!this.isConfigured) {
      return { success: false, error: 'Groq API key not configured' };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: `You are an expert code analyst. Explain this ${language || 'code'} clearly.` },
              { role: 'user', content: `Explain this code:\n\n\`\`\`\n${code}\n\`\`\`` },
            ],
            max_tokens: 4096,
            temperature: 0.3,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';

      return {
        success: true,
        output: text,
        model: data.model,
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

// Export service
export const groqAI = new GroqAIService();

// ===========================================
// CONVENIENCE FUNCTIONS
// ===========================================

export async function generateWithGroq(
  prompt: string,
  model?: string
): Promise<GroqResponse> {
  return groqAI.generateText(prompt, model);
}

export async function generateCodeWithGroq(
  prompt: string,
  language?: string
): Promise<GroqResponse> {
  return groqAI.generateCode(prompt, language);
}

export async function debugCodeWithGroq(
  code: string,
  error?: string,
  language?: string
): Promise<GroqResponse> {
  return groqAI.debugCode(code, error, language);
}

export async function explainCodeWithGroq(
  code: string,
  language?: string
): Promise<GroqResponse> {
  return groqAI.explainCode(code, language);
}
