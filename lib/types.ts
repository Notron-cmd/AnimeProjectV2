// AniList API types
export interface AniListTitle {
  english?: string;
  romaji: string;
  native?: string;
}

export interface AniListCoverImage {
  large: string;
  extraLarge: string;
  medium?: string;
  color?: string;
}

export interface AniListDate {
  year?: number;
  month?: number;
  day?: number;
}

export interface AniListCharacter {
  id: number;
  name: { full: string; native?: string };
  image?: { large?: string; medium?: string };
  role?: string;
  voiceActors?: Array<{
    id: number;
    name: { full: string };
    image?: { large?: string };
    language?: string;
  }>;
}

export interface AniListStudio {
  id: number;
  name: string;
  isAnimationStudio?: boolean;
}

export interface AniListRecommended {
  id: number;
  title: AniListTitle;
  coverImage?: AniListCoverImage;
  averageScore?: number;
  format?: string;
}

export interface AniListCharacterEdge {
  role: string;
  node: {
    id: number;
    name: { full: string };
    image: { large: string };
  };
}

export interface AniListAnime {
  id: number;
  title: AniListTitle;
  coverImage: AniListCoverImage;
  bannerImage?: string;
  averageScore?: number;
  meanScore?: number;
  episodes?: number;
  duration?: number;
  status?: string;
  format?: string;
  genres?: string[];
  seasonYear?: number;
  season?: string;
  popularity?: number;
  trending?: number;
  description?: string;
  source?: string;
  hashtag?: string;
  studios?: { nodes?: AniListStudio[] };
  characters?: { nodes?: AniListCharacter[] };
  trailer?: {
    id?: string;
    site?: string;
    thumbnail?: string;
  };
  mainCharacters?: {
    edges?: AniListCharacterEdge[];
  };
  supportingCharacters?: {
    edges?: AniListCharacterEdge[];
  };
  recommendations?: { nodes?: Array<{ mediaRecommendation?: AniListRecommended }> };
  tags?: Array<{ name: string; rank: number }>;
  startDate?: AniListDate;
  endDate?: AniListDate;
  nextAiringEpisode?: {
    airingAt: number;
    episode: number;
    timeUntilAiring: number;
  };
  rankings?: Array<{
    rank: number;
    type: string;
    season?: string;
    year?: number;
    allTime?: boolean;
    context: string;
  }>;
}

export interface AniListPageInfo {
  total?: number;
  currentPage?: number;
  lastPage?: number;
  hasNextPage?: boolean;
  perPage?: number;
}
