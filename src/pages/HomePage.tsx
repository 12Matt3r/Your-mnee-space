// YourSpace Creative Labs - Home Page with Real Data
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDemo, useDemoContent } from '../hooks/useDemo'
import { useAnalytics } from '../hooks/useAnalytics'
import { 
  PlusIcon, 
  FireIcon, 
  SparklesIcon,
  EyeIcon,
  HeartIcon,
  UserGroupIcon,
  HomeIcon
} from '@heroicons/react/24/outline'
import { formatRelativeTime } from '../lib/utils'
import { VirtualRoom } from '../components/room/VirtualRoom'
import { EPKComputerModal } from '../components/room/EPKComputerModal'
import { DemoBanner } from '../components/demo/DemoBanner'

export const HomePage = () => {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { isDemoMode = false, demoProfile = null, demoContent = [] } = useDemo() || {}
  const { content: demoUserContent = [], loading: demoLoading = false } = useDemoContent() || {}
  const { content: realContent, loading: realLoading, fetchContent } = { content: [], loading: false, fetchContent: () => {} }
  const { stats = {}, fetchTrendingContent = async () => [] } = useAnalytics() || {}
  const [featuredContent, setFeaturedContent] = useState<any[]>([])
  const [showEPKModal, setShowEPKModal] = useState(false)

  // Use demo or real data
  const activeUser = isDemoMode ? demoProfile : profile
  const activeContent = isDemoMode ? demoUserContent : realContent
  const activeLoading = isDemoMode ? demoLoading : realLoading

  useEffect(() => {
    // Demo mode: load demo content
    if (isDemoMode) {
      setFeaturedContent(demoContent.slice(0, 3))
      return
    }

    // Real mode: fetch user's recent content for activity feed (only if authenticated)
    if (profile) {
      fetchContent({ userId: profile.id, limit: 5 })
    }
    
    // Fetch trending content for featured section
    const loadTrending = async () => {
      try {
        const trending = await fetchTrendingContent()
        setFeaturedContent((trending || []).slice(0, 3))
      } catch (error) {
        console.log('Error loading trending content:', error)
        setFeaturedContent([])
      }
    }
    loadTrending()
  }, [profile, isDemoMode, demoContent])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const handleOpenEPK = () => {
    setShowEPKModal(true)
  }

  // Anonymous user experience
  if (!user) {
    return (
      <div className="space-y-8">
        {/* Hero Section for Anonymous Users */}
        <div className="bg-gradient-to-r from-mnee-charcoal to-mnee-black backdrop-blur-sm border border-mnee-slate rounded-2xl p-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to <span className="text-mnee-gold">YourSpace</span>
          </h1>
          <p className="text-gray-300 text-xl mb-6 max-w-3xl mx-auto">
            Discover amazing artists, explore creative content, and find your next collaboration. 
            Powered by <span className="text-mnee-gold">MNEE</span> - The World's Fastest Stablecoin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-mnee-gold to-mnee-goldDark rounded-xl text-mnee-black font-semibold hover:shadow-mnee-gold transition-all duration-200"
            >
              Join YourSpace
            </Link>
            <Link
              to="/discover-artists"
              className="px-8 py-4 bg-black/20 border border-mnee-blue/30 rounded-xl text-mnee-blue font-semibold hover:bg-mnee-blue/20 transition-all duration-200"
            >
              Explore Artists
            </Link>
          </div>
        </div>

        {/* Featured Content */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FireIcon className="h-6 w-6 text-orange-400 mr-2" />
              Trending Now
            </h2>
            <Link to="/discover" className="text-mnee-gold hover:text-mnee-goldLight font-medium">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredContent.length > 0 ? featuredContent.map((item) => (
              <div
                key={item.id}
                className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl overflow-hidden hover:border-mnee-gold/40 transition-all duration-200 group"
              >
                <div className="aspect-video bg-gradient-to-br from-mnee-blue/20 to-mnee-gold/20 relative overflow-hidden">
                  {item.file_url && (
                    <img 
                      src={item.file_url} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg truncate">{item.title}</h3>
                    <p className="text-gray-300 text-sm">by {item.profiles?.display_name || item.profiles?.username}</p>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-black/50 rounded-full text-xs text-white capitalize">
                      {item.content_type}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {item.view_count?.toLocaleString() || 0}
                      </span>
                      <span className="flex items-center">
                        <HeartIcon className="h-4 w-4 mr-1" />
                        {item.like_count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-400">Loading amazing content...</p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-mnee-charcoal to-mnee-black backdrop-blur-sm border border-mnee-slate rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Create?</h2>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
            Join thousands of creators sharing their passion, collaborating on projects, and building their audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-6 py-3 bg-gradient-to-r from-mnee-gold to-mnee-goldDark rounded-xl text-mnee-black font-semibold hover:shadow-mnee-gold transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5 inline mr-2" />
              Start Creating
            </Link>
            <Link
              to="/discover-artists"
              className="px-6 py-3 bg-black/20 border border-mnee-blue/30 rounded-xl text-mnee-blue font-semibold hover:bg-mnee-blue/20 transition-all duration-200"
            >
              <SparklesIcon className="h-5 w-5 inline mr-2" />
              Discover Artists
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated user experience (existing code)
  return (
    <div className="space-y-8">
      {/* Demo Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-mnee-gold/10 to-mnee-blue/10 border border-mnee-gold/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-mnee-gold to-mnee-blue rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-4 w-4 text-mnee-black" />
              </div>
              <div>
                <span className="text-mnee-gold font-medium">Demo Mode Active</span>
                <span className="text-gray-400 text-sm ml-2">- Experience YourSpace with sample content</span>
              </div>
            </div>
            <Link
              to="/create"
              className="text-mnee-gold hover:text-mnee-goldLight text-sm font-medium"
            >
              Add Your Content →
            </Link>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-mnee-charcoal to-mnee-black backdrop-blur-sm border border-mnee-slate rounded-2xl p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-mnee-gold/10 rounded-full px-3 py-1 mb-3 border border-mnee-gold/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-mnee-gold">Powered by MNEE</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {getGreeting()}, {profile?.display_name || profile?.username}!
            </h1>
            <p className="text-gray-400 text-lg">
              Your creative universe awaits. Build, collaborate, and grow.
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/create"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-mnee-gold to-mnee-goldDark rounded-xl text-mnee-black font-semibold hover:shadow-mnee-gold transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create</span>
            </Link>
            <Link
              to="/collaborate"
              className="flex items-center space-x-2 px-6 py-3 bg-black/20 border border-mnee-blue/30 rounded-xl text-mnee-blue font-semibold hover:bg-mnee-blue/20 transition-all duration-200"
            >
              <UserGroupIcon className="h-5 w-5" />
              <span>Collaborate</span>
            </Link>
          </div>
        </div>

        {/* Your Creative Journey */}
        <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-mnee-slate">
          <div className="text-center group cursor-default">
            <div className="text-3xl font-bold text-mnee-blue group-hover:scale-110 transition-transform">{stats.totalViews?.toLocaleString() || 0}</div>
            <div className="text-gray-400 text-sm">Total Reach</div>
          </div>
          <div className="text-center group cursor-default">
            <div className="text-3xl font-bold text-mnee-gold group-hover:scale-110 transition-transform">{stats.totalLikes?.toLocaleString() || 0}</div>
            <div className="text-gray-400 text-sm">Room Visits</div>
          </div>
          <div className="text-center group cursor-default">
            <div className="text-3xl font-bold text-white group-hover:scale-110 transition-transform">{stats.totalCollaborations || 0}</div>
            <div className="text-gray-400 text-sm">Collaborations</div>
          </div>
        </div>
      </div>

      {/* Virtual Room */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <HomeIcon className="h-6 w-6 text-blue-400 mr-2" />
            Your Bedroom
          </h2>
          <div className="flex space-x-4">
            {/* Jump Back In Button */}
            <button
              onClick={() => navigate('/rooms/manage')}
              className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <span>Jump back in</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </button>
            <button
              onClick={() => navigate('/studio', { state: { tab: 'epk' } })}
              className="text-mnee-gold hover:text-mnee-goldLight font-medium"
            >
              Manage EPK
            </button>
          </div>
        </div>

        <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-2xl p-6">
          <VirtualRoom 
            onOpenEPK={handleOpenEPK}
            className="mb-4"
          />
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Click on objects in your room to interact with them. Your EPK computer allows you to create and manage your Electronic Press Kit.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Content */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FireIcon className="h-6 w-6 text-orange-400 mr-2" />
            Trending Now
          </h2>
          <Link to="/discover" className="text-mnee-gold hover:text-mnee-goldLight font-medium">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredContent.length > 0 ? featuredContent.map((item) => (
            <div
              key={item.id}
              className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl overflow-hidden hover:border-mnee-gold/40 transition-all duration-200 group"
            >
              <div className="aspect-video bg-gradient-to-br from-mnee-blue/20 to-mnee-gold/20 relative overflow-hidden">
                {item.file_url && (
                  <img 
                    src={item.file_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg truncate">{item.title}</h3>
                  <p className="text-gray-300 text-sm">by {item.profiles?.display_name || item.profiles?.username}</p>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-1 bg-black/50 rounded-full text-xs text-white capitalize">
                    {item.content_type}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {item.view_count?.toLocaleString() || 0}
                    </span>
                    <span className="flex items-center">
                      <HeartIcon className="h-4 w-4 mr-1" />
                      {item.like_count || 0}
                    </span>
                  </div>
                  <button className="text-mnee-gold hover:text-mnee-goldLight transition-colors">
                    <HeartIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-400">No trending content available yet. Be the first to create!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <SparklesIcon className="h-6 w-6 text-yellow-400 mr-2" />
            Your Recent Activity
          </h2>
        </div>

        <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl p-6">
          {activeLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading-spinner w-8 h-8" />
            </div>
          ) : activeContent.length > 0 ? (
            <div className="space-y-4">
              {activeContent.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-mnee-charcoal/50 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-mnee-gold to-mnee-blue rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {item.content_type.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{item.title}</h4>
                    <p className="text-gray-400 text-sm">
                      {item.description || 'No description'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">
                      {formatRelativeTime(item.created_at)}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{item.view_count || 0} views</span>
                      <span>•</span>
                      <span>{item.like_count || 0} likes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <PlusIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Start Creating</h3>
              <p className="text-gray-400 mb-4">
                Upload your first piece and begin your creative journey
              </p>
              <Link
                to="/create"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-mnee-gold to-mnee-goldDark rounded-xl text-mnee-black font-semibold hover:shadow-mnee-gold transition-all duration-200"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Create Now</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* EPK Computer Modal */}
      <EPKComputerModal 
        isOpen={showEPKModal}
        onClose={() => setShowEPKModal(false)}
      />
    </div>
  )
}