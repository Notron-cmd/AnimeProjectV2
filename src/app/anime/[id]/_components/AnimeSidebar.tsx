import Image from 'next/image';

interface SidebarProps {
  title: string;
  image: string;
  score: number;
  format: string;
  episodes: number;
  status: string;
  season: string;
  studio: string;
  genres: string[];
}

export default function AnimeSidebar({ title, image, score, format, episodes, status, season, studio, genres }: SidebarProps) {
  return (
    <aside className="w-full md:w-[280px] shrink-0 flex flex-col gap-5">
      {/* Poster Card */}
      <div className="relative w-48 sm:w-56 md:w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#14181d]/60 backdrop-blur-xl border border-[#242b33]/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:border-[#7c3aed] transition-all duration-300 mx-auto md:mx-0 group">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 max-w-sm mx-auto md:mx-0 w-full">
        <button className="flex-1 bg-[#7c3aed] text-white text-xs font-bold tracking-wider uppercase py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#732ee4] transition-colors active:scale-95 duration-150">
          <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          ADD TO LIST
        </button>
        <button className="w-12 h-12 bg-[#14181d]/60 backdrop-blur-xl border border-[#242b33]/80 rounded-lg flex items-center justify-center text-[#e2e2e6] hover:text-[#7c3aed] transition-colors active:scale-95 duration-150">
          <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Stats Bento Box */}
      <div className="bg-[#14181d]/60 backdrop-blur-xl border border-[#242b33]/80 rounded-xl p-4 flex flex-col gap-4 max-w-sm mx-auto md:mx-0 w-full">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
          <span className="text-xs font-bold tracking-wider text-zinc-400 uppercase">SCORE</span>
          <div className="flex items-center gap-1">
            <span className="text-[#4cd7f6] text-sm">★</span>
            <span className="text-sm font-medium text-[#e2e2e6]">{score}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          <div>
            <span className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-0.5">FORMAT</span>
            <span className="text-xs text-[#e2e2e6]">{format}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-0.5">EPISODES</span>
            <span className="text-xs text-[#e2e2e6]">{episodes}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-0.5">STATUS</span>
            <span className="text-xs text-[#4cd7f6] font-semibold">{status}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-0.5">SEASON</span>
            <span className="text-xs text-[#e2e2e6]">{season}</span>
          </div>
          <div className="col-span-2">
            <span className="block text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-0.5">STUDIO</span>
            <span className="text-xs text-[#7c3aed] font-medium">{studio}</span>
          </div>
          <div className="col-span-2 flex flex-wrap gap-1.5 mt-1">
            {genres.map((genre) => (
              <span key={genre} className="px-2 py-0.5 rounded bg-[#1e2023] text-[#e2e2e6] text-[9px] font-bold tracking-wider border border-zinc-700">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}