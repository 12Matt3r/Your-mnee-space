// YourSpace Creative Labs - Artist Directory Page
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { searchArtists, getFeaturedArtists, artistsData, Artist } from '../data/artistsData'
import { useDemo } from '../hooks/useDemo'
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  UserPlusIcon,
  EyeIcon,
  MusicalNoteIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'

export const ArtistDirectoryPage = () => {
  const { isDemoMode } = useDemo()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>(artistsData)

  // Get all unique genres
  const allGenres = ['all', ...new Set(artistsData.flatMap(artist => artist.genres))]

  useEffect(() => {
    let results = artistsData

    // Search filter
    if (searchQuery.trim()) {
      results = searchArtists(searchQuery)
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      results = results.filter(artist => 
        artist.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase())
      )
    }

    // Featured filter
    if (showFeaturedOnly) {
      results = results.filter(artist => artist.featured)
    }

    setFilteredArtists(results)
  }, [searchQuery, selectedGenre, showFeaturedOnly])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Artist <span className="text-mnee-gold">Directory</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Discover talented creators in the YourSpace community. From electronic producers 
          to visual artists, find your new favorite artist.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-mnee-gray" />
            <input
              type="text"
              placeholder="Search artists, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-mnee-black/50 border border-mnee-slate rounded-lg text-white placeholder-mnee-gray focus:outline-none focus:border-mnee-gold focus:ring-2 focus:ring-mnee-gold/20 transition-all"
            />
          </div>

          {/* Genre Filter */}
          <div className="flex items-center space-x-3">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-mnee-gray" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-3 bg-mnee-black/50 border border-mnee-slate rounded-lg text-white focus:outline-none focus:border-mnee-gold transition-all"
            >
              {allGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Toggle */}
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showFeaturedOnly}
              onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              className="w-5 h-5 rounded border-mnee-slate bg-mnee-black/50 text-mnee-gold focus:ring-mnee-gold/20"
            />
            <span className="text-gray-300">Featured Only</span>
          </label>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400">
          Showing <span className="text-white font-semibold">{filteredArtists.length}</span> artists
        </p>
      </div>

      {/* Artists Grid */}
      {filteredArtists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <Link
              key={artist.id}
              to={`/artist/${artist.id}`}
              className="group bg-mnee-charcoal/50 backdrop-blur-sm border border-mnee-slate rounded-xl overflow-hidden hover:border-mnee-gold/50 transition-all duration-300"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-mnee-slate">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-mnee-gold to-mnee-blue p-1 flex-shrink-0">
                    <div className="w-full h-full rounded-full bg-mnee-black flex items-center justify-center">
                      {artist.avatar ? (
                        <img 
                          src={artist.avatar} 
                          alt={artist.displayName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-xl font-bold">
                          {artist.displayName.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-bold truncate group-hover:text-mnee-gold transition-colors">
                        {artist.displayName}
                      </h3>
                      {artist.verified && (
                        <span className="text-mnee-gold text-sm">✓</span>
                      )}
                    </div>
                    <p className="text-mnee-gray text-sm truncate">@{artist.username}</p>
                    {artist.realName && (
                      <p className="text-gray-500 text-xs truncate">{artist.realName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                  {artist.bio}
                </p>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {artist.genres.slice(0, 3).map((genre, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 bg-mnee-slate text-mnee-gray rounded"
                    >
                      {genre}
                    </span>
                  ))}
                  {artist.genres.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-mnee-slate text-mnee-gray rounded">
                      +{artist.genres.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-mnee-slate">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <UserPlusIcon className="h-4 w-4 mr-1" />
                      {artist.stats.followers.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {artist.stats.totalViews.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-mnee-gold">
                    {artist.stats.totalProjects} projects
                  </span>
                </div>
              </div>

              {/* Featured Badge */}
              {artist.featured && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 bg-gradient-to-r from-mnee-gold to-mnee-goldDark text-mnee-black px-2 py-1 rounded-full text-xs font-bold">
                    <StarIcon className="h-3 w-3" />
                    <span>Featured</span>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-mnee-gold to-mnee-blue rounded-full flex items-center justify-center mb-4">
            <MagnifyingGlassIcon className="h-8 w-8 text-mnee-black" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Artists Found</h3>
          <p className="text-gray-400 mb-4">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedGenre('all')
              setShowFeaturedOnly(false)
            }}
            className="text-mnee-gold hover:text-mnee-goldLight font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-mnee-charcoal to-mnee-black border border-mnee-slate rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Are You an Artist?</h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Join YourSpace and showcase your work to a community of passionate creators and fans. 
          Create your profile and start building your audience today.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-mnee-gold to-mnee-goldDark rounded-xl text-mnee-black font-semibold hover:shadow-mnee-gold transition-all duration-200"
        >
          <span>Create Your Profile</span>
        </Link>
      </div>
    </div>
  )
}

export default ArtistDirectoryPage;
