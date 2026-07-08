import type { AniListAnime } from "@/lib/types";

const ANILIST_URL = "https://graphql.anilist.co";
const cache = new Map<string, { data: unknown; expiresAt: number }>();

async function fetchAniList(query: string, variables: object) {
  const isClient = typeof window !== 'undefined';
  const cacheKey = isClient ? JSON.stringify({ query, variables }) : '';

  if (isClient) {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }
  }

  try {
    const res = await fetch(ANILIST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      ...(isClient ? {} : { next: { revalidate: 300 } }),
    });

    const json = await res.json();
    if (json.errors) {
      const msg = json.errors.map((e: { message: string }) => e.message).join('; ');
      throw new Error(`AniList error: ${msg}`);
    }
    if (!res.ok) throw new Error(`AniList HTTP ${res.status}`);

    if (isClient) {
      cache.set(cacheKey, { data: json.data, expiresAt: Date.now() + 300000 });
    }

    return json.data;
  } catch (error) {
    console.error("Fetch AniList Gagal:", error);
    return null;
  }
}


export async function getTrendingAnime(genre?: string, timeframe: 'week' | 'month' | 'all' = 'week', page: number = 1) {
  const isFilteringGenre = genre && genre !== 'All Genres';
  const currentYear = new Date().getFullYear();
  
  // Menentukan musim saat ini
  const currentMonth = new Date().getMonth();
  let currentSeason = "SPRING";
  if (currentMonth >= 11 || currentMonth <= 1) currentSeason = "WINTER";
  else if (currentMonth >= 2 && currentMonth <= 4) currentSeason = "SPRING";
  else if (currentMonth >= 5 && currentMonth <= 7) currentSeason = "SUMMER";
  else if (currentMonth >= 8 && currentMonth <= 10) currentSeason = "FALL";

  let sortString = "TRENDING_DESC";
  let timeFilterString = "";

  if (timeframe === 'month') {
    sortString = "POPULARITY_DESC";
    timeFilterString = `, seasonYear: ${currentYear}, season: ${currentSeason}`;
  } else if (timeframe === 'all') {
    sortString = "POPULARITY_DESC";
  }

  // QUERY FIX: Format pendefinisian variabel dipisah dengan koma yang benar
  const query = `
    query ($page: Int ${isFilteringGenre ? ', $genre: String' : ''}) {
      Page(page: $page, perPage: 13) {
        media(type: ANIME, sort: ${sortString} ${timeFilterString} ${isFilteringGenre ? ', genre: $genre' : ''}, genre_not_in: ["Hentai"], isAdult: false) {
          id
          title {
            romaji
            english
          }
          averageScore
          format
          episodes
          coverImage {
            large
            extraLarge
          }
          bannerImage   
          description   
          genres        
          seasonYear    
        }
      }
    }
  `;
  
  const variables: Record<string, unknown> = { page };
  if (isFilteringGenre) variables.genre = genre;
  
  const data = await fetchAniList(query, variables);
  return data?.Page?.media || [];
}

// 2. Mencari Anime berdasarkan Teks & Genre
export async function searchAnime(
  searchQuery: string, 
  genres?: string[],
  format?: string,
  sortBy: string = 'popularity',
  page: number = 1
): Promise<AniListAnime[]> {
  const validGenres = genres?.filter(g => g !== 'All' && g !== 'All Genres') || [];
  const isFilteringGenre = validGenres.length > 0;
  const hasSearchText = searchQuery && searchQuery.trim() !== '';
  const hasFormat = format && format !== 'All';

  const sortMap: Record<string, string> = {
    popularity: 'POPULARITY_DESC',
    rating: 'SCORE_DESC',
    title: 'TITLE_ROMAJI',
  };
  const sortString = sortMap[sortBy] || 'POPULARITY_DESC';

  const queryArgs = [
    `$page: Int`,
    hasSearchText ? `$search: String` : null,
    isFilteringGenre ? `$genre: [String]` : null,
    hasFormat ? `$format: MediaFormat` : null
  ].filter(Boolean).join(', ');

  const query = `
    query (${queryArgs}) {
      Page(page: $page, perPage: 50) {
        media(
          type: ANIME, 
          sort: ${sortString}
          ${hasSearchText ? ', search: $search' : ''} 
          ${isFilteringGenre ? ', genre_in: $genre' : ''}
          ${hasFormat ? ', format: $format' : ''}
          genre_not_in: ["Hentai"], isAdult: false
        ) {
          id
          title {
            romaji
            english
          }
          averageScore
          format
          episodes
          coverImage {
            large
            extraLarge
          }
        }
      }
    }
  `;
  
  const variables: Record<string, unknown> = { page };
  if (hasSearchText) variables.search = searchQuery;
  if (isFilteringGenre) variables.genre = validGenres;
  if (hasFormat) variables.format = format;

  const data = await fetchAniList(query, variables);
  return data?.Page?.media || [];
}






