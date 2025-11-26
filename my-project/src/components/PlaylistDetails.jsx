import React from "react";
import { useLocation } from "react-router-dom";

function PlaylistDetails() {
  const { state } = useLocation();

  return (
    <div className="p-6">
      <img src={state.image} alt={state.title} className="w-40 h-40 rounded-lg mb-4" />
      <h1 className="text-3xl font-bold">{state.title}</h1>
      <p className="text-gray-600">Created by {state.owner} • {state.songs} songs</p>

      <button className="mt-4 bg-black text-white px-5 py-2 rounded">
        ▶ Play All
      </button>
    </div>
  );
}

export { PlaylistDetails };
