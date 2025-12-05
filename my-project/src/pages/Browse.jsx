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
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const { playSong } = useAudio()

  useEffect(() => {
    loadBrowseData()
  }, [])

  const loadBrowseData = async () => {
    try {
      const [songsData, genresData] = await Promise.all([
        musicService.getSongsWithDetails(),
        musicService.getAllGenres()
      ])
      
      // Featured songs (first 6)
      setFeaturedSongs(songsData.slice(0, 6))
      
      // Top charts (by play count)
      const chartSongs = [...songsData]
        .sort((a, b) => (b.play_count || 0) - (a.play_count || 0))
        .slice(0, 10)
      setTopCharts(chartSongs)
      
      // New releases (last 8)
      setNewReleases(songsData.slice(-8))

      // Set genres from database
      setGenres(genresData)
      
    } catch (error) {
      console.error('Failed to load browse data:', error)
    } finally {
      setLoading(false)
    }
  }

  const playGenrePlaylist = async (genreName) => {
    try {
      // Get all songs with details first
      const allSongs = await musicService.getSongsWithDetails()
      
      // Filter songs by the selected genre
      const filteredSongs = allSongs.filter(song => song.genre === genreName)
      
      if (filteredSongs.length > 0) {
        // Shuffle the songs for variety
        const shuffledSongs = [...filteredSongs].sort(() => Math.random() - 0.5)
        playSong(shuffledSongs[0], shuffledSongs, 0)
        console.log(`Playing ${filteredSongs.length} songs from ${genreName} genre`)
      } else {
        console.log(`No songs found for genre: ${genreName}`)
        // Fallback: play some random songs if no exact genre match
        const randomSongs = [...featuredSongs, ...topCharts, ...newReleases]
          .sort(() => Math.random() - 0.5)
          .slice(0, 10)
        if (randomSongs.length > 0) {
          playSong(randomSongs[0], randomSongs, 0)
        }
      }
    } catch (error) {
      console.error('Failed to play genre playlist:', error)
    }
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
          <Button variant="outline" size="sm" onClick={() => featuredSongs.length > 0 && playSong(featuredSongs[0], featuredSongs, 0)}>
            <Play className="h-4 w-4 mr-2" />
            Play All
          </Button>
        </div>
        <SongList songs={featuredSongs} onSongSelect={playSong} showAddToPlaylist />
      </div>

      {/* Top Charts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-500" />
            Top Charts
          </h2>
          <Button variant="outline" size="sm" onClick={() => {
            if (topCharts.length > 0) {
              const shuffled = [...topCharts].sort(() => Math.random() - 0.5)
              playSong(shuffled[0], shuffled, 0)
            }
          }}>
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
                <div className="w-full aspect-square bg-linear-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
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