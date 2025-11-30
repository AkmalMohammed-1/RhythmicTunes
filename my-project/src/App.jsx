import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ThemeProvider } from './components/theme-provider'
import { AudioProvider } from './contexts/AudioContext'
import { AuthProvider } from './contexts/AuthContext'
import { PlaylistProvider } from './contexts/PlaylistContext'
import { LikeProvider } from './contexts/LikeContext'
import AudioPlayer from './components/AudioPlayer'
import ProtectedRoute from './components/ProtectedRoute'
import {
  HomePage,
  Search,
  Library,
  Browse,
  LikedSongs,
  RecentlyPlayed,
  Profile,
  Settings,
  Playlist,
  LoginPage,
  SignupPage
} from './pages'

export const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="rhythmic-tunes-theme">
      <AuthProvider>
        <LikeProvider>
          <PlaylistProvider>
            <AudioProvider>
            <Router>
            <Routes>
              {/* Public Routes - Full Screen */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected Routes - Main App Layout */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <div className="flex h-screen overflow-hidden">
                    <Layout>
                      <main className="flex-1 overflow-auto pb-20">
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/search" element={<Search />} />
                          <Route path="/library" element={<Library />} />
                          <Route path="/browse" element={<Browse />} />
                          <Route path="/liked-songs" element={<LikedSongs />} />
                          <Route path="/recently-played" element={<RecentlyPlayed />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/playlist/:id" element={<Playlist />} />
                        </Routes>
                      </main>
                      <AudioPlayer />
                    </Layout>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
            </Router>
          </AudioProvider>
        </PlaylistProvider>
      </LikeProvider>
    </AuthProvider>
  </ThemeProvider>
  )
}

export default App