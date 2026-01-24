// ===========================================
// GOOGLE JULES AI - CODING SPECIALIST
// ===========================================

export const JULES_CONFIG = {
  name: 'Google Jules',
  // Jules API endpoint (using Google's AI studio/API structure)
  apiBase: 'https://generativelanguage.googleapis.com/v1beta',
  // The API key you provided
  apiKey: import.meta.env.VITE_JULES_AI_API_KEY || '',
  
  // Jules is specialized for:
  // - Code generation and completion
  // - Bug fixing and debugging
  // - Code refactoring
  // - Algorithm design
  // - Documentation
  // - Multi-file projects
  
  models: {
    'jules-code': {
      type: 'coding',
      cost: 0, // Free with API key
      contextWindow: 1000000, // 1M tokens!
      capabilities: [
        'code_generation',
        'code_completion',
        'bug_fixing',
        'refactoring',
        'documentation',
        'algorithm_design',
        'code_review',
        'debugging',
      ],
      description: 'Google Jules - AI coding specialist',
    },
  },
};

// Jules AI Service
class JulesAIService {
  name = 'Google Jules';
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = JULES_CONFIG.apiKey;
    this.baseUrl = JULES_CONFIG.apiBase;
  }

  isAvailable(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  // Generate code with Jules
  async generateCode(
    prompt: string,
    language?: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
      projectContext?: string;
    }
  ): Promise<{
    success: boolean;
    code?: string;
    explanation?: string;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      // Jules uses Google's AI API structure
      const response = await fetch(
        `${this.baseUrl}/models/jules-code:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: this.buildCodingPrompt(prompt, language, options?.projectContext),
              }],
            }],
            generationConfig: {
              maxOutputTokens: options?.maxTokens || 4000,
              temperature: options?.temperature || 0.2, // Lower temp for code = more reliable
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Jules API error: ${response.status}`);
      }

      const data = await response.json();
      const output = this.parseCodeResponse(data);
      
      return {
        success: true,
        code: output.code,
        explanation: output.explanation,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Debug/fix code
  async debugCode(
    code: string,
    errorMessage?: string,
    language?: string
  ): Promise<{
    success: boolean;
    fixedCode?: string;
    explanation?: string;
    error?: string;
  }> {
    try {
      const prompt = `Debug and fix this ${language || 'code'}:\n\n${code}${errorMessage ? `\n\nError message: ${errorMessage}` : ''}`;
      
      const response = await fetch(
        `${this.baseUrl}/models/jules-code:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are Jules, Google's AI coding assistant. Debug and fix the following code. Provide the corrected code and explain what was wrong.\n\n${prompt}`,
              }],
            }],
            generationConfig: {
              maxOutputTokens: 4000,
              temperature: 0.2,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Jules API error: ${response.status}`);
      }

      const data = await response.json();
      const output = this.parseCodeResponse(data);
      
      return {
        success: true,
        fixedCode: output.code,
        explanation: output.explanation,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Refactor code
  async refactorCode(
    code: string,
    language: string,
    goal: string
  ): Promise<{
    success: boolean;
    refactoredCode?: string;
    explanation?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/models/jules-code:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are Jules, Google's AI coding assistant. Refactor this ${language} code to: ${goal}\n\nOriginal code:\n${code}\n\nProvide the refactored code and explain the changes made.`,
              }],
            }],
            generationConfig: {
              maxOutputTokens: 6000,
              temperature: 0.3,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Jules API error: ${response.status}`);
      }

      const data = await response.json();
      const output = this.parseCodeResponse(data);
      
      return {
        success: true,
        refactoredCode: output.code,
        explanation: output.explanation,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Build specialized coding prompt
  private buildCodingPrompt(prompt: string, language?: string, projectContext?: string): string {
    let systemPrompt = `You are Jules, Google's AI coding assistant. You are an expert programmer who writes clean, efficient, well-documented code.`;
    
    if (language) {
      systemPrompt += `\n\nLanguage: ${language}`;
    }
    
    if (projectContext) {
      systemPrompt += `\n\nProject context:\n${projectContext}`;
    }
    
    systemPrompt += `\n\nUser request:\n${prompt}`;
    
    systemPrompt += `\n\nRespond with:
1. A brief explanation of the approach
2. The complete, working code
3. Any necessary imports or dependencies`;
    
    return systemPrompt;
  }

  // Parse response to extract code and explanation
  private parseCodeResponse(data: any): { code?: string; explanation?: string } {
    try {
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Try to extract code blocks
      const codeBlockMatch = text.match(/```[\w]*\n([\s\S]*?)```/g);
      const explanationMatch = text.split(/```/)[0];
      
      let code = '';
      if (codeBlockMatch) {
        code = codeBlockMatch
          .map(block => block.replace(/```[\w]*\n?/, '').replace(/```$/, ''))
          .join('\n\n');
      }
      
      return {
        explanation: explanationMatch?.trim(),
        code: code || text, // Fallback to full text if no code blocks
      };
    } catch (error) {
      return {
        explanation: 'Error parsing response',
        code: '',
      };
    }
  }
}

// Export Jules service
export const julesAI = new JulesAIService();

// ===========================================
// COMPREHENSIVE AI SERVICES LIST
// ===========================================

export const ALL_AI_SERVICES = {
  // FREE - No API Key Required
  pollinations: {
    name: 'Pollinations.ai',
    type: 'free',
    requiresKey: false,
    description: 'Free text & image generation',
    capabilities: ['text', 'code', 'image', 'analysis'],
    models: {
      text: ['openai-style', 'deepseek', 'qwen', 'mistral', 'llama'],
      image: ['flux', 'realism', 'anime', 'ghibli', 'disney', 'cyberpunk', 'fantasy', 'pixel'],
    },
  },
  
  // PAID - Requires API Key
  google_jules: {
    name: 'Google Jules',
    type: 'paid',
    requiresKey: true,
    keyProvided: false,
    description: 'Google\'s AI coding specialist',
    capabilities: ['code_generation', 'debugging', 'refactoring', 'documentation'],
    models: ['jules-code'],
  },
  
  openai: {
    name: 'OpenAI',
    type: 'paid',
    requiresKey: true,
    keyProvided: false,
    description: 'GPT-4, DALL-E, Whisper',
    capabilities: ['text', 'code', 'image', 'audio'],
    models: ['gpt-4', 'gpt-4-turbo', 'dall-e-3', 'whisper'],
  },
  
  anthropic: {
    name: 'Anthropic',
    type: 'paid',
    requiresKey: true,
    keyProvided: false,
    description: 'Claude - Advanced reasoning',
    capabilities: ['text', 'code', 'analysis', 'reasoning'],
    models: ['claude-sonnet-4', 'claude-3-5-sonnet'],
  },
  
  elevenlabs: {
    name: 'ElevenLabs',
    type: 'paid',
    requiresKey: true,
    keyProvided: false,
    description: 'Voice synthesis',
    capabilities: ['voice', 'audio'],
    models: ['multilingual-v2', 'english-v1'],
  },
};

// Usage helper
export function getAIServiceInfo(serviceId: string) {
  return ALL_AI_SERVICES[serviceId as keyof typeof ALL_AI_SERVICES];
}

export function getAvailableServices() {
  return Object.entries(ALL_AI_SERVICES).map(([id, service]) => ({
    id,
    ...service,
  }));
}
