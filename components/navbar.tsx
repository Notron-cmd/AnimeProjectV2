"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logoutUser } from '@/src/app/actions/auth';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const fetchAvatar = useCallback(() => {
    fetch('/api/user')
      .then((res) => {
        if (!res.ok) {
          setIsLoggedIn(false);
          setAvatarUrl(null);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setIsLoggedIn(true);
        if (data?.user?.avatarUrl) {
          setAvatarUrl(data.user.avatarUrl);
        } else {
          setAvatarUrl(null);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setAvatarUrl(null);
      });
  }, []);

  useEffect(() => {
    fetchAvatar();
    window.addEventListener('avatar-updated', fetchAvatar);
    return () => window.removeEventListener('avatar-updated', fetchAvatar);
  }, [fetchAvatar]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoutRef = useRef<HTMLFormElement>(null);

  function handleLogout() {
    setProfileOpen(false);
    logoutRef.current?.requestSubmit();
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Trending', href: '/trending' },
    { name: 'Top Rated', href: '/rankings' },
    { name: 'Seasonal', href: '/seasonal' },
    { name: 'Airing', href: '/airing' },
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
        <NotificationBell />

        {isLoggedIn ? (
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="User menu"
              className="w-9 h-9 rounded-full overflow-hidden border border-zinc-700 cursor-pointer hover:border-purple-400 transition duration-200 relative block bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] flex items-center justify-center"
            >
              {avatarUrl ? (
                <Image src={avatarUrl} alt="User Avatar" fill sizes="36px" className="object-cover" />
              ) : (
                <span className="text-xs font-bold text-white">U</span>
              )}
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-[#1a1b1e] border border-zinc-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/50 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  Profile
                </Link>
                <form ref={logoutRef} action={logoutUser}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800/50 transition cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                    </svg>
                    Logout
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="text-xs font-medium text-zinc-400 hover:text-zinc-200 transition border border-zinc-700 hover:border-purple-400 px-3 py-1.5 rounded-lg"
          >
            Login
          </Link>
        )}

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