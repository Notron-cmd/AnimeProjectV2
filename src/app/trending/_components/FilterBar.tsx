'use client';

import React, { useState, useRef, useEffect } from 'react';

interface FilterBarProps {
  timeframe: 'week' | 'month' | 'all';
  setTimeframe: (value: 'week' | 'month' | 'all') => void;
  selectedGenre: string;
  setSelectedGenre: (value: string) => void;
}

export default function FilterBar({ timeframe, setTimeframe, selectedGenre, setSelectedGenre }: FilterBarProps) {
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const genreRef = useRef<HTMLDivElement>(null);
  const genres = ['All Genres', 'Action', 'Sci-Fi', 'Drama', 'Mystery', 'Fantasy', 'Romance'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genreRef.current && !genreRef.current.contains(event.target as Node)) {
        setIsGenreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      {/* Timeframe Toggles */}
      <div className="flex items-center gap-1.5 bg-[#1a1c1f] p-1 rounded-xl border border-[#4a4455]/40">
        {(([ 'week', 'month', 'all' ] as const)).map((type) => (
          <button 
            key={type}
            onClick={() => setTimeframe(type)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase cursor-pointer ${
              timeframe === type ? 'bg-[#333538] text-[#d2bbff]' : 'text-[#ccc3d8] hover:bg-[#333538]/50'
            }`}
          >
            {type === 'all' ? 'All Time' : `This ${type}`}
          </button>
        ))}
      </div>

      {/* Glassmorphic Genre Dropdown */}
      <div className="relative" ref={genreRef}>
        <button 
          onClick={() => setIsGenreOpen(!isGenreOpen)}
          className={`flex items-center gap-2.5 text-sm font-semibold px-4 py-2 rounded-full border backdrop-blur-md transition-all cursor-pointer ${
            isGenreOpen 
              ? 'bg-[#282a2d]/80 border-[#d2bbff] text-[#d2bbff] shadow-[0_0_12px_rgba(124,58,237,0.2)]' 
              : 'bg-[#282a2d]/40 border-white/10 text-[#ccc3d8] hover:text-white hover:border-white/20'
          }`}
        >
          {/* Mengganti emoji folder dengan SVG Folder */}
          <svg 
            className="w-4 h-4 stroke-current text-[#ccc3d8] group-hover:text-white" 
            viewBox="0 0 24 24" 
            fill="none" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
          </svg>

          <span>{selectedGenre}</span>
          
          {/* Mengganti panah teks dengan SVG Chevron Down yang presisi */}
          <svg 
            className={`w-3 h-3 stroke-current transition-transform duration-200 ${isGenreOpen ? 'rotate-180' : ''}`} 
            viewBox="0 0 24 24" 
            fill="none" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {isGenreOpen && (
          <div className="absolute right-0 left-0 mt-2 w-48 backdrop-blur-lg bg-[#282a2d]/70 border border-white/10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-1.5 z-50 overflow-hidden">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => {
                  setSelectedGenre(genre);
                  setIsGenreOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer block ${
                  selectedGenre === genre ? 'bg-[#7c3aed]/20 text-[#d2bbff] font-bold' : 'text-[#ccc3d8] hover:text-white hover:bg-white/5'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}