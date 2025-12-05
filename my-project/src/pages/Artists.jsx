import React, { useState, useEffect } from 'react'
import { musicService } from '../services'
import { useAudio } from '../contexts/AudioContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Users, Play, Music, Shuffle } from 'lucide-react'

export function Artists() {
  const [artists, setArtists] = useState([])
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const { playSong } = useAudio()

  useEffect(() => {
    loadArtistsData()
  }, [])

  const loadArtistsData = async () => {
    try {
      const [artistsData, songsData] = await Promise.all([
        musicService.getAllArtists(),
        musicService.getSongsWithDetails()
      ])
      
      setArtists(artistsData)
      setSongs(songsData)
    } catch (error) {
      console.error('Failed to load artists data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getArtistSongs = (artistId) => {
    return songs.filter(song => song.artist_id.toString() === artistId.toString())
  }

  const playArtistSongs = (artistId) => {
    const artistSongs = getArtistSongs(artistId)
    if (artistSongs.length > 0) {
      // Shuffle the artist's songs
      const shuffledSongs = [...artistSongs].sort(() => Math.random() - 0.5)
      playSong(shuffledSongs[0], shuffledSongs, 0)
    }
  }

  const getGenreColor = (genreName) => {
    // Map genre names to colors
    const genreColors = {
      'Pop': '#e91e63',
      'Hip-Hop': '#9c27b0',
      'R&B': '#ff9800',
      'Rock': '#f44336',
      'Dance-Pop': '#2196f3',
      'Soul': '#4caf50',
      'New Wave': '#00bcd4',
      'Rap': '#795548',
      'Electronic': '#673ab7',
      'House': '#3f51b5',
      'Techno': '#607d8b',
      'Electropop': '#ff5722',
      'Punk Rock': '#e91e63',
      'Conscious Rap': '#4caf50',
      'Smooth Jazz': '#ff9800'
    }
    return genreColors[genreName] || '#9e9e9e'
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="h-8 w-8" />
          Artists
        </h1>
        <p className="text-muted-foreground">
          Discover your favorite artists and explore their music
        </p>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => {
          const artistSongs = getArtistSongs(artist.id)
          const totalPlays = artistSongs.reduce((sum, song) => sum + (song.play_count || 0), 0)
          
          return (
            <Card key={artist.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-xl">{artist.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Music className="h-4 w-4" />
                      {artistSongs.length} song{artistSongs.length !== 1 ? 's' : ''}
                      {totalPlays > 0 && (
                        <>
                          <span>•</span>
                          <Play className="h-3 w-3" />
                          {totalPlays.toLocaleString()} plays
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => playArtistSongs(artist.id)}
                    disabled={artistSongs.length === 0}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Bio */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {artist.bio}
                </p>
                
                {/* Genres */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Genres</h4>
                  <div className="flex flex-wrap gap-1">
                    {artist.genres.map((genre) => (
                      <Badge 
                        key={genre} 
                        variant="secondary"
                        className="text-xs"
                        style={{
                          backgroundColor: `${getGenreColor(genre)}20`,
                          color: getGenreColor(genre),
                          borderColor: `${getGenreColor(genre)}40`
                        }}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Songs Preview */}
                {artistSongs.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Popular Tracks</h4>
                    <div className="space-y-1">
                      {artistSongs
                        .sort((a, b) => (b.play_count || 0) - (a.play_count || 0))
                        .slice(0, 3)
                        .map((song) => (
                          <div 
                            key={song.id}
                            className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => playSong(song, artistSongs, artistSongs.indexOf(song))}
                          >
                            <span className="truncate flex-1">{song.title}</span>
                            <span className="text-muted-foreground ml-2">
                              {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                
                {/* Play All Button */}
                {artistSongs.length > 0 && (
                  <Button 
                    className="w-full"
                    onClick={() => playArtistSongs(artist.id)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Play All ({artistSongs.length} songs)
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default Artists