import React, { useState, useEffect } from 'react'
import { musicService } from '../services'
import { useAudio } from '../contexts/AudioContext'
import SongList from '../components/SongList'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Search as SearchIcon, Music, User, Album } from 'lucide-react'

export function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [popularCategories] = useState([
    { name: 'Pop', icon: Music, color: 'bg-pink-500' },
    { name: 'Rock', icon: Music, color: 'bg-red-500' },
    { name: 'Hip Hop', icon: Music, color: 'bg-purple-500' },
    { name: 'Electronic', icon: Music, color: 'bg-blue-500' },
    { name: 'Jazz', icon: Music, color: 'bg-yellow-500' },
    { name: 'Classical', icon: Music, color: 'bg-green-500' }
  ])
  const [loading, setLoading] = useState(false)
  const { playSong } = useAudio()

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

      {/* Recent Searches & Categories when no search */}
      {!searchQuery && (
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
              {popularCategories.map((category, index) => {
                const Icon = category.icon
                return (
                  <Card key={index} className="cursor-pointer hover:scale-105 transition-transform">
                    <CardContent className="p-4">
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-medium">{category.name}</h3>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search