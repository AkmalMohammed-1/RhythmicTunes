import React from 'react'
import { Link } from 'react-router-dom'
import { usePlaylist } from '../contexts/PlaylistContext'
import { Button } from '../components/ui/button'
import { 
  ListMusic, 
  Heart, 
  Plus, 
  Clock,
  Music,
  Lock,
  Globe
} from 'lucide-react'

export function Library() {
  const { playlists, loading, createPlaylist } = usePlaylist()

  const handleCreatePlaylist = async () => {
    const playlistData = {
      name: `My Playlist #${playlists.length + 1}`,
      description: `Created on ${new Date().toLocaleDateString()}`,
      song_ids: [],
      is_public: false
    };

    await createPlaylist(playlistData);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-8 bg-muted animate-pulse rounded w-1/4" />
          <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 bg-muted animate-pulse rounded-lg">
              <div className="aspect-square bg-muted-foreground/20 rounded mb-3" />
              <div className="h-4 bg-muted-foreground/20 rounded mb-2" />
              <div className="h-3 bg-muted-foreground/20 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <p className="text-muted-foreground">
          Your playlists, liked songs, and music collection
        </p>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          to="/liked-songs"
          className="group p-4 border rounded-lg bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Liked Songs</h3>
              <p className="text-sm text-muted-foreground">Your favorite tracks</p>
            </div>
          </div>
        </Link>

        <Link 
          to="/recently-played"
          className="group p-4 border rounded-lg bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Recently Played</h3>
              <p className="text-sm text-muted-foreground">Your listening history</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Playlists Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Playlists</h2>
          <Button onClick={handleCreatePlaylist} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Playlist
          </Button>
        </div>

        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {playlists.map((playlist) => (
              <Link 
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                className="group p-4 bg-card border rounded-lg hover:bg-accent/50 transition-colors"
              >
                {/* Playlist Cover */}
                <div className="relative mb-3">
                  <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                    {playlist.cover_url ? (
                      <img 
                        src={playlist.cover_url} 
                        alt={playlist.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <ListMusic className="h-12 w-12 text-primary" />
                    )}
                  </div>
                  
                  {/* Privacy indicator */}
                  <div className="absolute top-2 right-2">
                    {playlist.is_public ? (
                      <div className="p-1 bg-black/50 rounded-full">
                        <Globe className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <div className="p-1 bg-black/50 rounded-full">
                        <Lock className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Playlist Info */}
                <div className="space-y-1">
                  <h3 className="font-medium text-sm truncate">{playlist.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {playlist.song_ids?.length || 0} song{(playlist.song_ids?.length || 0) !== 1 ? 's' : ''}
                  </p>
                  {playlist.description && (
                    <p className="text-xs text-muted-foreground/70 line-clamp-2">
                      {playlist.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
            <Music className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first playlist to organize your favorite songs and discover new music.
            </p>
            <Button onClick={handleCreatePlaylist} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Playlist
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Library