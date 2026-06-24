import React from 'react';
import Image from 'next/image';
import AnimeBanner from '@/src/app/anime/[id]/_components/AnimeBanner';
import AnimeSidebar from '@/src/app/anime/[id]/_components/AnimeSidebar';
import AnimeContent from '@/src/app/anime/[id]/_components/AnimeContent';

// MOCK DATA FETCHING
async function getAnimeFromDatabase(id: string) {
  if (id === "frieren") {
    return {
      title: "Frieren: Beyond Journey's End",
      title_japanese: '葬送のフリーレン',
      synopsis: 'The adventure is over but life goes on for an elf mage just beginning to learn what living is all about. Elf mage Frieren and her courageous fellow adventurers have defeated the Demon King and brought peace to the land. But Frieren will long outlive the rest of her former party. How will she come to understand what life means to the people around her? Decades after their victory, the funeral of one her friends confronts Frieren with her own near immortality. Frieren sets out to fulfill the last wishes of her comrades and finds herself beginning a new adventure…',
      score: 8.9,
      format: 'TV Series',
      episodes: 24,
      status: 'Finished',
      season: 'Fall 2024',
      studio: 'MADHOUSE',
      genres: ['ACTION', 'SCI-FI', 'DRAMA'],
      image_url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-qQTzQnEJJ3oB.jpg',
      trailer_thumbnail: 'https://media.themoviedb.org/t/p/w500_and_h282_face/emGCHnRPru5LLWcKbSFzUEUisac.jpg',
      characters: [
        { name: 'Frieren', role: 'MAIN', img: 'https://s4.anilist.co/file/anilistcdn/character/large/b176754-PCnpqIOkjhFk.png' },
        { name: 'Fern', role: 'MAIN', img: 'https://s4.anilist.co/file/anilistcdn/character/large/b183965-uGFohBjlFoTp.png' },
        { name: 'Stark', role: 'SUPPORTING', img: 'https://s4.anilist.co/file/anilistcdn/character/large/b184313-CQl6GSt4RSny.jpg' },
        { name: 'Himmel', role: 'SUPPORTING', img: 'https://s4.anilist.co/file/anilistcdn/character/large/b184311-wQFySqYXEqf1.png' },
      ],
      recommendations: [
        { id: 'iron-genesis', title: 'Iron Genesis', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80' },
        { id: 'cyber-frame', title: 'Cyber Frame', img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80' },
        { id: 'stellar-transit', title: 'Stellar Transit', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80' },
        { id: 'aegis-protocol', title: 'Aegis Protocol', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80' },
        { id: 'the-monolith', title: 'The Monolith', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80' },
      ]
    };
  }
  return null;
}

export default async function AnimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; 
  
  const anime = await getAnimeFromDatabase(id);

  if (!anime) {
    return <div className="text-center py-20 text-zinc-400">Anime Not Found</div>;
  }
  return (
    <div className="bg-[#121317] text-[#e2e2e6] min-h-screen font-sans antialiased pb-24 selection:bg-[#7c3aed] selection:text-white">
      
      <AnimeBanner src={anime.image_url} alt={anime.title} />

      <div className="px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto relative z-20 -mt-24 sm:-mt-36 md:-mt-44">
        
        {/* 📱 Mobile Title */}
        <div className="block md:hidden mb-6 text-center px-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#e2e2e6] leading-tight">{anime.title}</h1>
          <h2 className="text-xs sm:text-sm text-zinc-400 font-normal mt-1">{anime.title_japanese}</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          <AnimeSidebar 
            title={anime.title} image={anime.image_url} score={anime.score} 
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
              characters={anime.characters} 
              recommendations={anime.recommendations} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}