// src/app/explore/_components/SearchBar.tsx
import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <section className="flex flex-col gap-4 items-center justify-center w-full pt-4">
      <h1 className="text-4xl md:text-5xl font-bold text-on-surface text-center tracking-tight">
        Discover Anime
      </h1>
      <p className="text-base md:text-lg text-on-surface-variant text-center max-w-2xl">
        Search across thousands of series. Immerse yourself in premium anime intelligence.
      </p>

      <div className="w-full max-w-3xl mt-4 relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.601Z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search anime..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search anime"
          className="w-full bg-surface-container border border-outline-variant rounded-xl py-3 pl-12 pr-24 text-on-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-lg"
        />
      </div>
    </section>
  );
};