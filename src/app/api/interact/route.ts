import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/src/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { validateAnilistId } from '@/lib/validation';

const VALID_ACTIONS = ['bookmark', 'favorite', 'remove_bookmark', 'remove_favorite'] as const;
const VALID_STATUSES = ['Watching', 'Completed', 'Plan to Watch'] as const;

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rl = rateLimit(`interact:${currentUser.id}`, { limit: 30, windowMs: 60000 });
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const { anilistId, title, imageUrl, genres, actionType, status, totalEpisodes, bookmarkId, favoriteId } = body;

    if (!actionType || !VALID_ACTIONS.includes(actionType)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const userId = currentUser.id;

    if (actionType === 'remove_bookmark') {
      if (bookmarkId && typeof bookmarkId === 'string') {
        const bookmark = await prisma.bookmark.findUnique({
          where: { id: bookmarkId },
          select: { animeId: true, userId: true },
        });
        if (!bookmark || bookmark.userId !== userId) {
          return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
        }
        await prisma.bookmark.delete({ where: { id: bookmarkId } });
        await prisma.activityLog.create({
          data: { userId, action: 'remove_bookmark', animeId: bookmark.animeId },
        });
      } else {
        const cleanAnilistId = validateAnilistId(anilistId);
        if (!cleanAnilistId) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const cleanGenres = Array.isArray(genres) ? genres.filter((g): g is string => typeof g === 'string').slice(0, 10) : [];
        const anime = await prisma.anime.upsert({
          where: { anilistId: cleanAnilistId },
          update: {},
          create: {
            anilistId: cleanAnilistId,
            title: (title && typeof title === 'string' ? title.slice(0, 500) : 'Unknown'),
            imageUrl: imageUrl && typeof imageUrl === 'string' ? imageUrl.slice(0, 1000) : '',
            genres: cleanGenres,
          },
        });
        await prisma.bookmark.deleteMany({ where: { userId, animeId: anime.id } });
        if (cleanGenres.length > 0) {
          for (const genre of cleanGenres) {
            await prisma.genreStat.updateMany({
              where: { userId, genre, count: { gt: 0 } },
              data: { count: { decrement: 1 } },
            });
          }
        }
        await prisma.activityLog.create({
          data: { userId, action: 'remove_bookmark', animeId: anime.id },
        });
      }
      return NextResponse.json({ success: true });
    }

    if (actionType === 'remove_favorite') {
      if (favoriteId && typeof favoriteId === 'string') {
        const favorite = await prisma.favorite.findUnique({
          where: { id: favoriteId },
          select: { animeId: true, userId: true },
        });
        if (!favorite || favorite.userId !== userId) {
          return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
        }
        await prisma.favorite.delete({ where: { id: favoriteId } });
        await prisma.activityLog.create({
          data: { userId, action: 'remove_favorite', animeId: favorite.animeId },
        });
      } else {
        const cleanAnilistId = validateAnilistId(anilistId);
        if (!cleanAnilistId) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const cleanGenres = Array.isArray(genres) ? genres.filter((g): g is string => typeof g === 'string').slice(0, 10) : [];
        const anime = await prisma.anime.upsert({
          where: { anilistId: cleanAnilistId },
          update: {},
          create: {
            anilistId: cleanAnilistId,
            title: (title && typeof title === 'string' ? title.slice(0, 500) : 'Unknown'),
            imageUrl: imageUrl && typeof imageUrl === 'string' ? imageUrl.slice(0, 1000) : '',
            genres: cleanGenres,
          },
        });
        await prisma.favorite.deleteMany({ where: { userId, animeId: anime.id } });
        await prisma.activityLog.create({
          data: { userId, action: 'remove_favorite', animeId: anime.id },
        });
      }
      return NextResponse.json({ success: true });
    }

    const cleanAnilistId = validateAnilistId(anilistId);
    if (!cleanAnilistId || !title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cleanTitle = title.slice(0, 500);
    const cleanImage = imageUrl && typeof imageUrl === 'string' ? imageUrl.slice(0, 1000) : '';
    const cleanGenres = Array.isArray(genres) ? genres.filter((g): g is string => typeof g === 'string').slice(0, 10) : [];

    const cleanTotalEpisodes = typeof totalEpisodes === 'number' && totalEpisodes > 0 ? totalEpisodes : null;

    const anime = await prisma.anime.upsert({
      where: { anilistId: cleanAnilistId },
      update: cleanTotalEpisodes != null ? { totalEpisodes: cleanTotalEpisodes } : {},
      create: {
        anilistId: cleanAnilistId,
        title: cleanTitle,
        imageUrl: cleanImage,
        genres: cleanGenres,
        totalEpisodes: cleanTotalEpisodes,
      },
    });

    if (actionType === 'bookmark') {
      await prisma.bookmark.upsert({
        where: { userId_animeId: { userId, animeId: anime.id } },
        update: { status: status && typeof status === 'string' && VALID_STATUSES.includes(status as typeof VALID_STATUSES[number]) ? status : 'Plan to Watch' },
        create: { userId, animeId: anime.id, status: status && typeof status === 'string' && VALID_STATUSES.includes(status as typeof VALID_STATUSES[number]) ? status : 'Plan to Watch' },
      });

      if (cleanGenres.length > 0) {
        for (const genre of cleanGenres) {
          await prisma.genreStat.upsert({
            where: { userId_genre: { userId, genre } },
            update: { count: { increment: 1 } },
            create: { userId, genre, count: 1 },
          });
        }
      }

      await prisma.activityLog.create({
        data: { userId, action: 'bookmark', animeId: anime.id },
      });
    } else if (actionType === 'favorite') {
      await prisma.favorite.upsert({
        where: { userId_animeId: { userId, animeId: anime.id } },
        update: {},
        create: { userId, animeId: anime.id },
      });

      await prisma.activityLog.create({
        data: { userId, action: 'favorite', animeId: anime.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rl = rateLimit(`interact:${currentUser.id}`, { limit: 30, windowMs: 60000 });
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { bookmarkId, status, currentEpisode, totalEpisodes } = await request.json();

    if (!bookmarkId || typeof bookmarkId !== 'string') {
      return NextResponse.json({ error: 'Missing bookmarkId' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};

    if (status && VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
      updateData.status = status;
    }

    if (typeof currentEpisode === 'number' && currentEpisode >= 0) {
      updateData.currentEpisode = currentEpisode;
    }

    if (typeof totalEpisodes === 'number' && totalEpisodes > 0) {
      await prisma.anime.update({
        where: { id: (await prisma.bookmark.findUnique({ where: { id: bookmarkId }, select: { animeId: true } }))?.animeId ?? '' },
        data: { totalEpisodes },
      }).catch(() => {});
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    await prisma.bookmark.update({
      where: { id: bookmarkId, userId: currentUser.id },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}