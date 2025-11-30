import React, { createContext, useContext, useReducer, useRef, useEffect } from 'react'
import { userService } from '../services'
import { useAuth } from './AuthContext'

// Audio Player States
const INITIAL_STATE = {
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  queue: [],
  currentIndex: 0,
  repeat: 'off', // 'off', 'track', 'queue'
  shuffle: false,
  isLoading: false,
  error: null
}

// Audio Player Actions
const audioActions = {
  PLAY_SONG: 'PLAY_SONG',
  PAUSE_SONG: 'PAUSE_SONG',
  SET_CURRENT_TIME: 'SET_CURRENT_TIME',
  SET_DURATION: 'SET_DURATION',
  SET_VOLUME: 'SET_VOLUME',
  TOGGLE_MUTE: 'TOGGLE_MUTE',
  SET_QUEUE: 'SET_QUEUE',
  NEXT_SONG: 'NEXT_SONG',
  PREVIOUS_SONG: 'PREVIOUS_SONG',
  TOGGLE_REPEAT: 'TOGGLE_REPEAT',
  TOGGLE_SHUFFLE: 'TOGGLE_SHUFFLE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

// Audio Player Reducer
function audioReducer(state, action) {
  switch (action.type) {
    case audioActions.PLAY_SONG:
      return {
        ...state,
        currentSong: action.payload.song,
        isPlaying: true,
        currentIndex: action.payload.index || 0,
        queue: action.payload.queue || [action.payload.song],
        error: null
      }
    
    case audioActions.PAUSE_SONG:
      return {
        ...state,
        isPlaying: false
      }
    
    case audioActions.SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.payload
      }
    
    case audioActions.SET_DURATION:
      return {
        ...state,
        duration: action.payload
      }
    
    case audioActions.SET_VOLUME:
      return {
        ...state,
        volume: action.payload,
        isMuted: false
      }
    
    case audioActions.TOGGLE_MUTE:
      return {
        ...state,
        isMuted: !state.isMuted
      }
    
    case audioActions.SET_QUEUE:
      return {
        ...state,
        queue: action.payload.queue,
        currentIndex: action.payload.index || 0,
        currentSong: action.payload.queue[action.payload.index || 0] || null
      }
    
    case audioActions.NEXT_SONG:
      const nextIndex = state.shuffle 
        ? Math.floor(Math.random() * state.queue.length)
        : (state.currentIndex + 1) % state.queue.length
      
      return {
        ...state,
        currentIndex: nextIndex,
        currentSong: state.queue[nextIndex] || null
      }
    
    case audioActions.PREVIOUS_SONG:
      const prevIndex = state.shuffle 
        ? Math.floor(Math.random() * state.queue.length)
        : state.currentIndex === 0 
          ? state.queue.length - 1 
          : state.currentIndex - 1
      
      return {
        ...state,
        currentIndex: prevIndex,
        currentSong: state.queue[prevIndex] || null
      }
    
    case audioActions.TOGGLE_REPEAT:
      const repeatModes = ['off', 'queue', 'track']
      const currentModeIndex = repeatModes.indexOf(state.repeat)
      const nextMode = repeatModes[(currentModeIndex + 1) % repeatModes.length]
      
      return {
        ...state,
        repeat: nextMode
      }
    
    case audioActions.TOGGLE_SHUFFLE:
      return {
        ...state,
        shuffle: !state.shuffle
      }
    
    case audioActions.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    
    case audioActions.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    
    case audioActions.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }
    
    default:
      return state
  }
}

// Create Context
const AudioContext = createContext()

