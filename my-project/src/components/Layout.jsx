import React from 'react'
import { useLocation } from 'react-router-dom'
import { AppSidebar } from './app-sidebar'
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from './ui/sidebar'
import { Separator } from './ui/separator'
import { ThemeToggle } from './theme-toggle'

// Page title mappings
const pageTitles = {
  '/': 'Home',
  '/search': 'Search',
  '/library': 'Your Library',
  '/browse': 'Browse',
  '/artists': 'Artists',
  '/liked-songs': 'Liked Songs',
  '/recently-played': 'Recently Played',
}

export function Layout({ children }) {
  const location = useLocation()
  
  // Get current page title
  const getCurrentPageTitle = () => {
    const path = location.pathname
    
    // Handle playlist routes
    if (path.startsWith('/playlist/')) {
      return 'Playlist'
    }
    
    return pageTitles[path] || 'Unknown Page'
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="flex items-center gap-2">
              <span className="font-semibold">RhythmicTunes</span>
              <span className="text-muted-foreground">›</span>
              <span className="text-muted-foreground">{getCurrentPageTitle()}</span>
            </div>
          </div>
          <div className="px-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-auto scrollbar-hide">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}