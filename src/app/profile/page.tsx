'use client';

import React from 'react';
import ProfileHeader from './_components/ProfileHeader';
import ProfileTabs from './_components/ProfileTabs';
import FavoriteCollection from './_components/FavoriteCollection';
import BookmarkedList from './_components/BookmarkedList';
import GenreStats from './_components/GenreStats';
import RecentActivity from './_components/RecentActivity';

export default function ProfilePage() {
  return (
    <main className="flex-grow pt-24 px-4 sm:px-8 max-w-6xl mx-auto w-full pb-12">
      <div className="space-y-6">
        
        {/* PROFILE HEADER PANEL */}
        <ProfileHeader />

        {/* PROFILE NAVIGATION SUB-TABS */}
        <ProfileTabs />

        {/* MAIN SPLIT COLUMNS LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT SIDE CONTENT COMPONENT COLUMN (md:col-span-2) */}
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

      </div>
    </main>
  );
}