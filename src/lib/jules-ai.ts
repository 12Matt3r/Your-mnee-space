// ===========================================
// GOOGLE JULES AI - CODING SPECIALIST
// ===========================================

// IMPORTANT: Store your API key securely in environment variables!
// DO NOT commit API keys to version control

export const JULES_CONFIG = {
  name: 'Google Jules',
  description: 'Google\'s AI coding assistant - specialized for code generation, debugging, and refactoring',

  // Gemini API key provided by user for the YourSpace platform
  // Standard Google Cloud API key format (AIza...)
  apiKey: import.meta.env.VITE_JULES_AI_API_KEY || '',

  apiBase: 'https://generativelanguage.googleapis.com/v1beta',

  // Fallback to Pollinations.ai when Gemini API is not available
  fallbackEnabled: true,

  // Jules capabilities
  capabilities: [
    'code_generation',
    'code_completion', 
    'bug_fixing',
    'refactoring',
    'documentation',
    'algorithm_design',
    'code_review',
    'debugging',
    'architecture_design',
    'test_generation',
  ],
  
  supportedLanguages: [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp',
    'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'sql',
    'html', 'css', 'bash', 'yaml', 'json', 'markdown'
  ],
  
  models: {
    'gemini-pro': {
      contextWindow: 1000000, // 1M tokens!
      maxOutputTokens: 8000,
      costPerToken: 0, // Free with API key
    },
  },
};

// ===========================================
// Jules AI SERVICE IMPLEMENTATION
// ===========================================

export interface JulesResponse {
  success: boolean;
  output?: string;
  code?: string;
  explanation?: string;
  error?: string;
}

class JulesAIService {
  private apiKey: string;
  private baseUrl: string;
  private isConfigured: boolean;

  constructor() {
    this.apiKey = JULES_CONFIG.apiKey;
    this.baseUrl = JULES_CONFIG.apiBase;
    this.isConfigured = !!this.apiKey && this.apiKey.length > 0;
    
    if (this.isConfigured) {
      console.log('✅ Google Jules AI configured successfully!');
    } else {
      console.log('⚠️ Google Jules AI not configured (no API key)');
    }
  }

  isAvailable(): boolean {
    return this.isConfigured;
  }

