import api from './api'

// User API Service
export const userService = {
  // User management
  getAllUsers: async () => {
    const response = await api.get('/users')
    return response.data
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData)
    return response.data
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  // Playlists
  createPlaylist: async (playlistData) => {
    const response = await api.post('/playlists', playlistData)
    return response.data
  },

  getUserPlaylists: async (userId) => {
    const response = await api.get(`/playlists?user_id=${userId}`)
    return response.data
  },

  getPlaylistById: async (id) => {
    const response = await api.get(`/playlists/${id}`)
    return response.data
  },

  updatePlaylist: async (id, playlistData) => {
    const response = await api.put(`/playlists/${id}`, playlistData)
    return response.data
  },

  deletePlaylist: async (id) => {
    const response = await api.delete(`/playlists/${id}`)
    return response.data
  },

  addSongToPlaylist: async (playlistId, songId) => {
    const playlist = await userService.getPlaylistById(playlistId)
    
    // Check if song already exists in playlist
    if (playlist.song_ids.includes(songId)) {
      throw new Error('Song is already in this playlist')
    }
    
    const updatedSongIds = [...playlist.song_ids, songId]
    return await userService.updatePlaylist(playlistId, {
      ...playlist,
      song_ids: updatedSongIds
    })
  },

  removeSongFromPlaylist: async (playlistId, songId) => {
    const playlist = await userService.getPlaylistById(playlistId)
    const updatedSongIds = playlist.song_ids.filter(id => id !== songId)
    return await userService.updatePlaylist(playlistId, {
      ...playlist,
      song_ids: updatedSongIds
    })
  },

  // User preferences
  updateUserPreferences: async (userId, preferences) => {
    const user = await userService.getUserById(userId)
    return await userService.updateUser(userId, {
      ...user,
      preferences: { ...user.preferences, ...preferences }
    })
  },

  // Recently played
  addToRecentlyPlayed: async (userId, songId) => {
    const user = await userService.getUserById(userId)
    const recentlyPlayed = user.recently_played || []
    const updatedRecentlyPlayed = [songId, ...recentlyPlayed.filter(id => id !== songId)].slice(0, 50) // Keep last 50
    
    return await userService.updateUser(userId, {
      ...user,
      recently_played: updatedRecentlyPlayed
    })
  },

  getRecentlyPlayed: async (userId) => {
    const user = await userService.getUserById(userId)
    return user.recently_played || []
  },
}

export default userService