import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLikes } from '../contexts/LikeContext'
import { usePlaylist } from '../contexts/PlaylistContext'
import { userService } from '../services'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { UserCircle, Mail, Calendar, Music, Heart, Clock } from 'lucide-react'

export function Profile() {
  const { user } = useAuth()
  const { likedSongs, loading: likesLoading } = useLikes()
  const { playlists } = usePlaylist()
  const [recentlyPlayedCount, setRecentlyPlayedCount] = useState(0)
  const [userStats, setUserStats] = useState({
    likedCount: 0,
    playlistCount: 0,
    recentlyPlayedCount: 0,
    estimatedHours: 0
  })

  useEffect(() => {
    const loadUserStats = async () => {
      if (!user?.id) return
      
      try {
        // Get fresh user data for recently played
        const freshUserData = await userService.getUserById(user.id)
        const recentlyPlayedCount = freshUserData?.recently_played?.length || 0
        
        setUserStats({
          likedCount: likedSongs?.length || 0,
          playlistCount: playlists?.length || 0,
          recentlyPlayedCount,
          estimatedHours: Math.round(recentlyPlayedCount * 3.5) // 3.5 min average per song
        })
        
      } catch (error) {
        console.error('Failed to load user stats:', error)
        setUserStats({
          likedCount: likedSongs?.length || 0,
          playlistCount: playlists?.length || 0,
          recentlyPlayedCount: user?.recently_played?.length || 0,
          estimatedHours: Math.round((user?.recently_played?.length || 0) * 3.5)
        })
      }
    }
    
    loadUserStats()
  }, [user, likedSongs, playlists])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <UserCircle className="h-8 w-8" />
          Profile
        </h1>
        <p className="text-muted-foreground">View your account information and music activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {user?.display_name || user?.username || 'User'}
                </h3>
                <Badge variant="secondary">Free User</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Username</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.username || 'Not set'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.email || 'Not set'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Music Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Music Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mx-auto mb-2">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-2xl font-bold">{userStats.likedCount}</p>
                <p className="text-sm text-muted-foreground">Liked Songs</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 mx-auto mb-2">
                  <Music className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-2xl font-bold">{userStats.playlistCount}</p>
                <p className="text-sm text-muted-foreground">Playlists</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 mx-auto mb-2">
                  <Clock className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-2xl font-bold">{userStats.estimatedHours}m</p>
                <p className="text-sm text-muted-foreground">Est. Listening Time</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 mx-auto mb-2">
                  <Music className="h-6 w-6 text-purple-500" />
                </div>
                <p className="text-2xl font-bold">{userStats.recentlyPlayedCount}</p>
                <p className="text-sm text-muted-foreground">Recently Played</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Subscription</h3>
              <p className="text-sm text-muted-foreground">
                You're currently on the free plan
              </p>
            </div>
            <Badge variant="outline">Free Plan</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile