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

  // Albums
  getAllAlbums: async () => {
    const response = await api.get('/albums')
    return response.data
  },

  getAlbumById: async (id) => {
    const response = await api.get(`/albums/${id}`)
    return response.data
  },

  getAlbumSongs: async (albumId) => {
    const response = await api.get(`/songs?album_id=${albumId}`)
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

  // Enhanced function to get songs with artist and album names
  getSongsWithDetails: async () => {
    try {
      const [songs, artists, albums] = await Promise.all([
        api.get('/songs'),
        api.get('/artists'),
        api.get('/albums')
      ])

      // Create lookup maps for faster searching
      const artistMap = artists.data.reduce((map, artist) => {
        map[artist.id] = artist
        return map
      }, {})

      const albumMap = albums.data.reduce((map, album) => {
        map[album.id] = album
        return map
      }, {})

      // Enhance songs with artist and album data
      const enhancedSongs = songs.data.map(song => ({
        ...song,
        artist_name: artistMap[song.artist_id]?.name || 'Unknown Artist',
        artist: artistMap[song.artist_id],
        album_name: albumMap[song.album_id]?.title || 'Unknown Album',
        album: albumMap[song.album_id],
        cover_url: albumMap[song.album_id]?.cover_url || null
      }))

      return enhancedSongs
    } catch (error) {
      console.error('Error fetching songs with details:', error)
      throw error
    }
  },
}

export default musicService