'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
  
  return (
    <section className="relative w-full h-[600px] sm:h-[450px] md:h-[600px] lg:h-[1024px] pt-0">
        <div className="absolute inset-0 z-0 overflow-hidden">
           <Image 
            src="/assets/Homepage/BackgroundHome.jpg"
            alt="Hero Banner AniVision"
            fill
            priority
            className="object-cover object-[50%_30%]" 
            />
        </div>
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle,_transparent_30%,_rgba(18,19,23,0.85)_100%)]" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#121317] via-[#121317]/50 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#121317]/80 via-transparent to-transparent" />

        <div className="relative z-20 flex h-full items-end pb-12 px-6 sm:px-12 max-w-[1600px] mx-auto w-full">
          <div className="max-w-2xl text-white">
            <div className="flex items-center space-x-3 mb-3 text-xs sm:text-sm font-medium">
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
                9.2
              </span>
              <span className="text-zinc-300">2026</span>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-300">Action, Sci-Fi</span>
              <span className="text-zinc-400">•</span>
              <span className="border border-zinc-500/50 text-zinc-400 px-1.5 py-0.2 text-[10px] rounded tracking-wide uppercase font-bold">HD</span>
            </div>

            {/* Judul Anime */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-white mb-4 drop-shadow-md">
              Frieren: Beyond Journey's End
            </h1>

            {/* Deskripsi / Sinopsis */}
            {/* line-clamp digunakan agar di layar HP teks otomatis terpotong menjadi 2 baris saja agar rapi */}
            <p className="text-zinc-300 text-sm sm:text-base md:text-lg mb-8 leading-relaxed max-w-xl line-clamp-2 sm:line-clamp-3 lg:line-clamp-none drop-shadow">
              Mage elf Frieren dan rekan-rekan pahlawannya telah berhasil mengalahkan Raja Iblis dan membawa perdamaian ke dunia. Namun, sebagai elf, Frieren ditakdirkan hidup jauh lebih lama daripada teman-temannya. Petualangan barunya dimulai untuk memahami arti waktu dan hubungan manusia.
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-wrap gap-4">
              
              {/* Tombol Utama: Watch Now */}
              <button className="bg-[#c3b4fc] text-[#0b0c10] font-bold px-10 sm:px-8 py-3 rounded-xl flex items-center gap-2.5 hover:bg-[#b3a2f7] active:scale-95 transition-all duration-200 shadow-lg shadow-[#c3b4fc]/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
                Watch Now
              </button>

              {/* Tombol Kedua: Add to List */}
              <button className="bg-white/10 hover:bg-white/15 backdrop-blur-md text-white border border-white/15 font-semibold px-7 sm:px-6 py-3 rounded-xl flex items-center gap-2 active:scale-95 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                View Details
              </button>

            </div>
          </div>
        </div>
    </section>
  );
}