import { useState, useEffect } from 'react';
import { supabase, GuestbookEntry, TopEightFriend } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useSocialFeatures = (profileId: string) => {
  const { user } = useAuth();
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [topEight, setTopEight] = useState<TopEightFriend[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!profileId) return;
    setLoading(true);
    try {
      // Fetch Guestbook
      const { data: entries } = await supabase
        .from('guestbook_entries')
        .select(`
          *,
          author:author_id (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });

      if (entries) setGuestbookEntries(entries);

      // Fetch Top 8
      const { data: friends } = await supabase
        .from('top_eight')
        .select(`
          *,
          friend:friend_id (
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('user_id', profileId)
        .order('position', { ascending: true });

      if (friends) setTopEight(friends);

    } catch (error) {
      console.error('Error fetching social features:', error);
    } finally {
      setLoading(false);
    }
  };

  const signGuestbook = async (message: string) => {
    if (!user) throw new Error('Must be signed in');

    const { data, error } = await supabase
      .from('guestbook_entries')
      .insert({
        profile_id: profileId,
        author_id: user.id,
        message
      })
      .select(`
        *,
        author:author_id (
          username,
          display_name,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;
    if (data) setGuestbookEntries([data, ...guestbookEntries]);
    return data;
  };

  useEffect(() => {
    fetchData();
  }, [profileId]);

  return { guestbookEntries, topEight, loading, signGuestbook };
};
