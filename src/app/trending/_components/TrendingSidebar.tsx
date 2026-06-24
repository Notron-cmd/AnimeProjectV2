'use client';

import React from 'react';

export default function TrendingSidebar() {
  const risingStars = [
    { title: "Shadow Protocol", pop: "+142%", width: "w-3/4", img: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=200" },
    { title: "Flora's Memory", pop: "+85%", width: "w-1/2", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=200" },
    { title: "Velocity Shift", pop: "+64%", width: "w-1/3", img: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=200" },
  ];

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-6">
      
      {/* RISING STARS */}
      <div className="backdrop-blur-md bg-[#14181d]/70 border border-[#242b33]/50 p-5 rounded-2xl">
        <h4 className="font-bold text-base sm:text-lg mb-4 flex items-center gap-2 text-white">
          <span className="text-[#4cd7f6]">⚡</span> Rising Stars
        </h4>
        <div className="flex flex-col gap-4">
          {risingStars.map((star, idx) => (
            <div key={idx} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-14 h-16 rounded-lg bg-[#1e2023] overflow-hidden shrink-0">
                <img src={star.img} className="w-full h-full object-cover" alt={star.title} />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-bold line-clamp-1 group-hover:text-[#4cd7f6] transition-colors">{star.title}</h5>
                <p className="text-[#4cd7f6] text-[11px] font-semibold mt-0.5">▲ {star.pop} Popularity</p>
                <div className="mt-1.5 w-full h-1 bg-[#282a2d] rounded-full overflow-hidden">
                  <div className={`h-full bg-[#4cd7f6] ${star.width}`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WEEKLY STATS */}
      <div className="backdrop-blur-md bg-[#14181d]/70 border border-[#242b33]/50 p-5 rounded-2xl">
        <h4 className="font-bold text-base sm:text-lg mb-4 text-white">Weekly Stats</h4>
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-[#1a1c1f] p-4 rounded-xl border border-[#4a4455]/30">
            <span className="text-[#ccc3d8] text-[10px] font-bold tracking-wider block">ACTIVE VIEWERS</span>
            <div className="flex items-end justify-between mt-1">
              <span className="text-3xl font-extrabold text-[#d2bbff] leading-none">4.2M</span>
              <span className="text-green-400 font-bold text-xs">↑ 12%</span>
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

      {/* PREMIUM PROMO */}
      <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-[#242b33]/50 shadow-xl group">
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-102 transition-transform duration-700" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-[#7c3aed]/10 mix-blend-overlay"></div>
        <div className="absolute bottom-0 p-5 text-center w-full z-10">
          <h4 className="text-lg font-bold mb-1 text-white">AniVision Plus</h4>
          <p className="text-xs text-[#ccc3d8] mb-4">Unlock ad-free streaming and exclusive early access.</p>
          <button className="w-full bg-white text-black font-bold text-xs py-2.5 rounded-xl hover:bg-white/95 transition-all shadow-md cursor-pointer active:scale-98">
            UPGRADE NOW
          </button>
        </div>
      </div>

    </aside>
  );
}