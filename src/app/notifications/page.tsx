'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useNotifications } from '@/components/notifications/useNotifications';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function NotificationsPage() {
  const { notifications, fetchNotifications, markAllRead } = useNotifications();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchNotifications().finally(() => setLoading(false));
  }, [fetchNotifications]);

  if (loading) {
    return (
      <main className="flex-grow pt-24 px-4 sm:px-8 max-w-4xl mx-auto w-full pb-12">
        <div className="flex justify-center py-20 text-zinc-400">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex-grow pt-24 px-4 sm:px-8 max-w-4xl mx-auto w-full pb-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">Notifications</h1>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllRead}
            className="text-sm text-purple-400 hover:text-purple-300 transition cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-1">
        {notifications.length === 0 ? (
          <div className="bg-[#1e2023] rounded-xl border border-zinc-800 p-8 text-center">
            <p className="text-zinc-500">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-4 p-4 rounded-xl transition ${
                !n.read
                  ? 'bg-purple-900/10 border border-purple-900/20'
                  : 'bg-[#1e2023] border border-transparent'
              }`}
            >
              {n.anime ? (
                <Link href={`/anime/${n.anime.anilistId}`} className="w-10 h-14 rounded overflow-hidden shrink-0 bg-zinc-800 relative block">
                  <Image src={n.anime.imageUrl} alt={n.anime.title} fill sizes="40px" className="object-cover" />
                </Link>
              ) : (
                <div className="w-10 h-14 rounded shrink-0 bg-zinc-800 flex items-center justify-center">
                  <span className="text-xl">📺</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${!n.read ? 'text-zinc-100 font-medium' : 'text-zinc-400'}`}>
                  {n.anime ? (
                    <Link href={`/anime/${n.anime.anilistId}`} className="hover:text-purple-400 transition">
                      {n.message}
                    </Link>
                  ) : (
                    n.message
                  )}
                </p>
                <p className="text-xs text-zinc-600 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
