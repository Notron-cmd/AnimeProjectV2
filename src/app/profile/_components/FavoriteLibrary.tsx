'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/components/ui/toast';

interface LibraryItem {
  id: string;
  anilistId: number;
  title: string;
  status: string;
  statusColor: string;
  rating: string;
  currentEpisode: number;
  totalEpisodes: number | null;
  episodeProgress: string;
  image: string;
  genres?: string[];
}

interface FavoriteLibraryProps {
  libraryData: LibraryItem[];
  onRefresh?: () => void;
}

const STATUS_OPTIONS = ['Watching', 'Completed', 'Plan to Watch'] as const;

export default function FavoriteLibrary({ libraryData, onRefresh }: FavoriteLibraryProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Added");

  const filteredLibrary = useMemo(() => {
    let result = [...libraryData];

    if (selectedTab !== "All") {
      result = result.filter((item) => item.status === selectedTab);
    }

    if (searchQuery.trim() !== "") {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === "Score (Highest)") {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortBy === "Alphabetical (A-Z)") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    return result;
  }, [libraryData, searchQuery, selectedTab, sortBy]);

  const handleStatusChange = async (bookmarkId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/interact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookmarkId, status: newStatus }),
      });

      if (res.ok) {
        toast('Status updated!', 'success');
        onRefresh?.();
      } else {
        toast('Failed to update status', 'error');
      }
    } catch {
      toast('Failed to update status', 'error');
    }
  };

  const handleEpisodeChange = async (bookmarkId: string, currentEpisode: number, totalEpisodes?: number) => {
    try {
      const body: Record<string, unknown> = { bookmarkId, currentEpisode };
      if (totalEpisodes != null) body.totalEpisodes = totalEpisodes;
      const res = await fetch('/api/interact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast('Episode progress updated!', 'success');
        onRefresh?.();
      } else {
        toast('Failed to update progress', 'error');
      }
    } catch {
      toast('Failed to update progress', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">My Library</h2>
          <p className="text-xs text-muted-foreground mt-0.5"> Total saved: <span className="text-primary font-semibold">{filteredLibrary.length} titles</span></p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-muted-foreground text-lg">search</span>
            <input
              type="text"
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search library"
              className="bg-card border border-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-ring focus:border-ring outline-none w-full sm:w-44 transition-all"
            />
          </div>

          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-card border border-border rounded-lg pl-3 pr-8 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-ring focus:border-ring outline-none cursor-pointer"
            >
              <option>Recently Added</option>
              <option>Score (Highest)</option>
              <option>Alphabetical (A-Z)</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 pointer-events-none text-muted-foreground text-lg">expand_more</span>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-1 border-b border-border/40 pb-px overflow-x-auto no-scrollbar">
        {["All", "Watching", "Completed", "Plan to Watch"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              selectedTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredLibrary.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredLibrary.map((anime) => (
            <StatusCard
              key={anime.id}
              item={anime}
              onStatusChange={handleStatusChange}
              onEpisodeChange={handleEpisodeChange}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-3xl text-muted-foreground/30 mb-1">folder_open</span>
          <p className="text-xs text-muted-foreground">No anime found in this filter.</p>
        </div>
      )}
    </div>
  );
}

function StatusCard({
  item,
  onStatusChange,
  onEpisodeChange,
  onRefresh,
}: {
  item: LibraryItem;
  onStatusChange: (id: string, status: string) => void;
  onEpisodeChange: (id: string, currentEpisode: number, totalEpisodes?: number) => void;
  onRefresh?: () => void;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookmarkId: item.id,
          actionType: 'remove_bookmark',
        }),
      });
      if (res.ok) {
        toast(`Berhasil menghapus ${item.title} dari bookmark`, 'success');
        onRefresh?.();
      } else {
        toast('Gagal menghapus bookmark', 'error');
      }
    } catch {
      toast('Gagal menghapus bookmark', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="group relative flex flex-col gap-2">
      <Link href={`/anime/${item.anilistId}`}>
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card border border-border/40 hover:ring-2 hover:ring-primary transition-all duration-300 shadow-sm cursor-pointer">
          {item.image ? (
            <Image className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.image} alt={item.title} fill loading="lazy" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#7c3aed]/20 to-[#4c1d95]/20">
              <span className="text-3xl font-bold text-[#7c3aed]/40">
                {item.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <button
            onClick={(e) => { e.preventDefault(); handleDelete(); }}
            disabled={deleting}
            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-white">{deleting ? 'sync' : 'delete'}</span>
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-xs font-semibold text-foreground">{item.rating}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <button
                onClick={(e) => { e.preventDefault(); onEpisodeChange(item.id, Math.max(0, item.currentEpisode - 1)); }}
                className="w-5 h-5 rounded bg-black/50 flex items-center justify-center hover:bg-primary/80 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[10px] text-white">remove</span>
              </button>
              <span className="text-[9px] font-bold text-primary tabular-nums">{item.episodeProgress}</span>
              <button
                onClick={(e) => { e.preventDefault(); onEpisodeChange(item.id, (item.currentEpisode ?? 0) + 1, item.totalEpisodes ?? undefined); }}
                className="w-5 h-5 rounded bg-black/50 flex items-center justify-center hover:bg-primary/80 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[10px] text-white">add</span>
              </button>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-0.5">
        <Link href={`/anime/${item.anilistId}`}>
          <h3 className="font-medium text-xs text-foreground line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
        </Link>
        <div className="relative flex items-center gap-1.5 mt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full ${item.statusColor}`} />
          <button
            onClick={() => setOpen(!open)}
            className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-0.5"
          >
            {item.status}
            <span className="material-symbols-outlined text-[10px]">expand_more</span>
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute top-full left-0 mt-1 z-20 bg-card border border-border rounded-lg shadow-xl py-1 min-w-[130px]">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onStatusChange(item.id, s);
                      setOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-1.5 text-[11px] font-medium hover:bg-muted transition-colors cursor-pointer ${
                      s === item.status ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
