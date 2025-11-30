import React, { useState, useEffect } from 'react'
import { musicService } from '../services'
import { useAudio } from '../contexts/AudioContext'
import SongList from '../components/SongList'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Music, TrendingUp, Star, Clock, Play, Shuffle } from 'lucide-react'

export function Browse() {
  const [featuredSongs, setFeaturedSongs] = useState([])
  const [topCharts, setTopCharts] = useState([])
  const [newReleases, setNewReleases] = useState([])
  const [genres] = useState([
    { name: 'Pop', songs: 156, color: 'bg-gradient-to-r from-pink-500 to-rose-500' },
    { name: 'Rock', songs: 243, color: 'bg-gradient-to-r from-red-500 to-orange-500' },
    { name: 'Hip Hop', songs: 189, color: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
    { name: 'Electronic', songs: 167, color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { name: 'Jazz', songs: 98, color: 'bg-gradient-to-r from-yellow-500 to-amber-500' },
    { name: 'Classical', songs: 134, color: 'bg-gradient-to-r from-green-500 to-emerald-500' }
  ])
  const [loading, setLoading] = useState(true)
  const { playSong, playPlaylist } = useAudio()

  useEffect(() => {
    loadBrowseData()
  }, [])

  const loadBrowseData = async () => {
    try {
      const songs = await musicService.getSongsWithDetails()
      
      // Featured songs (first 6)
      setFeaturedSongs(songs.slice(0, 6))
      
      // Top charts (by play count)
      const chartSongs = [...songs]
        .sort((a, b) => (b.play_count || 0) - (a.play_count || 0))
        .slice(0, 10)
      setTopCharts(chartSongs)
      
      // New releases (last 8)
      setNewReleases(songs.slice(-8))
    } catch (error) {
      console.error('Failed to load browse data:', error)
    } finally {
      setLoading(false)
    }
  }

  const playGenrePlaylist = (genreName) => {
    // Filter songs by genre (simplified - in real app would use genre field)
    const shuffledSongs = [...featuredSongs, ...topCharts, ...newReleases]
      .sort(() => Math.random() - 0.5)
      .slice(0, 20)
    playPlaylist(shuffledSongs, 0)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Browse</h1>
        <p className="text-muted-foreground">Discover new music and explore genres</p>
      </div>

      {/* Featured Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            Featured Music
          </h2>
          <Button variant="outline" size="sm" onClick={() => playPlaylist(featuredSongs, 0)}>
            <Play className="h-4 w-4 mr-2" />
            Play All
          </Button>
        </div>
        <SongList songs={featuredSongs} onSongSelect={playSong} showAddToPlaylist />
      </div>

      {/* Genre Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Browse by Genre</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map((genre, index) => (
            <Card key={index} className="cursor-pointer hover:scale-105 transition-all duration-200 overflow-hidden group">
              <CardContent className="p-0">
                <div className={`${genre.color} h-24 relative flex items-center justify-center`}>
                  <Music className="h-8 w-8 text-white" />
                  <Button 
                    size="sm" 
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => playGenrePlaylist(genre.name)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{genre.name}</h3>
                  <p className="text-sm text-muted-foreground">{genre.songs} songs</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Top Charts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-500" />
            Top Charts
          </h2>
          <Button variant="outline" size="sm" onClick={() => playPlaylist(topCharts, 0)}>
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle Play
          </Button>
        </div>
        <SongList songs={topCharts} onSongSelect={playSong} showAddToPlaylist showRanking />
      </div>

      {/* New Releases */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Clock className="h-6 w-6 text-blue-500" />
          New Releases
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {newReleases.map((song, index) => (
            <Card key={song.id} className="cursor-pointer hover:scale-105 transition-transform group">
              <CardContent className="p-4 text-center">
                <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
                  <Music className="h-8 w-8 text-primary" />
                  <Button 
                    size="sm" 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50"
                    onClick={() => playSong(song, index)}
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
                <h3 className="font-medium text-sm truncate">{song.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{song.artist_name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Browse