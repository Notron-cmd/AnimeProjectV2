import React from "react";
import { AnimeCard } from "./AnimeCard";

interface AnimeGridProps {
  animes: any[];
}

export const AnimeGrid = ({ animes }: AnimeGridProps) => {
  if (animes.length === 0) {
    return (
      <div className="text-center py-20 text-on-surface-variant text-base">
        Anime tidak ditemukan. Coba ketik kata kunci lain!
      </div>
    );
  }

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full">
      {animes.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </section>
  );
};