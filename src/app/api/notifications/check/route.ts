import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/src/lib/auth';
import { getAiringUpdates, type AiringMedia } from '@/lib/anilist';
import { rateLimit } from '@/lib/rate-limit';

export async function POST() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rl = rateLimit(`notif-check:${currentUser.id}`, { limit: 10, windowMs: 300000 });
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: currentUser.id, status: 'Watching' },
      include: { anime: true },
    });

    if (bookmarks.length === 0) {
      return NextResponse.json({ checked: 0, created: 0 });
    }

    const anilistIds = bookmarks.map((b) => b.anime.anilistId);
    const airingData: AiringMedia[] = await getAiringUpdates(anilistIds);

    const existingNotifications = await prisma.notification.findMany({
      where: { userId: currentUser.id, type: 'NEW_EPISODE' },
      select: { animeId: true, message: true },
    });

    const existingKeys = new Set(
      existingNotifications.map((n) => `${n.animeId}|${n.message}`)
    );

    let created = 0;

    for (const media of airingData) {
      if (!media.nextAiringEpisode || media.status !== 'RELEASING') continue;

      const airedEpisodes = (media.episodes ?? 0) > 0
        ? (media.episodes as number)
        : media.nextAiringEpisode.episode - 1;

      const anime = bookmarks.find((b) => b.anime.anilistId === media.id)?.anime;
      if (!anime) continue;

      for (let ep = 1; ep <= airedEpisodes; ep++) {
        const key = `${anime.id}|Episode ${ep} of ${anime.title} has aired!`;
        if (existingKeys.has(key)) continue;

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

      const nextEpKey = `${anime.id}|Episode ${media.nextAiringEpisode.episode} of ${anime.title} airing soon!`;
      if (!existingKeys.has(nextEpKey)) {
        const timeUntilAiring = media.nextAiringEpisode.timeUntilAiring;

        if (timeUntilAiring <= 0) {
          await prisma.notification.create({
            data: {
              userId: currentUser.id,
              animeId: anime.id,
              type: 'NEW_EPISODE',
              message: `Episode ${media.nextAiringEpisode.episode} of ${anime.title} has just aired!`,
            },
          });
          created++;
        } else if (timeUntilAiring <= 86400) {
          const hours = Math.ceil(timeUntilAiring / 3600);
          await prisma.notification.create({
            data: {
              userId: currentUser.id,
              animeId: anime.id,
              type: 'NEW_EPISODE',
              message: `Episode ${media.nextAiringEpisode.episode} of ${anime.title} airs in ${hours} hour${hours > 1 ? 's' : ''}!`,
            },
          });
          created++;
        }
      }
    }

    return NextResponse.json({ checked: bookmarks.length, created });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
