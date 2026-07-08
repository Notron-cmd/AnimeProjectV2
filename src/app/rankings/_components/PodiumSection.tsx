'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/components/ui/toast';
import { Star, RefreshCw, Plus } from "lucide-react";
import { fetchWithCsrf } from '@/lib/csrf-client';
import type { AniListAnime } from "@/lib/types";

interface PodiumSectionProps {
  topThree: AniListAnime[];
}

export default function PodiumSection({ topThree }: PodiumSectionProps) {
  if (!topThree || topThree.length < 3) return null;

  const [rank1, rank2, rank3] = topThree;

  return (
    <section className="px-8 sm:px-12 md:px-16 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-end">
        <PodiumCard rank={2} anime={rank2} customClass="border-t-4 border-[#C0C0C0] bg-gradient-to-b from-[rgba(192,192,192,0.05)] to-[#121317] order-2 md:order-1" />
        <PodiumCard rank={1} anime={rank1} customClass="border-t-4 border-[#7c3aed] bg-gradient-to-b from-[rgba(210,187,255,0.05)] to-[#121317] order-1 md:order-2 md:scale-105 md:-translate-y-6 shadow-2xl border-purple-500/20" />
        <PodiumCard rank={3} anime={rank3} customClass="border-t-4 border-[#CD7F32] bg-gradient-to-b from-[rgba(205,127,50,0.05)] to-[#121317] order-3 md:order-3" />
      </div>
    </section>
  );
}

function PodiumCard({ rank, anime, customClass }: { rank: number; anime: AniListAnime; customClass: string }) {
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  if (!anime) return null;

  const isRank1 = rank === 1;
  const title = anime.title.english || anime.title.romaji;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(2) : 'N/A';
  const image = anime.coverImage.extraLarge || anime.coverImage.large;

  const handleAddToLibrary = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (adding) return;
    setAdding(true);
    try {
      const res = await fetchWithCsrf('/api/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anilistId: anime.id,
          title,
          imageUrl: image,
          genres: anime.genres || [],
          actionType: 'bookmark',
        }),
      });
      if (res.ok) {
        toast(`Berhasil menambahkan ${title} ke bookmark!`, 'success');
      } else {
        toast('Gagal menambahkan ke bookmark', 'error');
      }
    } catch {
      toast('Gagal menambahkan ke bookmark', 'error');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={`bg-[#14181d]/60 backdrop-blur-xl border border-[#242b33]/50 rounded-xl p-6 flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-300 ${customClass}`}>
      <Link href={`/anime/${anime.id}`} className="block w-full">
        <div className="relative w-full aspect-[2/3] mb-4 rounded-lg overflow-hidden">
          <Image alt={title} src={image} fill className="w-full h-full object-cover" loading="lazy" sizes="(max-width: 768px) 100vw, 33vw" />
          <div className={`absolute top-2 left-2 px-4 py-1 rounded-full text-xs font-semibold ${isRank1 ? 'bg-[#7c3aed] text-white shadow-lg' : 'bg-white/20 backdrop-blur-md text-white'}`}>
            #{rank}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-1 line-clamp-1">{title}</h3>
        <div className="flex items-center justify-center gap-1 mb-4">
          <Star className="text-[18px] text-yellow-400 fill-yellow-400" />
          <span className={`text-lg font-medium ${isRank1 ? 'text-[#d2bbff] font-bold text-xl' : 'text-zinc-300'}`}>{score}</span>
        </div>
      </Link>
      <button
        onClick={handleAddToLibrary}
        disabled={adding}
        className={`w-full flex items-center justify-center gap-1 rounded-lg text-xs font-semibold tracking-wide transition-all active:scale-95 bg-[#282a2d] text-zinc-400 border border-[#4a4455]/30 hover:bg-[#7c3aed] hover:text-white hover:border-[#7c3aed] ${
          isRank1 ? 'py-3 hover:shadow-lg hover:shadow-purple-500/20 brightness-105' : 'py-2.5'
        }`}
      >
        {adding ? <RefreshCw className="text-[16px] animate-spin" /> : <Plus className="text-[16px]" />}
        {adding ? 'Adding...' : 'Add to Library'}
      </button>
    </div>
  );
}
