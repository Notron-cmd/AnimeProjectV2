'use client';

import React, { useState } from 'react';
import ProfileHeader from './_components/ProfileHeader';
import ProfileTabs from './_components/ProfileTabs';
import BookmarkedList from './_components/BookmarkedList';
import GenreStats from './_components/GenreStats';
import RecentActivity from './_components/RecentActivity';
import FavoriteCollection from './_components/FavoriteCollection';
import FavoriteLibrary from './_components/FavoriteLibrary';
import AnimeCollection from './_components/AnimeCollection'; 

export default function ProfilePage() {

  const [activeTab, setActiveTab] = useState<'overview' | 'library' | 'anime-collection'>('overview');

  return (
    <main className="flex-grow pt-24 px-4 sm:px-8 max-w-6xl mx-auto w-full pb-12">
      <div className="space-y-6">
        
        {/* PROFILE HEADER PANEL */}
        <ProfileHeader />

        {/* PROFILE NAVIGATION SUB-TABS */}
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* KONDISI 1: JIKA TAB LIBRARY AKTIF */}
        {activeTab === 'library' && (
          <div className="w-full bg-background border border-border/40 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <FavoriteLibrary />
          </div>
        )}

        {/* KONDISI 2: JIKA TAB ANIME COLLECTION AKTIF (Menggantikan Hall of Fame) */}
        {activeTab === 'anime-collection' && (
          <div className="w-full bg-background border border-border/40 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AnimeCollection />
          </div>
        )}

        {/* KONDISI 3: JIKA TAB OVERVIEW AKTIF */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            
            {/* LEFT SIDE CONTENT COMPONENT COLUMN */}
            <div className="md:col-span-2 space-y-8">
              <FavoriteCollection />
              <BookmarkedList />
            </div>

            {/* RIGHT SIDE DATA WIDGETS COLUMN */}
            <div className="space-y-6">
              <GenreStats />
              <RecentActivity />
            </div>

          </div>
        )}

      </div>
    </main>
  );
}