import React from 'react';
import { notFound } from 'next/navigation';
import { getAnimeDetail } from '@/lib/anilist'; // Pastikan path import mengarah ke file anilist.ts kamu
import AnimeBanner from '@/src/app/anime/[id]/_components/AnimeBanner';
import AnimeSidebar from '@/src/app/anime/[id]/_components/AnimeSidebar';
import AnimeContent from '@/src/app/anime/[id]/_components/AnimeContent';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { id } = await params; 
  
  // Ambil data langsung dari AniList API asli menggunakan ID dari URL rute
  const animeData = await getAnimeDetail(id);

  if (!animeData) {
    notFound();
  }

  // Rekonstruksi bentuk data agar cocok dan serasi dengan skema props komponen buatanmu
  const anime = {
    title: animeData.title.english || animeData.title.romaji,
    title_japanese: animeData.title.native || "",
    synopsis: animeData.description ? animeData.description.replace(/<\/?[^>]+(>|$)/g, "") : "No synopsis available.",
    score: animeData.averageScore ? animeData.averageScore / 10 : 0,
    format: animeData.format || "TV",
    episodes: animeData.episodes || 0,
    status: animeData.status || "UNKNOWN",
    season: animeData.season ? `${animeData.season} ${animeData.seasonYear}` : `${animeData.seasonYear || 'N/A'}`,
    studio: animeData.studios?.nodes?.[0]?.name || "Unknown Studio",
    genres: animeData.genres || [],
    image_url: animeData.coverImage.extraLarge || animeData.coverImage.large,
    banner_url: animeData.bannerImage || animeData.coverImage.extraLarge,
    
    trailer_thumbnail: animeData.trailer?.thumbnail || "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800",
    trailerId: animeData.trailer?.id || null,
    trailerSite: animeData.trailer?.site || null,
    
    // Mapping Karakter
    characters: [
      ...(animeData.mainCharacters?.edges?.map((edge: any) => ({
        name: edge.node.name.full,
        role: edge.role,
        img: edge.node.image.large
      })) || []),
      ...(animeData.supportingCharacters?.edges?.map((edge: any) => ({
        name: edge.node.name.full,
        role: edge.role,
        img: edge.node.image.large
      })) || [])
    ],

    // Mapping Rekomendasi
    recommendations: animeData.recommendations?.nodes
      ?.filter((node: any) => node.mediaRecommendation !== null)
      ?.map((node: any) => ({
        id: node.mediaRecommendation.id.toString(),
        title: node.mediaRecommendation.title.english || node.mediaRecommendation.title.romaji,
        img: node.mediaRecommendation.coverImage.large
      })) || []
  };

  return (
    <div className="bg-[#121317] text-[#e2e2e6] min-h-screen font-sans antialiased pb-24 selection:bg-[#7c3aed] selection:text-white">
      
      {/* Memakai banner_url landscape agar background atas megah */}
      <AnimeBanner src={anime.banner_url} alt={anime.title} />

      <div className="px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto relative z-20 -mt-24 sm:-mt-36 md:-mt-44">
        
        {/* 📱 Mobile Title */}
        <div className="block md:hidden mb-6 text-center px-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#e2e2e6] leading-tight">{anime.title}</h1>
          <h2 className="text-xs sm:text-sm text-zinc-400 font-normal mt-1">{anime.title_japanese}</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          <AnimeSidebar 
            anilistId={id} title={anime.title} image={anime.image_url} score={anime.score} 
            format={anime.format} episodes={anime.episodes} status={anime.status} 
            season={anime.season} studio={anime.studio} genres={anime.genres} 
          />

          <div className="flex-1 flex flex-col gap-8 md:gap-10">
            {/* 💻 Desktop Title */}
            <div className="hidden md:block">
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#e2e2e6]">{anime.title}</h1>
              <h2 className="text-lg text-zinc-400 font-normal mt-2">{anime.title_japanese}</h2>
            </div>

            <AnimeContent 
              synopsis={anime.synopsis} 
              trailerThumbnail={anime.trailer_thumbnail} 
              trailerId={anime.trailerId}
              trailerSite={anime.trailerSite}
              characters={anime.characters} 
              recommendations={anime.recommendations} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}