'use client';

import React from 'react';

export default function RecentActivity() {
  return (
    <div className="bg-[#1e2023] rounded-xl border border-[#4a4455]/30 p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#e2e2e6] mb-4">Recent Activity</h3>
      <div className="space-y-4">
        
        {/* Log Item 1 - Star Icon */}
        <div className="flex gap-3 items-start">
          <div className="mt-0.5 text-[#d2bbff] shrink-0">
            {/* Pastikan menggunakan class material-symbols-outlined */}
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
          </div>
          <div>
            <p className="text-sm text-[#e2e2e6]">
              Rated <span className="font-semibold text-[#d2bbff]">Neon Genesis</span> 10/10
            </p>
            <p className="text-xs text-[#c4c7c9] mt-0.5">2 days ago</p>
          </div>
        </div>

        {/* Log Item 2 - Check Circle Icon */}
        <div className="flex gap-3 items-start">
          <div className="mt-0.5 text-[#4cd7f6] shrink-0">
            {/* Pastikan menggunakan class material-symbols-outlined */}
            <span className="material-symbols-outlined text-[20px]">
              check_circle
            </span>
          </div>
          <div>
            <p className="text-sm text-[#e2e2e6]">
              Completed <span className="font-semibold text-[#4cd7f6]">Abyssal Knight</span>
            </p>
            <p className="text-xs text-[#c4c7c9] mt-0.5">1 week ago</p>
          </div>
        </div>

      </div>
    </div>
  );
}