import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const LikeContext = createContext()

export const useLikes = () => {
  const context = useContext(LikeContext)
  if (!context) {
    throw new Error('useLikes must be used within a LikeProvider')
  }
  return context
}

export const LikeProvider = ({ children }) => {
  const [likedSongs, setLikedSongs] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Load liked songs from localStorage on user change
  useEffect(() => {
    if (user?.id) {
      loadLikedSongs()
    } else {
      setLikedSongs(new Set())
    }
  }, [user])

  // Load liked songs from localStorage
  const loadLikedSongs = () => {
    try {
      setLoading(true)
      const storageKey = `likedSongs_${user.id}`
      const storedLikes = localStorage.getItem(storageKey)
      
      if (storedLikes) {
        const likedArray = JSON.parse(storedLikes)
        setLikedSongs(new Set(likedArray))
      } else {
        setLikedSongs(new Set())
      }
    } catch (error) {
      console.error('Failed to load liked songs:', error)
      setLikedSongs(new Set())
    } finally {
      setLoading(false)
    }
  }

  // Save liked songs to localStorage
  const saveLikedSongs = (newLikedSongs) => {
    try {
      const storageKey = `likedSongs_${user.id}`
      const likedArray = Array.from(newLikedSongs)
      localStorage.setItem(storageKey, JSON.stringify(likedArray))
    } catch (error) {
      console.error('Failed to save liked songs:', error)
    }
  }

  // CRUD Operations for Liked Songs

  // CREATE: Like a song
  const likeSong = (songId) => {
    if (!user?.id || !songId) return false

    const newLikedSongs = new Set(likedSongs)
    newLikedSongs.add(songId)
    
    setLikedSongs(newLikedSongs)
    saveLikedSongs(newLikedSongs)
    
    console.log(`Song ${songId} liked`)
    return true
  }

  // DELETE: Unlike a song
  const unlikeSong = (songId) => {
    if (!user?.id || !songId) return false

    const newLikedSongs = new Set(likedSongs)
    newLikedSongs.delete(songId)
    
    setLikedSongs(newLikedSongs)
    saveLikedSongs(newLikedSongs)
    
    console.log(`Song ${songId} unliked`)
    return true
  }

  // TOGGLE: Toggle like status
  const toggleLike = (songId) => {
    if (!user?.id || !songId) return false

    const isLiked = likedSongs.has(songId)
    
    if (isLiked) {
      return unlikeSong(songId)
    } else {
      return likeSong(songId)
    }
  }

  // READ: Check if song is liked
  const isLiked = (songId) => {
    return likedSongs.has(songId)
  }

  // READ: Get all liked songs as array
  const getLikedSongs = () => {
    return Array.from(likedSongs)
  }

  // READ: Get liked songs count
  const getLikedCount = () => {
    return likedSongs.size
  }

  // DELETE: Clear all liked songs
  const clearAllLikes = () => {
    if (!user?.id) return false

    setLikedSongs(new Set())
    
    try {
      const storageKey = `likedSongs_${user.id}`
      localStorage.removeItem(storageKey)
      console.log('All likes cleared')
      return true
    } catch (error) {
      console.error('Failed to clear likes:', error)
      return false
    }
  }

  // BULK CREATE: Like multiple songs
  const likeMultipleSongs = (songIds) => {
    if (!user?.id || !songIds || songIds.length === 0) return false

    const newLikedSongs = new Set(likedSongs)
    songIds.forEach(songId => newLikedSongs.add(songId))
    
    setLikedSongs(newLikedSongs)
    saveLikedSongs(newLikedSongs)
    
    console.log(`${songIds.length} songs liked`)
    return true
  }

  // BULK DELETE: Unlike multiple songs
  const unlikeMultipleSongs = (songIds) => {
    if (!user?.id || !songIds || songIds.length === 0) return false

    const newLikedSongs = new Set(likedSongs)
    songIds.forEach(songId => newLikedSongs.delete(songId))
    
    setLikedSongs(newLikedSongs)
    saveLikedSongs(newLikedSongs)
    
    console.log(`${songIds.length} songs unliked`)
    return true
  }

  // UTILITY: Export liked songs data
  const exportLikedSongs = () => {
    return {
      userId: user?.id,
      likedSongs: Array.from(likedSongs),
      exportDate: new Date().toISOString(),
      count: likedSongs.size
    }
  }

  // UTILITY: Import liked songs data
  const importLikedSongs = (importData) => {
    try {
      if (importData.userId !== user?.id) {
        console.warn('Import data is for different user')
        return false
      }

      const newLikedSongs = new Set(importData.likedSongs)
      setLikedSongs(newLikedSongs)
      saveLikedSongs(newLikedSongs)
      
      console.log(`Imported ${importData.count} liked songs`)
      return true
    } catch (error) {
      console.error('Failed to import liked songs:', error)
      return false
    }
  }

  const value = {
    // State
    likedSongs: Array.from(likedSongs),
    loading,
    
    // Basic CRUD Operations
    likeSong,           // CREATE
    unlikeSong,         // DELETE
    toggleLike,         // UPDATE (toggle)
    isLiked,           // READ
    
    // Extended READ Operations
    getLikedSongs,
    getLikedCount,
    
    // Bulk Operations
    likeMultipleSongs,    // BULK CREATE
    unlikeMultipleSongs,  // BULK DELETE
    clearAllLikes,        // DELETE ALL
    
    // Utility Operations
    exportLikedSongs,
    importLikedSongs,
    
    // Data refresh
    loadLikedSongs
  }

  return (
    <LikeContext.Provider value={value}>
      {children}
    </LikeContext.Provider>
  )
}

export default LikeContext