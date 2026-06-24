'use client';

import React from 'react';

export default function FavoriteCollection() {
  const favorites = [
    { id: 1, title: 'Neon Genesis', rating: '9.8', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASW7bXsZfucYj2_RN2ldNLwqH6-WlRTWz9-T1MJc_aqrW4N7Upff-Ygi0ZbaJHBIZziJRhjIl0xz4w7teW6xCx58KpB-XIDb4-hsa-0m8_k7EMd_CU-JdKrq3dAzbs7MIN3ScgVE6pozgW8jRdnez-04LOvVdH_-Sd2k5GhodF7SOHND1DJkghWCCi-EnZqCrUU3It-s6eBONz87oH-DieLUphnE0SjQ_X_6WrWfDSd_L2E9FAEqc2-GwYa-_in4HKpLbUXcl8Aw', visibility: 'block' },
    { id: 2, title: 'Abyssal Knight', rating: '9.5', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD73_HlmRBnr7_fIKzOwOBFSxmEGpWjRsKA_a4F8tAzCfzGCh17hJGo_zM1eCOa0_GMxfLdE3lMK7L8G_860AfsiY9AT9IRx_7msV9Ogz2gjlafrIhmMcsMdexZeHxoeNqfkTR8gAa6FPGYgxuZIZFQEtlKY69E5Vt8FotwhI152wHPDBzfQZIRivRF7_aRNpHdPbkuFm8ltzUN4NKXH2nkLiwdCEgH0Tkc4DbEVuJ9sb19XOhoau8F0Se_0xfF-B0X1wkojshIkg', visibility: 'block' },
    { id: 3, title: 'Starlight Drift', rating: '9.2', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPqJkNMlo2BJCd_DCxJrrsmMjHNqvKsJ_K4fgc1JV5DHNDGQD2iOqf0l2HcZXYSZ2cdlaLqg9lQFZQjpt3_BNeORuo2JSh8xjbXSEgunW7CkVn2INOy2zA6aKNr3U7zVW4Wl8e1vIhXFi2NchAphtTECtyxMetfKtsIzJMKXeIOT1lJBRVszjMzI3s4O4sclyUSN8Ol1qWG2A9ZEoAzM2O953f2vO0fHXWNiFCXu1VuI0zmohQZ4EOoPUBpskyaliKfwRXOWyrwA', visibility: 'hidden sm:block' },
    { id: 4, title: 'Echoes', rating: '8.9', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeBOgi4o3nZIlCQZzqdTS1uH15ko9jo4Gz4av8jpibUZrkAF6Q71V0o2-UwfeI5Hg4B_VFwbmheTaQxZ0Rt9lBL6GVjtlqHLE9jaFTt0A_fAXoQYv1O1Sx9W0f1D2X9eJYGbuWZRxn9AAV8w3LEo8l28Hq6jEzLwK1AsM4TzfmrFpCAN8BYjgQCVxW96v1egNBmup06zz4E7iQtDu52YtcTrpytwvP_wXnQJN7HoMV2gkFMXeHcKvynkGNvoGq-NCC8luWeSZXSA', visibility: 'hidden lg:block' }
  ];

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#e2e2e6]">Favorite Collection</h2>
        <button className="text-sm font-medium text-[#d2bbff] hover:text-[#eaddff] transition-colors cursor-pointer">View All</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.map((item) => (
          <div 
            key={item.id} 
            className={`relative aspect-[2/3] rounded-lg overflow-hidden border border-[#4a4455]/30 group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(124,58,237,0.2)] hover:border-[#7c3aed] bg-[#1e2023] ${item.visibility}`}
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
        ))}
      </div>
    </section>
  );
}