'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { AniListAnime } from "@/lib/types";

interface TrendingSidebarProps {
  stars: AniListAnime[];
  loading: boolean;
}

export default function TrendingSidebar({ stars, loading }: TrendingSidebarProps) {
  // Cari nilai tren tertinggi untuk dijadikan acuan batas 100% pada progress bar
  const maxTrendingScore = stars.length > 0 ? Math.max(...stars.map(s => s.trending || 1)) : 1;

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-6">
      
      {/* RISING STARS */}
      <div className="backdrop-blur-md bg-[#14181d]/70 border border-[#242b33]/50 p-5 rounded-2xl">
        <h2 className="font-bold text-base sm:text-lg mb-4 flex items-center gap-2 text-white">
          <svg className="w-4 h-4 fill-[#4cd7f6] text-[#4cd7f6]" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Rising Stars
        </h2>
        
        <div className="flex flex-col gap-4">
          {loading ? (
            // Skeleton loader untuk sidebar saat loading
            [...Array(3)].map((_, idx) => (
              <div key={idx} className="flex items-center gap-3 animate-pulse">
                <div className="w-14 h-16 rounded-lg bg-[#1e2023]" />
                <div className="flex-1">
                  <div className="h-3 bg-[#1e2023] rounded w-3/4 mb-2" />
                  <div className="h-2 bg-[#1e2023] rounded w-1/2" />
                </div>
              </div>
            ))
          ) : stars.length > 0 ? (
            stars.slice(0, 4).map((star) => {
              const displayTitle = star.title.english || star.title.romaji;
              
              // Hitung persentase bar secara dinamis berdasarkan skor tren dibanding skor tertinggi
              const barWidth = Math.min(Math.max(((star.trending ?? 0) / maxTrendingScore) * 100, 15), 100);
              
              // Format angka popularitas besar (misal 150000 -> 150K)
              const totalFans = (star.popularity ?? 0) >= 1000 
                ? `${((star.popularity ?? 0) / 1000).toFixed(0)}K fans` 
                : `${star.popularity ?? 0} fans`;

              return (
                <Link 
                  key={star.id} 
                  href={`/anime/${star.id}`}
                  className="flex items-center gap-3 group cursor-pointer block"
                >
                  <div className="relative w-14 h-16 rounded-lg bg-[#1e2023] overflow-hidden shrink-0 border border-white/5">
                    <Image 
                      src={star.coverImage.medium || star.coverImage.large} 
                      alt={displayTitle} 
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      loading="lazy"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold line-clamp-1 group-hover:text-[#4cd7f6] transition-colors">
                      {displayTitle}
                    </h3>
                    
                    <p className="text-[#4cd7f6] text-[11px] font-semibold mt-0.5 flex items-center justify-between">
                      <span className="flex items-center gap-0.5">
                        <svg className="w-3 h-3 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                          <polyline points="16 7 22 7 22 13" />
                        </svg>
                        +{star.trending} Hot Points
                      </span>
                      <span className="text-[#ccc3d8]/60 font-normal">{totalFans}</span>
                    </p>

                    {/* Progress Bar Dinamis */}
                    <div className="mt-1.5 w-full h-1 bg-[#282a2d] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#4cd7f6] transition-all duration-500" 
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-xs text-zinc-500 text-center py-2">No rising stars available.</div>
          )}
        </div>
      </div>

      {/* WEEKLY STATS (Tetap statis seperti desain awalmu) */}
      <div className="backdrop-blur-md bg-[#14181d]/70 border border-[#242b33]/50 p-5 rounded-2xl">
        <h2 className="font-bold text-base sm:text-lg mb-4 text-white">Weekly Stats</h2>
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-[#1a1c1f] p-4 rounded-xl border border-[#4a4455]/30">
            <span className="text-[#ccc3d8] text-[10px] font-bold tracking-wider block">ACTIVE VIEWERS</span>
            <div className="flex items-end justify-between mt-1">
              <span className="text-3xl font-extrabold text-[#d2bbff] leading-none">4.2M</span>
              <span className="text-green-400 font-bold text-xs flex items-center gap-0.5">
                <svg className="w-3 h-3 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
                12%
              </span>
            </div>
          </div>
          <div className="bg-[#1a1c1f] p-4 rounded-xl border border-[#4a4455]/30">
            <span className="text-[#ccc3d8] text-[10px] font-bold tracking-wider block">NEW RELEASES</span>
            <div className="flex items-end justify-between mt-1">
              <span className="text-3xl font-extrabold text-white leading-none">28</span>
              <span className="text-[#ccc3d8] text-xs">This week</span>
            </div>
          </div>
        </div>
      </div>

      {/* PREMIUM PROMO (Tetap statis seperti desain awalmu) */}
      <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-[#242b33]/50 shadow-xl group">
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-102 transition-transform duration-700" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-[#7c3aed]/10 mix-blend-overlay"></div>
        <div className="absolute bottom-0 p-5 text-center w-full z-10">
          <h2 className="text-lg font-bold mb-1 text-white">AniVision Plus</h2>
          <p className="text-xs text-[#ccc3d8] mb-4">Unlock ad-free streaming and exclusive early access.</p>
          <button className="w-full bg-white text-black font-bold text-xs py-2.5 rounded-xl hover:bg-white/95 transition-all shadow-md cursor-pointer active:scale-98">
            UPGRADE NOW
          </button>
        </div>
      </div>

    </aside>
  );
}