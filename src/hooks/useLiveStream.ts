import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface Stream {
  id: string;
  user_id: string;
  title: string | null;
  status: 'live' | 'ended';
  viewer_count: number;
  started_at: string;
}

export const useLiveStream = () => {
  const { user } = useAuth();
  const [currentStream, setCurrentStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch active stream for current user on mount
  useEffect(() => {
    if (!user) return;
    const fetchStream = async () => {
        const { data } = await supabase
            .from('streams')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'live')
            .order('started_at', { ascending: false })
            .limit(1)
            .single();

        if (data) setCurrentStream(data);
    };
    fetchStream();
  }, [user]);

  const startStream = async (title: string) => {
    if (!user) return;
    setLoading(true);
    try {
        const { data, error } = await supabase
            .from('streams')
            .insert({
                user_id: user.id,
                title,
                status: 'live',
                viewer_count: 0
            })
            .select()
            .single();

        if (error) throw error;
        setCurrentStream(data);
        return data;
    } catch (e) {
        console.error("Failed to start stream", e);
    } finally {
        setLoading(false);
    }
  };

  const endStream = async () => {
    if (!currentStream) return;
    setLoading(true);
    try {
        await supabase
            .from('streams')
            .update({ status: 'ended', ended_at: new Date().toISOString() })
            .eq('id', currentStream.id);

        setCurrentStream(null);
    } catch (e) {
        console.error("Failed to end stream", e);
    } finally {
        setLoading(false);
    }
  };

  return { currentStream, startStream, endStream, loading };
};
