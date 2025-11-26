import React from 'react'
import { AppSidebar } from './app-sidebar'
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from './ui/sidebar'
import { Separator } from './ui/separator'
import { ThemeToggle } from './theme-toggle'

export function Layout({ children }) {
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
              <span className="text-muted-foreground">Home</span>
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