import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/src/lib/auth';
import { getAnimeScores } from '@/lib/anilist';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rawBookmarks = await prisma.bookmark.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: 'desc' },
    }).catch(e => { console.error('bookmarks query failed:', e); return []; });

    const rawFavorites = await prisma.favorite.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: 'desc' },
    }).catch(e => { console.error('favorites query failed:', e); return []; });

    const animeIds = [...new Set([
      ...rawBookmarks.map(b => b.animeId),
      ...rawFavorites.map(f => f.animeId),
    ])].filter(Boolean);

    const animeMap: Record<string, { id: string; anilistId: number; title: string; imageUrl: string; genres: string[]; totalEpisodes: number | null }> = {};
    if (animeIds.length > 0) {
      const animes = await prisma.anime.findMany({
        where: { id: { in: animeIds } },
      }).catch(e => { console.error('anime findMany failed:', e); return []; });
      for (const a of animes) {
        animeMap[a.id] = a;
      }
    }

    const bookmarks = rawBookmarks.filter(b => animeMap[b.animeId] != null).map(b => ({ ...b, anime: animeMap[b.animeId] }));
    const favorites = rawFavorites.filter(f => animeMap[f.animeId] != null).map(f => ({ ...f, anime: animeMap[f.animeId] }));

    const [genreStats, recentActivities] = await Promise.all([
      prisma.genreStat.findMany({
        where: { userId: currentUser.id },
        orderBy: { count: 'desc' },
      }).catch(e => { console.error('genreStats query failed:', e); return []; }),
      prisma.activityLog.findMany({
        where: { userId: currentUser.id },
        include: { anime: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }).catch(e => { console.error('activityLogs query failed:', e); return []; }),
    ]);

    const allAnilistIds = [
      ...new Set([
        ...bookmarks.map(b => b.anime.anilistId),
        ...favorites.map(f => f.anime.anilistId),
      ]),
    ];

    const scores = allAnilistIds.length > 0 ? await getAnimeScores(allAnilistIds).catch(e => { console.error('getAnimeScores failed:', e); return {}; }) : {};

    const userRatingRows = await prisma.userRating
      .findMany({ where: { userId: currentUser.id }, include: { anime: true } })
      .catch(e => { console.error('userRatings query failed:', e); return []; });

    const ratingsMap: Record<number, number> = {};
    for (const r of userRatingRows) {
      if (r.anime) ratingsMap[r.anime.anilistId] = r.score;
    }

    const safeActivities = recentActivities.filter(a => !a.animeId || a.anime);

    return NextResponse.json({
      user: currentUser,
      bookmarks,
      favorites,
      genreStats,
      recentActivities: safeActivities,
      scores,
      userRatings: ratingsMap,
    });
  } catch (e) {
    console.error('/api/profile error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
