import React from 'react'
import { useAudio } from '../contexts/AudioContext'
import { Button } from './ui/button'
import { Play, Pause } from 'lucide-react'
import { cn } from '../lib/utils'

function PlayButton({ 
  song, 
  songs = [], 
  index = 0, 
  variant = "default", 
  size = "default",
  className,
  showIcon = true,
  children,
  ...props 
}) {
  const { 
    currentSong, 
    isPlaying, 
    isLoading,
    playSong, 
    togglePlayPause 
  } = useAudio()

  const isCurrentSong = currentSong?.id === song?.id
  const isCurrentlyPlaying = isCurrentSong && isPlaying

  const handleClick = (e) => {
    e.stopPropagation()
    
    if (!song) return
    
    if (isCurrentSong) {
      togglePlayPause()
    } else {
      playSong(song, songs.length > 0 ? songs : [song], index)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "relative",
        isCurrentSong && "text-primary",
        className
      )}
      onClick={handleClick}
      disabled={!song || isLoading}
      {...props}
    >
      {isLoading && isCurrentSong ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <>
          {showIcon && (
            isCurrentlyPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )
          )}
          {children}
        </>
      )}
    </Button>
  )
}

export default PlayButton