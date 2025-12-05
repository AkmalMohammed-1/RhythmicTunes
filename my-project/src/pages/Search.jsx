import React, { useState, useEffect } from 'react'
import { musicService } from '../services'
import { useAudio } from '../contexts/AudioContext'
import SongList from '../components/SongList'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Search as SearchIcon, Music } from 'lucide-react'

export function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [genreSongs, setGenreSongs] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(false)
  const { playSong } = useAudio()

  useEffect(() => {
    loadGenres()
  }, [])

  const loadGenres = async () => {
    try {
      const genresData = await musicService.getAllGenres()
      setGenres(genresData)
    } catch (error) {
      console.error('Failed to load genres:', error)
    }
  }

  const handleSearch = async (query, addToRecent = false) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      const songs = await musicService.getSongsWithDetails()
      const filteredSongs = songs.filter(song => 
        song.title?.toLowerCase().includes(query.toLowerCase()) ||
        song.artist_name?.toLowerCase().includes(query.toLowerCase()) ||
        song.album_name?.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filteredSongs)
      
      // Only add to recent searches when explicitly requested (Enter key or button click)
      if (addToRecent && !recentSearches.includes(query)) {
        setRecentSearches(prev => [query, ...prev.slice(0, 4)])
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      handleSearch(searchQuery, true)
    }
  }

  const handleGenreClick = async (genreName) => {
    try {
      setLoading(true)
      setSelectedGenre(genreName)
      setSearchResults([]) // Clear search results when browsing by genre
      
      // Get all songs and filter by genre
      const allSongs = await musicService.getSongsWithDetails()
      const filteredSongs = allSongs.filter(song => song.genre === genreName)
      
      setGenreSongs(filteredSongs)
    } catch (error) {
      console.error('Failed to load genre songs:', error)
      setGenreSongs([])
    } finally {
      setLoading(false)
    }
  }

  const clearGenreSelection = () => {
    setSelectedGenre(null)
    setGenreSongs([])
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery, false) // Don't add to recent searches for live search
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  return (
    <div className="p-6 space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Search</h1>
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for songs, artists, or albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Search Results</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <SongList songs={searchResults} onSongSelect={playSong} showAddToPlaylist />
          ) : (
            <div className="text-center py-8">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {/* Genre Results */}
      {selectedGenre && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{selectedGenre} Songs</h2>
            <Button variant="outline" size="sm" onClick={clearGenreSelection}>
              Back to Browse
            </Button>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading {selectedGenre} songs...</p>
            </div>
          ) : genreSongs.length > 0 ? (
            <SongList songs={genreSongs} onSongSelect={playSong} showAddToPlaylist />
          ) : (
            <div className="text-center py-8">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No {selectedGenre} songs found</p>
            </div>
          )}
        </div>
      )}

      {/* Recent Searches & Categories when no search and no genre selected */}
      {!searchQuery && !selectedGenre && (
        <div className="space-y-8">
          {/* Recent Searches */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recent searches</h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(search)
                    handleSearch(search, true)
                  }}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>

          {/* Browse Categories */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Browse all</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {genres.map((genre) => (
                <Card 
                  key={genre.id} 
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handleGenreClick(genre.name)}
                >
                  <CardContent className="p-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: genre.color }}>
                      <Music className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-medium">{genre.name}</h3>
                    <p className="text-xs text-muted-foreground">{genre.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search