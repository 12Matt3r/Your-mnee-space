// YourSpace Creative Labs - Artist Profile Page
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDemo } from '../hooks/useDemo'
import { getArtistById, getFeaturedArtists, Artist } from '../data/artistsData'
import { 
  MapPinIcon, 
  LinkIcon,
  PlayIcon,
  EyeIcon,
  HeartIcon,
  UserPlusIcon,
  CalendarIcon,
  MusicalNoteIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'

export const ArtistProfilePage = () => {
  const { artistId } = useParams()
  const { isDemoMode, updateDemoProfile } = useDemo()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'about'>('overview')

  useEffect(() => {
    if (artistId) {
      const foundArtist = getArtistById(artistId)
      setArtist(foundArtist || null)
    }
  }, [artistId])

  if (!artist) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-mnee-gold to-mnee-blue rounded-full flex items-center justify-center mb-4">
            <UserPlusIcon className="h-8 w-8 text-mnee-black" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Artist Not Found</h3>
          <p className="text-gray-400 mb-4">This artist profile doesn't exist yet.</p>
          <Link
            to="/discover"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-mnee-gold to-mnee-goldDark rounded-xl text-mnee-black font-semibold hover:shadow-mnee-gold transition-all duration-200"
          >
            <span>Discover Artists</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Artist Header */}
      <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-2xl overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-mnee-gold/30 via-mnee-blue/20 to-mnee-black relative">
          {artist.coverImage && (
            <img 
              src={artist.coverImage} 
              alt={`${artist.displayName} cover`}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-mnee-charcoal via-transparent to-transparent" />
          
          {/* Verified Badge */}
          {artist.verified && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-mnee-gold to-mnee-goldDark text-mnee-black px-3 py-1 rounded-full text-sm font-bold">
              ✓ Verified Artist
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="p-6 md:p-8 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative -mt-20 md:-mt-16">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-mnee-gold to-mnee-blue p-1">
                  <div className="w-full h-full rounded-full bg-mnee-black flex items-center justify-center overflow-hidden">
                    {artist.avatar ? (
                      <img 
                        src={artist.avatar} 
                        alt={artist.displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-4xl md:text-5xl font-bold">
                        {artist.displayName.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                {artist.featured && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-mnee-gold rounded-full flex items-center justify-center">
                    <span className="text-mnee-black text-lg">★</span>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {artist.displayName}
                </h1>
                <p className="text-mnee-gold mb-2">@{artist.username}</p>
                
                {/* Aliases */}
                {artist.aliases && artist.aliases.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {artist.aliases.map((alias, index) => (
                      <span 
                        key={index}
                        className="text-xs text-mnee-gray bg-mnee-slate px-2 py-1 rounded"
                      >
                        {alias}
                      </span>
                    ))}
                  </div>
                )}

                {/* Location & Social */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  {artist.location && (
                    <span className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {artist.location}
                    </span>
                  )}
                  <span className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Joined {new Date(artist.createdAt).getFullYear()}
                  </span>
                  
                  {/* Social Links */}
                  <div className="flex items-center space-x-3">
                    {artist.socialLinks.instagram && (
                      <a 
                        href={`https://instagram.com/${artist.socialLinks.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-mnee-gold transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                    {artist.socialLinks.soundcloud && (
                      <a 
                        href={artist.socialLinks.soundcloud}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-mnee-gold transition-colors"
                      >
                        SoundCloud
                      </a>
                    )}
                    {artist.socialLinks.bandcamp && (
                      <a 
                        href={artist.socialLinks.bandcamp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-mnee-gold transition-colors"
                      >
                        Bandcamp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-mnee-gold to-mnee-goldDark rounded-xl text-mnee-black font-semibold hover:shadow-mnee-gold transition-all duration-200">
                <UserPlusIcon className="h-5 w-5" />
                <span>Follow</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 bg-mnee-charcoal/50 border border-mnee-slate rounded-xl text-white font-medium hover:bg-mnee-slate transition-all duration-200">
                <LinkIcon className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-mnee-slate">
            {artist.genres.map((genre, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-mnee-gold/10 to-mnee-blue/10 border border-mnee-gold/20 rounded-full text-sm text-mnee-gold"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-mnee-gold">{artist.stats.totalProjects}</div>
          <div className="text-gray-400 text-sm">Projects</div>
        </div>
        <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-mnee-blue">{artist.stats.followers.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Followers</div>
        </div>
        <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-white">{artist.stats.totalViews.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Total Views</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-mnee-slate">
        {['overview', 'projects', 'about'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab 
                ? 'text-mnee-gold border-mnee-gold' 
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Bio */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">About</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {artist.longBio || artist.bio}
              </p>
            </div>

            {/* Featured Projects Preview */}
            <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Featured Projects</h3>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i}
                    className="aspect-video bg-gradient-to-br from-mnee-blue/20 to-mnee-gold/20 rounded-lg flex items-center justify-center"
                  >
                    <div className="text-center">
                      <PlayIcon className="h-8 w-8 text-mnee-gold mx-auto mb-2" />
                      <span className="text-gray-400 text-sm">Project {i}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Stats & Links */}
          <div className="space-y-6">
            <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Connect</h3>
              <div className="space-y-3">
                {artist.socialLinks.website && (
                  <a 
                    href={artist.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-mnee-black/50 rounded-lg hover:bg-mnee-slate transition-colors"
                  >
                    <ComputerDesktopIcon className="h-5 w-5 text-mnee-gold" />
                    <span className="text-gray-300">Website</span>
                  </a>
                )}
                {artist.socialLinks.soundcloud && (
                  <a 
                    href={artist.socialLinks.soundcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-mnee-black/50 rounded-lg hover:bg-mnee-slate transition-colors"
                  >
                    <MusicalNoteIcon className="h-5 w-5 text-mnee-gold" />
                    <span className="text-gray-300">SoundCloud</span>
                  </a>
                )}
                {artist.socialLinks.bandcamp && (
                  <a 
                    href={artist.socialLinks.bandcamp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-mnee-black/50 rounded-lg hover:bg-mnee-slate transition-colors"
                  >
                    <MusicalNoteIcon className="h-5 w-5 text-mnee-gold" />
                    <span className="text-gray-300">Bandcamp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl p-6">
          <div className="text-center py-12">
            <MusicalNoteIcon className="h-16 w-16 text-mnee-gold mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Projects Coming Soon</h3>
            <p className="text-gray-400">
              {artist.displayName}'s projects will be displayed here. Connect your game hub to populate this section.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">More About {artist.displayName}</h3>
          
          <div className="space-y-6">
            {/* Real Name */}
            {artist.realName && (
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Real Name</h4>
                <p className="text-white">{artist.realName}</p>
              </div>
            )}

            {/* Location */}
            {artist.location && (
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Location</h4>
                <p className="text-white flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1 text-mnee-gold" />
                  {artist.location}
                </p>
              </div>
            )}

            {/* Joined Date */}
            <div>
              <h4 className="text-sm text-gray-400 mb-1">Joined YourSpace</h4>
              <p className="text-white">{new Date(artist.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>

            {/* Verified Status */}
            <div>
              <h4 className="text-sm text-gray-400 mb-1">Status</h4>
              <p className="text-white">
                {artist.verified ? (
                  <span className="text-mnee-gold">✓ Verified Artist</span>
                ) : (
                  <span>Unverified Artist</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ArtistProfilePage;
