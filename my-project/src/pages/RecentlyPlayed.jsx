import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { userService, musicService } from '../services'
import SongList from '../components/SongList'
import { Clock, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/button'

export function RecentlyPlayed() {
  const [recentlySongs, setRecentlySongs] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadRecentlyPlayed()
  }, [user])

  const loadRecentlyPlayed = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const recentlyPlayedIds = await userService.getRecentlyPlayed(user.id)
      
      if (recentlyPlayedIds && recentlyPlayedIds.length > 0) {
        // Get all songs
        const allSongs = await musicService.getSongsWithDetails()
        
        // Filter and sort songs based on recently played order
        const recentSongs = recentlyPlayedIds
          .map(id => allSongs.find(song => song.id === id))
          .filter(Boolean) // Remove any null/undefined songs
        
        setRecentlySongs(recentSongs)
      } else {
        setRecentlySongs([])
      }
    } catch (error) {
      console.error('Failed to load recently played:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearRecentlyPlayed = async () => {
    if (!user?.id) return

    try {
      await userService.updateUser(user.id, {
        ...user,
        recently_played: []
      })
      setRecentlySongs([])
    } catch (error) {
      console.error('Failed to clear recently played:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
          <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
        </div>
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

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Recently Played</h1>
              <p className="text-muted-foreground">
                {recentlySongs.length > 0 
                  ? `${recentlySongs.length} song${recentlySongs.length !== 1 ? 's' : ''}`
                  : 'No recently played songs'
                }
              </p>
            </div>
          </div>
          
          {recentlySongs.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearRecentlyPlayed}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </Button>
          )}
        </div>
      </div>

      {recentlySongs.length > 0 ? (
        <SongList songs={recentlySongs} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <Clock className="h-16 w-16 text-muted-foreground/50" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No Recently Played Songs</h3>
            <p className="text-muted-foreground max-w-md">
              Songs you play will appear here. Start listening to music to build your recently played history.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecentlyPlayed