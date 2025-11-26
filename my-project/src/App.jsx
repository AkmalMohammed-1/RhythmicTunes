import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './components/HomePage'
import { ThemeProvider } from './components/theme-provider'
import { AudioProvider } from './contexts/AudioContext'
import AudioPlayer from './components/AudioPlayer'

export const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="rhythmic-tunes-theme">
      <AudioProvider>
        <Router>
          <div className="flex h-screen overflow-hidden">
            <Layout>
              <main className="flex-1 overflow-auto pb-20">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<div className="p-6"><h1 className="text-2xl font-bold">Search</h1><p className="text-muted-foreground">Search functionality coming soon...</p></div>} />
                  <Route path="/library" element={<div className="p-6"><h1 className="text-2xl font-bold">Your Library</h1><p className="text-muted-foreground">Library functionality coming soon...</p></div>} />
                  <Route path="/playlists" element={<div className="p-6"><h1 className="text-2xl font-bold">Playlists</h1><p className="text-muted-foreground">Playlists functionality coming soon...</p></div>} />
                </Routes>
              </main>
            </Layout>
            <AudioPlayer />
          </div>
        </Router>
      </AudioProvider>
    </ThemeProvider>
  )
}

export default App