'use client';

import React, { useState } from 'react';
import FeaturedCard from './_components/FeaturedCard';
import FilterBar from './_components/FilterBar';
import AnimeCard from './_components/AnimeCard';
import TrendingSidebar from './_components/TrendingSidebar';

export default function TrendingPage() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');

  // Kumpulan data simulasi/dummy item grid anime
  const cardData = [
    { rank: "#2", title: "Cyber Slayers", genre: "Action • Sci-Fi", views: "2.4M", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400" },
    { rank: "#3", title: "Garden of Echoes", genre: "Drama • Mystery", views: "1.9M", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400" },
    { rank: "#4", title: "Void Runners", genre: "Sports • Tech", views: "1.8M", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400" },
    { rank: "#5", title: "Eternal Archive", genre: "Fantasy • Magic", views: "1.5M", image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=400" },
    { rank: "#6", title: "Neon Pulse", genre: "Music • Slice of Life", views: "1.2M", image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=400" },
    { rank: "#7", title: "Binary Hearts", genre: "Romance • Comedy", views: "980K", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400" },
    { rank: "#8", title: "Iron Valkyrie", genre: "Mecha • Military", views: "850K", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400" },
    { rank: "#9", title: "Solar Drift", genre: "Adventure • Space", views: "720K", image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=400" },
    { rank: "#10", title: "Grimwire", genre: "Horror • Thriller", views: "650K", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400" },
    { rank: "#11", title: "Glitch Kingdom", genre: "Isekai • Adventure", views: "590K", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=400" },
    { rank: "#12", title: "Zenith Gate", genre: "Shounen • Action", views: "540K", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400" },
    { rank: "#13", title: "Midnight Code", genre: "Supernatural", views: "410K", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400" }
  ];

  return (
    <main className="min-h-screen bg-[#0A0C0F] text-[#e2e2e6] pt-24 pb-10 max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
      
      {/* HEADER UTAMA */}
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 text-white font-display">
          Trending Now
        </h1>
        <p className="text-base sm:text-lg text-[#ccc3d8] max-w-2xl">
          Discover the series that are capturing the world's attention this week. Real-time popularity data driven by global engagement.
        </p>
      </header>

      {/* SEKSI HIGHLIGHT RANK #1 */}
      <FeaturedCard />

      {/* CORE LAYOUT DENGAN SIDEBAR */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* KOLOM KIRI: FILTERS & GRID CARDS */}
        <div className="flex-1">
          <FilterBar 
            timeframe={timeframe} 
            setTimeframe={setTimeframe} 
            selectedGenre={selectedGenre} 
            setSelectedGenre={setSelectedGenre} 
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
            {cardData.map((anime, index) => (
              <AnimeCard key={index} {...anime} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button className="px-6 py-3 rounded-xl border border-[#4a4455] text-white hover:bg-[#333538] transition-all text-xs font-bold tracking-wider cursor-pointer active:scale-95">
              LOAD MORE TRENDING
            </button>
          </div>
        </div>

        {/* KOLOM KANAN: SIDEBAR */}
        <TrendingSidebar />

      </div>
    </main>
  );
}