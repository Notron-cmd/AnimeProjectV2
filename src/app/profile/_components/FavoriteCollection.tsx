'use client';

import React from 'react';

interface FavoriteAnime {
  id: string;
  title: string;
  rating: string;
  image: string;
}

interface FavoriteCollectionProps {
  libraryData: FavoriteAnime[];
}

export default function FavoriteCollection({ libraryData }: FavoriteCollectionProps) {
  // Ambil maksimal 4 data teratas untuk display ringkasan overview
  const displayFavorites = libraryData.slice(0, 4);

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#e2e2e6]">Favorite Collection</h2>
      </div>

      {displayFavorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayFavorites.map((item, index) => {
            // Mengatur visibilitas responsif berdasarkan urutan grid
            const visibilityClass = 
              index === 2 ? 'hidden sm:block' : 
              index === 3 ? 'hidden lg:block' : 'block';

            return (
              <div 
                key={item.id} 
                className={`relative aspect-[2/3] rounded-lg overflow-hidden border border-[#4a4455]/30 group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(124,58,237,0.2)] hover:border-[#7c3aed] bg-[#1e2023] ${visibilityClass}`}
              >
                <img className="w-full h-full object-cover" src={item.image} alt={item.title} />
                
                {/* Hover Gradient Text Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0F]/90 via-transparent to-transparent flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
                  <div className="flex items-center gap-1 text-[#4cd7f6] mt-0.5">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-xs font-semibold tracking-wider">{item.rating}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic py-2">Belum ada anime favorit koleksi.</p>
      )}
    </section>
  );
}