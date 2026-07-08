'use client';

import React from 'react';
import Link from 'next/link';
import type { AniListAnime } from "@/lib/types";

interface FeaturedCardProps {
  anime: AniListAnime;
}

export default function FeaturedCard({ anime }: FeaturedCardProps) {
  const title = anime.title.english || anime.title.romaji;
  
  // Bersihkan tag HTML dari deskripsi AniList jika ada
  const cleanSynopsis = anime.description 
    ? anime.description.replace(/<\/?[^>]+(>|$)/g, "") 
    : "No synopsis available.";

  const bannerImg = anime.bannerImage || anime.coverImage.extraLarge;

  return (
    <section className="mb-12 relative group">
      <div className="relative h-[420px] sm:h-[500px] w-full rounded-2xl overflow-hidden border border-[#242b33]/50 bg-gradient-to-br from-[#14181d]/70 to-[#121317]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-103 opacity-60"
          style={{ backgroundImage: `url('${bannerImg}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0F] via-[#0A0C0F]/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full md:w-2/3 z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-[#7c3aed] text-[#ede0ff] px-3.5 py-1 rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              RANKING #1
            </span>
            <span className="text-[#4cd7f6] text-xs font-bold tracking-wider uppercase">
              {anime.format || "TV SERIES"} • {anime.seasonYear || ""}
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 text-white leading-tight line-clamp-2">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-[#ccc3d8] mb-6 line-clamp-3 max-w-2xl">
            {cleanSynopsis}
          </p>
          
          <div className="flex flex-wrap items-center gap-3">
            <Link 
              href={`/anime/${anime.id}`}
              className="bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-[#ede0ff] px-6 py-2.5 rounded-xl font-semibold transition-all active:scale-95 cursor-pointer shadow-lg flex items-center gap-1.5"
            >
              <span>▶</span> See Details
            </Link>
            <button className="border border-[#4a4455] hover:bg-[#333538]/40 text-white px-6 py-2.5 rounded-xl font-semibold transition-all cursor-pointer">
              + Add to Bookmark
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}