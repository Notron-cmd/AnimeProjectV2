'use client';

import React from 'react';

export default function FeaturedCard() {
  return (
    <section className="mb-12 relative group">
      <div className="relative h-[420px] sm:h-[500px] w-full rounded-2xl overflow-hidden border border-[#242b33]/50 bg-gradient-to-br from-[#14181d]/70 to-[#121317]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-103 opacity-75"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C0F] via-[#0A0C0F/60] to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full md:w-2/3 z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-[#7c3aed] text-[#ede0ff] px-3.5 py-1 rounded-full text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              ⚡ RANKING #1
            </span>
            <span className="text-[#4cd7f6] text-xs font-bold tracking-wider uppercase">SEASONAL PREMIERE</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 text-white leading-tight">
            Project Aether: Zero Horizon
          </h2>
          <p className="text-sm sm:text-base text-[#ccc3d8] mb-6 line-clamp-3 max-w-2xl">
            In a world where digital souls are the primary currency, a rogue archivist discovers a forgotten sector of the network that holds the key to the physical world's restoration. A breathtaking visual masterpiece with high-octane action.
          </p>
          
          <div className="flex flex-wrap items-center gap-3">
            <button className="bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-[#ede0ff] px-6 py-2.5 rounded-xl font-semibold transition-all active:scale-95 cursor-pointer shadow-lg">
              ▶ Watch Now
            </button>
            <button className="border border-[#4a4455] hover:bg-[#333538]/40 text-white px-6 py-2.5 rounded-xl font-semibold transition-all cursor-pointer">
              + Add to List
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}