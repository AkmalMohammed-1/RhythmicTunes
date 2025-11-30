import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { userService } from '../services'

const PlaylistContext = createContext(null)

export function usePlaylist() {
  const context = useContext(PlaylistContext)
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider')
  }
  return context
}

export function PlaylistProvider({ children }) {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadPlaylists()
  }, [user])

  const loadPlaylists = async () => {
    if (!user?.id) {
      setPlaylists([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const userPlaylists = await userService.getUserPlaylists(user.id)
      setPlaylists(userPlaylists || [])
    } catch (error) {
      console.error('Failed to load playlists:', error)
      setPlaylists([])
    } finally {
      setLoading(false)
    }
  }

  const createPlaylist = async (playlistData) => {
    if (!user?.id) return null

    try {
      const newPlaylistData = {
        ...playlistData,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const createdPlaylist = await userService.createPlaylist(newPlaylistData)
      setPlaylists(prev => [...prev, createdPlaylist])
      return createdPlaylist
    } catch (error) {
      console.error('Failed to create playlist:', error)
      return null
    }
  }

  const updatePlaylist = async (playlistId, updates) => {
    try {
      const updatedPlaylist = await userService.updatePlaylist(playlistId, {
        ...updates,
        updated_at: new Date().toISOString()
      })
      setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p))
      return updatedPlaylist
    } catch (error) {
      console.error('Failed to update playlist:', error)
      return null
    }
  }

  const deletePlaylist = async (playlistId) => {
    try {
      await userService.deletePlaylist(playlistId)
      setPlaylists(prev => prev.filter(p => p.id !== playlistId))
      return true
    } catch (error) {
      console.error('Failed to delete playlist:', error)
      return false
    }
  }

  const addSongToPlaylist = async (playlistId, songId) => {
    try {
      const updatedPlaylist = await userService.addSongToPlaylist(playlistId, songId)
      setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p))
      return true
    } catch (error) {
      console.error('Failed to add song to playlist:', error)
      return false
    }
  }

  const removeSongFromPlaylist = async (playlistId, songId) => {
    try {
      const updatedPlaylist = await userService.removeSongFromPlaylist(playlistId, songId)
      setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p))
      return true
    } catch (error) {
      console.error('Failed to remove song from playlist:', error)
      return false
    }
  }

  const refreshPlaylists = () => {
    loadPlaylists()
  }

  const contextValue = {
    playlists,
    loading,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    refreshPlaylists
  }

  return (
    <PlaylistContext.Provider value={contextValue}>
      {children}
    </PlaylistContext.Provider>
  )
}

export default PlaylistProvider