import React, { useState, useEffect } from 'react'
import { useAudio } from '../contexts/AudioContext'
import { useLikes } from '../contexts/LikeContext'
import { Button } from './ui/button'
import { musicService } from '../services'
import AddToPlaylistDropdown from './AddToPlaylistDropdown'
import { 
  Play, 
  Pause, 
  Heart, 
  MoreHorizontal,
  Clock,
  Music,
  Plus
} from 'lucide-react'
import { cn } from '../lib/utils'

function SongList({ songs: propSongs, playlist = null, className, showAddToPlaylist = false, onSongSelect, showRanking = false, currentSongId }) {
  const [songs, setSongs] = useState(propSongs || [])
  const [loading, setLoading] = useState(!propSongs)
  const { 
    currentSong, 
    isPlaying, 
    playSong, 
    togglePlayPause,
    formatTime 
  } = useAudio()
  const { isLiked, toggleLike } = useLikes()

  useEffect(() => {
    if (!propSongs) {
      loadSongs()
    }
  }, [])

  const loadSongs = async () => {
    try {
      setLoading(true)
      const data = await musicService.getSongsWithDetails()  // Get songs with artist names
      setSongs(data)
    } catch (error) {
      console.error('Failed to load songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlaySong = (song, index) => {
    if (onSongSelect) {
      onSongSelect(song, songs, index)
    } else if (currentSong?.id === song.id) {
      togglePlayPause()
    } else {
      playSong(song, songs, index)
    }
  }

  const isCurrentSong = (song) => {
    return currentSongId ? currentSongId === song.id : currentSong?.id === song.id
  }

  if (loading) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-lg">
            <div className="w-10 h-10 bg-muted animate-pulse rounded" />
            <div className="flex-1">
              <div className="h-4 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
            </div>
            <div className="w-12 h-4 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (songs.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No songs found</h3>
        <p className="text-muted-foreground">There are no songs to display.</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-1", className)}>
      {playlist && (
        <div className="flex items-center gap-2 mb-4 p-4 border-b">
          <div className="w-16 h-16 bg-linear-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
            <Music className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{playlist.name}</h2>
            <p className="text-muted-foreground">
              {songs.length} song{songs.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
      
      {songs.map((song, index) => (
        <div
          key={song.id}
          className={cn(
            "group flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer",
            isCurrentSong(song) && "bg-accent"
          )}
          onClick={() => handlePlaySong(song, index)}
        >
          {/* Play Button / Track Number */}
          <div className="w-10 h-10 flex items-center justify-center">
            {isCurrentSong(song) ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlayPause()
                }}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <>
                <span className="text-sm text-muted-foreground group-hover:hidden">
                  {index + 1}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hidden group-hover:flex"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlaySong(song, index)
                  }}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Song Cover */}
          <div className="w-10 h-10 bg-muted rounded flex items-center justify-center overflow-hidden shrink-0">
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

          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              "font-medium text-sm truncate",
              isCurrentSong(song) && "text-primary"
            )}>
              {song.title}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {song.artist_name || 'Unknown Artist'}
            </p>
          </div>

          {/* Album */}
          <div className="hidden md:block flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">
              {song.genre || 'Unknown Genre'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {showRanking && (
              <div className="w-6 text-xs text-muted-foreground font-mono">
                #{index + 1}
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                isLiked(song.id) && "opacity-100 text-red-500"
              )}
              onClick={(e) => {
                e.stopPropagation()
                toggleLike(song.id)
              }}
            >
              <Heart className={cn(
                "h-4 w-4",
                isLiked(song.id) && "fill-current"
              )} />
            </Button>
            
            {showAddToPlaylist && (
              <AddToPlaylistDropdown songId={song.id}>
                <button 
                  className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </AddToPlaylistDropdown>
            )}
            
            {/* Duration */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-[50px] justify-end">
              <Clock className="h-3 w-3" />
              <span>{formatTime(song.duration)}</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SongList