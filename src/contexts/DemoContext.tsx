import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';

interface DemoProfile {
  id: string;
  username: string;
  display_name: string;
  email: string;
  bio: string;
  avatar_url: string | null;
  background_url: string | null;
  location: string;
  subscription_tier: string;
  created_at: string;
}

interface DemoContent {
  id: string;
  title: string;
  description: string;
  content_type: string;
  file_url: string;
  creator_id: string;
  profiles: DemoProfile;
  view_count: number;
  like_count: number;
  created_at: string;
}

interface DemoContextType {
  isDemoMode: boolean;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  demoUser: User | null;
  demoProfile: DemoProfile | null;
  demoContent: DemoContent[];
  addDemoContent: (content: Omit<DemoContent, 'id' | 'created_at' | 'profiles'>) => void;
  clearDemoContent: () => void;
  updateDemoProfile: (updates: Partial<DemoProfile>) => void;
  logoutDemo: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

// Sample demo profiles to populate the platform
const sampleProfiles: DemoProfile[] = [
  {
    id: 'demo-user-1',
    username: 'neon_dreams',
    display_name: 'Neon Dreams',
    email: 'neon@demo.com',
    bio: 'Creating cyberpunk vibes and synthwave beats. Living in the digital realm.',
    avatar_url: null,
    background_url: null,
    location: 'Neo Tokyo',
    subscription_tier: 'creator',
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'demo-user-2',
    username: 'crypto_queen',
    display_name: 'Crypto Queen',
    email: 'crypto@demo.com',
    bio: 'Digital artist exploring the intersection of art and blockchain technology.',
    avatar_url: null,
    background_url: null,
    location: 'Decentraland',
    subscription_tier: 'pro',
    created_at: '2025-01-05T00:00:00Z'
  },
  {
    id: 'demo-user-3',
    username: 'bass_drop',
    display_name: 'Bass Drop',
    email: 'bass@demo.com',
    bio: 'EDM producer and live performer. Let the bass move you.',
    avatar_url: null,
    background_url: null,
    location: 'Los Angeles',
    subscription_tier: 'creator',
    created_at: '2025-01-10T00:00:00Z'
  }
];

// Sample demo content
const sampleContent: DemoContent[] = [
  {
    id: 'content-1',
    title: 'Midnight City Vibes',
    description: 'A synthwave track inspired by late nights in the city.',
    content_type: 'audio',
    file_url: '',
    creator_id: 'demo-user-1',
    profiles: sampleProfiles[0],
    view_count: 1520,
    like_count: 234,
    created_at: '2025-01-08T00:00:00Z'
  },
  {
    id: 'content-2',
    title: 'Digital Horizon',
    description: 'Abstract digital art exploring virtual landscapes.',
    content_type: 'image',
    file_url: '',
    creator_id: 'demo-user-2',
    profiles: sampleProfiles[1],
    view_count: 3420,
    like_count: 567,
    created_at: '2025-01-09T00:00:00Z'
  },
  {
    id: 'content-3',
    title: 'Festival Anthem 2026',
    description: 'High energy EDM track perfect for festivals.',
    content_type: 'audio',
    file_url: '',
    creator_id: 'demo-user-3',
    profiles: sampleProfiles[2],
    view_count: 8930,
    like_count: 1234,
    created_at: '2025-01-10T00:00:00Z'
  },
  {
    id: 'content-4',
    title: 'Pixel Dreams',
    description: 'Retro pixel art animation with a modern twist.',
    content_type: 'video',
    file_url: '',
    creator_id: 'demo-user-1',
    profiles: sampleProfiles[0],
    view_count: 5670,
    like_count: 892,
    created_at: '2025-01-11T00:00:00Z'
  },
  {
    id: 'content-5',
    title: 'Blockchain Symphony',
    description: 'An experimental piece exploring tokenized music.',
    content_type: 'audio',
    file_url: '',
    creator_id: 'demo-user-2',
    profiles: sampleProfiles[1],
    view_count: 2340,
    like_count: 456,
    created_at: '2025-01-11T00:00:00Z'
  }
];

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoUser, setDemoUser] = useState<User | null>(null);
  const [demoProfile, setDemoProfile] = useState<DemoProfile | null>(null);
  const [demoContent, setDemoContent] = useState<DemoContent[]>(sampleContent);

  const enableDemoMode = useCallback(() => {
    console.log('🎮 Demo mode enabled');
    setIsDemoMode(true);
    
    // Create a demo user
    const demoUserData = {
      id: 'demo-user-main',
      email: 'demo@yourspace.io',
      created_at: new Date().toISOString(),
    } as User;
    
    setDemoUser(demoUserData);
    
    // Create a demo profile for the main user
    const newProfile: DemoProfile = {
      id: 'demo-user-main',
      username: 'demo_creator',
      display_name: 'Demo Creator',
      email: 'demo@yourspace.io',
      bio: 'This is a demo profile. Edit it to make it your own!',
      avatar_url: null,
      background_url: null,
      location: 'Your City',
      subscription_tier: 'creator',
      created_at: new Date().toISOString()
    };
    
    setDemoProfile(newProfile);
  }, []);

  const disableDemoMode = useCallback(() => {
    console.log('🎮 Demo mode disabled');
    setIsDemoMode(false);
    setDemoUser(null);
    setDemoProfile(null);
  }, []);

  const logoutDemo = useCallback(() => {
    setDemoUser(null);
    setDemoProfile(null);
  }, []);

  const addDemoContent = useCallback((content: Omit<DemoContent, 'id' | 'created_at' | 'profiles'>) => {
    const newContent: DemoContent = {
      ...content,
      id: `content-${Date.now()}`,
      created_at: new Date().toISOString(),
      profiles: demoProfile || sampleProfiles[0]
    };
    
    setDemoContent(prev => [newContent, ...prev]);
    console.log('📦 Added demo content:', newContent.title);
  }, [demoProfile]);

  const clearDemoContent = useCallback(() => {
    setDemoContent([]);
  }, []);

  const updateDemoProfile = useCallback((updates: Partial<DemoProfile>) => {
    setDemoProfile(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  // Auto-enable demo mode for convenience
  useEffect(() => {
    // Check if there's already a demo profile in localStorage
    const savedDemoProfile = localStorage.getItem('demoProfile');
    if (savedDemoProfile) {
      const profile = JSON.parse(savedDemoProfile);
      setDemoProfile(profile);
      setIsDemoMode(true);
      setDemoUser({
        id: profile.id,
        email: profile.email,
        created_at: profile.created_at
      } as User);
    }
  }, []);

  // Save demo profile to localStorage
  useEffect(() => {
    if (demoProfile) {
      localStorage.setItem('demoProfile', JSON.stringify(demoProfile));
    }
  }, [demoProfile]);

  return (
    <DemoContext.Provider value={{
      isDemoMode,
      enableDemoMode,
      disableDemoMode,
      demoUser,
      demoProfile,
      demoContent,
      addDemoContent,
      clearDemoContent,
      updateDemoProfile,
      logoutDemo
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
