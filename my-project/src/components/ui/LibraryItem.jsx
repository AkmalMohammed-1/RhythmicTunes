import React from "react";

function LibraryItem({ item }) {
  const handleClick = () => {
    console.log("Clicked:", item);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center p-3 bg-gray-100 rounded-lg mb-3 cursor-pointer hover:bg-gray-200"
    >
      <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg mr-4" />
      <div>
        <h3 className="text-lg font-bold">{item.title}</h3>
        <p className="text-sm text-gray-600">
          Playlist • {item.owner} • {item.songs} songs
        </p>
      </div>
    </div>
  );
}

export { LibraryItem };
