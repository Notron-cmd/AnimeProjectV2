'use client';

import React, { useRef } from 'react';
import Link from 'next/link'; 
import AnimeCard from './AnimeCard';
import type { AniListAnime } from "@/lib/types";

export default function TrendingSection({ animeData }: { animeData: AniListAnime[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      
      carouselRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="w-full bg-[#121317] px-6 sm:px-12 md:px-16 py-8 max-w-[1600px] mx-auto relative z-30">
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#c3b4fc] rounded-full inline-block"></span>
            Trending Sekarang
          </h2>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-5">
          <Link 
            href="/trending"
            className="text-xs sm:text-sm font-semibold text-zinc-400 hover:text-[#c3b4fc] transition-colors flex items-center gap-1 group/see-more cursor-pointer"
          >
            See More
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/see-more:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          <span className="h-4 w-[1px] bg-white/10 block"></span>

          <div className="flex items-center space-x-2.5">
            <button onClick={() => handleScroll('left')} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1a1b23] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-[#c3b4fc] hover:border-[#c3b4fc]/30 transition group active:scale-90 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button onClick={() => handleScroll('right')} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1a1b23] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-[#c3b4fc] hover:border-[#c3b4fc]/30 transition group active:scale-90 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-0.5 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Wrapper */}
      <div 
        ref={carouselRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 progress-wrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:none"
      >
        {animeData.map((anime: AniListAnime) => (
          <Link href={`/anime/${anime.id}`} key={anime.id} className="snap-start shrink-0">
            <AnimeCard
              title={anime.title.english || anime.title.romaji}
              rating={anime.averageScore ? (anime.averageScore / 10).toFixed(1) : "N/A"}
              episode={anime.episodes?.toString() || "Ongoing"}
              type={anime.format || "TV"}
              image={anime.coverImage.large || anime.coverImage.extraLarge}
            />
          </Link>
        ))}
      </div>

    </section>
  );
}