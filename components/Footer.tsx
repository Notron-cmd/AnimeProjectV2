import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b0c10] border-t border-white/5 mt-16">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 md:px-16 pt-16 pb-8">
        
        {/* BAGIAN ATAS: Grid Konten */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Kolom 1: Brand & Deskripsi (Membentang 2 kolom di layar besar) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-2xl font-bold text-[#c3b4fc] tracking-wide cursor-pointer">
              AniVision
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              AniVision adalah platform pelacak dan penemuan anime gratis. Temukan, tandai, dan kelola tontonan anime favoritmu disini!!
            </p>
            {/* Ikon Sosial Media */}
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-[#c3b4fc] hover:bg-[#c3b4fc]/10 hover:border-[#c3b4fc]/30 transition group">
                <span className="text-sm font-bold group-hover:scale-105 transition-transform">Dc</span> {/* Discord */}
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-[#c3b4fc] hover:bg-[#c3b4fc]/10 hover:border-[#c3b4fc]/30 transition group">
                <span className="text-sm font-bold group-hover:scale-105 transition-transform">Tw</span> {/* Twitter / X */}
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-[#c3b4fc] hover:bg-[#c3b4fc]/10 hover:border-[#c3b4fc]/30 transition group">
                <span className="text-sm font-bold group-hover:scale-105 transition-transform">Ig</span> {/* Instagram */}
              </a>
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-1 h-3 bg-[#c3b4fc] rounded-full"></span>
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li><a href="/" className="hover:text-[#c3b4fc] transition duration-200">Home</a></li>
              <li><a href="/trending" className="hover:text-[#c3b4fc] transition duration-200">Trending Anime</a></li>
              <li><a href="/schedule" className="hover:text-[#c3b4fc] transition duration-200">Schedule</a></li>
              <li><a href="/rankings" className="hover:text-[#c3b4fc] transition duration-200">Top Rated</a></li>
              <li><a href="/seasonal" className="hover:text-[#c3b4fc] transition duration-200">Seasonal</a></li>
              <li><a href="/airing" className="hover:text-[#c3b4fc] transition duration-200">Currently Airing</a></li>
            </ul>
          </div>

          {/* Kolom 3: Genre Populer */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-1 h-3 bg-[#c3b4fc] rounded-full"></span>
              Genre Populer
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-[#c3b4fc] transition duration-200">Action</a></li>
              <li><a href="#" className="hover:text-[#c3b4fc] transition duration-200">Fantasy</a></li>
              <li><a href="#" className="hover:text-[#c3b4fc] transition duration-200">Romance</a></li>
              <li><a href="#" className="hover:text-[#c3b4fc] transition duration-200">Sci-Fi</a></li>
            </ul>
          </div>

          {/* Kolom 4: Disclaimer / Dukungan */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-1 h-3 bg-[#c3b4fc] rounded-full"></span>
              Pernyataan
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed mb-3">
              AniVision adalah database dan platform pelacak anime. Kami tidak menyediakan, menyimpan, atau menautkan konten streaming apa pun.
            </p>
            <a href="#" className="text-xs text-[#c3b4fc] hover:underline font-medium">
              DMCA & Hak Cipta
            </a>
          </div>

        </div>

        {/* Divider Garis Tipis */}
        <hr className="border-white/5 my-6" />

        {/* BAGIAN BAWAH: Hak Cipta & Kebijakan */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © 2026 <span className="text-zinc-400 font-medium">AniVision</span>. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-zinc-300 transition">Terms of Service</a>
            <a href="#" className="hover:text-zinc-300 transition">Privacy Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}