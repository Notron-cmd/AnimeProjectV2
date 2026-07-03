// src/app/explore/_components/FilterSection.tsx
import React, { useState, useRef, useEffect } from "react";

interface FilterSectionProps {
  selectedGenres: string[]; // Sekarang berupa array
  onGenreToggle: (genre: string) => void;
  onClearGenres: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  selectedFormat: string;
  onFormatChange: (format: string) => void;
}

export const FilterSection = ({
  selectedGenres,
  onGenreToggle,
  onClearGenres,
  sortBy,
  onSortChange,
  selectedFormat,
  onFormatChange,
}: FilterSectionProps) => {
  const genres = ["Action", "Sci-Fi", "Drama", "Fantasy", "Comedy", "Adventure", "Romance"];
  const formats = ["All", "TV", "MOVIE", "OVA", "ONA", "SPECIAL"];
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { value: "popularity", label: "Sort: Popularity" },
    { value: "rating", label: "Sort: Top Rating" },
    { value: "title", label: "Sort: Alphabetical" },
  ];

  const currentSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || "Sort: Popularity";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full border-y border-outline-variant/30 py-4 my-2">
      {/* Header Filter */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">
            Active Filters
          </span>
          {selectedGenres.length > 0 && (
            <button 
              onClick={onClearGenres}
              className="text-xs text-red-400 hover:underline cursor-pointer"
            >
              (Clear All)
            </button>
          )}
        </div>
        <button 
          onClick={() => setIsMoreFiltersOpen(!isMoreFiltersOpen)}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${isMoreFiltersOpen ? "text-primary" : "text-sky-400 hover:text-sky-300"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 12h7.5" />
          </svg>
          {isMoreFiltersOpen ? "Hide Filters" : "More Filters"}
        </button>
      </div>

      {/* Barisan Filter Chips UTAMA (Multi-Select Genre) */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Dropdown Sorting */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center justify-between gap-3 text-sm text-on-surface font-medium pl-4 pr-3.5 py-1.5 rounded-full border transition-all duration-300 cursor-pointer min-w-[165px] text-left backdrop-blur-md ${
              isDropdownOpen 
                ? "bg-surface-container-high/80 border-primary ring-1 ring-primary shadow-[0_0_15px_rgba(124,58,237,0.25)]" 
                : "bg-surface-container-high/40 border-white/10 hover:border-white/20 hover:bg-surface-container-high/60"
            }`}
          >
            <span>{currentSortLabel}</span>
            <span className={`text-[9px] text-on-surface-variant transition-transform duration-200 block ${isDropdownOpen ? "rotate-180 text-primary" : ""}`}>
              ▼
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 backdrop-blur-lg bg-surface-container-high/60 border border-white/10 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-1.5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer block ${
                    sortBy === option.value
                      ? "bg-primary/20 text-primary font-semibold backdrop-blur-sm"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tombol "All" - Aktif jika tidak memilih genre apapun */}
        <button
          onClick={onClearGenres}
          className={`text-sm px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer border backdrop-blur-sm ${
            selectedGenres.length === 0
              ? "border-primary bg-primary/20 text-primary font-semibold shadow-[0_0_15px_rgba(124,58,237,0.25)]" 
              : "border-white/10 bg-surface-container/30 text-on-surface-variant hover:text-on-surface"
          }`}
        >
          All Genres
        </button>

        {/* List Chips Genre Multi-Select */}
        {genres.map((genre) => {
          const isActive = selectedGenres.includes(genre);
          return (
            <button
              key={genre}
              onClick={() => onGenreToggle(genre)}
              className={`text-sm px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer border backdrop-blur-sm flex items-center gap-1.5 ${
                isActive
                  ? "border-primary bg-primary/20 text-primary font-semibold shadow-[0_0_15px_rgba(124,58,237,0.25)]" 
                  : "border-white/10 bg-surface-container/30 text-on-surface-variant hover:text-on-surface hover:border-white/20"
              }`}
            >
              <span>{genre}</span>
              {isActive && <span className="text-[10px] opacity-70">✕</span>}
            </button>
          );
        })}
      </div>

      {/* PANEL MORE FILTERS (Format Dropdown yang Tersembunyi) */}
      {isMoreFiltersOpen && (
        <div className="mt-4 p-4 bg-surface-container-high/30 border border-white/5 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Media Format</h4>
          <div className="flex flex-wrap gap-2">
            {formats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => onFormatChange(fmt)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedFormat === fmt
                    ? "border-sky-400 bg-sky-400/20 text-sky-400 font-medium"
                    : "border-white/5 bg-zinc-900/40 text-zinc-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {fmt === 'All' ? 'All Formats' : fmt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};