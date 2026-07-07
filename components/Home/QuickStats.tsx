'use client';

import React, { useEffect, useRef, useState } from 'react';

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLParagraphElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || started.current) return;
    started.current = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        let start = performance.now();
        function tick(now: number) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

const iconStyles: Record<string, { color: string; bg: string }> = {
  play_circle: { color: 'text-sky-300', bg: 'bg-sky-400/25' },
  group: { color: 'text-purple-300', bg: 'bg-purple-400/25' },
  bookmark: { color: 'text-emerald-300', bg: 'bg-emerald-400/25' },
  favorite: { color: 'text-red-300', bg: 'bg-red-400/25' },
};

function StatCard({ label, value, icon, gradient, displayZero }: { label: string; value: number; icon: string; gradient: string; displayZero?: boolean }) {
  const { count, ref } = useCountUp(value);
  const s = iconStyles[icon] || { color: 'text-white', bg: 'bg-white/10' };
  return (
    <div className={`relative group ${gradient} rounded-2xl p-[1px] overflow-hidden`}>
      <div className="bg-[#121317] rounded-2xl p-6 h-full flex flex-col items-center justify-center relative z-10">
        <div className={`w-12 h-12 rounded-xl ${s.bg} border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg`}>
          <span className={`material-symbols-outlined ${s.color} text-2xl`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        <p ref={ref} className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums leading-none tracking-tight">
          {displayZero && value === 0 ? '—' : count.toLocaleString()}
        </p>
        <p className="text-xs text-zinc-400 mt-1.5 font-medium tracking-wide uppercase">{label}</p>
      </div>
    </div>
  );
}

export default function QuickStats({ animeCount, userCount, bookmarkCount, favoriteCount }: { animeCount: number; userCount: number; bookmarkCount: number; favoriteCount: number }) {
  return (
    <section className="w-full px-6 sm:px-12 md:px-16 py-10 max-w-[1600px] mx-auto relative z-30">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-1 bg-gradient-to-b from-[#c3b4fc] to-[#4cd7f6] rounded-full" />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-white">AniVision in Numbers</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Real-time platform statistics</p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Anime Tracked" value={animeCount} icon="play_circle" gradient="bg-gradient-to-br from-sky-400/70 via-sky-500/30 to-transparent" />
        <StatCard label="Community Members" value={userCount} icon="group" gradient="bg-gradient-to-br from-purple-400/70 via-purple-500/30 to-transparent" />
        <StatCard label="Bookmarks Saved" value={bookmarkCount} icon="bookmark" gradient="bg-gradient-to-br from-emerald-400/70 via-emerald-500/30 to-transparent" />
        <StatCard label="Favorites Curated" value={favoriteCount} icon="favorite" gradient="bg-gradient-to-br from-red-400/70 via-red-500/30 to-transparent" displayZero />
      </div>
    </section>
  );
}
