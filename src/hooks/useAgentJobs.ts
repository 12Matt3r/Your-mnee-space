import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface AgentJob {
  id: string;
  agent_id: string;
  requester_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  budget: number;
  created_at: string;
  transaction_hash?: string;
}

export const useAgentJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<AgentJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        setJobs([]);
        return;
    }

    const fetchJobs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('agent_jobs')
            .select('*')
            .eq('requester_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching jobs:', error);
        } else {
            setJobs(data || []);
        }
        setLoading(false);
    };

    fetchJobs();
  }, [user]);

  const addJob = async (job: Omit<AgentJob, 'id' | 'created_at'>) => {
    if (!user) return;

    // Optimistic update
    const tempJob = { ...job, id: `temp-${Date.now()}`, created_at: new Date().toISOString() };
    setJobs(prev => [tempJob, ...prev]);

    const { data, error } = await supabase
        .from('agent_jobs')
        .insert({
            ...job,
            requester_id: user.id
        })
        .select()
        .single();

    if (error) {
        console.error('Error adding job:', error);
        // Revert on failure (could improve this)
        setJobs(prev => prev.filter(j => j.id !== tempJob.id));
    } else if (data) {
        // Replace temp with real
        setJobs(prev => [data, ...prev.filter(j => j.id !== tempJob.id)]);
    }
  };

  return { jobs, addJob, loading };
};
