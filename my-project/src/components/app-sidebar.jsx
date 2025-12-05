import React, { useState } from 'react'
import {
  Home,
  Search,
  Library,
  Heart,
  Plus,
  Music,
  Users,
  Clock,
  ListMusic,
  Headphones,
  User,
  ChevronDown,
  LogOut,
  Settings,
  UserCircle,
  ChevronUp,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { usePlaylist } from '../contexts/PlaylistContext';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "./ui/sidebar";

// Main navigation items
const mainNavItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Your Library",
    url: "/library",
    icon: Library,
  },
];

// Library items
const libraryItems = [
  {
    title: "Liked Songs",
    url: "/liked-songs",
    icon: Heart,
  },
  {
    title: "Recently Played",
    url: "/recently-played",
    icon: Clock,
  },
];

// Discover items
const discoverItems = [
  {
    title: "Browse",
    url: "/browse",
    icon: Music,
  },
  {
    title: "Artists",
    url: "/artists",
    icon: Users,
  },
];

// Mock playlists data - removed, now using dynamic data

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { playlists, loading, createPlaylist } = usePlaylist();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleCreatePlaylist = async () => {
    const playlistData = {
      name: `My Playlist #${playlists.length + 1}`,
      description: `Created on ${new Date().toLocaleDateString()}`,
      song_ids: [],
      is_public: false
    };

    await createPlaylist(playlistData);
  };

  return (
    <Sidebar className="overflow-x-hidden">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1">
              <Music className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg truncate">RhythmicTunes</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Library Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Your Library</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {libraryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Discover Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Discover</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {discoverItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Playlists Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Playlists</SidebarGroupLabel>
          <SidebarGroupAction title="Create Playlist" onClick={handleCreatePlaylist}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">Create Playlist</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <SidebarMenuItem key={`skeleton-${i}`}>
                    <div className="flex items-center gap-2 p-2">
                      <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                      <div className="h-4 bg-muted animate-pulse rounded flex-1" />
                    </div>
                  </SidebarMenuItem>
                ))
              ) : playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <SidebarMenuItem key={playlist.id}>
                    <SidebarMenuButton asChild isActive={location.pathname === `/playlist/${playlist.id}`}>
                      <Link to={`/playlist/${playlist.id}`}>
                        <ListMusic className="h-4 w-4" />
                        <span className="truncate">{playlist.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem>
                  <div className="text-xs text-muted-foreground p-2">
                    No playlists yet. Create one!
                  </div>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="w-full"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <User className="h-4 w-4" />
              <span className="truncate">{user?.display_name || user?.username || 'User'}</span>
              {isUserMenuOpen ? (
                <ChevronUp className="ml-auto h-4 w-4" />
              ) : (
                <ChevronDown className="ml-auto h-4 w-4" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {/* Dropdown Menu Items */}
          {isUserMenuOpen && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="pl-8 text-sm">
                  <Link to="/profile">
                    <UserCircle className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="pl-8 text-sm">
                  <Link to="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className="pl-8 text-sm text-destructive hover:text-destructive"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
