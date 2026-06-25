'use client';

import { useState, useMemo } from 'react';

const INITIAL_LIBRARY = [
  {
    id: 1,
    title: "Shadow's Embrace",
    status: "Watching",
    statusColor: "bg-violet-500",
    rating: "9.2",
    episodeProgress: "EPISODE 12 / 24",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=500",
  },
  {
    id: 2,
    title: "Skybound Chronicles",
    status: "Plan to Watch",
    statusColor: "bg-slate-400",
    rating: "8.7",
    episodeProgress: "EPISODE 0 / 12",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500",
  },
  {
    id: 3,
    title: "Nexus Paradox",
    status: "Completed",
    statusColor: "bg-cyan-400",
    rating: "9.5",
    episodeProgress: "EPISODE 24 / 24",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500",
  },
  {
    id: 4,
    title: "Blade of Echoes",
    status: "Watching",
    statusColor: "bg-violet-500",
    rating: "8.1",
    episodeProgress: "EPISODE 4 / 24",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500",
  },
];

export default function FavoriteLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Added");

  const filteredLibrary = useMemo(() => {
    let result = [...INITIAL_LIBRARY];
    if (selectedTab !== "All") {
      result = result.filter((item) => item.status === selectedTab);
    }
    if (searchQuery.trim() !== "") {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortBy === "Score (Highest)") {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortBy === "Alphabetical (A-Z)") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    return result;
  }, [searchQuery, selectedTab, sortBy]);

  return (
    <div className="space-y-6">
      {/* Kontrol Atas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Favorite Anime Collection</h2>
          <p className="text-xs text-muted-foreground mt-0.5"> Total saved: <span className="text-primary font-semibold">{filteredLibrary.length} titles</span></p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-muted-foreground text-lg">search</span>
            <input 
              type="text" 
              placeholder="Search favorites..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-ring focus:border-ring outline-none w-full sm:w-44 transition-all"
            />
          </div>
          
          <div className="relative flex items-center">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-card border border-border rounded-lg pl-3 pr-8 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-ring focus:border-ring outline-none cursor-pointer"
            >
              <option>Recently Added</option>
              <option>Score (Highest)</option>
              <option>Alphabetical (A-Z)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 pointer-events-none text-muted-foreground text-lg">expand_more</span>
          </div>
        </div>
      </div>

      {/* Filter Status Internal */}
      <div className="flex gap-1 border-b border-border/40 pb-px overflow-x-auto no-scrollbar">
        {["All", "Watching", "Completed", "Plan to Watch"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-all cursor-pointer ${
              selectedTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid Item Favorit */}
      {filteredLibrary.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredLibrary.map((anime) => (
            <div key={anime.id} className="group relative flex flex-col gap-2">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card border border-border/40 hover:ring-2 hover:ring-primary transition-all duration-300 shadow-sm cursor-pointer">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={anime.image} alt={anime.title} />
                
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-xs font-semibold text-foreground">{anime.rating}</span>
                  </div>
                  <p className="text-[9px] font-bold text-primary">{anime.episodeProgress}</p>
                </div>
              </div>

              <div className="px-0.5">
                <h3 className="font-medium text-xs text-foreground line-clamp-1 group-hover:text-primary transition-colors">{anime.title}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${anime.statusColor}`} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{anime.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-3xl text-muted-foreground/30 mb-1">folder_open</span>
          <p className="text-xs text-muted-foreground">No anime found in this filter.</p>
        </div>
      )}
    </div>
  );
}