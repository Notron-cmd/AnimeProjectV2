import HeroSection from "@/components/Home/Hero";
import SearchSection from "@/components/Home/SearchSection";
import TrendingSection from "@/components/Home/TrendingSection";
import { getTrendingAnime, searchAnime } from "@/lib/anilist";
import Link from 'next/link';
import AnimeCard from "@/components/Home/AnimeCard"; // Pastikan path path sesuai strukturmu

interface PageProps {
  searchParams: Promise<{ q?: string; genre?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const genre = params.genre || "All Genres";

  // Ambil data trending untuk carousel atas
  const trendingData = await getTrendingAnime();

  // Jika user sedang mencari sesuatu, ambil data hasil pencariannya
  const isSearching = query !== "" || genre !== "All Genres";
  const searchResults = isSearching ? await searchAnime(query, [genre]) : [];

  return (
    <>
      <main className="bg-[#121317] min-h-screen pb-16">
        {/* 1. Hero Banner Tetap Statis/Dinamis Mendukung */}
        <HeroSection trendingData={trendingData}/>
        
        {/* 2. Komponen Input Pencarian */}
        <SearchSection currentQuery={query} currentGenre={genre} />

        {/* 3. Kondisional Kondisi: Jika Mencari vs Tampilan Normal */}
        {isSearching ? (
          <section className="w-full px-6 sm:px-12 md:px-16 py-8 max-w-[1600px] mx-auto relative z-30">
            <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#c3b4fc] rounded-full inline-block"></span>
              Hasil Pencarian {query && `"${query}"`} {genre !== 'All Genres' && `[${genre}]`}
            </h2>
            
            {searchResults.length === 0 ? (
              <p className="text-zinc-400 text-sm">Anime tidak ditemukan, coba filter atau kata kunci lain.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {searchResults.map((anime: any) => (
                  <Link href={`/anime/${anime.id}`} key={anime.id}>
                    <AnimeCard
                      title={anime.title.english || anime.title.romaji}
                      rating={anime.averageScore ? (anime.averageScore / 10).toFixed(1) : "N/A"}
                      episode={anime.episodes || "Ongoing"}
                      type={anime.format || "TV"}
                      image={anime.coverImage.large || anime.coverImage.extraLarge}
                    />
                  </Link>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* Tampilkan Carousel Trending Jika Tidak Sedang Mencari */
          <TrendingSection animeData={trendingData} />
        )}
      </main>
    </>
  );
}