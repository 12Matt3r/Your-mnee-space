import { useState, useEffect } from 'react';
import { supabase, Proposal } from '../lib/supabase';

export const useGovernance = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('end_date', { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (err: any) {
      console.error('Error fetching proposals:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return { proposals, loading, error, refetch: fetchProposals };
};
