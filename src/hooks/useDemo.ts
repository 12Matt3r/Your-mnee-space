import { useDemo as useDemoContext, DemoProfile, DemoContent } from '../contexts/DemoContext'
import { useAuth } from './useAuth'
import { User } from '@supabase/supabase-js'

// Extended interface that combines both real and demo data
interface ExtendedUser extends User {
  display_name?: string;
  avatar_url?: string;
}

interface ExtendedProfile extends DemoProfile {
  isDemo?: boolean;
}

interface UseDemoReturn {
  isDemoMode: boolean;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  user: ExtendedUser | null;
  profile: ExtendedProfile | null;
  content: DemoContent[];
  addDemoContent: (content: Omit<DemoContent, 'id' | 'created_at' | 'profiles'>) => void;
  clearDemoContent: () => void;
  updateDemoProfile: (updates: Partial<DemoProfile>) => void;
  isAuthenticated: boolean;
}

export const useDemo = (): UseDemoReturn => {
  const demo = useDemoContext()
  const { user: realUser, profile: realProfile } = useAuth()

  // If in demo mode, use demo data
  if (demo.isDemoMode) {
    const demoUser: ExtendedUser | null = demo.demoUser ? {
      ...demo.demoUser,
      display_name: demo.demoProfile?.display_name,
      avatar_url: demo.demoProfile?.avatar_url
    } : null

    const demoProfile: ExtendedProfile = demo.demoProfile ? {
      ...demo.demoProfile,
      isDemo: true
    } : null

    return {
      isDemoMode: demo.isDemoMode,
      enableDemoMode: demo.enableDemoMode,
      disableDemoMode: demo.disableDemoMode,
      user: demoUser,
      profile: demoProfile,
      content: demo.demoContent,
      addDemoContent: demo.addDemoContent,
      clearDemoContent: demo.clearDemoContent,
      updateDemoProfile: demo.updateDemoProfile,
      isAuthenticated: !!demoUser
    }
  }

  // Otherwise use real authentication
  return {
    isDemoMode: false,
    enableDemoMode: demo.enableDemoMode,
    disableDemoMode: demo.disableDemoMode,
    user: realUser ? {
      ...realUser,
      display_name: realProfile?.display_name,
      avatar_url: realProfile?.avatar_url
    } : null,
    profile: realProfile ? {
      ...realProfile,
      isDemo: false
    } : null,
    content: [],
    addDemoContent: () => {},
    clearDemoContent: () => {},
    updateDemoProfile: () => {},
    isAuthenticated: !!realUser
  }
}

// Hook specifically for demo content
export const useDemoContent = () => {
  const { content, addDemoContent, clearDemoContent, isDemoMode } = useDemoContext()
  const { content: realContent, uploadContent } = { content: [], uploadContent: async () => null } // Placeholder for real content

  return {
    content: isDemoMode ? content : realContent,
    loading: false,
    uploading: false,
    fetchContent: () => {},
    uploadContent: async (params: any) => {
      if (isDemoMode) {
        addDemoContent({
          title: params.title,
          description: params.description || '',
          content_type: params.contentType,
          file_url: '',
          creator_id: 'demo-user-main',
          view_count: 0,
          like_count: 0
        })
        return { success: true }
      }
      return uploadContent(params)
    },
    deleteContent: () => {},
    likeContent: () => {}
  }
}
