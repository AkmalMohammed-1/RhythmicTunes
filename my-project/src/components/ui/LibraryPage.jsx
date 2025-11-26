import React, { useState } from "react";
import { LibraryItem } from "./LibraryItem";

function LibraryPage() {
  const [activeTab, setActiveTab] = useState("Playlists");

  const libraryData = {
    Playlists: [
      { id: 1, title: "Liked Songs", owner: "You", songs: 83, image: "/assets/liked.jpg" },
      { id: 2, title: "Fav ❤️", owner: "Mdjunaidshaik", songs: 52, image: "/assets/fav.jpg" },
      { id: 3, title: "Telugu 💖", owner: "Mohith", songs: 40, image: "/assets/telugu.jpg" },
    ],
    Albums: [],
    Artists: []
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <div className="flex gap-2">
          <input type="text" placeholder="Search..." className="border p-2 rounded" />
          <button className="bg-black text-white px-4 py-2 rounded">+ Create</button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        {["Playlists", "Albums", "Artists"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 rounded-full ${
              activeTab === tab ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {libraryData[activeTab].length === 0 ? (
          <p>No {activeTab} available.</p>
        ) : (
          libraryData[activeTab].map((item) => (
            <LibraryItem key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}

export { LibraryPage };
