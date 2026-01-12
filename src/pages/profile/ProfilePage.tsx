// YourSpace Creative Labs - Profile Page
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useDemo } from '../../hooks/useDemo'
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
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { formatDate } from '../../lib/utils'
import { BioModule } from '../../components/profile/modules/BioModule'
import { PortfolioModule } from '../../components/profile/modules/PortfolioModule'
import { TippingModule } from '../../components/profile/modules/TippingModule'
import { MentorshipModule } from '../../components/profile/modules/MentorshipModule'
import { TopEightWidget } from '../../components/profile/widgets/TopEightWidget'
import { GuestbookWidget } from '../../components/profile/widgets/GuestbookWidget'
import toast from 'react-hot-toast'

// Sortable Wrapper Component
const SortableItem = ({ id, children, disabled }: { id: string, children: React.ReactNode, disabled?: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={disabled ? '' : 'cursor-grab active:cursor-grabbing touch-none'}>
      {children}
    </div>
  );
};

export const ProfilePage = () => {
  const { username } = useParams()
  const { profile: currentUserProfile, user } = useAuth()
  const { isDemoMode, demoProfile, updateDemoProfile } = useDemo()
  const [profileData, setProfileData] = useState<any>(null)
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  // New Modular State
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid')

  // Widget Order State
  const [leftColumnWidgets, setLeftColumnWidgets] = useState(['bio', 'tipping', 'mentorship', 'top8', 'guestbook'])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLeftColumnWidgets((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Simulated Stats
  const [stats, setStats] = useState({
    totalContent: 0,
    totalViews: 0,
    totalLikes: 0,
    followers: 0,
    following: 0
  })

  // Content for portfolio
  const [content, setContent] = useState<any[]>([])

  useEffect(() => {
    // Demo mode handling
    if (isDemoMode && demoProfile) {
      const isOwn = !username || username === demoProfile.username
      setIsOwnProfile(isOwn)
      setProfileData(demoProfile)
      setStats({
        totalContent: 5,
        totalViews: 15420,
        totalLikes: 892,
        followers: 1234,
        following: 567
      })
      return
    }

    // Real mode handling
    const isOwn = !username || username === currentUserProfile?.username
    setIsOwnProfile(isOwn)

    if (isOwn && currentUserProfile) {
      setProfileData(currentUserProfile)
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
  }, [username, currentUserProfile, isDemoMode, demoProfile])

  const handleTip = (amount: number) => {
    if (amount === 0) {
      toast('Custom tip amount coming soon!', { icon: '💰' })
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
      <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-2xl overflow-hidden group/header">
        {/* Background Cover */}
        <div className="h-48 bg-gradient-to-r from-mnee-gold via-mnee-blue to-mnee-black relative">
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
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-mnee-gold to-mnee-blue p-1">
                  <div className="w-full h-full rounded-full bg-mnee-black flex items-center justify-center overflow-hidden">
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
                      className="flex items-center hover:text-mnee-gold transition-colors"
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
                    className="p-3 bg-mnee-charcoal/50 border border-mnee-slate rounded-xl text-mnee-gray hover:bg-mnee-slate transition-all"
                    title="Toggle Layout"
                  >
                    {layoutMode === 'grid' ? <ViewColumnsIcon className="h-5 w-5" /> : <Squares2X2Icon className="h-5 w-5" />}
                  </button>
                  <button className="flex items-center space-x-2 px-6 py-3 bg-mnee-gold/20 border border-mnee-gold/50 rounded-xl text-mnee-gold font-medium hover:bg-mnee-gold/30 transition-all">
                    <CogIcon className="h-5 w-5" />
                    <span>Customize</span>
                  </button>
                </div>
              ) : (
                <>
                  <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-mnee-gold to-mnee-goldDark rounded-xl text-mnee-black font-medium hover:shadow-mnee-gold transition-all">
                    <UserPlusIcon className="h-5 w-5" />
                    <span>Support</span>
                  </button>
                  <button className="flex items-center space-x-2 px-6 py-3 bg-mnee-charcoal/50 border border-mnee-blue/30 rounded-xl text-mnee-blue font-medium hover:bg-mnee-blue/20 transition-all">
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
          <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-mnee-blue">{stats.totalContent}</div>
            <div className="text-gray-400 text-sm">Content</div>
          </div>
          <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-mnee-gold">{stats.totalViews.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Total Reach</div>
          </div>
          <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white">{stats.totalLikes.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Appreciations</div>
          </div>
          <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-mnee-gold">{stats.followers.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Supporters</div>
          </div>
          <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-mnee-blue">{stats.following.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Supporting</div>
          </div>
        </div>
      )}

      {/* Modular Content Area */}
      <div className={`grid gap-6 ${layoutMode === 'grid' ? 'grid-cols-1 md:grid-cols-12' : 'grid-cols-1'}`}>

        {/* Left Column (Sortable Widgets) */}
        <div className={`space-y-6 ${layoutMode === 'grid' ? 'md:col-span-4' : ''}`}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={leftColumnWidgets}
              strategy={verticalListSortingStrategy}
              disabled={!isOwnProfile} // Only allow dragging if own profile
            >
              {leftColumnWidgets.map((widgetId) => (
                <SortableItem key={widgetId} id={widgetId} disabled={!isOwnProfile}>
                  {widgetId === 'bio' && (
                    <BioModule
                      content={profileData.bio}
                      editable={isOwnProfile}
                      onEdit={() => toast('Edit Bio Coming Soon', { icon: '✨' })}
                    />
                  )}
                  {widgetId === 'tipping' && (
                    <TippingModule
                      creatorName={profileData.display_name || profileData.username}
                      onTip={handleTip}
                    />
                  )}
                  {widgetId === 'mentorship' && (
                    <MentorshipModule
                      creatorName={profileData.display_name || profileData.username}
                    />
                  )}
                  {widgetId === 'top8' && <TopEightWidget />}
                  {widgetId === 'guestbook' && <GuestbookWidget />}
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {/* Right Column (Portfolio/Content - currently fixed) */}
        <div className={`${layoutMode === 'grid' ? 'md:col-span-8' : ''}`}>
            <PortfolioModule
              items={content}
              limit={layoutMode === 'grid' ? 6 : 12}
            />
        </div>

      </div>
    </div>
  )
}