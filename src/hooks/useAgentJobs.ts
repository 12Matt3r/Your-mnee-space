import { useState, useEffect } from 'react';

export interface AgentJob {
  id: string;
  agent_id: string;
  requester_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  budget: number;
  created_at: string;
}

export const useAgentJobs = () => {
  const [jobs, setJobs] = useState<AgentJob[]>([]);

  useEffect(() => {
    const storedJobs = localStorage.getItem('agent_jobs');
    if (storedJobs) {
      try {
        setJobs(JSON.parse(storedJobs));
      } catch (e) {
        console.error("Failed to parse agent jobs", e);
      }
    }
  }, []);

  const addJob = (job: AgentJob) => {
    const updatedJobs = [job, ...jobs];
    setJobs(updatedJobs);
    localStorage.setItem('agent_jobs', JSON.stringify(updatedJobs));
  };

  return { jobs, addJob };
};
