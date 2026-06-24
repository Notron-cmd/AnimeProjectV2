"use client";

import React, { useState } from "react";
import { SearchBar } from "./_components/SearchBar";
import { FilterSection } from "./_components/FilterSection"; 
import { AnimeGrid } from "./_components/AnimeGrid";

interface ExploreClientProps {
  initialAnime: any[];
}

const ExploreClient = ({ initialAnime }: ExploreClientProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");

  // Logika Filter & Sorting Gabungan (Instant Client-side)
  const processedAnime = initialAnime
    .filter((anime) => {
      // 1. Filter berdasarkan pencarian kata kunci
      const matchesSearch = anime.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Filter berdasarkan genre chip yang aktif
      const matchesGenre = selectedGenre === "All" || anime.genres.includes(selectedGenre);
      
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      // 3. Logika Sorting
      if (sortBy === "rating") return parseFloat(b.rating) - parseFloat(a.rating);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return b.popularity - a.popularity; // Default: Popularity
    });

  return (
    <main className="flex-grow flex flex-col px-6 py-10 gap-6 max-w-7xl mx-auto w-full pt-24 min-h-screen">
      {/* 1. Area Search */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* 2. Area Komponen Filter Sesuai Gambar Screenshot */}
      <FilterSection
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* 3. Area Grid List Menampilkan Hasil Akhir */}
      <AnimeGrid animes={processedAnime} />
    </main>
  );
};

export default ExploreClient;