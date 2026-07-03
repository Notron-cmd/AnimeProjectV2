'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function SearchSection({ currentQuery, currentGenre }: { currentQuery: string, currentGenre: string }) {
  const [searchQuery, setSearchQuery] = useState(currentQuery);
  const [selectedGenre, setSelectedGenre] = useState(currentGenre);
  
  const router = useRouter();
  const pathname = usePathname();

  const genres = ['All Genres', 'Action', 'Adventure', 'Fantasy', 'Romance', 'Sci-Fi', 'Slice of Life', 'Drama', 'Comedy'];

  // Trigger pencarian ke URL setiap kali query text atau genre berubah
  useEffect(() => {
    const delayDebounceId = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedGenre && selectedGenre !== 'All Genres') params.set('genre', selectedGenre);

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 400); // Debounce 400ms biar tidak terlalu sering spam request saat mengetik

    return () => clearTimeout(delayDebounceId);
  }, [searchQuery, selectedGenre, router, pathname]);

  return (
    <section className="w-full bg-[#121317] px-6 sm:px-12 md:px-16 pt-12 pb-6 max-w-[1600px] mx-auto relative z-30">
      <div className="w-full bg-[#1a1b23] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          
          {/* Input Pencarian */}
          <div className="w-full lg:max-w-xl relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.601Z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari anime favoritmu di sini..."
              className="w-full bg-[#121317] border border-white/10 text-white placeholder-zinc-500 rounded-xl pl-12 pr-4 py-3.5 text-sm sm:text-base focus:outline-none focus:border-[#c3b4fc] focus:ring-1 focus:ring-[#c3b4fc] transition-all duration-200"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-end ">
            <div className="relative">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full sm:w-48 bg-[#121317] border border-white/10 text-zinc-300 text-sm rounded-xl px-4 py-3.5 appearance-none cursor-pointer focus:outline-none focus:border-[#c3b4fc] transition"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre} className="bg-[#1a1b23]">
                    {genre}
                  </option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-zinc-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}