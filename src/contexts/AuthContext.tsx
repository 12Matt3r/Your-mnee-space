import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';
import { socialApi } from '../lib/api';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName?: string) => Promise<any>;
  signOut: () => Promise<void>;
  demoLogin: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user data constants to ensure consistency between login and restoration
const DEMO_USER = {
  id: 'demo-user-001',
  email: 'demo@yourspace.io',
  user_metadata: { full_name: 'Demo Creator' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as any;

const DEMO_PROFILE = {
  id: 'demo-user-001',
  user_id: 'demo-user-001',
  username: 'DemoCreator',
  display_name: 'Demo Creator',
  bio: 'Welcome to YourSpace! This is a demo account.',
  avatar_url: null,
  followers_count: 1250,
  following_count: 89,
  is_creator: true,
  creator_type: 'musician',
} as any;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount (one-time check)
  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setSession(session);
          setUser(session.user);
          const userProfile = await socialApi.getCurrentUserProfile();
          setProfile(userProfile);
        } else {
          // Check for persisted demo mode
          const isDemo = localStorage.getItem('yourspace_demo_mode');
          if (isDemo === 'true') {
            console.log('Restoring demo session...');
            setUser(DEMO_USER);
            setProfile(DEMO_PROFILE);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    }
    loadUser();

    // Set up auth listener - KEEP SIMPLE, avoid any async operations in callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // If we are in demo mode and Supabase sends a null session (expected), ignore it
        // to prevent overwriting our demo state.
        const isDemo = localStorage.getItem('yourspace_demo_mode');

        if (session) {
          // Real session takes precedence
          setSession(session);
          setUser(session.user);
          // We let the profile effect handle the profile fetch
          if (isDemo) {
            localStorage.removeItem('yourspace_demo_mode');
          }
        } else if (!isDemo) {
          // Only clear state if NOT in demo mode
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Load profile when user changes (only for real users)
  useEffect(() => {
    async function loadProfile() {
      const isDemo = localStorage.getItem('yourspace_demo_mode');
      if (user && !profile && !isDemo) {
        try {
          const userProfile = await socialApi.getCurrentUserProfile();
          setProfile(userProfile);
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
    }
    loadProfile();
  }, [user, profile]);

  // Demo login for hackathon - bypasses real auth
  async function demoLogin() {
    localStorage.setItem('yourspace_demo_mode', 'true');
    setUser(DEMO_USER);
    setProfile(DEMO_PROFILE);
    return { data: { user: DEMO_USER }, error: null };
  }

  // Auth methods
  async function signIn(email: string, password: string) {
    const result = await socialApi.signIn(email, password);
    return result;
  }

  async function signUp(email: string, password: string, fullName?: string) {
    const result = await socialApi.signUp(email, password, fullName);
    return result;
  }

  async function signOut() {
    localStorage.removeItem('yourspace_demo_mode');
    await socialApi.signOut();
    setProfile(null);
    setSession(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signUp, signOut, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
