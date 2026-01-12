import { useState, useCallback } from 'react';
import {
  openRouterAI,
  generateWithOpenRouter,
  generateCodeWithOpenRouter,
  analyzeCodeWithOpenRouter,
  creativeWritingWithOpenRouter,
  OpenRouterResponse,
} from '../lib/openrouter-ai';

interface OpenRouterTask {
  id: string;
  type: 'generate' | 'code' | 'analyze' | 'creative';
  prompt: string;
  language?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: OpenRouterResponse;
  createdAt: Date;
}

interface UseOpenRouterAIReturn {
  isAvailable: boolean;
  isProcessing: boolean;
  tasks: OpenRouterTask[];
  models: { id: string; type: string; contextWindow: number; capabilities: string[]; description: string; provider: string }[];
  modelsByProvider: Record<string, { id: string; type: string; contextWindow: number; capabilities: string[]; description: string; provider: string }[]>;

  // Core functions
  generateText: (prompt: string, model?: string) => Promise<OpenRouterResponse>;
  generateCode: (prompt: string, language?: string, model?: string) => Promise<OpenRouterResponse>;
  analyzeCode: (code: string, language?: string) => Promise<OpenRouterResponse>;
  creativeWriting: (prompt: string, style?: string) => Promise<OpenRouterResponse>;

  // Task management
  addTask: (task: Omit<OpenRouterTask, 'id' | 'status' | 'createdAt'>) => string;
  getTask: (id: string) => OpenRouterTask | undefined;
  clearTasks: () => void;
}

export function useOpenRouterAI(): UseOpenRouterAIReturn {
  const [tasks, setTasks] = useState<OpenRouterTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate unique task ID
  const generateId = () => `openrouter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add task to queue
  const addTask = useCallback((task: Omit<OpenRouterTask, 'id' | 'status' | 'createdAt'>): string => {
    const id = generateId();
    const newTask: OpenRouterTask = {
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
    async (prompt: string, model?: string): Promise<OpenRouterResponse> => {
      setIsProcessing(true);
      const taskId = addTask({
        type: 'generate',
        prompt,
      });

      try {
        const result = await generateWithOpenRouter(prompt, model);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: result.success ? 'completed' : 'failed', result }
              : t
          )
        );

        return result;
      } catch (error: any) {
        const errorResult: OpenRouterResponse = { success: false, error: error.message };

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
    async (prompt: string, language?: string, model?: string): Promise<OpenRouterResponse> => {
      setIsProcessing(true);
      const taskId = addTask({
        type: 'code',
        prompt,
        language,
      });

      try {
        const result = await generateCodeWithOpenRouter(prompt, language, model);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: result.success ? 'completed' : 'failed', result }
              : t
          )
        );

        return result;
      } catch (error: any) {
        const errorResult: OpenRouterResponse = { success: false, error: error.message };

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

  // Analyze code
  const analyzeCode = useCallback(
    async (code: string, language?: string): Promise<OpenRouterResponse> => {
      setIsProcessing(true);
      const taskId = addTask({
        type: 'analyze',
        prompt: code,
        language,
      });

      try {
        const result = await analyzeCodeWithOpenRouter(code, language);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: result.success ? 'completed' : 'failed', result }
              : t
          )
        );

        return result;
      } catch (error: any) {
        const errorResult: OpenRouterResponse = { success: false, error: error.message };

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

  // Creative writing
  const creativeWriting = useCallback(
    async (prompt: string, style?: string): Promise<OpenRouterResponse> => {
      setIsProcessing(true);
      const taskId = addTask({
        type: 'creative',
        prompt,
      });

      try {
        const result = await creativeWritingWithOpenRouter(prompt, style);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: result.success ? 'completed' : 'failed', result }
              : t
          )
        );

        return result;
      } catch (error: any) {
        const errorResult: OpenRouterResponse = { success: false, error: error.message };

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
    isAvailable: openRouterAI.isAvailable(),
    isProcessing,
    tasks,
    models: openRouterAI.getModels(),
    modelsByProvider: openRouterAI.getModelsByProvider(),
    generateText,
    generateCode,
    analyzeCode,
    creativeWriting,
    addTask,
    getTask,
    clearTasks,
  };
}
