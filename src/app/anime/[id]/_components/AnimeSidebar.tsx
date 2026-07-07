'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/toast';

interface SidebarProps {
  anilistId: string;
  title: string;
  image: string;
  score: number;
  format: string;
  episodes: number;
  status: string;
  season: string;
  studio: string;
  genres: string[];
}

export default function AnimeSidebar({ anilistId, title, image, score, format, episodes, status, season, studio, genres }: SidebarProps) {
  const { toast } = useToast();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/rating?anilistId=${anilistId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.score != null) setUserRating(data.score);
        }
      } catch {}
    })();
  }, [anilistId]);

  const handleRate = async (newScore: number) => {
    setRatingLoading(true);
    try {
      const res = await fetch('/api/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anilistId: parseInt(anilistId), score: newScore }),
      });
      if (res.ok) {
        setUserRating(newScore);
        toast('Rating saved!', 'success');
      } else {
        toast('Failed to save rating', 'error');
      }
    } catch {
      toast('Failed to save rating', 'error');
    } finally {
      setRatingLoading(false);
    }
  };

  const handleAction = async (actionType: string, label: string) => {
    try {
      const body: Record<string, unknown> = {
        anilistId, title, imageUrl: image, genres: genres || [], actionType,
      };
      if (animeEpisodes > 0) body.totalEpisodes = animeEpisodes;

      const res = await fetch('/api/interact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Server Error (${res.status}):`, errorText);
        toast(`Gagal menyimpan (${res.status})`, 'error');
        return;
      }

      const data = await res.json();

      if (data.success) {
        toast(`Berhasil menambahkan ${title} ke ${label}!`, 'success');
      } else {
        console.error(data.error);
        toast(data.error || 'Gagal menyimpan', 'error');
      }
    } catch (error) {
      console.error("Gagal menyambungkan ke database:", error);
      toast("Gagal menyambungkan ke database", 'error');
    }
  };

  const animeEpisodes = episodes;

  return (
    <aside className="w-full md:w-[280px] shrink-0 flex flex-col gap-5">
      {/* Poster Card */}
      <div className="relative w-48 sm:w-56 md:w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#14181d]/60 backdrop-blur-xl border border-[#242b33]/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:border-[#7c3aed] transition-all duration-300 mx-auto md:mx-0 group">
        <Image src={image} alt={title} fill sizes="(max-width: 768px) 224px, 280px" className="object-cover" />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 max-w-sm mx-auto md:mx-0 w-full">
        <button
          onClick={() => handleAction('favorite', 'favorit')}
          className="flex-1 bg-[#7c3aed] text-white text-xs font-bold tracking-wider uppercase py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#732ee4] transition-colors active:scale-95 duration-150 cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          ADD TO FAVORITE
        </button>

        <button
          onClick={() => handleAction('bookmark', 'bookmark')}
          className="w-12 h-12 bg-[#14181d]/60 backdrop-blur-xl border border-[#242b33]/80 rounded-lg flex items-center justify-center text-[#e2e2e6] hover:text-[#7c3aed] transition-colors active:scale-95 duration-150 cursor-pointer"
        >
          <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        <button
          onClick={async () => {
            if (navigator.share) {
              try {
                await navigator.share({ title, url: window.location.href });
              } catch {}
            } else {
              try {
                await navigator.clipboard.writeText(window.location.href);
                toast('Link copied to clipboard!', 'success');
              } catch {
                toast('Failed to copy link', 'error');
              }
            }
          }}
          className="w-12 h-12 bg-[#14181d]/60 backdrop-blur-xl border border-[#242b33]/80 rounded-lg flex items-center justify-center text-[#e2e2e6] hover:text-[#4cd7f6] transition-colors active:scale-95 duration-150 cursor-pointer"
          title="Share"
        >
          <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
      
      {/* Stats Bento Box */}
      <div className="bg-[#14181d]/60 backdrop-blur-xl border border-[#242b33]/80 rounded-xl p-4 flex flex-col gap-4 max-w-sm mx-auto md:mx-0 w-full">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
          <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase">SCORE</span>
          <div className="flex items-center gap-1">
            <span className="text-[#4cd7f6] text-sm">★</span>
            <span className="text-sm font-medium text-[#e2e2e6]">{score}</span>
          </div>
        </div>

        {/* Personal Rating */}
        <div className="border-b border-zinc-800 pb-2">
          <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase block mb-1.5">YOUR RATING</span>
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5,6,7,8,9,10].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                disabled={ratingLoading}
                className={`text-sm cursor-pointer transition-colors ${
                  star <= (userRating ?? 0) ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-400'
                } ${ratingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ★
              </button>
            ))}
            {userRating != null && (
              <span className="text-[10px] text-zinc-500 ml-1 font-medium">{userRating}/10</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          <div>
            <span className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-0.5">FORMAT</span>
            <span className="text-xs text-[#e2e2e6]">{format}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-0.5">EPISODES</span>
            <span className="text-xs text-[#e2e2e6]">{episodes}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-0.5">STATUS</span>
            <span className="text-xs text-[#4cd7f6] font-semibold">{status}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-0.5">SEASON</span>
            <span className="text-xs text-[#e2e2e6]">{season}</span>
          </div>
          <div className="col-span-2">
            <span className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-0.5">STUDIO</span>
            <span className="text-xs text-[#7c3aed] font-medium">{studio}</span>
          </div>
          <div className="col-span-2 flex flex-wrap gap-1.5 mt-1">
            {genres.map((genre) => (
              <span key={genre} className="px-2 py-0.5 rounded bg-[#1e2023] text-[#e2e2e6] text-[9px] font-bold tracking-wider border border-zinc-700">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}