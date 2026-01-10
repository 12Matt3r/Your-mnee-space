import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zbmigpfyzdmwtcsqniys.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibWlncGZ5emRtd3Rjc3FuaXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5MzA2OTgsImV4cCI6MjA4MzUwNjY5OH0.quUOZNtInJtz4ySRA7jl9jZzymo-IcS4USQ-mLqXnEo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for YourSpace MNEE Platform
export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  background_image_url: string | null;
  background_video_url: string | null;
  theme: string | null;
  custom_css: string | null;
  creator_type: string | null;
  is_verified: boolean | null;
  is_premium: boolean | null;
  profile_views: number | null;
  follower_count: number | null;
  following_count: number | null;
  total_earnings: number | null;
  reputation_score: number | null;
  wallet_address: string | null;
  mnee_balance: number | null;
  created_at: string;
  updated_at: string;
}

export interface Creator {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  wallet_address: string | null;
  room_theme: string;
  mnee_earnings: number;
  subscriber_count: number;
  is_verified: boolean;
  created_at: string;
}

export interface Room {
  id: string;
  creator_id: string;
  name: string;
  description: string | null;
  theme: string;
  is_public: boolean;
  visitor_count: number;
  created_at: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string | null;
  agent_type: string;
  avatar_url: string | null;
  hourly_rate: number;
  skills: string[];
  performance_score: number;
  total_jobs: number;
  is_available: boolean;
  created_at: string;
}

export interface AgentJob {
  id: string;
  agent_id: string;
  requester_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  payment_amount: number;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  created_at: string;
  completed_at: string | null;
}

export interface MNEETransaction {
  id: string;
  from_user_id: string | null;
  to_user_id: string | null;
  amount: number;
  transaction_type: 'tip' | 'subscription' | 'purchase' | 'job_payment' | 'agent_hire';
  tx_hash: string | null;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
}

export interface SubscriptionTier {
  id: string;
  creator_id: string;
  name: string;
  price_mnee: number;
  description: string | null;
  benefits: string[];
  subscriber_count: number;
}
