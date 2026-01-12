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

// Demo user data constants
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

  // Consolidated Auth Logic
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        setLoading(true);
        
        // 1. Check for Demo Mode first
        const isDemo = localStorage.getItem('yourspace_demo_mode') === 'true';
        if (isDemo) {
            if (mounted) {
                setSession({ user: DEMO_USER } as Session);
                setUser(DEMO_USER);
                setProfile(DEMO_PROFILE);
                setLoading(false);
            }
            return;
        }

        // 2. Check Supabase Session
        const { data: { session: initialSession } } = await supabase.auth.getSession();

        if (initialSession && mounted) {
          setSession(initialSession);
          setUser(initialSession.user);

          // Fetch profile immediately
          try {
             const userProfile = await socialApi.getCurrentUserProfile();
             if (mounted) setProfile(userProfile);
          } catch (err) {
             console.error("Error fetching initial profile", err);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initializeAuth();

    // 3. Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        // Ignore updates if we are explicitly in demo mode (unless it's a sign-out event which might clear it)
        // But usually demo mode bypasses this. However, if we sign in via Supabase, we should clear demo mode.
        if (newSession) {
             localStorage.removeItem('yourspace_demo_mode');
             setSession(newSession);
             setUser(newSession.user);

             // Fetch profile on session change
             try {
                const userProfile = await socialApi.getCurrentUserProfile();
                if (mounted) setProfile(userProfile);
             } catch (err) {
                 console.error("Error fetching profile on auth change", err);
             }
        } else {
             // If session is null, check if we reverted to demo mode (unlikely via onAuthStateChange)
             // Or just sign out
             const isDemo = localStorage.getItem('yourspace_demo_mode') === 'true';
             if (!isDemo) {
                 setSession(null);
                 setUser(null);
                 setProfile(null);
             }
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Demo login
  async function demoLogin() {
    localStorage.setItem('yourspace_demo_mode', 'true');
    setUser(DEMO_USER);
    setProfile(DEMO_PROFILE);
    setSession({ user: DEMO_USER } as Session);
    return { data: { user: DEMO_USER }, error: null };
  }

  // Auth methods
  async function signIn(email: string, password: string) {
    return socialApi.signIn(email, password);
  }

  async function signUp(email: string, password: string, fullName?: string) {
    return socialApi.signUp(email, password, fullName);
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
