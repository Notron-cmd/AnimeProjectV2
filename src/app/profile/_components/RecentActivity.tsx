'use client';

import React from 'react';

interface ActivityAnime {
  id: string;
  anilistId: number;
  title: string;
  imageUrl: string;
  genres: string[];
}

interface ActivityItem {
  id: string;
  action: string;
  animeId: string | null;
  createdAt: string;
  anime: ActivityAnime | null;
}

function timeAgo(dateStr: string) {
  const now = Date.now();
  const past = new Date(dateStr).getTime();
  const diffMs = now - past;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 5) return `${weeks}w ago`;
  return `${months}mo ago`;
}

const ACTION_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  bookmark: {
    icon: 'bookmark',
    color: '#f59e0b',
    label: 'Bookmarked',
  },
  favorite: {
    icon: 'favorite',
    color: '#ef4444',
    label: 'Favorited',
  },
  remove_bookmark: {
    icon: 'bookmark_remove',
    color: '#958da1',
    label: 'Removed bookmark',
  },
};

export default function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-[#1e2023] rounded-xl border border-[#4a4455]/30 p-5 shadow-sm">
        <h3 className="text-lg font-bold text-[#e2e2e6] mb-4">Recent Activity</h3>
        <p className="text-sm text-[#ccc3d8]">Belum ada aktivitas. Mulai bookmarks atau favorite anime untuk melihat aktivitas terbaru.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1e2023] rounded-xl border border-[#4a4455]/30 p-5 shadow-sm">
      <h3 className="text-lg font-bold text-[#e2e2e6] mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((item) => {
          const config = ACTION_CONFIG[item.action] || { icon: 'circle', color: '#958da1', label: item.action };
          const title = item.anime?.title ?? 'Unknown';
          return (
            <div key={item.id} className="flex gap-3 items-start">
              <div className="mt-0.5 shrink-0" style={{ color: config.color }}>
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {config.icon}
                </span>
              </div>
              <div>
                <p className="text-sm text-[#e2e2e6]">
                  {config.label}{' '}
                  <span className="font-semibold" style={{ color: config.color }}>
                    {title}
                  </span>
                </p>
                <p className="text-xs text-[#c4c7c9] mt-0.5">{timeAgo(item.createdAt)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}