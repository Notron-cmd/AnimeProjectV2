"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname(); 
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Trending', href: '/trending' },
    { name: 'Top Rated', href: '/top-rated' },
    { name: 'Search', href: '/explore' },
  ];

  return (
    <nav className="bg-[#0b0c10]/70 backdrop-blur-md border-b border-white/10 text-white px-6 h-16 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      
      {/* KIRI: Logo & Menu Navigasi Desktop */}
      <div className="flex items-center space-x-10">
        <Link href="/" className="text-xl font-bold text-[#c3b4fc] tracking-wide cursor-pointer hover:opacity-90 transition">
          AniVision
        </Link>
        
        <div className="hidden md:flex space-x-6 text-sm font-medium h-16 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center h-full cursor-pointer px-1 transition duration-200 ${
                  isActive ? 'text-[#c3b4fc] font-semibold' : 'text-zinc-400 hover:text-zinc-200' 
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#c3b4fc] rounded-t-md animate-fade-in"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* KANAN: Aksi & Tombol Hamburger */}
      <div className="flex items-center space-x-4 md:space-x-5">
        <button className="text-zinc-400 hover:text-zinc-200 focus:outline-none transition p-1 relative" aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        </button>

        <Link href="/profile" className="w-9 h-9 rounded-full overflow-hidden border border-zinc-700 cursor-pointer hover:border-purple-400 transition duration-200 relative block">
          <Image 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150" 
            alt="User Avatar" 
            fill
            className="object-cover"
          />
        </Link>

        {/* TOMBOL HAMBURGER MOBILE */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-transform duration-300 p-1 cursor-pointer focus:outline-none"
          aria-label="Toggle Menu"
        >
          {/* Ikon ditambahkan sedikit efek rotasi ketika status berubah */}
          <span className={`material-symbols-outlined text-[28px] transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
            {isOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* --- MENU DROPDOWN MOBILE DENGAN ANIMASI --- */}
      <div 
        className={`absolute top-16 left-0 right-0 bg-[#0b0c10]/95 backdrop-blur-lg border-b border-white/10 flex flex-col px-6 md:hidden z-40 transition-all duration-300 ease-in-out origin-top ${
          isOpen 
            ? 'max-h-[300px] opacity-100 py-6 visible pointer-events-auto' 
            : 'max-h-0 opacity-0 py-0 invisible pointer-events-none'
        }`}
      >
        {navLinks.map((link, index) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              /* Ditambahkan sedikit transisi translatif y agar item navigasi terlihat meluncur turun tipis saat dibuka */
              className={`text-base font-medium py-2 px-3 rounded-lg transition-all duration-300 ${
                isOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
              } ${
                isActive 
                  ? 'text-[#c3b4fc] bg-[#c3b4fc]/10 font-semibold' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
              style={{ transitionDelay: `${index * 40}ms` }} // Efek stagger (bergantian masuk) per menu link
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;