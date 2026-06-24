'use client';

import React from 'react';

export default function GenreStats() {
  const genres = [
    { name: 'Sci-Fi', percent: 45, color: 'bg-[#7c3aed]' },
    { name: 'Action', percent: 30, color: 'bg-[#4cd7f6]' },
    { name: 'Fantasy', percent: 15, color: 'bg-[#958da1]' }
  ];

  return (
    <div className="bg-[#1e2023] rounded-xl border border-[#4a4455]/30 p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#e2e2e6] mb-4">Top Genres</h3>
      <div className="space-y-4">
        {genres.map((genre, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-1.5 font-medium">
              <span className="text-[#e2e2e6]">{genre.name}</span>
              <span className="text-[#ccc3d8]">{genre.percent}%</span>
            </div>
            {/* Progress Container */}
            <div className="h-1.5 w-full bg-[#333538] rounded-full overflow-hidden">
              <div 
                className={`h-full ${genre.color} rounded-full transition-all duration-500`} 
                style={{ width: `${genre.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}