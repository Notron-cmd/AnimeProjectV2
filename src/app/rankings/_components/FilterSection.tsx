'use client';

import React from 'react';

const GENRES = [
  'All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mecha', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports',
  'Supernatural', 'Thriller',
];

const STATUSES = ['All', 'RELEASING', 'FINISHED', 'NOT_YET_RELEASED', 'CANCELLED'];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = ['All', ...Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i)];

interface FilterSectionProps {
  genre: string;
  year: number | undefined;
  status: string;
  onGenreChange: (g: string) => void;
  onYearChange: (y: number | undefined) => void;
  onStatusChange: (s: string) => void;
  total: number;
}

export default function FilterSection({
  genre, year, status,
  onGenreChange, onYearChange, onStatusChange,
  total,
}: FilterSectionProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 py-4 border-y border-[#4a4455]/20">
      <div className="flex flex-wrap gap-2">
        <select
          value={genre}
          onChange={(e) => onGenreChange(e.target.value)}
          className="px-4 py-1.5 rounded-full bg-[#282a2d] border border-[#4a4455]/20 hover:border-[#7c3aed] transition-all text-xs font-semibold text-white outline-none cursor-pointer appearance-none"
        >
          {GENRES.map((g) => (
            <option key={g} value={g} className="bg-[#1a1c1f]">{g === 'All' ? 'Genre: All' : g}</option>
          ))}
        </select>

        <select
          value={year ?? 'All'}
          onChange={(e) => onYearChange(e.target.value === 'All' ? undefined : Number(e.target.value))}
          className="px-4 py-1.5 rounded-full bg-[#282a2d] border border-[#4a4455]/20 hover:border-[#7c3aed] transition-all text-xs font-semibold text-white outline-none cursor-pointer appearance-none"
        >
          {YEARS.map((y) => (
            <option key={y} value={y} className="bg-[#1a1c1f]">{y === 'All' ? 'Year: All' : String(y)}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-1.5 rounded-full bg-[#282a2d] border border-[#4a4455]/20 hover:border-[#7c3aed] transition-all text-xs font-semibold text-white outline-none cursor-pointer appearance-none"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} className="bg-[#1a1c1f]">{s === 'All' ? 'Status: All' : s}</option>
          ))}
        </select>
      </div>
      <div className="text-zinc-400 text-sm">
        Showing {total} titles
      </div>
    </div>
  );
}
