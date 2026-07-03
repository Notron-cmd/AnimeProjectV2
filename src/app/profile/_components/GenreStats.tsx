'use client';

import React from 'react';

const COLORS = [
  'bg-[#7c3aed]',
  'bg-[#4cd7f6]',
  'bg-[#958da1]',
  'bg-[#f59e0b]',
  'bg-[#ef4444]',
  'bg-[#10b981]',
  'bg-[#ec4899]',
  'bg-[#3b82f6]',
];

interface GenreStatItem {
  id: string;
  userId: string;
  genre: string;
  count: number;
}

export default function GenreStats({ stats }: { stats: GenreStatItem[] }) {
  if (!stats || stats.length === 0) {
    return (
      <div className="bg-[#1e2023] rounded-xl border border-[#4a4455]/30 p-5 shadow-sm">
        <h3 className="text-lg font-bold text-[#e2e2e6] mb-4">Top Genres</h3>
        <p className="text-sm text-[#ccc3d8]">Belum ada data genre. Mulai bookmarks anime untuk melihat statistik.</p>
      </div>
    );
  }

  const maxCount = Math.max(...stats.map(s => s.count));

  return (
    <div className="bg-[#1e2023] rounded-xl border border-[#4a4455]/30 p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#e2e2e6] mb-4">Top Genres</h3>
      <div className="space-y-4">
        {stats.map((item, idx) => {
          const percent = Math.round((item.count / maxCount) * 100);
          const color = COLORS[idx % COLORS.length];
          return (
            <div key={item.id}>
              <div className="flex justify-between text-sm mb-1.5 font-medium">
                <span className="text-[#e2e2e6]">{item.genre}</span>
                <span className="text-[#ccc3d8]">{item.count}</span>
              </div>
              <div className="h-1.5 w-full bg-[#333538] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${color} rounded-full transition-all duration-500`} 
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}