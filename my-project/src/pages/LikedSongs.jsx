import React, { useState, useEffect } from 'react'
import { musicService, userService } from '../services'
import { useAuth } from '../contexts/AuthContext'
import { useAudio } from '../contexts/AudioContext'
import { useLikes } from '../contexts/LikeContext'
import SongList from '../components/SongList'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Heart, Play } from 'lucide-react'

export function LikedSongs() {
  const [likedSongsData, setLikedSongsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalSongs: 0, totalDuration: 0 })
  const { user } = useAuth()
  const { playSong, currentSong } = useAudio()
  const { likedSongs, getLikedCount } = useLikes()

  useEffect(() => {
    loadLikedSongs()
  }, [user, likedSongs])

  const loadLikedSongs = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      
      if (likedSongs.length === 0) {
        setLikedSongsData([])
        setStats({ totalSongs: 0, totalDuration: 0 })
        return
      }
      
      // Get all songs and filter by liked song IDs
      const allSongs = await musicService.getSongsWithDetails()
      const likedSongsData = allSongs.filter(song => likedSongs.includes(song.id))
      
      setLikedSongsData(likedSongsData)
      
      // Calculate stats
      const totalDuration = likedSongsData.reduce((total, song) => {
        return total + (song.duration || 180) // Default 3 minutes if no duration
      }, 0)
      
      setStats({
        totalSongs: likedSongsData.length,
        totalDuration
      })
    } catch (error) {
      console.error('Failed to load liked songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const handlePlayAll = () => {
    if (likedSongsData.length > 0) {
      playSong(likedSongsData[0], likedSongsData, 0)
    }
  }

  const handleShuffle = () => {
    if (likedSongsData.length > 0) {
      const shuffledSongs = [...likedSongsData].sort(() => Math.random() - 0.5)
      playSong(shuffledSongs[0], shuffledSongs, 0)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-48 h-48 bg-muted rounded" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-64" />
              <div className="h-4 bg-muted rounded w-48" />
              <div className="h-4 bg-muted rounded w-32" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-start space-x-6">
        {/* Playlist Cover */}
        <div className="w-48 h-48 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-lg flex items-center justify-center shadow-xl">
          <Heart className="h-20 w-20 text-white fill-current" />
        </div>
        
        {/* Playlist Info */}
        <div className="space-y-4 flex-1">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase">Playlist</p>
            <h1 className="text-4xl md:text-6xl font-bold mt-2">Liked Songs</h1>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span className="font-medium">{user?.username || 'User'}</span>
            <span>•</span>
            <span>{stats.totalSongs} songs</span>
            <span>•</span>
            <span>about {formatDuration(stats.totalDuration)}</span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4 pt-4">
            <Button 
              size="lg" 
              className="rounded-full h-12 w-12 p-0"
              onClick={handlePlayAll}
              disabled={likedSongsData.length === 0}
            >
              <Play className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="space-y-4">
        {likedSongsData.length > 0 ? (
          <SongList 
            songs={likedSongsData} 
            onSongSelect={playSong} 
            showAddToPlaylist={true}
            currentSongId={currentSong?.id}
          />
        ) : (
          <Card className="p-8">
            <CardContent className="text-center space-y-4">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No liked songs yet</h3>
                <p className="text-muted-foreground">Songs you like will appear here. Start exploring and heart the songs you love!</p>
              </div>
              <Button onClick={() => window.location.href = '/browse'}>
                Browse Music
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default LikedSongs