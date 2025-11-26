import React from 'react'

export function HomePage() {
  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
          <h3 className="text-muted-foreground">Recently Played</h3>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
          <h3 className="text-muted-foreground">Top Charts</h3>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
          <h3 className="text-muted-foreground">Recommended</h3>
        </div>
      </div>
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Welcome to RhythmicTunes</h1>
          <p className="text-muted-foreground text-lg">Your music streaming experience starts here!</p>
        </div>
      </div>
    </>
  )
}