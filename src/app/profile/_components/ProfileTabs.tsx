'use client';

import React, { useState } from 'react';

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Favorites', 'Reviews', 'Settings'];

  return (
    <div className="flex gap-4 border-b border-[#4a4455]/30 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`text-base font-medium pb-2 px-2 whitespace-nowrap transition-all relative cursor-pointer ${
            activeTab === tab ? 'text-[#d2bbff]' : 'text-[#ccc3d8] hover:text-[#e2e2e6]'
          }`}
        >
          {tab}
          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#d2bbff]" />
          )}
        </button>
      ))}
    </div>
  );
}