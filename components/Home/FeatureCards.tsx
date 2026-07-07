'use client';

import React, { useState } from 'react';

const features = [
  { icon: 'bookmark', label: 'Track Anime', desc: 'Bookmark and organize your personal watchlist with ease. Track your progress across multiple statuses like Watching, Completed, Plan to Watch, or Dropped — so you never lose track of where you left off.' },
  { icon: 'favorite', label: 'Favorites Collection', desc: 'Build your personal elite collection of all-time favorite anime. Curate a showcase of top-tier titles that define your taste and share your anime identity with the community.' },
  { icon: 'trending_up', label: 'Trending & Rankings', desc: 'Stay ahead with real-time popularity data powered by global engagement. Discover what the world is watching, from rising stars to all-time masterpieces ranked by the community.' },
  { icon: 'notifications', label: 'Smart Alerts', desc: 'Never miss a moment. Get instant notifications when new episodes air, your favorite shows go live, or a completed series finishes — all powered by live AniList data.' },
];

export default function FeatureCards() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="w-full px-6 sm:px-12 md:px-16 py-10 max-w-[1600px] mx-auto relative z-30">
      <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-white mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block"></span>
        Why AniVision?
      </h2>
      <div className="flex flex-col gap-3">
        {features.map((f, i) => (
          <button
            key={f.label}
            onClick={() => toggle(i)}
            className="bg-[#1a1b23] border border-white/5 rounded-xl p-5 flex items-start gap-4 hover:border-[#c3b4fc]/30 transition-all duration-200 text-left cursor-pointer w-full"
          >
            <div className="w-10 h-10 rounded-lg bg-[#c3b4fc]/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#c3b4fc] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-sm text-white">{f.label}</h3>
                <span className={`material-symbols-outlined text-zinc-500 text-base transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </div>
              <div className={`overflow-hidden transition-all duration-200 ${openIndex === i ? 'max-h-40 mt-1.5 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
