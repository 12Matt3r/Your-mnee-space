// YourSpace Creative Labs - Profile Page
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useContent } from '../../hooks/useContent'
import { 
  CogIcon,
  UserPlusIcon,
  GiftIcon,
  CalendarIcon,
  MapPinIcon,
  LinkIcon,
  Squares2X2Icon,
  ViewColumnsIcon
} from '@heroicons/react/24/outline'
import { formatDate } from '../../lib/utils'
import { BioModule } from '../../components/profile/modules/BioModule'
import { PortfolioModule } from '../../components/profile/modules/PortfolioModule'
import { TippingModule } from '../../components/profile/modules/TippingModule'
import { MentorshipModule } from '../../components/profile/modules/MentorshipModule'
import toast from 'react-hot-toast'

export const ProfilePage = () => {
  const { username } = useParams()
  const { profile: currentUserProfile, user } = useAuth()
  const { content, loading, fetchContent } = useContent()
  const [profileData, setProfileData] = useState<any>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  // New Modular State
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid')
  const [modules, setModules] = useState<string[]>(['bio', 'tipping', 'mentorship', 'portfolio'])

  // Simulated Stats
  const [stats, setStats] = useState({
    totalContent: 0,
    totalViews: 0,
    totalLikes: 0,
    followers: 0,
    following: 0
  })

  useEffect(() => {
    const isOwn = !username || username === currentUserProfile?.username
    setIsOwnProfile(isOwn)

    if (isOwn && currentUserProfile) {
      setProfileData(currentUserProfile)
      fetchContent({ userId: currentUserProfile.id })
    } else {
      setProfileData({
        username: username || 'unknown',
        display_name: 'Creative Artist',
        bio: 'Digital artist creating vaporwave and cyberpunk aesthetics. Always experimenting with new techniques and technologies.',
        avatar_url: null,
        background_url: null,
        website: 'https://example.com',
        location: 'Neo Tokyo',
        subscription_tier: 'creator',
        neon_theme: 'purple',
        created_at: '2024-01-15T00:00:00Z'
      })
    }

    setStats({
      totalContent: 42,
      totalViews: 15420,
      totalLikes: 892,
      followers: 1234,
      following: 567
    })
  }, [username, currentUserProfile, fetchContent])

  const handleTip = (amount: number) => {
    if (amount === 0) {
      toast('Custom tip amount coming soon!', { icon: '💸' })
    } else {
      toast.success(`Sent $${amount} tip to ${profileData.display_name}!`)
    }
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading-spinner w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden group/header">
        {/* Background Cover */}
        <div className="h-48 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative">
          {profileData.background_url && (
            <img 
              src={profileData.background_url} 
              alt="Profile background"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {isOwnProfile && (
            <button className="absolute top-4 right-4 bg-black/50 p-2 rounded-lg text-white opacity-0 group-hover/header:opacity-100 transition-all">
              Change Cover
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="p-8 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative -mt-20 md:-mt-16 group/avatar">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-1">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                    {profileData.avatar_url ? (
                      <img 
                        src={profileData.avatar_url} 
                        alt={profileData.display_name}
                        className="w-28 h-28 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-4xl font-bold">
                        {(profileData.display_name || profileData.username).charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                {isOwnProfile && (
                  <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-all text-white text-xs">
                    Edit
                  </button>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-1">
                  {profileData.display_name || profileData.username}
                </h1>
                <p className="text-purple-300 mb-2">@{profileData.username}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  {profileData.location && (
                    <span className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {profileData.location}
                    </span>
                  )}
                  {profileData.website && (
                    <a 
                      href={profileData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-purple-300 transition-colors"
                    >
                      <LinkIcon className="h-4 w-4 mr-1" />
                      Website
                    </a>
                  )}
                  <span className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Joined {formatDate(profileData.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 mt-6 md:mt-0">
              {isOwnProfile ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLayoutMode(layoutMode === 'grid' ? 'list' : 'grid')}
                    className="p-3 bg-black/30 border border-purple-500/30 rounded-xl text-purple-300 hover:bg-purple-500/20"
                    title="Toggle Layout"
                  >
                    {layoutMode === 'grid' ? <ViewColumnsIcon className="h-5 w-5" /> : <Squares2X2Icon className="h-5 w-5" />}
                  </button>
                  <button className="flex items-center space-x-2 px-6 py-3 bg-purple-500/20 border border-purple-400/50 rounded-xl text-purple-300 font-medium hover:bg-purple-500/30 transition-all">
                    <CogIcon className="h-5 w-5" />
                    <span>Customize</span>
                  </button>
                </div>
              ) : (
                <>
                  <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all neon-glow">
                    <UserPlusIcon className="h-5 w-5" />
                    <span>Support</span>
                  </button>
                  <button className="flex items-center space-x-2 px-6 py-3 bg-black/30 border border-purple-500/30 rounded-xl text-purple-300 font-medium hover:bg-purple-500/20 transition-all">
                    <GiftIcon className="h-5 w-5" />
                    <span>Tip</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats - Anti-Analytics Pattern (Private Only) */}
      {isOwnProfile && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-cyan-400">{stats.totalContent}</div>
            <div className="text-gray-400 text-sm">Content</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.totalViews.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Total Reach</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-pink-400">{stats.totalLikes.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Appreciations</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.followers.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Supporters</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-orange-400">{stats.following.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Supporting</div>
          </div>
        </div>
      )}

      {/* Modular Content Area */}
      <div className={`grid gap-6 ${layoutMode === 'grid' ? 'grid-cols-1 md:grid-cols-12' : 'grid-cols-1'}`}>

        {/* Left Column (Bio & Tipping) */}
        <div className={`space-y-6 ${layoutMode === 'grid' ? 'md:col-span-4' : ''}`}>
          {modules.includes('bio') && (
            <BioModule
              content={profileData.bio}
              editable={isOwnProfile}
              onEdit={() => toast('Edit Bio Coming Soon', { icon: '📝' })}
            />
          )}

          {modules.includes('tipping') && (
            <TippingModule
              creatorName={profileData.display_name || profileData.username}
              onTip={handleTip}
            />
          )}

          {modules.includes('mentorship') && (
            <MentorshipModule
              creatorName={profileData.display_name || profileData.username}
            />
          )}
        </div>

        {/* Right Column (Portfolio/Content) */}
        <div className={`${layoutMode === 'grid' ? 'md:col-span-8' : ''}`}>
          {modules.includes('portfolio') && (
            <PortfolioModule
              items={content}
              limit={layoutMode === 'grid' ? 6 : 12}
            />
          )}
        </div>

      </div>
    </div>
  )
}