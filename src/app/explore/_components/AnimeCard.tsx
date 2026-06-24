import React from "react";

interface AnimeCardProps {
  anime: {
    id: number;
    title: string;
    rating: string;
    type: string;
    image: string;
  };
}

export const AnimeCard = ({ anime }: AnimeCardProps) => {
  return (
    <div className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-surface-container cursor-pointer transition-all duration-300 hover:border-primary border border-transparent hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]">
      <img
        src={anime.image}
        alt={anime.title}
        className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10 opacity-90" />

      <div className="absolute bottom-0 left-0 w-full p-3 z-20 flex flex-col gap-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-sm font-semibold text-on-surface line-clamp-2 leading-tight">
          {anime.title}
        </h3>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-secondary">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold text-on-surface">{anime.rating}</span>
          </div>
          <span className="text-[10px] text-on-surface-variant border border-outline-variant px-1 rounded-sm uppercase font-semibold">
            {anime.type}
          </span>
        </div>
      </div>
    </div>
  );
};