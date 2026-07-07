'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/components/ui/toast';
import { fetchWithCsrf } from '@/lib/csrf-client';

interface RankingRowProps {
  rank: number;
  anime: any;
}

export default function RankingRow({ rank, anime }: RankingRowProps) {
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const title = anime.title.english || anime.title.romaji;
  const image = anime.coverImage.large || anime.coverImage.extraLarge;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(2) : 'N/A';

  const formatUsers = (num: number) => {
    if (!num) return '0';
    return num >= 1e6 ? (num / 1e6).toFixed(1) + 'M' : num >= 1e3 ? (num / 1e3).toFixed(1) + 'K' : num.toString();
  };

  const handleAddToLibrary = async () => {
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
    <div className="group grid grid-cols-12 items-center gap-4 bg-[#1a1c1f]/50 hover:bg-[#1e2023] transition-all p-4 rounded-lg border border-transparent hover:border-[#4a4455]/20">
      <div className="col-span-2 md:col-span-1 flex justify-center">
        <span className="text-xl font-medium text-zinc-400">#{rank}</span>
      </div>
      <Link href={`/anime/${anime.id}`} className="col-span-7 md:col-span-6 flex items-center gap-4">
        <div className="relative w-12 h-16 rounded overflow-hidden flex-shrink-0 bg-zinc-800">
          <Image className="w-full h-full object-cover" alt={title} src={image} fill loading="lazy" sizes="48px" />
        </div>
        <div>
          <h4 className="text-base font-semibold text-white group-hover:text-[#d2bbff] transition-colors line-clamp-1">{title}</h4>
          <p className="text-xs text-zinc-400 mt-0.5">{anime.format || 'TV'} &bull; {anime.episodes || 'Ongoing'} eps</p>
        </div>
      </Link>
      <div className="hidden md:flex col-span-2 justify-center items-center gap-1">
        <span className="material-symbols-outlined text-[#7c3aed] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
        <span className="font-medium text-white">{score}</span>
      </div>
      <div className="hidden md:flex col-span-2 justify-center items-center gap-1">
        <span className="material-symbols-outlined text-zinc-400 text-[16px]">person</span>
        <span className="text-sm text-zinc-400">{formatUsers(anime.popularity)}</span>
      </div>
      <div className="col-span-3 md:col-span-1 flex justify-end">
        <button
          onClick={handleAddToLibrary}
          disabled={adding}
          className="p-2.5 rounded-full bg-[#7c3aed]/10 text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white transition-all active:scale-90 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-sm">{adding ? 'sync' : 'library_add'}</span>
        </button>
      </div>
    </div>
  );
}
