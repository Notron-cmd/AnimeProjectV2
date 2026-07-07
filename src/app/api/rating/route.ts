import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/src/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { validateAnilistId } from '@/lib/validation';
import { validateCsrf } from '@/lib/csrf';
import { getCached, setCache } from '@/lib/query-cache';

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const anilistId = searchParams.get('anilistId');
    const cleanId = validateAnilistId(anilistId);
    if (!cleanId) {
      return NextResponse.json({ score: null });
    }

    const cacheKey = `animeIdByAnilist:${cleanId}`;
    let anime = getCached<{ id: string }>(cacheKey);
    if (!anime) {
      anime = await prisma.anime.findUnique({ where: { anilistId: cleanId }, select: { id: true } });
      if (anime) setCache(cacheKey, anime, 30000);
    }
    if (!anime) {
      return NextResponse.json({ score: null });
    }

    const rating = await prisma.userRating.findUnique({
      where: { userId_animeId: { userId: currentUser.id, animeId: anime.id } },
      select: { score: true },
    });

    return NextResponse.json({ score: rating?.score ?? null });
  } catch {
    return NextResponse.json({ score: null });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await validateCsrf(request))) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rl = rateLimit(`rating:${currentUser.id}`, { limit: 30, windowMs: 60000 });
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { anilistId, score } = await request.json();

    const cleanAnilistId = validateAnilistId(anilistId);
    if (!cleanAnilistId) {
      return NextResponse.json({ error: 'Invalid anilistId' }, { status: 400 });
    }

    const cleanScore = typeof score === 'number' && Number.isInteger(score) && score >= 1 && score <= 10 ? score : null;
    if (cleanScore == null) {
      return NextResponse.json({ error: 'Score must be an integer between 1 and 10' }, { status: 400 });
    }

    const anime = await prisma.anime.upsert({
      where: { anilistId: cleanAnilistId },
      update: {},
      create: {
        anilistId: cleanAnilistId,
        title: '',
        imageUrl: '',
        genres: [],
      },
    });

    await prisma.userRating.upsert({
      where: { userId_animeId: { userId: currentUser.id, animeId: anime.id } },
      update: { score: cleanScore },
      create: { userId: currentUser.id, animeId: anime.id, score: cleanScore },
    });

    return NextResponse.json({ success: true, score: cleanScore });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
