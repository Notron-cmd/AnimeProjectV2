// src/app/explore/page.tsx
import ExploreClient from "./ExploreClient";

const MOCK_ANIME = [
  {
    id: 1,
    title: "Frieren: Beyond Journey's End",
    rating: "4.9",
    type: "TV",
    genres: ["Drama", "Fantasy"],
    popularity: 98,
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Jujutsu Kaisen Season 2",
    rating: "4.8",
    type: "TV",
    genres: ["Action", "Fantasy"],
    popularity: 95,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Demon Slayer: Kimetsu no Yaiba",
    rating: "4.7",
    type: "MOVIE",
    genres: ["Action", "Fantasy"],
    popularity: 92,
    image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Chainsaw Man",
    rating: "4.6",
    type: "TV",
    genres: ["Action", "Sci-Fi"],
    popularity: 88,
    image: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Attack on Titan: The Final Season",
    rating: "4.9",
    type: "OVA",
    genres: ["Action", "Drama"],
    popularity: 99,
    image: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Cyberpunk: Edgerunners",
    rating: "4.7",
    type: "TV",
    genres: ["Action", "Sci-Fi"],
    popularity: 85,
    image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function ExplorePage() {
  return <ExploreClient initialAnime={MOCK_ANIME} />;
}