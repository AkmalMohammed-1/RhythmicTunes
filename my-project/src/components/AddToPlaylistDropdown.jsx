import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePlaylist } from '../contexts/PlaylistContext'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Plus, ListMusic } from 'lucide-react'

export function AddToPlaylistDropdown({ songId, children }) {
  const { user } = useAuth()
  const { playlists, loading, createPlaylist, addSongToPlaylist } = usePlaylist()

  const handleAddToPlaylist = async (playlistId) => {
    if (!songId || !user?.id) {
      console.error('Missing songId or user')
      return
    }
    
    try {
      const success = await addSongToPlaylist(playlistId, songId)
      if (success) {
        // Optional: Show success feedback
        console.log('Song added to playlist successfully')
      }
    } catch (error) {
      if (error.message === 'Song is already in this playlist') {
        console.log('Song is already in this playlist')
        // You could show a toast notification here
      } else {
        console.error('Failed to add song to playlist:', error)
      }
    }
  }

  const handleCreateNewPlaylist = async () => {
    if (!user?.id || !songId) return

    const playlistData = {
      name: `New Playlist`,
      description: `Created on ${new Date().toLocaleDateString()}`,
      song_ids: [songId],
      is_public: false
    }

    await createPlaylist(playlistData)
  }

  if (!user?.id) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Add to playlist</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {loading ? (
          <DropdownMenuItem disabled>
            Loading playlists...
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem onClick={handleCreateNewPlaylist}>
              <Plus className="mr-2 h-4 w-4" />
              Create new playlist
            </DropdownMenuItem>
            
            {playlists.length > 0 && (
              <>
                <DropdownMenuSeparator />
                {playlists.map((playlist) => (
                  <DropdownMenuItem
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id)}
                  >
                    <ListMusic className="mr-2 h-4 w-4" />
                    {playlist.name}
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AddToPlaylistDropdown