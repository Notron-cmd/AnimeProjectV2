'use client';

import React, { useState, useEffect } from 'react';
import ProfileHeader from './_components/ProfileHeader';
import ProfileTabs from './_components/ProfileTabs';
import BookmarkedList from './_components/BookmarkedList';
import GenreStats from './_components/GenreStats';
import RecentActivity from './_components/RecentActivity';
import FavoriteCollection from './_components/FavoriteCollection';
import FavoriteLibrary from './_components/FavoriteLibrary';
import AnimeCollection from './_components/AnimeCollection';
import { fetchWithCsrf } from '@/lib/csrf-client';

interface AnimeData {
  id: string;
  anilistId: number;
  title: string;
  imageUrl: string;
  genres: string[];
  totalEpisodes?: number | null;
}

interface ProfileUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: string;
}

interface BookmarkItem {
  id: string;
  userId: string;
  animeId: string;
  status: string;
  currentEpisode: number;
  completedAt: string | null;
  createdAt: string;
  anime: AnimeData;
}

interface FavoriteItem {
  id: string;
  userId: string;
  animeId: string;
  createdAt: string;
  anime: AnimeData;
}

interface GenreStatItem {
  id: string;
  userId: string;
  genre: string;
  count: number;
}

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

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'library' | 'anime-collection'>('overview');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [genreStats, setGenreStats] = useState<GenreStatItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [_userRatings, _setUserRatings] = useState<Record<number, number>>({});

  // Ambil data profile dari API saat halaman dibuka
  useEffect(() => {
    async function fetchProfileData() {
      try {
        const res = await fetch('/api/profile');
        if (res.status === 401) {
          setAuthError(true);
          return;
        }
        if (!res.ok) throw new Error('Gagal mengambil data');
        const data = await res.json();

        setUser(data.user ?? null);
        setBookmarks(data.bookmarks || []);
        setFavorites(data.favorites || []);
        setGenreStats(data.genreStats || []);
        setRecentActivities(data.recentActivities || []);
        setScores(data.scores || {});
        _setUserRatings(data.userRatings || {});
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfileData();
  }, [refreshKey]);

  // Handler memindahkan bookmark ke library (favorite)
  const handleMoveToLibrary = async (bookmarkItem: BookmarkItem) => {
    try {
      const res = await fetchWithCsrf('/api/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anilistId: bookmarkItem.anime.anilistId,
          title: bookmarkItem.anime.title,
          imageUrl: bookmarkItem.anime.imageUrl,
          genres: bookmarkItem.anime.genres,
          actionType: 'favorite'
        })
      });

      if (res.ok) {
        setBookmarks(prev => prev.filter(b => b.id !== bookmarkItem.id));
        setRefreshKey(k => k + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteBookmark = async (bookmarkId: string) => {
    try {
      const res = await fetchWithCsrf('/api/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookmarkId,
          actionType: 'remove_bookmark',
        }),
      });

      if (res.ok) {
        setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
        setRefreshKey(k => k + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <main className="flex-grow pt-24 px-4 sm:px-8 max-w-6xl mx-auto w-full pb-12 space-y-6">
        <div className="bg-[#1e2023] rounded-xl border border-[#4a4455]/30 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-zinc-800/50 animate-pulse shrink-0" />
          <div className="flex-grow space-y-3 text-center md:text-left">
            <div className="h-7 w-48 bg-zinc-800/50 animate-pulse rounded mx-auto md:mx-0" />
            <div className="h-4 w-32 bg-zinc-800/50 animate-pulse rounded mx-auto md:mx-0" />
            <div className="h-3 w-40 bg-zinc-800/50 animate-pulse rounded mx-auto md:mx-0" />
          </div>
          <div className="flex gap-3">
            <div className="h-9 w-20 bg-zinc-800/50 animate-pulse rounded-lg" />
            <div className="h-9 w-24 bg-zinc-800/50 animate-pulse rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-[#1e2023] rounded-xl border border-[#4a4455]/30 animate-pulse" />
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-[#1e2023] rounded-xl border border-[#4a4455]/30 animate-pulse" />
            <div className="h-32 bg-[#1e2023] rounded-xl border border-[#4a4455]/30 animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (authError) {
    return (
      <main className="flex-grow pt-24 px-4 sm:px-8 max-w-6xl mx-auto w-full pb-12">
        <div className="bg-[#1e2023] rounded-xl border border-[#4a4455]/30 p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-[#e2e2e6]">Belum masuk</h2>
          <p className="text-sm text-[#ccc3d8]">
            Silakan login untuk melihat profile kamu.
          </p>
          <a
            href="/login"
            className="inline-block bg-[#7c3aed] text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Ke halaman login
          </a>
        </div>
      </main>
    );
  }

  // Menyelaraskan struktur data AniList dengan komponen UI lamamu
  const formattedBookmarks = bookmarks.map(b => ({
    id: b.id,
    title: b.anime.title,
    meta: b.anime.genres.join(' • '),
    image: b.anime.imageUrl
  }));

  const formattedLibrary = bookmarks.map(b => ({
    id: b.id,
    anilistId: b.anime.anilistId,
    title: b.anime.title,
    status: b.status || "Plan to Watch",
    statusColor: b.status === 'Watching' ? 'bg-emerald-400' : b.status === 'Completed' ? 'bg-sky-400' : 'bg-slate-400',
    rating: scores[b.anime.anilistId] != null ? `${scores[b.anime.anilistId]}` : "AniList",
    currentEpisode: b.currentEpisode ?? 0,
    totalEpisodes: b.anime.totalEpisodes ?? null,
    episodeProgress: b.anime.totalEpisodes != null ? `EPISODE ${b.currentEpisode ?? 0} / ${b.anime.totalEpisodes}` : `EPISODE ${b.currentEpisode ?? 0} / --`,
    image: b.anime.imageUrl,
    genres: b.anime.genres
  }));

  return (
    <main className="flex-grow pt-24 px-4 sm:px-8 max-w-6xl mx-auto w-full pb-12">
      <div className="space-y-6">
        <ProfileHeader user={user} onAvatarChange={() => setRefreshKey(k => k + 1)} />
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'library' && (
          <div className="w-full bg-background border border-border/40 rounded-xl p-6 shadow-sm">
            <FavoriteLibrary libraryData={formattedLibrary} onRefresh={() => setRefreshKey(k => k + 1)} />
          </div>
        )}

        {activeTab === 'anime-collection' && (
          <div className="w-full bg-background border border-border/40 rounded-xl p-6 shadow-sm">
            <AnimeCollection favorites={favorites} onRefresh={() => setRefreshKey(k => k + 1)} />
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-8">
              <FavoriteCollection libraryData={formattedLibrary} />
              <BookmarkedList 
                bookmarks={formattedBookmarks} 
                onDelete={handleDeleteBookmark}
                onMoveToLibrary={(id) => {
                  const target = bookmarks.find(b => b.id === id.toString());
                  if (target) handleMoveToLibrary(target);
                }}
              />
            </div>
            <div className="space-y-6">
              <GenreStats stats={genreStats} />
              <RecentActivity activities={recentActivities} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}