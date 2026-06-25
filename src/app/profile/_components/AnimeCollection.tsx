'use client';

import React, { useRef } from 'react';

interface MasterpieceAnime {
  rank: number;
  title: string;
  score: string;
  rewatched: number;
  imageUrl: string;
}

export default function AnimeCollection() {
  // Data Top 10 anime pilihan
  const masterpieces: MasterpieceAnime[] = [
    {
      rank: 1,
      title: "Shadow Rebirth",
      score: "10/10",
      rewatched: 7,
      imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=500",
    },
    {
      rank: 2,
      title: "Neon Pulse",
      score: "10/10",
      rewatched: 4,
      imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=500",
    },
    {
      rank: 3,
      title: "Zenith Garden",
      score: "9.8/10",
      rewatched: 2,
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bagian Anime Collection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>rewarded_ads</span>
            Anime Collection
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your personal elite tier: <span className="text-primary font-semibold">{masterpieces.length} / 10 slots filled</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/20 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-sm">add_circle</span>
            Add Anime
          </button>
        </div>
      </div>

      {/* Grid Poster 3D Parallax */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-5">
        {/* Render Card Anime */}
        {masterpieces.map((anime) => (
          <TiltPosterCard key={anime.rank} anime={anime} />
        ))}

        {/* Slot Kosong berikutnya */}
        <div className="aspect-[2/3] rounded-2xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center p-4 text-center group cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
          <div className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center mb-2.5 text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors">
            <span className="material-symbols-outlined text-xl">add</span>
          </div>
          <p className="font-semibold text-xs text-foreground/80 mb-0.5 group-hover:text-foreground">Slot #{masterpieces.length + 1}</p>
          <p className="text-[10px] text-muted-foreground">Click to fill slot</p>
        </div>

        {/* Slot Terkunci */}
        <div className="aspect-[2/3] rounded-2xl border-2 border-dashed border-border/20 flex flex-col items-center justify-center p-4 text-center opacity-40 bg-card/10">
          <div className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center mb-2.5 text-muted-foreground">
            <span className="material-symbols-outlined text-xl">lock</span>
          </div>
          <p className="font-semibold text-xs text-muted-foreground mb-0.5">Slot #{masterpieces.length + 2}</p>
          <p className="text-[9px] text-muted-foreground/60 italic">Elite Tier Required</p>
        </div>
      </div>
    </div>
  );
}

// Sub-komponen Card dengan efek 3D Tilt tetap dipertahankan
function TiltPosterCard({ anime }: { anime: MasterpieceAnime }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.1s ease-out, border-color 0.3s' }}
      className="relative group aspect-[2/3] rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 shadow-md bg-card cursor-pointer"
    >
      <img
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
        alt={anime.title}
        src={anime.imageUrl}
      />
      
      {/* Badge Urutan */}
      <div className="absolute top-3 left-3 z-20">
        <div className="bg-background/80 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-border flex items-center gap-1">
          <span className="material-symbols-outlined text-primary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>crown</span>
          <span className="text-[10px] font-bold text-foreground">#{anime.rank}</span>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-background via-background/50 to-transparent transition-opacity duration-300 z-10 flex flex-col justify-end p-4">
        <h3 className="font-bold text-xs text-foreground mb-1.5 line-clamp-1">{anime.title}</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-card/40 border border-border/50 p-1.5 rounded-lg backdrop-blur-sm">
            <p className="text-[8px] text-muted-foreground uppercase font-semibold">Score</p>
            <p className="font-bold text-foreground text-xs">{anime.score}</p>
          </div>
          <div className="bg-card/40 border border-border/50 p-1.5 rounded-lg backdrop-blur-sm">
            <p className="text-[8px] text-muted-foreground uppercase font-semibold">Rewatched</p>
            <p className="font-bold text-foreground text-xs">{anime.rewatched}x</p>
          </div>
        </div>
        <button className="w-full bg-primary text-primary-foreground py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer">
          Deep Dive
        </button>
      </div>
    </div>
  );
}