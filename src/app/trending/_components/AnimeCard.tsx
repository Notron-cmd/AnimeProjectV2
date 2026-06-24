'use client';

import React from 'react';

interface AnimeCardProps {
  rank: string;
  title: string;
  genre: string;
  views: string;
  image: string;
}

export default function AnimeCard({ rank, title, genre, views, image }: AnimeCardProps) {
  return (
    <div className="group flex flex-col gap-2 p-1 rounded-xl border border-transparent hover:border-[#7c3aed] hover:-translate-y-1 transition-all duration-300 bg-[#121317]/20">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1e2023]">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
        />
        {/* Badge Rank */}
        <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[#d2bbff] font-bold text-xs border border-[#d2bbff]/30">
          {rank}
        </div>
        {/* Quick View Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <button className="w-full bg-[#d2bbff] text-[#3f008e] py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] cursor-pointer">
            Quick View
          </button>
        </div>
      </div>

      <div className="px-1.5 py-1">
        <h3 className="font-bold text-sm sm:text-base line-clamp-1 group-hover:text-[#d2bbff] transition-colors">
          {title}
        </h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-[#ccc3d8]">{genre}</span>
          <span className="text-[11px] font-semibold text-[#4cd7f6] flex items-center gap-1">
            👁️ {views}
          </span>
        </div>
      </div>
    </div>
  );
}