  // Generate code from natural language description
  async generateCode(
    prompt: string,
    language?: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
      projectContext?: string;
    }
  ): Promise<JulesResponse> {
    if (!this.isConfigured) {
      // Fallback to Pollinations.ai when Jules is not configured
      return this.generateCodeWithPollinations(prompt, language);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: this.buildCodePrompt(prompt, language, options?.projectContext),
              }],
            }],
            generationConfig: {
              maxOutputTokens: options?.maxTokens || 4000,
              temperature: options?.temperature || 0.1,
            },
          }),
        }
      );

      if (!response.ok) {
        // Fallback to Pollinations.ai on API error
        if (JULES_CONFIG.fallbackEnabled) {
          console.log('Gemini API error, falling back to Pollinations.ai...');
          return this.generateCodeWithPollinations(prompt, language);
        }
        throw new Error(`Jules API error: ${response.status}`);
      }

      const data = await response.json();
      const result = this.parseResponse(data);

      return { success: true, ...result };
    } catch (error: any) {
      // Fallback to Pollinations.ai on exception
      if (JULES_CONFIG.fallbackEnabled) {
        console.log('Gemini API exception, falling back to Pollinations.ai...');
        return this.generateCodeWithPollinations(prompt, language);
      }
      return { success: false, error: error.message };
    }
  }

  // Fallback: Generate code using Pollinations.ai (free, no API key required)
  private async generateCodeWithPollinations(
    prompt: string,
    language?: string
  ): Promise<JulesResponse> {
    try {
      const enhancedPrompt = `You are an expert coding assistant. Write clean, efficient, well-documented ${language || 'code'} based on this request:\n\n${prompt}\n\nProvide the complete code with explanations.`;

      const response = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(enhancedPrompt)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'text/plain',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Pollinations API error: ${response.status}`);
      }

      const text = await response.text();
      const result = this.parseResponse({ candidates: [{ content: { parts: [{ text }] } }] });

      return {
        success: true,
        ...result,
        explanation: result.explanation + '\n\n[Generated with Pollinations.ai fallback]',
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Debug broken code
  async debugCode(
    code: string,
    errorMessage?: string,
    language?: string
  ): Promise<JulesResponse> {
    if (!this.isConfigured) {
      return this.debugCodeWithPollinations(code, errorMessage, language);
    }

    try {
      const prompt = `Debug this ${language || 'code'}:\n\n\`\`\`\n${code}\n\`\`\`\n\n${errorMessage ? `Error: ${errorMessage}` : 'Find and fix any bugs'}`;

      const response = await fetch(
        `${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are Jules, Google's AI coding assistant. Debug the following code. Provide:
1. What was wrong
2. The fixed code
3. Explanation of the fix\n\n${prompt}`,
              }],
            }],
            generationConfig: { maxOutputTokens: 4000, temperature: 0.1 },
          }),
        }
      );

      if (!response.ok) {
        if (JULES_CONFIG.fallbackEnabled) {
          console.log('Gemini API error, falling back to Pollinations.ai...');
          return this.debugCodeWithPollinations(code, errorMessage, language);
        }
        throw new Error(`Jules API error: ${response.status}`);
      }

      const data = await response.json();
      const result = this.parseResponse(data);

      return { success: true, ...result };
    } catch (error: any) {
      if (JULES_CONFIG.fallbackEnabled) {
        console.log('Gemini API exception, falling back to Pollinations.ai...');
        return this.debugCodeWithPollinations(code, errorMessage, language);
      }
      return { success: false, error: error.message };
    }
  }

  // Fallback: Debug code using Pollinations.ai
  private async debugCodeWithPollinations(
    code: string,
    errorMessage?: string,
    language?: string
  ): Promise<JulesResponse> {
    try {
      const prompt = `You are an expert debugging assistant. Debug this ${language || 'code'}:\n\n\`\`\`\n${code}\n\`\`\`\n\n${errorMessage ? `Error: ${errorMessage}` : 'Find and fix any bugs'}\n\nProvide: 1. What was wrong, 2. The fixed code, 3. Explanation of the fix.`;

      const response = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(prompt)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'text/plain',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Pollinations API error: ${response.status}`);
      }

      const text = await response.text();
      const result = this.parseResponse({ candidates: [{ content: { parts: [{ text }] } }] });

      return {
        success: true,
        ...result,
        explanation: result.explanation + '\n\n[Debugged with Pollinations.ai fallback]',
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Refactor/optimize code
  async refactorCode(
    code: string,
    language: string,
    goal: string
  ): Promise<JulesResponse> {
    if (!this.isConfigured) {
      return this.refactorCodeWithPollinations(code, language, goal);
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are Jules, Google's AI coding assistant. Refactor this ${language} code to: ${goal}\n\nOriginal code:\n\`\`\`\n${code}\n\`\`\`\n\nProvide the refactored code and explain changes.`,
              }],
            }],
            generationConfig: { maxOutputTokens: 6000, temperature: 0.2 },
          }),
        }
      );

      if (!response.ok) {
        if (JULES_CONFIG.fallbackEnabled) {
          console.log('Gemini API error, falling back to Pollinations.ai...');
          return this.refactorCodeWithPollinations(code, language, goal);
        }
        throw new Error(`Jules API error: ${response.status}`);
      }

      const data = await response.json();
      const result = this.parseResponse(data);

      return { success: true, ...result };
    } catch (error: any) {
      if (JULES_CONFIG.fallbackEnabled) {
        console.log('Gemini API exception, falling back to Pollinations.ai...');
        return this.refactorCodeWithPollinations(code, language, goal);
      }
      return { success: false, error: error.message };
    }
  }

  // Fallback: Refactor code using Pollinations.ai
  private async refactorCodeWithPollinations(
    code: string,
    language: string,
    goal: string
  ): Promise<JulesResponse> {
    try {
      const prompt = `You are an expert refactoring assistant. Refactor this ${language} code to: ${goal}\n\nOriginal code:\n\`\`\`\n${code}\n\`\`\`\n\nProvide the refactored code and explain the changes made.`;

      const response = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(prompt)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'text/plain',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Pollinations API error: ${response.status}`);
      }

      const text = await response.text();
      const result = this.parseResponse({ candidates: [{ content: { parts: [{ text }] } }] });

      return {
        success: true,
        ...result,
        explanation: result.explanation + '\n\n[Refactored with Pollinations.ai fallback]',
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Build specialized coding prompt
  private buildCodePrompt(
    prompt: string,
    language?: string,
    projectContext?: string
  ): string {
    let context = 'You are Jules, Google\'s AI coding assistant. Write clean, efficient, well-documented code.\n\n';
    
    if (language) context += `Language: ${language}\n`;
    if (projectContext) context += `Project context: ${projectContext}\n`;
    
    context += `\nRequest: ${prompt}\n\n`;
    context += 'Respond with code block and brief explanation.';
    
    return context;
  }

  // Parse API response
  private parseResponse(data: any): { code: string; explanation: string } {
    try {
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Extract code blocks
      const codeBlockMatch = text.match(/```[\w]*\n([\s\S]*?)```/g);
      let code = '';
      
      if (codeBlockMatch) {
        code = codeBlockMatch
          .map(block => block.replace(/```[\w]*\n?/, '').replace(/```$/, ''))
          .join('\n\n');
      }
      
      // Explanation is everything before code blocks
      const explanation = text.split(/```/)[0].trim();
      
      return { 
        code: code || text, // Fallback to full text
        explanation: explanation || 'Code generated successfully'
      };
    } catch (error) {
      return { 
        code: '', 
        explanation: 'Error parsing response' 
      };
    }
  }
}

// Export service
export const julesAIService = new JulesAIService();

// ===========================================
// CONVENIENCE FUNCTIONS
// ===========================================

export async function generateWithJules(
  prompt: string,
  language?: string
): Promise<JulesResponse> {
  return julesAIService.generateCode(prompt, language);
}

export async function debugWithJules(
  code: string,
  error?: string,
  language?: string
): Promise<JulesResponse> {
  return julesAIService.debugCode(code, error, language);
}

export async function refactorWithJules(
  code: string,
  language: string,
  goal: string
): Promise<JulesResponse> {
  return julesAIService.refactorCode(code, language, goal);
}
