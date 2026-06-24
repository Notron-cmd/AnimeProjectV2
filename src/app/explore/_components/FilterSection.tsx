// src/app/explore/_components/FilterSection.tsx
import React, { useState, useRef, useEffect } from "react";

interface FilterSectionProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const FilterSection = ({
  selectedGenre,
  onGenreChange,
  sortBy,
  onSortChange,
}: FilterSectionProps) => {
  const genres = ["All", "Action", "Sci-Fi", "Drama", "Fantasy"];
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
        <span className="text-xs font-bold tracking-wider text-on-surface-variant uppercase">
          Active Filters
        </span>
        <button className="flex items-center gap-1.5 text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 12h7.5" />
          </svg>
          More Filters
        </button>
      </div>

      {/* Barisan Filter Chips */}
      <div className="flex flex-wrap items-center gap-2.5">
        
        
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
              {sortOptions.map((option) => {
                const isSelected = sortBy === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer block ${
                      isSelected
                        ? "bg-primary/20 text-primary font-semibold backdrop-blur-sm"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tombol List Genre dengan Efek Semi-Glass */}
        {genres.map((genre) => {
          const isActive = selectedGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => onGenreChange(genre)}
              className={`text-sm px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer border backdrop-blur-sm ${
                isActive
                  ? "border-primary bg-primary/20 text-primary font-semibold shadow-[0_0_15px_rgba(124,58,237,0.25)]" 
                  : "border-white/10 bg-surface-container/30 text-on-surface-variant hover:text-on-surface hover:border-white/20 hover:bg-surface-container/50"
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
};