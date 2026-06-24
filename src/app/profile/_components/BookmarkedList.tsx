'use client';

import React from 'react';

export default function BookmarkedList() {
  const bookmarks = [
    {
      id: 1,
      title: 'Velocity Protocol',
      meta: 'Sci-Fi • Action • 12 Episodes',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm73Gxnk7St4Le_msYivMaNDcBu3AjHq4alajc8ZZNu_4SgQccT0h-NkWHjYcosItFhA3hFOUHAxyqiadxuSBcvFyvTn1XJKJpZyNBSaWC9AQltwNc8RF8R33cqMssZ7z8hYtEqnGfBatwvdb0p5E3NTBG7utBMG97rGWgl2qfauuNAdi63rilDjCLOKBmmm8jbYpZBOtoWGA72w_Qoy_aJotHZl-RV9KdnA1O1ZIV3G99oDZvemw1GVt8SSqIp0jEIt9LzZRExg'
    },
    {
      id: 2,
      title: 'Neon Shadows',
      meta: 'Mystery • Cyberpunk • 24 Episodes',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMaDgLwlU6m3Vs5t8kxz3sW5DtOUBo1axpQjfXzLGWX_HBB2a3C1DozQB9C85_NTiQUBbuUvvOCSdDdaDAqSSEEyO8SYBM1FZm8CBIADNrU-nP0sU4JwfbKmXs9PjKNVqVY2iRq3FLaIoF4xR-tsEgaWvbRDhTZ3bsiLNCgQFb7Dwz3xaPJcmYzS6GALJJMT-IMVGjQ2kgZa2wGHH_xm-Kgrl80pkVFwHeiqblgzSUCAz4dDwDOUlKlDLBYj-MZ2dI88GwpTLycA'
    }
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-[#e2e2e6]">Bookmarked for Later</h2>
      <div className="space-y-3">
        {bookmarks.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center gap-4 p-2 rounded-lg hover:bg-[#333538]/30 border border-transparent hover:border-[#4a4455]/30 transition-all cursor-pointer group"
          >
            {/* Mini Square Poster */}
            <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-[#1e2023]">
              <img className="w-full h-full object-cover" src={item.image} alt={item.title} />
            </div>
            
            {/* Titles */}
            <div className="flex-grow">
              <h4 className="text-base font-semibold text-[#e2e2e6] group-hover:text-[#d2bbff] transition-colors">{item.title}</h4>
              <p className="text-sm text-[#ccc3d8] mt-0.5">{item.meta}</p>
            </div>
            
            {/* Remove Action Button (Trash Bin Icon) */}
            <button 
                className="text-[#ccc3d8] hover:text-red-500 active:text-red-600 transition-colors p-2 cursor-pointer rounded-lg hover:bg-red-500/10"
                onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Hapus bookmark ID: ${item.id}`);
                }}
                >
                {/* Berikan class material-symbols-outlined di sini */}
                <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}