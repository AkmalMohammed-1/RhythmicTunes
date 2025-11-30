import React, { useState, useEffect } from 'react'
import { musicService } from '../services'
import { usePlaylist } from '../contexts/PlaylistContext'
import { useLikes } from '../contexts/LikeContext'
import SongList from '../components/SongList'
import PlayButton from '../components/PlayButton'
import AddToPlaylistDropdown from '../components/AddToPlaylistDropdown'
import { Button } from '../components/ui/button'
import { 
  Play,
  Music,
  TrendingUp,
  Clock,
  Heart,
  Plus
} from 'lucide-react'
import { cn } from '../lib/utils'

export function HomePage() {
  const [recentSongs, setRecentSongs] = useState([])
  const [popularSongs, setPopularSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const { playlists } = usePlaylist()
  const { isLiked, toggleLike } = useLikes()

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      setLoading(true)
      
      // Load songs and sort by different criteria
      const songs = await musicService.getSongsWithDetails()  // Get songs with artist/album names

      // Get recent songs (last 6)
      const recent = songs.slice(0, 6)
      
      // Get popular songs (sort by play_count)
      const popular = [...songs]
        .sort((a, b) => (b.play_count || 0) - (a.play_count || 0))
        .slice(0, 6)

      setRecentSongs(recent)
      setPopularSongs(popular)
      
    } catch (error) {
      console.error('Failed to load home data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded w-1/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
          </div>
          
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg space-y-3">
                <div className="w-full aspect-square bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Good {getGreeting()}</h1>
        <p className="text-muted-foreground">Discover and play your favorite music</p>
      </div>

      {/* Quick Play Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recently Added
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentSongs.map((song, index) => (
            <div 
              key={song.id} 
              className="group relative p-4 bg-card border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center overflow-hidden shrink-0">
                  {song.cover_url ? (
                    <img 
                      src={song.cover_url} 
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {song.title?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{song.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {song.artist_name || 'Unknown Artist'}
                  </p>
                </div>
                
                <PlayButton 
                  song={song}
                  songs={recentSongs}
                  index={index}
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Tracks */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Popular Right Now
          </h2>
          <Button variant="ghost" size="sm">
            See all
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularSongs.map((song, index) => (
            <div 
              key={song.id} 
              className="group relative bg-card border rounded-lg p-4 hover:bg-accent/50 transition-colors"
            >
              {/* Song Cover */}
              <div className="relative mb-4">
                <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden">
                  {song.cover_url ? (
                    <img 
                      src={song.cover_url} 
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Music className="h-8 w-8 text-primary" />
                    </div>
                  )}
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <button 
                    className={cn(
                      "inline-flex items-center justify-center h-8 w-8 rounded-md transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg",
                      isLiked(song.id) 
                        ? "bg-red-500 text-white opacity-100" 
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 opacity-0 group-hover:opacity-100"
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleLike(song.id)
                    }}
                  >
                    <Heart className={cn(
                      "h-3 w-3",
                      isLiked(song.id) && "fill-current"
                    )} />
                  </button>
                  
                  <AddToPlaylistDropdown songId={song.id}>
                    <button 
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </AddToPlaylistDropdown>
                  
                  <PlayButton 
                    song={song}
                    songs={popularSongs}
                    index={index}
                    size="sm"
                    className="h-8 w-8 p-0 bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg"
                  />
                </div>
              </div>
              
              {/* Song Info */}
              <div className="space-y-1">
                <h3 className="font-medium text-sm truncate">{song.title}</h3>
                <p className="text-xs text-muted-foreground truncate">
                  {song.artist_name || 'Unknown Artist'}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>{song.play_count?.toLocaleString() || 0} plays</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Your Playlists */}
      {playlists.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Your Playlists
            </h2>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create playlist
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {playlists.map((playlist) => (
              <div 
                key={playlist.id}
                className="group p-4 bg-card border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="relative mb-3">
                  <div className="w-full aspect-square bg-linear-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                    {playlist.cover_url ? (
                      <img 
                        src={playlist.cover_url} 
                        alt={playlist.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Music className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  
                  <PlayButton 
                    song={null}
                    variant="default"
                    size="sm"
                    className="absolute bottom-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  />
                </div>
                
                <div>
                  <h3 className="font-medium text-sm truncate">{playlist.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {playlist.song_ids?.length || 0} songs
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Songs Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Music className="h-5 w-5" />
          All Songs
        </h2>
        
        <SongList showAddToPlaylist={true} />
      </section>
    </div>
  )
}

// Helper function to get greeting based on time
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

export default HomePage