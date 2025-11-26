import {
  Home,
  Search,
  Library,
  Heart,
  Plus,
  Music,
  Radio,
  Clock,
  ListMusic,
  Headphones,
  User,
  ChevronDown,
  Download,
} from "lucide-react";

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
    url: "#Home",
    icon: Home,
  },
  {
    title: "Search",
    url: "#Search",
    icon: Search,
  },
  {
    title: "Your Library",
    url: "#",
    icon: Library,
  },
];

// Library items
const libraryItems = [
  {
    title: "Liked Songs",
    url: "#",
    icon: Heart,
  },
  {
    title: "Recently Played",
    url: "#",
    icon: Clock,
  },
  {
    title: "Downloaded Music",
    url: "#",
    icon: Download,
  },
];

// Discover items
const discoverItems = [
  {
    title: "Browse",
    url: "#",
    icon: Music,
  },
  {
    title: "Radio",
    url: "#",
    icon: Radio,
  },
  {
    title: "Podcasts",
    url: "#",
    icon: Headphones,
  },
];

// Mock playlists data
const playlists = [
  "My Playlist #1",
  "Chill Vibes",
  "Workout Mix",
  "Road Trip Songs",
  "Study Music",
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1">
              <Music className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">RhythmicTunes</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
          <SidebarGroupAction title="Create Playlist">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Create Playlist</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {playlists.map((playlist, index) => (
                <SidebarMenuItem key={playlist}>
                  <SidebarMenuButton asChild>
                    <a href={`#playlist-${index}`}>
                      <ListMusic className="h-4 w-4" />
                      <span>{playlist}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User className="h-4 w-4" />
              <span>John Doe</span>
              <ChevronDown className="ml-auto h-4 w-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
