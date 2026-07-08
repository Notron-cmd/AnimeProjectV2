'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/components/ui/toast';
import { Trophy, Plus, Lock, Crown, Trash2 } from "lucide-react";
import { fetchWithCsrf } from '@/lib/csrf-client';

interface AnimeData {
  id: string;
  anilistId: number;
  title: string;
  imageUrl: string;
  genres: string[];
}

interface FavoriteItem {
  id: string;
  userId: string;
  animeId: string;
  createdAt: string;
  anime: AnimeData;
}

interface AnimeCollectionProps {
  favorites: FavoriteItem[];
  onRefresh?: () => void;
}

export default function AnimeCollection({ favorites, onRefresh }: AnimeCollectionProps) {
  const collection = favorites.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="text-primary text-2xl" />
            Anime Collection
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your personal elite tier: <span className="text-primary font-semibold">{collection.length} / 10 slots filled</span>
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-5">
        {collection.map((fav, index) => (
          <TiltPosterCard key={fav.id} favorite={fav} rank={index + 1} onRefresh={onRefresh} />
        ))}

        {collection.length < 10 && (
          <div className="aspect-[2/3] rounded-2xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center p-4 text-center group cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all duration-300">
            <div className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center mb-2.5 text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors">
              <Plus className="text-xl" />
            </div>
            <p className="font-semibold text-xs text-foreground/80 mb-0.5 group-hover:text-foreground">Slot #{collection.length + 1}</p>
            <p className="text-[10px] text-muted-foreground">Favorite more anime</p>
          </div>
        )}

        {Array.from({ length: Math.max(0, 9 - collection.length) }).map((_, i) => (
          <div key={`locked-${i}`} className="aspect-[2/3] rounded-2xl border-2 border-dashed border-border/20 flex flex-col items-center justify-center p-4 text-center opacity-40 bg-card/10">
            <div className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center mb-2.5 text-muted-foreground">
              <Lock className="text-xl" />
            </div>
            <p className="font-semibold text-xs text-muted-foreground mb-0.5">Slot #{collection.length + 2 + i}</p>
            <p className="text-[9px] text-muted-foreground/60 italic">Elite Tier Required</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TiltPosterCard({ favorite, rank, onRefresh }: { favorite: FavoriteItem; rank: number; onRefresh?: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleRemoveFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      const res = await fetchWithCsrf('/api/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          favoriteId: favorite.id,
          actionType: 'remove_favorite',
        }),
      });

      if (res.ok) {
        toast(`Berhasil menghapus ${favorite.anime.title} dari favorit`, 'success');
        onRefresh?.();
      } else {
        toast('Gagal menghapus dari favorit', 'error');
      }
    } catch {
      toast('Gagal menghapus dari favorit', 'error');
    }
  };

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
    <Link href={`/anime/${favorite.anime.anilistId}`}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transition: 'transform 0.1s ease-out, border-color 0.3s' }}
        className="relative group aspect-[2/3] rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 shadow-md bg-card cursor-pointer"
      >
        {favorite.anime.imageUrl ? (
          <Image
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            alt={favorite.anime.title}
            src={favorite.anime.imageUrl}
            fill
            sizes="(max-width: 640px) 50vw, 20vw"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#7c3aed]/20 to-[#4c1d95]/20">
            <span className="text-4xl font-bold text-[#7c3aed]/40">
              {favorite.anime.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 z-20">
          <div className="bg-background/80 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-border flex items-center gap-1">
            <Crown className="text-primary text-xs" />
            <span className="text-[10px] font-bold text-foreground">#{rank}</span>
          </div>
        </div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-background via-background/50 to-transparent transition-opacity duration-300 z-10 flex flex-col justify-end p-4">
          <h3 className="font-bold text-xs text-foreground mb-1.5 line-clamp-1">{favorite.anime.title}</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-card/40 border border-border/50 p-1.5 rounded-lg backdrop-blur-sm">
              <p className="text-[8px] text-muted-foreground uppercase font-semibold">Genres</p>
              <p className="font-bold text-foreground text-xs truncate">{favorite.anime.genres.slice(0, 2).join(', ')}</p>
            </div>
            <div className="bg-card/40 border border-border/50 p-1.5 rounded-lg backdrop-blur-sm">
              <p className="text-[8px] text-muted-foreground uppercase font-semibold">Added</p>
              <p className="font-bold text-foreground text-xs">{new Date(favorite.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button className="flex-1 bg-primary text-primary-foreground py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer">
              Detail
            </button>
            <button
              onClick={handleRemoveFavorite}
              className="bg-red-500/80 text-white py-1.5 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-red-500 transition-all cursor-pointer"
            >
              <Trash2 className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
