import { useState, useCallback } from 'react';
import {
  minimaxAI,
  generateWithMiniMax,
  generateCodeWithMiniMax,
  analyzeCodeWithMiniMax,
  MiniMaxResponse,
} from '../lib/minimax-ai';

interface MiniMaxTask {
  id: string;
  type: 'generate' | 'code' | 'analyze';
  prompt: string;
  language?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: MiniMaxResponse;
  createdAt: Date;
}

interface UseMiniMaxAIReturn {
  isAvailable: boolean;
  isProcessing: boolean;
  tasks: MiniMaxTask[];

  // Core functions
  generateText: (prompt: string, model?: string) => Promise<MiniMaxResponse>;
  generateCode: (prompt: string, language?: string) => Promise<MiniMaxResponse>;
  analyzeCode: (code: string, language?: string) => Promise<MiniMaxResponse>;

  // Task management
  addTask: (task: Omit<MiniMaxTask, 'id' | 'status' | 'createdAt'>) => string;
  getTask: (id: string) => MiniMaxTask | undefined;
  clearTasks: () => void;
}

export function useMiniMaxAI(): UseMiniMaxAIReturn {
  const [tasks, setTasks] = useState<MiniMaxTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate unique task ID
  const generateId = () => `minimax-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add task to queue
  const addTask = useCallback((task: Omit<MiniMaxTask, 'id' | 'status' | 'createdAt'>): string => {
    const id = generateId();
    const newTask: MiniMaxTask = {
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
    async (prompt: string, model?: string): Promise<MiniMaxResponse> => {
      setIsProcessing(true);
      const taskId = addTask({
        type: 'generate',
        prompt,
      });

      try {
        const result = await generateWithMiniMax(prompt, model);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: result.success ? 'completed' : 'failed', result }
              : t
          )
        );

        return result;
      } catch (error: any) {
        const errorResult: MiniMaxResponse = { success: false, error: error.message };

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
    async (prompt: string, language?: string): Promise<MiniMaxResponse> => {
      setIsProcessing(true);
      const taskId = addTask({
        type: 'code',
        prompt,
        language,
      });

      try {
        const result = await generateCodeWithMiniMax(prompt, language);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: result.success ? 'completed' : 'failed', result }
              : t
          )
        );

        return result;
      } catch (error: any) {
        const errorResult: MiniMaxResponse = { success: false, error: error.message };

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
    async (code: string, language?: string): Promise<MiniMaxResponse> => {
      setIsProcessing(true);
      const taskId = addTask({
        type: 'analyze',
        prompt: code,
        language,
      });

      try {
        const result = await analyzeCodeWithMiniMax(code, language);

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId
              ? { ...t, status: result.success ? 'completed' : 'failed', result }
              : t
          )
        );

        return result;
      } catch (error: any) {
        const errorResult: MiniMaxResponse = { success: false, error: error.message };

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
    isAvailable: minimaxAI.isAvailable(),
    isProcessing,
    tasks,
    generateText,
    generateCode,
    analyzeCode,
    addTask,
    getTask,
    clearTasks,
  };
}