// Audio Provider Component
export function AudioProvider({ children }) {
  const [state, dispatch] = useReducer(audioReducer, INITIAL_STATE)
  const audioRef = useRef(new Audio())
  const timeUpdateInterval = useRef(null)
  const { user } = useAuth() // Get current user

  // Audio Event Handlers
  useEffect(() => {
    const audio = audioRef.current

    const handleLoadedMetadata = () => {
      dispatch({ type: audioActions.SET_DURATION, payload: audio.duration })
      dispatch({ type: audioActions.SET_LOADING, payload: false })
    }

    const handleTimeUpdate = () => {
      dispatch({ type: audioActions.SET_CURRENT_TIME, payload: audio.currentTime })
    }

    const handleEnded = () => {
      if (state.repeat === 'track') {
        audio.currentTime = 0
        audio.play()
      } else if (state.repeat === 'queue' || state.currentIndex < state.queue.length - 1) {
        dispatch({ type: audioActions.NEXT_SONG })
      } else {
        dispatch({ type: audioActions.PAUSE_SONG })
      }
    }

    const handleError = (e) => {
      dispatch({ 
        type: audioActions.SET_ERROR, 
        payload: 'Failed to load audio. Please try again.' 
      })
    }

    const handleLoadStart = () => {
      dispatch({ type: audioActions.SET_LOADING, payload: true })
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('loadstart', handleLoadStart)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('loadstart', handleLoadStart)
    }
  }, [state.repeat, state.currentIndex, state.queue.length])

  // Update audio source when current song changes
  useEffect(() => {
    const audio = audioRef.current
    
    if (state.currentSong?.audio_url) {
      audio.src = state.currentSong.audio_url
      audio.load()
    }
  }, [state.currentSong])

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current
    
    if (state.isPlaying && state.currentSong) {
      const playPromise = audio.play()
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          dispatch({ 
            type: audioActions.SET_ERROR, 
            payload: 'Playback failed. Please try again.' 
          })
        })
      }
    } else {
      audio.pause()
    }
  }, [state.isPlaying, state.currentSong])

  // Handle volume changes
  useEffect(() => {
    const audio = audioRef.current
    audio.volume = state.isMuted ? 0 : state.volume
  }, [state.volume, state.isMuted])

  // Audio Control Functions
  const playSong = async (song, queue = [song], index = 0) => {
    dispatch({ 
      type: audioActions.PLAY_SONG, 
      payload: { song, queue, index }
    })
    
    // Add to recently played if user is authenticated
    if (user?.id && song?.id) {
      try {
        await userService.addToRecentlyPlayed(user.id, song.id)
      } catch (error) {
        console.warn('Failed to add to recently played:', error)
      }
    }
  }

  const pauseSong = () => {
    dispatch({ type: audioActions.PAUSE_SONG })
  }

  const togglePlayPause = () => {
    if (state.isPlaying) {
      pauseSong()
    } else if (state.currentSong) {
      dispatch({ type: audioActions.PLAY_SONG, payload: { song: state.currentSong } })
    }
  }

  const seekTo = (time) => {
    audioRef.current.currentTime = time
    dispatch({ type: audioActions.SET_CURRENT_TIME, payload: time })
  }

  const setVolume = (volume) => {
    dispatch({ type: audioActions.SET_VOLUME, payload: Math.max(0, Math.min(1, volume)) })
  }

  const toggleMute = () => {
    dispatch({ type: audioActions.TOGGLE_MUTE })
  }

  const nextSong = () => {
    dispatch({ type: audioActions.NEXT_SONG })
  }

  const previousSong = () => {
    dispatch({ type: audioActions.PREVIOUS_SONG })
  }

  const toggleRepeat = () => {
    dispatch({ type: audioActions.TOGGLE_REPEAT })
  }

  const toggleShuffle = () => {
    dispatch({ type: audioActions.TOGGLE_SHUFFLE })
  }

  const setQueue = (queue, index = 0) => {
    dispatch({ type: audioActions.SET_QUEUE, payload: { queue, index } })
  }

  const clearError = () => {
    dispatch({ type: audioActions.CLEAR_ERROR })
  }

  // Format time helper
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const contextValue = {
    // State
    ...state,
    
    // Actions
    playSong,
    pauseSong,
    togglePlayPause,
    seekTo,
    setVolume,
    toggleMute,
    nextSong,
    previousSong,
    toggleRepeat,
    toggleShuffle,
    setQueue,
    clearError,
    
    // Utils
    formatTime
  }

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  )
}

// Custom hook to use audio context
export function useAudio() {
  const context = useContext(AudioContext)
  
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  
  return context
}

export default AudioContext