export async function getAnimeDetail(id: string): Promise<AniListAnime | null> {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
        }
        bannerImage
        description
        format
        episodes
        status
        averageScore
        season
        seasonYear
        genres
        studios(isMain: true) {
          nodes {
            name
          }
        }
        trailer {
          id
          site
          thumbnail
        }
        mainCharacters: characters(role: MAIN, perPage: 4) {
          edges {
            role
            node {
              name { full }
              image { large }
            }
          }
        }
        supportingCharacters: characters(role: SUPPORTING, perPage: 4) {
          edges {
            role
            node {
              name { full }
              image { large }
            }
          }
        }
        recommendations(perPage: 6) {
          nodes {
            mediaRecommendation {
              id
              title {
                english
                romaji
              }
              coverImage {
                large
              }
            }
          }
        }
      }
    }
  `;

  const data = await fetchAniList(query, { id: parseInt(id) });
  return data?.Media || null;
}

export async function getRisingStarsAnime() {
  const query = `
    query {
      Page(page: 1, perPage: 5) {
        media(type: ANIME, sort: TRENDING_DESC, genre_not_in: ["Hentai"], isAdult: false) {
          id
          title {
            romaji
            english
          }
          coverImage {
            medium
          }
          trending
          stats {
            statusDistribution {
              status
              amount 
            }
          }
        }
      }
    }
  `;
  const data = await fetchAniList(query, {});
  return data?.Page?.media || [];
}

export async function getTopAnime(
  page: number = 1,
  perPage: number = 20,
  filters?: { genre?: string; year?: number; status?: string }
) {
  const hasGenre = !!filters?.genre && filters.genre !== 'All';
  const hasYear = !!filters?.year;
  const hasStatus = !!filters?.status && filters.status !== 'All';

  const varParts = ['$page: Int', '$perPage: Int'];
  const filterParts: string[] = ['type: ANIME', 'sort: SCORE_DESC', 'genre_not_in: ["Hentai"], isAdult: false'];

  if (hasGenre) {
    varParts.push('$genre: String');
    filterParts.push('genre: $genre');
  }
  if (hasYear) {
    varParts.push('$year: Int');
    filterParts.push('seasonYear: $year');
  }
  if (hasStatus) {
    varParts.push('$status: MediaStatus');
    filterParts.push('status: $status');
  }

  const query = `
    query (${varParts.join(', ')}) {
      Page(page: $page, perPage: $perPage) {
        media(${filterParts.join(', ')}) {
          id
          title {
            romaji
            english
          }
          averageScore
          format
          episodes
          popularity
          status
          seasonYear
          genres
          coverImage {
            large
            extraLarge
          }
        }
      }
    }
  `;

  const variables: Record<string, unknown> = { page, perPage };
  if (hasGenre) variables.genre = filters.genre;
  if (hasYear) variables.year = filters.year;
  if (hasStatus) variables.status = filters.status;

  const data = await fetchAniList(query, variables);
  return data?.Page?.media || [];
}

export async function getAiringUpdates(anilistIds: number[]) {
  if (anilistIds.length === 0) return [];
  const query = `
    query ($ids: [Int]) {
      Page(page: 1, perPage: 50) {
        media(id_in: $ids, type: ANIME) {
          id
          title {
            romaji
            english
          }
          status
          episodes
          nextAiringEpisode {
            airingAt
            episode
            timeUntilAiring
          }
        }
      }
    }
  `;
  const data = await fetchAniList(query, { ids: anilistIds });
  return data?.Page?.media || [];
}

export async function getSeasonalAnime(season: string, year: number, page: number = 1) {
  const query = `
    query ($season: MediaSeason, $year: Int, $page: Int) {
      Page(page: $page, perPage: 24) {
        media(type: ANIME, season: $season, seasonYear: $year, sort: POPULARITY_DESC, genre_not_in: ["Hentai"], isAdult: false) {
          id
          title { romaji english }
          averageScore
          format
          episodes
          coverImage { large extraLarge }
          genres
          seasonYear
        }
      }
    }
  `;
  const data = await fetchAniList(query, { season, year, page });
  return data?.Page?.media || [];
}

export async function getCurrentlyAiring(page: number = 1) {
  const query = `
    query ($page: Int) {
      Page(page: $page, perPage: 24) {
        media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC, genre_not_in: ["Hentai"], isAdult: false) {
          id
          title { romaji english }
          averageScore
          format
          episodes
          coverImage { large extraLarge }
          genres
          nextAiringEpisode {
            episode
            airingAt
            timeUntilAiring
          }
        }
      }
    }
  `;
  const data = await fetchAniList(query, { page });
  return data?.Page?.media || [];
}

export async function getAnimeScores(anilistIds: number[]) {
  if (anilistIds.length === 0) return {};
  const query = `
    query ($ids: [Int]) {
      Page(page: 1, perPage: 50) {
        media(id_in: $ids, type: ANIME) {
          id
          averageScore
        }
      }
    }
  `;
  const data = await fetchAniList(query, { ids: anilistIds });
  const mediaList: { id: number; averageScore: number | null }[] = data?.Page?.media || [];
  const scores: Record<number, number> = {};
  for (const m of mediaList) {
    if (m.averageScore != null) scores[m.id] = m.averageScore;
  }
  return scores;
}

export async function getGenreRecommendations(genres: string[], page: number = 1) {
  if (!genres.length) return [];
  const query = `
    query ($genre: [String], $page: Int) {
      Page(page: $page, perPage: 12) {
        media(type: ANIME, genre_in: $genre, sort: POPULARITY_DESC, genre_not_in: ["Hentai"], isAdult: false) {
          id
          title { romaji english }
          coverImage { large extraLarge }
          averageScore
          format
          episodes
          genres
        }
      }
    }
  `;
  const data = await fetchAniList(query, { genre: genres, page });
  return data?.Page?.media || [];
}

export async function getScheduleAnime(page: number = 1) {
  const query = `
    query ($page: Int) {
      Page(page: $page, perPage: 50) {
        media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC, genre_not_in: ["Hentai"], isAdult: false) {
          id
          title { romaji english }
          coverImage { large extraLarge }
          averageScore
          format
          episodes
          genres
          nextAiringEpisode {
            episode
            airingAt
            timeUntilAiring
          }
        }
      }
    }
  `;
  const data = await fetchAniList(query, { page });
  return data?.Page?.media || [];
}

export type AiringMedia = {
  id: number;
  title: { romaji: string; english: string | null };
  status: string;
  episodes: number | null;
  nextAiringEpisode: {
    airingAt: number;
    episode: number;
    timeUntilAiring: number;
  } | null;
};