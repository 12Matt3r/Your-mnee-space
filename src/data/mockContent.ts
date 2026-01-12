// Mock Content for Demo
import { Post } from '../lib/supabase';

export const MOCK_POSTS = [
  {
    id: 'post-1',
    user_id: 'user-2',
    content: "Just dropped my new synthwave track 'Neon Nights' 🎵 #synthwave #music #producer",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    updated_at: new Date().toISOString(),
    is_locked: false,
    profiles: {
      user_id: 'user-2',
      full_name: 'Alex Synth',
      username: 'alex_synth',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
      wallet_address: '0x1234567890123456789012345678901234567890'
    }
  },
  {
    id: 'post-2',
    user_id: 'user-3',
    content: "Exclusive access to my 3D asset pack for subscribers! 🎨 Unlock to download. #3d #blender #art",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    updated_at: new Date().toISOString(),
    is_locked: true,
    unlock_price: 5,
    profiles: {
      user_id: 'user-3',
      full_name: 'Creative Studio',
      username: 'creative_studio',
      avatar_url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop',
      wallet_address: '0x9876543210987654321098765432109876543210'
    }
  },
  {
    id: 'post-3',
    user_id: 'user-4',
    content: "Working on a new AI agent that helps with songwriting. Thoughts? 🤖 Poll: What feature is most important?",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    updated_at: new Date().toISOString(),
    is_locked: false,
    poll: {
      question: "Best AI Feature?",
      total_votes: 256,
      options: [
        { id: '1', text: 'Lyrics Generation', votes: 120 },
        { id: '2', text: 'Melody Suggestion', votes: 80 },
        { id: '3', text: 'Chord Progressions', votes: 56 }
      ]
    },
    profiles: {
      user_id: 'user-4',
      full_name: 'Sarah Code',
      username: 'sarah_dev',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      wallet_address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
    }
  },
   {
    id: 'post-4',
    user_id: 'user-5',
    content: "Check out this amazing view from my virtual room! 🌌 \n\n![Virtual Room](https://images.unsplash.com/photo-1614726365723-49cfae9f6585?w=800&q=80)",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    updated_at: new Date().toISOString(),
    is_locked: false,
    profiles: {
      user_id: 'user-5',
      full_name: 'VR Explorer',
      username: 'vr_explorer',
      avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop'
    }
  }
];

export const MOCK_DISCOVERY_CONTENT = [
  {
    id: 'd1',
    title: 'Neon City Ambience',
    description: 'A 1 hour loop of cyberpunk city sounds for focus.',
    content_type: 'audio',
    file_url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80', // Placeholder image for audio
    view_count: 12500,
    like_count: 3400,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    vibe_tags: ['chill', 'futuristic']
  },
  {
    id: 'd2',
    title: 'Abstract Fluid Art',
    description: 'High resolution digital painting created with generative AI.',
    content_type: 'image',
    file_url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
    view_count: 8900,
    like_count: 2100,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    vibe_tags: ['dreamy', 'energetic']
  },
  {
    id: 'd3',
    title: 'Character Rig Demo',
    description: 'Showcase of the new rigging system for game characters.',
    content_type: 'video',
    file_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    view_count: 5600,
    like_count: 1200,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    vibe_tags: ['code', 'tech']
  },
   {
    id: 'd4',
    title: 'Lofi Study Beats',
    description: 'Relaxing beats to code to.',
    content_type: 'audio',
    file_url: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=800&q=80',
    view_count: 45000,
    like_count: 12000,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    vibe_tags: ['chill', 'retro']
  },
  {
    id: 'd5',
    title: 'Cyberpunk Girl',
    description: 'Digital illustration.',
    content_type: 'image',
    file_url: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?w=800&q=80',
    view_count: 3200,
    like_count: 800,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    vibe_tags: ['futuristic', 'dark']
  }
];

export const MOCK_ARTISTS = [
    {
        id: 'a1',
        full_name: 'Neon Artist',
        username: 'neon_artist',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
        bio: 'Creating synthwave music and art.',
        follower_count: 1200
    },
    {
        id: 'a2',
        full_name: 'Creative Studio',
        username: 'creative_studio',
        avatar_url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop',
        bio: '3D assets and game dev tutorials.',
        follower_count: 850
    },
     {
        id: 'a3',
        full_name: 'Sarah Code',
        username: 'sarah_dev',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        bio: 'Building the future of web3 social.',
        follower_count: 2300
    }
]
