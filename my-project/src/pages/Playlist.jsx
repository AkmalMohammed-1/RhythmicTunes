import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { userService, musicService } from '../services'
import SongList from '../components/SongList'
import { Button } from '../components/ui/button'
import { 
  ListMusic, 
  Play, 
  Heart, 
  Share, 
  MoreHorizontal, 
  Edit,
  Trash2,
  ArrowLeft,
  Plus
} from 'lucide-react'

export function Playlist() {
  const { id } = useParams()
  const { user } = useAuth()
  const [playlist, setPlaylist] = useState(null)
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadPlaylist()
  }, [id])

  const loadPlaylist = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load playlist details
      const playlistData = await userService.getPlaylistById(id)
      setPlaylist(playlistData)
      
      // Load songs in playlist
      if (playlistData.song_ids && playlistData.song_ids.length > 0) {
        const allSongs = await musicService.getSongsWithDetails()
        const playlistSongs = playlistData.song_ids
          .map(songId => allSongs.find(song => song.id == songId))
          .filter(Boolean) // Remove any null/undefined songs
        setSongs(playlistSongs)
      } else {
        setSongs([])
      }
    } catch (error) {
      console.error('Failed to load playlist:', error)
      setError('Failed to load playlist')
    } finally {
      setLoading(false)
    }
  }

  const deletePlaylist = async () => {
    if (!playlist || playlist.user_id !== user?.id) return
    
    if (window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
      try {
        await userService.deletePlaylist(playlist.id)
        // Navigate back to library or home
        window.location.href = '/library'
      } catch (error) {
        console.error('Failed to delete playlist:', error)
      }
    }
  }

  const removeSongFromPlaylist = async (songId) => {
    if (!playlist || playlist.user_id !== user?.id) return
    
    try {
      await userService.removeSongFromPlaylist(playlist.id, songId)
      // Reload playlist to reflect changes
      loadPlaylist()
    } catch (error) {
      console.error('Failed to remove song from playlist:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center gap-6">
          <div className="w-48 h-48 bg-muted animate-pulse rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded w-64" />
            <div className="h-4 bg-muted animate-pulse rounded w-32" />
            <div className="h-4 bg-muted animate-pulse rounded w-48" />
          </div>
        </div>
        
        {/* Songs skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3">
              <div className="w-10 h-10 bg-muted animate-pulse rounded" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
                <div className="h-3 bg-muted animate-pulse rounded w-1/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !playlist) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/library">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <ListMusic className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Playlist Not Found</h3>
          <p className="text-muted-foreground">
            The playlist you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    )
  }

  const isOwner = playlist.user_id === user?.id

  return (
    <div className="p-6 space-y-6">
      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Link to="/library">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Playlist Header */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Playlist Cover */}
        <div className="w-48 h-48 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          {playlist.cover_url ? (
            <img 
              src={playlist.cover_url} 
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ListMusic className="h-16 w-16 text-primary" />
          )}
        </div>
        
        {/* Playlist Info */}
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {playlist.is_public ? 'Public' : 'Private'} Playlist
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-4">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-muted-foreground mb-4">{playlist.description}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{user?.display_name || user?.username || 'Unknown'}</span>
              <span>•</span>
              <span>{songs.length} song{songs.length !== 1 ? 's' : ''}</span>
              {songs.length > 0 && (
                <>
                  <span>•</span>
                  <span>
                    {Math.floor(songs.reduce((total, song) => total + (song.duration || 0), 0) / 60)} min
                  </span>
                </>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {songs.length > 0 && (
              <Button size="lg" className="rounded-full px-8">
                <Play className="h-5 w-5 mr-2" />
                Play
              </Button>
            )}
            <Button variant="ghost" size="lg">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="lg">
              <Share className="h-5 w-5" />
            </Button>
            {isOwner && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="lg">
                  <Edit className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="lg" onClick={deletePlaylist}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            )}
            <Button variant="ghost" size="lg">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Playlist Content */}
      {songs.length > 0 ? (
        <SongList 
          songs={songs} 
          playlist={playlist}
          showRemove={isOwner}
          onRemoveSong={removeSongFromPlaylist}
        />
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
          <Plus className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No songs in this playlist</h3>
          <p className="text-muted-foreground mb-4">
            {isOwner 
              ? "Start building your playlist by adding your favorite songs." 
              : "This playlist is empty."
            }
          </p>
          {isOwner && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Songs
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default Playlist