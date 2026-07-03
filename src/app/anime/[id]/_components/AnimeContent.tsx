"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { XIcon } from 'lucide-react';

interface ContentProps {
  synopsis: string;
  trailerThumbnail: string;
  trailerId: string | null;
  trailerSite: string | null;
  characters: Array<{ name: string; role: string; img: string }>;
  recommendations: Array<{ id: string; title: string; img: string }>;
}

export default function AnimeContent({ synopsis, trailerThumbnail, trailerId, trailerSite, characters, recommendations }: ContentProps) {
  const [open, setOpen] = useState(false);

  const trailerUrl = trailerSite === 'youtube' && trailerId
    ? `https://www.youtube.com/embed/${trailerId}?autoplay=1`
    : null;

  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10">
      {/* Synopsis Section */}
      <section>
        <h3 className="text-lg font-bold text-[#e2e2e6] mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#7c3aed] rounded-full inline-block"></span> Synopsis
        </h3>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed text-justify md:text-left">
          {synopsis}
        </p>
      </section>

      {/* Trailer Section */}
      {trailerUrl && (
        <section>
          <h3 className="text-lg font-bold text-[#e2e2e6] mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#7c3aed] rounded-full inline-block"></span> Official Trailer
          </h3>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#14181d]/60 backdrop-blur-xl border border-[#242b33]/80 group cursor-pointer shadow-lg">
                <Image src={trailerThumbnail} alt="Trailer Thumbnail" fill className="object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#7c3aed]/90 backdrop-blur-md flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 fill-current text-white ml-1" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-7xl p-0 bg-black border-white/10 overflow-hidden rounded-xl">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
              >
                <XIcon className="h-5 w-5" />
              </button>
              <div className="relative w-full aspect-video">
                <iframe
                  src={trailerUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </DialogContent>
          </Dialog>
        </section>
      )}

      {/* Characters Section */}
      <section>
        <h3 className="text-lg font-bold text-[#e2e2e6] mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#7c3aed] rounded-full inline-block"></span> Main Characters
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {characters.map((char, index) => (
            <div key={index} className="bg-[#14181d]/60 backdrop-blur-xl rounded-xl overflow-hidden flex flex-col group border border-[#242b33]/80 hover:border-zinc-600 transition-all duration-300 shadow-md">
              <div className="w-full aspect-square overflow-hidden bg-zinc-900 relative">
                <Image src={char.img} alt={char.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3">
                <span className="block text-xs sm:text-sm font-semibold text-[#e2e2e6] truncate">{char.name}</span>
                <span className="block text-[9px] font-bold tracking-wider text-zinc-400 mt-1 uppercase">{char.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="mt-2">
        <h3 className="text-lg font-bold text-[#e2e2e6] mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#7c3aed] rounded-full inline-block"></span> You Might Also Like
        </h3>
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-none snap-x [&::-webkit-scrollbar]:hidden">
          {recommendations.map((rec) => (
            <Link href={`/anime/${rec.id}`} key={rec.id} className="w-[140px] sm:w-[160px] shrink-0 snap-start group cursor-pointer">
              <div className="w-full aspect-[2/3] rounded-lg overflow-hidden bg-[#14181d]/60 backdrop-blur-xl border border-[#242b33]/80 mb-2 relative shadow-md group-hover:border-zinc-500 transition-colors">
                <Image src={rec.img} alt={rec.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <span className="block text-xs text-[#e2e2e6] font-medium truncate group-hover:text-[#4cd7f6] transition-colors">
                {rec.title}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}