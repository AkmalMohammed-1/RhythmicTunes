import React, { useState } from 'react'
import { useAudio } from '../contexts/AudioContext'
import { useSidebar } from './ui/sidebar'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Repeat1, 
  Shuffle,
  Heart,
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { cn } from '../lib/utils'

function AudioPlayer() {
  const [isMinimized, setIsMinimized] = useState(false)
  const { open: sidebarOpen } = useSidebar()
  
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    repeat,
    shuffle,
    isLoading,
    error,
    togglePlayPause,
    nextSong,
    previousSong,
    seekTo,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    formatTime,
    clearError
  } = useAudio()

  if (!currentSong) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleProgressChange = (value) => {
    const newTime = (value[0] / 100) * duration
    seekTo(newTime)
  }

  const handleVolumeChange = (value) => {
    setVolume(value[0] / 100)
  }

  const getRepeatIcon = () => {
    switch (repeat) {
      case 'track':
        return Repeat1
      case 'queue':
        return Repeat
      default:
        return Repeat
    }
  }

  const RepeatIcon = getRepeatIcon()

  return (
    <div className={cn(
      "fixed bottom-0 right-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-t border-border z-50 transition-all duration-300",
      // Responsive positioning based on sidebar state
      "left-0", // Always start from left-0 on mobile
      sidebarOpen ? "md:left-64" : "md:left-0", // On desktop: left-64 when sidebar open, left-0 when closed
      isMinimized ? "p-2" : "p-4"
    )}>
      {error && !isMinimized && (
        <div className="mb-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearError}
            className="h-auto p-1 text-destructive hover:text-destructive"
          >
            ×
          </Button>
        </div>
      )}
      
      {isMinimized ? (
        // Minimized View
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center overflow-hidden shrink-0">
            {currentSong.cover_url ? (
              <img 
                src={currentSong.cover_url} 
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {currentSong.title?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-xs truncate">{currentSong.title}</h4>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={previousSong}
              className="h-6 w-6 p-0"
            >
              <SkipBack className="h-3 w-3" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={togglePlayPause}
              disabled={isLoading}
              className="h-6 w-6 p-0"
            >
              {isLoading ? (
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={nextSong}
              className="h-6 w-6 p-0"
            >
              <SkipForward className="h-3 w-3" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMinimized(false)}
              className="h-6 w-6 p-0"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        // Expanded View
        <div className="flex items-center gap-4">
          {/* Minimize Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsMinimized(true)}
            className="h-8 w-8 p-0 shrink-0"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          {/* Song Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden shrink-0">
              {currentSong.cover_url ? (
                <img 
                  src={currentSong.cover_url} 
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {currentSong.title?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-sm truncate">{currentSong.title}</h4>
              <p className="text-xs text-muted-foreground truncate">
                {currentSong.artist_name || 'Unknown Artist'}
              </p>
            </div>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-3 flex-1 max-w-lg">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleShuffle}
                className={cn(
                  "h-8 w-8 p-0",
                  shuffle && "text-primary"
                )}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={previousSong}
                className="h-8 w-8 p-0"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg" 
                onClick={togglePlayPause}
                disabled={isLoading}
                className="h-10 w-10 rounded-full"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={nextSong}
                className="h-8 w-8 p-0"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleRepeat}
                className={cn(
                  "h-8 w-8 p-0",
                  repeat !== 'off' && "text-primary"
                )}
              >
                <RepeatIcon className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[progress]}
                onValueChange={handleProgressChange}
                max={100}
                step={0.1}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 flex-1 justify-end max-w-32">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleMute}
              className="h-8 w-8 p-0"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-20"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AudioPlayer