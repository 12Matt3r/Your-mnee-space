import { useState, useCallback } from 'react';
import {
  groqAI,
  generateWithGroq,
  generateCodeWithGroq,
  debugCodeWithGroq,
  explainCodeWithGroq,
  GroqResponse,
} from '../lib/groq-ai';

interface GroqTask {
  id: string;
  type: 'generate' | 'code' | 'debug' | 'explain';
  prompt: string;
  language?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: GroqResponse;
  createdAt: Date;
}

interface UseGroqAIReturn {
  isAvailable: boolean;
  isProcessing: boolean;
  tasks: GroqTask[];
  models: { id: string; type: string; contextWindow: number; capabilities: string[]; description: string }[];

  // Core functions
  generateText: (prompt: string, model?: string) => Promise<GroqResponse>;
  generateCode: (prompt: string, language?: string) => Promise<GroqResponse>;
  debugCode: (code: string, error?: string, language?: string) => Promise<GroqResponse>;
  explainCode: (code: string, language?: string) => Promise<GroqResponse>;

  // Task management
  addTask: (task: Omit<GroqTask, 'id' | 'status' | 'createdAt'>) => string;
  getTask: (id: string) => GroqTask | undefined;
  clearTasks: () => void;
}

export function useGroqAI(): UseGroqAIReturn {
  const [tasks, setTasks] = useState<GroqTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate unique task ID
  const generateId = () => `groq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add task to queue
  const addTask = useCallback((task: Omit<GroqTask, 'id' | 'status' | 'createdAt'>): string => {
    const id = generateId();
    const newTask: GroqTask = {
      ...task,
      id,
      status: 'pending',
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
    return id;
  }, []);

  // Get single task
  const getTask = useCallback((id: string) => {
    return tasks.find((t) => t.id === id);
  }, [tasks]);

  // Clear all tasks
  const clearTasks = useCallback(() => {
    setTasks([]);
  }, []);

  // Generate text
  const generateText = useCallback(
    async (prompt: string, model?: string): Promise<GroqResponse> => {
      setIsProcessing(true);
      const taskId = addTask({
        type: 'generate',
        prompt,
      });

      try {
        const result = await generateWithGroq(prompt, model);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: result.success ? 'completed' : 'failed', result }
              : t
          )
        );

        return result;
      } catch (error: any) {
        const errorResult: GroqResponse = { success: false, error: error.message };

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: 'failed', result: errorResult }
              : t
          )
        );

        return errorResult;
      } finally {
        setIsProcessing(false);
      }
    },
    [addTask]
  );

  // Generate code
  const generateCode = useCallback(
    async (prompt: string, language?: string): Promise<GroqResponse> => {
      setIsProcessing(true);
      const taskId = addTask({
        type: 'code',
        prompt,
        language,
      });

      try {
        const result = await generateCodeWithGroq(prompt, language);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: result.success ? 'completed' : 'failed', result }
              : t
          )
        );

        return result;
      } catch (error: any) {
        const errorResult: GroqResponse = { success: false, error: error.message };

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: 'failed', result: errorResult }
              : t
          )
        );

        return errorResult;
      } finally {
        setIsProcessing(false);
      }
    },
    [addTask]
  );

  // Debug code
  const debugCode = useCallback(
    async (code: string, error?: string, language?: string): Promise<GroqResponse> => {
      setIsProcessing(true);
      const taskId = addTask({
        type: 'debug',
        prompt: code,
        language,
      });

      try {
        const result = await debugCodeWithGroq(code, error, language);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: result.success ? 'completed' : 'failed', result }
              : t
          )
        );

        return result;
      } catch (error: any) {
        const errorResult: GroqResponse = { success: false, error: error.message };

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: 'failed', result: errorResult }
              : t
          )
        );

        return errorResult;
      } finally {
        setIsProcessing(false);
      }
    },
    [addTask]
  );

  // Explain code
  const explainCode = useCallback(
    async (code: string, language?: string): Promise<GroqResponse> => {
      setIsProcessing(true);
      const taskId = addTask({
        type: 'explain',
        prompt: code,
        language,
      });

      try {
        const result = await explainCodeWithGroq(code, language);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: result.success ? 'completed' : 'failed', result }
              : t
          )
        );

        return result;
      } catch (error: any) {
        const errorResult: GroqResponse = { success: false, error: error.message };

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: 'failed', result: errorResult }
              : t
          )
        );

        return errorResult;
      } finally {
        setIsProcessing(false);
      }
    },
    [addTask]
  );

  return {
    isAvailable: groqAI.isAvailable(),
    isProcessing,
    tasks,
    models: groqAI.getModels(),
    generateText,
    generateCode,
    debugCode,
    explainCode,
    addTask,
    getTask,
    clearTasks,
  };
}
