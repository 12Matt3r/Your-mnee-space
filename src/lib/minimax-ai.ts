// ===========================================
// MINIMAX AI SERVICE
// ===========================================
// MiniMax API integration for text generation and more

export const MINIMAX_CONFIG = {
  name: 'MiniMax AI',
  description: 'MiniMax AI - Advanced language model for text generation and coding assistance',
  
  // MiniMax API key provided by user
  apiKey: 'sk-api-B2mot6xzokpd9IVXOh1cWI2fCY_7V2LzWAO0VQgJVmxcyciBxRk_qc7V8H_h9T3LNnbPWUIZM6W_Jm87vczq6iYgBGNYxlYipUTYGIBJZWaTai7MVRi_138',
  
  // MiniMax API endpoint
  apiBase: 'https://api.minimax.chat/v1/text',
  
  // Supported models
  models: {
    'abab6.5s-chat': {
      type: 'chat',
      contextWindow: 25000,
      maxOutputTokens: 8000,
      capabilities: ['text', 'code', 'reasoning'],
      description: 'MiniMax Chat - Fast and efficient chat model',
    },
    'abab6.5-chat': {
      type: 'chat',
      contextWindow: 25000,
      maxOutputTokens: 8000,
      capabilities: ['text', 'code', 'reasoning', 'analysis'],
      description: 'MiniMax Chat - Higher quality responses',
    },
  },
};

interface MiniMaxResponse {
  success: boolean;
  output?: string;
  code?: string;
  explanation?: string;
  error?: string;
}

class MiniMaxAIService {
  private apiKey: string;
  private baseUrl: string;
  private isConfigured: boolean;

  constructor() {
    this.apiKey = MINIMAX_CONFIG.apiKey;
    this.baseUrl = MINIMAX_CONFIG.apiBase;
    this.isConfigured = !!this.apiKey && this.apiKey.startsWith('sk-api-');
    
    if (this.isConfigured) {
      console.log('✅ MiniMax AI configured successfully!');
    } else {
      console.log('⚠️ MiniMax AI not configured (invalid API key format)');
    }
  }

  isAvailable(): boolean {
    return this.isConfigured;
  }

  // Generate text using MiniMax
  async generateText(
    prompt: string,
    model: string = 'abab6.5s-chat',
    options?: {
      maxTokens?: number;
      temperature?: number;
      systemPrompt?: string;
    }
  ): Promise<MiniMaxResponse> {
    if (!this.isConfigured) {
      return { success: false, error: 'MiniMax API key not configured' };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/${model}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              ...(options?.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : []),
              { role: 'user', content: prompt },
            ],
            tokens_to_generate: options?.maxTokens || 2000,
            temperature: options?.temperature || 0.7,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.base_resp?.rt_err_msg || `MiniMax API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || '';
      
      return {
        success: true,
        output: text,
        explanation: 'Generated with MiniMax AI',
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Generate code using MiniMax
  async generateCode(
    prompt: string,
    language?: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<MiniMaxResponse> {
    if (!this.isConfigured) {
      return { success: false, error: 'MiniMax API key not configured' };
    }

    const systemPrompt = `You are an expert coding assistant. Write clean, efficient, well-documented ${language || 'code'}. Provide complete code with proper error handling.`;

    try {
      const response = await fetch(
        `${this.baseUrl}/abab6.5s-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: 'abab6.5s-chat',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Write ${language || 'code'} for: ${prompt}` },
            ],
            tokens_to_generate: options?.maxTokens || 4000,
            temperature: options?.temperature || 0.1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`MiniMax API error: ${response.status}`);
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
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Analyze code
  async analyzeCode(
    code: string,
    language?: string
  ): Promise<MiniMaxResponse> {
    if (!this.isConfigured) {
      return { success: false, error: 'MiniMax API key not configured' };
    }

    const prompt = `Analyze this ${language || 'code'}:\n\n\`\`\`\n${code}\n\`\`\`\n\nProvide: 1. Overview, 2. Key components, 3. Potential improvements, 4. Complexity assessment.`;

    try {
      const response = await fetch(
        `${this.baseUrl}/abab6.5-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: 'abab6.5-chat',
            messages: [
              { role: 'system', content: 'You are an expert code analyst.' },
              { role: 'user', content: prompt },
            ],
            tokens_to_generate: 3000,
            temperature: 0.3,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`MiniMax API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';

      return {
        success: true,
        output: text,
        explanation: 'Analysis completed with MiniMax AI',
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

// Export service
export const minimaxAI = new MiniMaxAIService();

// ===========================================
// CONVENIENCE FUNCTIONS
// ===========================================

export async function generateWithMiniMax(
  prompt: string,
  model?: string
): Promise<MiniMaxResponse> {
  return minimaxAI.generateText(prompt, model);
}

export async function generateCodeWithMiniMax(
  prompt: string,
  language?: string
): Promise<MiniMaxResponse> {
  return minimaxAI.generateCode(prompt, language);
}

export async function analyzeCodeWithMiniMax(
  code: string,
  language?: string
): Promise<MiniMaxResponse> {
  return minimaxAI.analyzeCode(code, language);
}
