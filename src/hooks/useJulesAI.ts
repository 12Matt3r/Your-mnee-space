import { useState, useCallback } from 'react';
import { 
  julesAIService, 
  generateWithJules, 
  debugWithJules, 
  refactorWithJules,
  JulesResponse 
} from '../lib/jules-ai';

interface JulesTask {
  id: string;
  type: 'generate' | 'debug' | 'refactor' | 'review';
  prompt: string;
  language?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: JulesResponse;
  createdAt: Date;
}

interface UseJulesAIReturn {
  isAvailable: boolean;
  isProcessing: boolean;
  tasks: JulesTask[];
  
  // Core functions
  generateCode: (prompt: string, language?: string) => Promise<JulesResponse>;
  debugCode: (code: string, error?: string, language?: string) => Promise<JulesResponse>;
  refactorCode: (code: string, language: string, goal: string) => Promise<JulesResponse>;
  
  // Task management
  addTask: (task: Omit<JulesTask, 'id' | 'status' | 'createdAt'>) => string;
  getTask: (id: string) => JulesTask | undefined;
  clearTasks: () => void;
  
  // Convenience
  writeFunction: (name: string, params: string, returnType: string, description: string) => Promise<JulesResponse>;
  fixBug: (code: string, errorMessage: string, language: string) => Promise<JulesResponse>;
  createComponent: (componentName: string, props: string, children: string, framework: string) => Promise<JulesResponse>;
}

export function useJulesAI(): UseJulesAIReturn {
  const [tasks, setTasks] = useState<JulesTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate unique task ID
  const generateId = () => `jules-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add task to queue
  const addTask = useCallback((task: Omit<JulesTask, 'id' | 'status' | 'createdAt'>): string => {
    const id = generateId();
    const newTask: JulesTask = {
      ...task,
      id,
      status: 'pending',
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
    return id;
  }, []);

  // Get single task
  const getTask = useCallback((id: string) => {
    return tasks.find(t => t.id === id);
  }, [tasks]);

  // Clear all tasks
  const clearTasks = useCallback(() => {
    setTasks([]);
  }, []);

  // Generate code
  const generateCode = useCallback(async (
    prompt: string,
    language?: string
  ): Promise<JulesResponse> => {
    setIsProcessing(true);
    const taskId = addTask({
      type: 'generate',
      prompt,
      language,
    });

    try {
      const result = await generateWithJules(prompt, language);
      
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: result.success ? 'completed' : 'failed', result }
          : t
      ));
      
      return result;
    } catch (error: any) {
      const errorResult: JulesResponse = { success: false, error: error.message };
      
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: 'failed', result: errorResult }
          : t
      ));
      
      return errorResult;
    } finally {
      setIsProcessing(false);
    }
  }, [addTask]);

  // Debug code
  const debugCode = useCallback(async (
    code: string,
    error?: string,
    language?: string
  ): Promise<JulesResponse> => {
    setIsProcessing(true);
    const taskId = addTask({
      type: 'debug',
      prompt: code,
      language,
    });

    try {
      const result = await debugWithJules(code, error, language);
      
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: result.success ? 'completed' : 'failed', result }
          : t
      ));
      
      return result;
    } catch (error: any) {
      const errorResult: JulesResponse = { success: false, error: error.message };
      
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: 'failed', result: errorResult }
          : t
      ));
      
      return errorResult;
    } finally {
      setIsProcessing(false);
    }
  }, [addTask]);

  // Refactor code
  const refactorCode = useCallback(async (
    code: string,
    language: string,
    goal: string
  ): Promise<JulesResponse> => {
    setIsProcessing(true);
    const taskId = addTask({
      type: 'refactor',
      prompt: code,
      language,
    });

    try {
      const result = await refactorWithJules(code, language, goal);
      
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: result.success ? 'completed' : 'failed', result }
          : t
      ));
      
      return result;
    } catch (error: any) {
      const errorResult: JulesResponse = { success: false, error: error.message };
      
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: 'failed', result: errorResult }
          : t
      ));
      
      return errorResult;
    } finally {
      setIsProcessing(false);
    }
  }, [addTask]);

  // Convenience: Write a function
  const writeFunction = useCallback(async (
    name: string,
    params: string,
    returnType: string,
    description: string
  ): Promise<JulesResponse> => {
    const prompt = `Write a ${name} function with parameters (${params}) that returns ${returnType}. ${description}. Include proper error handling and documentation.`;
    return generateCode(prompt, 'typescript');
  }, [generateCode]);

  // Convenience: Fix a bug
  const fixBug = useCallback(async (
    code: string,
    errorMessage: string,
    language: string
  ): Promise<JulesResponse> => {
    return debugCode(code, errorMessage, language);
  }, [debugCode]);

  // Convenience: Create a component
  const createComponent = useCallback(async (
    componentName: string,
    props: string,
    children: string,
    framework: string
  ): Promise<JulesResponse> => {
    const prompt = `Create a ${componentName} component in ${framework} with props: ${props}. Children/content: ${children}. Include proper types/interfaces and styling.`;
    return generateCode(prompt, framework.toLowerCase());
  }, [generateCode]);

  return {
    isAvailable: julesAIService.isAvailable(),
    isProcessing,
    tasks,
    generateCode,
    debugCode,
    refactorCode,
    addTask,
    getTask,
    clearTasks,
    writeFunction,
    fixBug,
    createComponent,
  };
}
