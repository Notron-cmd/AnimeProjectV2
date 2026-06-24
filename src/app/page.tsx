import Image from "next/image";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/Home/Hero"
import SearchSection from "@/components/Home/SearchSection";
import TrendingSection from "@/components/Home/TrendingSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <HeroSection/>
        <SearchSection/>
        <TrendingSection/>
      </main>
    </>
  );
}
