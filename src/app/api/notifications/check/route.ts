import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/src/lib/auth';
import { getAiringUpdates, type AiringMedia } from '@/lib/anilist';
import { rateLimit } from '@/lib/rate-limit';
import { validateCsrf } from '@/lib/csrf';

export async function POST(request: Request) {
  try {
    if (!(await validateCsrf(request))) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rl = rateLimit(`notif-check:${currentUser.id}`, { limit: 10, windowMs: 300000 });
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: currentUser.id },
      include: { anime: true },
    });

    if (bookmarks.length === 0) {
      return NextResponse.json({ checked: 0, created: 0 });
    }

    const anilistIds = bookmarks.map((b) => b.anime.anilistId);
    const airingData: AiringMedia[] = await getAiringUpdates(anilistIds);

    const existingNotifications = await prisma.notification.findMany({
      where: { userId: currentUser.id, type: { in: ['NEW_EPISODE', 'NOW_AIRING', 'COMPLETED'] } },
      select: { animeId: true, message: true, type: true },
    });

    const existingEpisodeKeys = new Set(
      existingNotifications
        .filter((n) => n.type === 'NEW_EPISODE')
        .map((n) => `${n.animeId}|${n.message}`)
    );

    const existingNowAiring = new Set(
      existingNotifications
        .filter((n) => n.type === 'NOW_AIRING')
        .map((n) => n.animeId)
    );

    const existingCompleted = new Set(
      existingNotifications
        .filter((n) => n.type === 'COMPLETED')
        .map((n) => n.animeId)
    );

    let created = 0;

    for (const media of airingData) {
      const anime = bookmarks.find((b) => b.anime.anilistId === media.id)?.anime;
      if (!anime) continue;

      if (media.status === 'RELEASING' && !existingNowAiring.has(anime.id)) {
        let msg = `${anime.title} is now airing new episodes!`;
        if (media.nextAiringEpisode?.timeUntilAiring !== undefined && media.nextAiringEpisode.timeUntilAiring <= 3600) {
          msg = `Episode ${media.nextAiringEpisode.episode} of ${anime.title} is airing now!`;
        }
        await prisma.notification.create({
          data: {
            userId: currentUser.id,
            animeId: anime.id,
            type: 'NOW_AIRING',
            message: msg,
          },
        });
        created++;
      }

      if (media.status === 'FINISHED' && !existingCompleted.has(anime.id)) {
        const epCount = media.episodes ? ` All ${media.episodes} episodes are now available.` : '';
        await prisma.notification.create({
          data: {
            userId: currentUser.id,
            animeId: anime.id,
            type: 'COMPLETED',
            message: `${anime.title} has finished airing!${epCount}`,
          },
        });
        created++;
      }

      if (!media.nextAiringEpisode || media.status !== 'RELEASING') continue;

      const airedEpisodes = (media.episodes ?? 0) > 0
        ? (media.episodes as number)
        : media.nextAiringEpisode.episode - 1;

      for (let ep = 1; ep <= airedEpisodes; ep++) {
        const key = `${anime.id}|Episode ${ep} of ${anime.title} has aired!`;
        if (existingEpisodeKeys.has(key)) continue;

        await prisma.notification.create({
          data: {
            userId: currentUser.id,
            animeId: anime.id,
            type: 'NEW_EPISODE',
            message: `Episode ${ep} of ${anime.title} has aired!`,
          },
        });
        created++;
      }

      const timeUntilAiring = media.nextAiringEpisode.timeUntilAiring;
      const nextEpMsg = timeUntilAiring <= 0
        ? `Episode ${media.nextAiringEpisode.episode} of ${anime.title} has just aired!`
        : timeUntilAiring <= 86400
          ? `Episode ${media.nextAiringEpisode.episode} of ${anime.title} airs in ${Math.ceil(timeUntilAiring / 3600)} hour${Math.ceil(timeUntilAiring / 3600) > 1 ? 's' : ''}!`
          : null;

      if (nextEpMsg && !existingEpisodeKeys.has(`${anime.id}|${nextEpMsg}`)) {
        await prisma.notification.create({
          data: {
            userId: currentUser.id,
            animeId: anime.id,
            type: 'NEW_EPISODE',
            message: nextEpMsg,
          },
        });
        created++;
      }
    }

    return NextResponse.json({ checked: bookmarks.length, created });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
