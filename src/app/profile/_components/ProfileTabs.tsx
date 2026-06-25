'use client';

interface ProfileTabsProps {
  activeTab: 'overview' | 'library' | 'anime-collection';
  setActiveTab: (tab: 'overview' | 'library' | 'anime-collection') => void;
}

export default function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  return (
    <div className="flex gap-2 border-b border-border/60 pb-px overflow-x-auto no-scrollbar">
      <button
        onClick={() => setActiveTab('overview')}
        className={`px-4 py-2 text-sm font-medium border-b-2 transition-all cursor-pointer ${
          activeTab === 'overview'
            ? 'border-primary text-primary font-semibold'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        }`}
      >
        Overview
      </button>

      <button
        onClick={() => setActiveTab('library')}
        className={`px-4 py-2 text-sm font-medium border-b-2 transition-all cursor-pointer ${
          activeTab === 'library'
            ? 'border-primary text-primary font-semibold'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        }`}
      >
        My Library
      </button>
      <button
        onClick={() => setActiveTab('anime-collection')}
        className={`px-4 py-2 text-sm font-medium border-b-2 transition-all cursor-pointer ${
          activeTab === 'anime-collection'
            ? 'border-primary text-primary font-semibold'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        }`}
      >
        Anime Collection
      </button>
    </div>
  );
}