import api from './api'

// Music API Service
export const musicService = {
  // Songs
  getAllSongs: async () => {
    const response = await api.get('/songs')
    return response.data
  },

  getSongById: async (id) => {
    const response = await api.get(`/songs/${id}`)
    return response.data
  },

  searchSongs: async (query) => {
    const response = await api.get(`/songs?q=${query}`)
    return response.data
  },

  // Artists
  getAllArtists: async () => {
    const response = await api.get('/artists')
    return response.data
  },

  getArtistById: async (id) => {
    const response = await api.get(`/artists/${id}`)
    return response.data
  },

  getArtistSongs: async (artistId) => {
    const response = await api.get(`/songs?artist_id=${artistId}`)
    return response.data
  },

  // Genres
  getAllGenres: async () => {
    const response = await api.get('/genres')
    return response.data
  },

  getSongsByGenre: async (genre) => {
    const response = await api.get(`/songs?genre=${genre}`)
    return response.data
  },

  // Enhanced function to get songs with artist names
  getSongsWithDetails: async () => {
    try {
      const [songs, artists] = await Promise.all([
        api.get('/songs'),
        api.get('/artists')
      ])

      // Create lookup maps for faster searching
      const artistMap = artists.data.reduce((map, artist) => {
        map[artist.id] = artist
        return map
      }, {})

      // Enhance songs with artist data
      const enhancedSongs = songs.data.map(song => ({
        ...song,
        artist_name: artistMap[song.artist_id]?.name || 'Unknown Artist',
        artist: artistMap[song.artist_id]
      }))

      return enhancedSongs
    } catch (error) {
      console.error('Error fetching songs with details:', error)
      throw error
    }
  },
}

export default musicService