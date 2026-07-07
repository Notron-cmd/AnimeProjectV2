'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

interface HeroProps {
  trendingData: any[];
}

export default function Hero({ trendingData }: HeroProps) {
  const { toast } = useToast();
  // State untuk menyimpan anime aktif yang sedang tampil di Banner
  const [currentAnime, setCurrentAnime] = useState<any>(null);

  useEffect(() => {
    // 1. Validasi: Jika data dari API belum masuk atau kosong, gunakan fallback data Frieren
    if (!trendingData || trendingData.length === 0) {
      setCurrentAnime({
        id: "frieren-fallback",
        title: { english: "Frieren: Beyond Journey's End", romaji: "Sousou no Frieren" },
        averageScore: 92,
        bannerImage: "/assets/Homepage/BackgroundHome.jpg", // Gambar lokal kamu
        description: "Mage elf Frieren dan rekan-rekan pahlawannya telah berhasil mengalahkan Raja Iblis dan membawa perdamaian ke dunia. Namun, sebagai elf, Frieren ditakdirkan hidup jauh lebih lama daripada teman-temannya.",
        genres: ["Action", "Fantasy", "Drama"],
        seasonYear: 2024
      });
      return;
    }

    // 2. Fungsi untuk memilih 1 anime secara acak dari list trending
    const setRandomAnime = () => {
      const randomIndex = Math.floor(Math.random() * trendingData.length);
      setCurrentAnime(trendingData[randomIndex]);
    };

    // Jalankan pengacakan pertama kali saat halaman dimuat
    setRandomAnime();

    // 3. Set timer untuk mengacak ulang setiap 25 menit
    // 25 menit = 25 * 60 * 1000 = 1.500.000 ms
    const intervalTime = 25 * 60 * 1000; 
    const intervalId = setInterval(setRandomAnime, intervalTime);

    // Bersihkan interval jika komponen tidak lagi digunakan (anti memory leak)
    return () => clearInterval(intervalId);
  }, [trendingData]);

  // Jika state currentAnime belum siap, tampilkan placeholder kosong agar tidak crash
  if (!currentAnime) {
    return <div className="w-full h-[600px] bg-[#121317] animate-pulse" />;
  }

  // Bersihkan tag HTML (seperti <br>, <i>) yang kadang terbawa dari deskripsi AniList
  const cleanDescription = currentAnime.description
    ? currentAnime.description.replace(/<\/?[^>]+(>|$)/g, "")
    : "Tidak ada sinopsis yang tersedia untuk anime ini.";

  // Ambil gambar terbaik untuk background. 
  // Catatan: AniList menyediakan properti bannerImage untuk gambar landscape lebar.
  const backgroundImage = currentAnime.bannerImage || currentAnime.coverImage?.extraLarge || currentAnime.coverImage?.large;

  const handleBookmarkClick = async (animeFromAniList: any) => {
    try {
      const res = await fetch('/api/interact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          anilistId: animeFromAniList.id,
          title: animeFromAniList.title.english || animeFromAniList.title.romaji,
          imageUrl: animeFromAniList.coverImage.large || animeFromAniList.coverImage.medium,
          genres: animeFromAniList.genres || [],
          actionType: 'bookmark'
        }),
      });

      // 1. VALIDASI RESPONSE: Cek apakah server mengembalikan status sukses (200-299)
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Server Error (${res.status}):`, errorText);
        toast(`Gagal menyimpan (${res.status})`, 'error');
        return;
      }

      const data = await res.json();
      
      if (data.success) {
        toast(`Berhasil menambahkan ${animeFromAniList.title.romaji || animeFromAniList.title.english} ke bookmark!`, 'success');
      } else {
        console.error(data.error);
        toast(data.error || 'Gagal menyimpan', 'error');
      }
    } catch (error) {
      console.error("Gagal menyambungkan ke database:", error);
      toast("Gagal menyambungkan ke database", 'error');
    }
  };

  return (
    <section className="relative w-full h-[600px] sm:h-[450px] md:h-[600px] lg:h-[800px] pt-0">
      {/* Background Banner */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#121317]">
        <Image 
          src={backgroundImage}
          alt={`Hero Banner ${currentAnime.title?.english || currentAnime.title?.romaji}`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_30%] opacity-70 transition-all duration-700 ease-in-out" 
        />
      </div>
      
      {/* Overlay Gradasi Estetik */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle,_transparent_30%,_rgba(18,19,23,0.85)_100%)]" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#121317] via-[#121317]/50 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#121317]/80 via-transparent to-transparent" />

      {/* Konten Teks Anime */}
      <div className="relative z-20 flex h-full items-end pb-12 px-6 sm:px-12 max-w-[1600px] mx-auto w-full">
        <div className="max-w-2xl text-white">
          
          {/* Metadata Badge */}
          <div className="flex flex-wrap items-center gap-3 mb-3 text-xs sm:text-sm font-medium">
            {currentAnime.averageScore && (
              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
                {(currentAnime.averageScore / 10).toFixed(1)}
              </span>
            )}
            {currentAnime.seasonYear && <span className="text-zinc-300">{currentAnime.seasonYear}</span>}
            {currentAnime.genres && currentAnime.genres.length > 0 && (
              <>
                <span className="text-zinc-400">•</span>
                <span className="text-zinc-300 line-clamp-1">{currentAnime.genres.slice(0, 2).join(', ')}</span>
              </>
            )}
            <span className="text-zinc-400">•</span>
            <span className="border border-zinc-500/50 text-zinc-400 px-1.5 py-0.2 text-[10px] rounded tracking-wide uppercase font-bold">
              {currentAnime.format || "TV"}
            </span>
          </div>

          {/* Judul Anime Dinamis */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-white mb-4 drop-shadow-md line-clamp-2">
            {currentAnime.title?.english || currentAnime.title?.romaji}
          </h1>

          {/* Sinopsis Dinamis */}
          <p className="text-zinc-300 text-sm sm:text-base md:text-lg mb-8 leading-relaxed max-w-xl line-clamp-2 sm:line-clamp-3">
            {cleanDescription}
          </p>

          {/* Tombol Aksi */}
          <div className="flex flex-wrap gap-4">
            {/* Tombol View Details mengarah ke rute detail berdasarkan ID AniList */}
            <Link href={`/anime/${currentAnime.id}`} className="bg-[#c3b4fc] text-[#0b0c10] font-bold px-10 sm:px-8 py-3 rounded-xl flex items-center gap-2.5 hover:bg-[#b3a2f7] active:scale-95 transition-all duration-200 shadow-lg shadow-[#c3b4fc]/10 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
              View Details
            </Link>

            <button onClick={() => handleBookmarkClick(currentAnime)} className="bg-white/10 hover:bg-white/15 backdrop-blur-md text-white border border-white/15 font-semibold px-7 sm:px-6 py-3 rounded-xl flex items-center gap-2 active:scale-95 transition-all duration-200 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add To Bookmark
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}