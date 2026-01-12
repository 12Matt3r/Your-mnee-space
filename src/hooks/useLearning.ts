import { useState, useEffect } from 'react';
import { supabase, LearningModule } from '../lib/supabase';

export const useLearning = () => {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('learning_modules')
        .select(`
          *,
          steps:learning_steps(*)
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setModules(data || []);
    } catch (err: any) {
      console.error('Error fetching modules:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getModuleById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('learning_modules')
        .select(`
          *,
          steps:learning_steps(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error fetching module:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return { modules, loading, error, getModuleById };
};
