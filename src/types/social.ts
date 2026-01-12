import { Post } from '../lib/supabase';

export interface PostWithInteractions extends Post {
  likes_count: number;
  replies_count: number;
  bookmarks_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  is_locked?: boolean;
  unlock_price?: number;
  unlocked_by_user?: boolean;
  poll?: {
    question: string;
    options: { id: string; text: string; votes: number }[];
    total_votes: number;
    user_vote?: string;
  };
  profiles?: {
    user_id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    wallet_address?: string;
  };
}
