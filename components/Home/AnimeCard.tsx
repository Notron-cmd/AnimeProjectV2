import React from 'react';
import Image from 'next/image';

interface AnimeCardProps {
  title: string;
  image: string;
  rating: string;
  episode: string;
  type: string;
}

export default function AnimeCard({ title, image, rating, episode, type }: AnimeCardProps) {
  return (
    <div className="w-[160px] sm:w-[200px] md:w-[220px] shrink-0 snap-start group cursor-pointer">
      
      {/* Container Gambar dengan Efek Hover */}
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden border border-white/5 bg-[#1a1b23] group-hover:border-[#c3b4fc]/40 group-hover:shadow-lg group-hover:shadow-[#c3b4fc]/10 transition-all duration-300">
        
        {/* Gambar Poster Anime */}
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, 220px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge Rating & Tipe (Melayang di atas) */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center z-10">
          <span className="bg-[#0b0c10]/80 backdrop-blur-md text-[#c3b4fc] text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-amber-400">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
            {rating}
          </span>
          <span className="bg-white/10 backdrop-blur-md text-zinc-200 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md border border-white/5">
            {type}
          </span>
        </div>

        {/* Gradient Hitam Tipis di bagian bawah card agar teks Episode terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10]/90 via-transparent to-transparent opacity-100" />
        
        {/* Info Jumlah Episode */}
        <div className="absolute bottom-2.5 left-2.5 text-zinc-300 text-[11px] sm:text-xs font-medium">
          {episode} Eps
        </div>

      </div>

      {/* Detail Teks di Luar Card (Agar Grid Tetap Rapi) */}
      <div className="mt-3 px-1">
        <h3 className="text-sm sm:text-base font-semibold text-zinc-200 group-hover:text-[#c3b4fc] line-clamp-1 transition-colors duration-200">
          {title}
        </h3>
      </div>

    </div>
  );
}