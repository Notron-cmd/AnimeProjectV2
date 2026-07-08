'use client';

import React from 'react';
import Image from 'next/image';
import { BookmarkPlus, Trash2 } from "lucide-react";

interface BookmarkItem {
  id: string;
  title: string;
  meta: string;
  image: string;
}

interface BookmarkedListProps {
  bookmarks: BookmarkItem[];
  onDelete: (id: string) => void;
  onMoveToLibrary: (id: string) => void;
}

export default function BookmarkedList({ bookmarks, onDelete, onMoveToLibrary }: BookmarkedListProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-[#e2e2e6]">Bookmarked for Later</h2>
      
      {bookmarks.length > 0 ? (
        <div className="space-y-3">
          {bookmarks.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-[#333538]/30 border border-transparent hover:border-[#4a4455]/30 transition-all cursor-pointer group"
            >
              {/* Mini Square Poster */}
              <div className="relative w-16 h-16 rounded overflow-hidden shrink-0 bg-[#1e2023]">
                {item.image ? (
                  <Image className="w-full h-full object-cover" src={item.image} alt={item.title} fill loading="lazy" sizes="64px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#7c3aed]/20 to-[#4c1d95]/20">
                    <span className="text-lg font-bold text-[#7c3aed]/40">
                      {item.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Titles */}
              <div className="flex-grow">
                <h4 className="text-base font-semibold text-[#e2e2e6] group-hover:text-[#d2bbff] transition-colors">{item.title}</h4>
                <p className="text-sm text-[#ccc3d8] mt-0.5">{item.meta}</p>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Tombol Pindah ke Library */}
                <button 
                  title="Move to Library"
                  className="text-[#ccc3d8] hover:text-primary transition-colors p-2 cursor-pointer rounded-lg hover:bg-primary/10 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveToLibrary(item.id);
                  }}
                >
                  <BookmarkPlus className="text-xl" />
                </button>

                {/* Tombol Hapus Bookmark */}
                <button 
                  title="Remove Bookmark"
                  className="text-[#ccc3d8] hover:text-red-500 active:text-red-600 transition-colors p-2 cursor-pointer rounded-lg hover:bg-red-500/10 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                >
                  <Trash2 className="text-xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground italic py-2">Belum ada anime yang di-bookmark.</p>
      )}
    </section>
  );
}