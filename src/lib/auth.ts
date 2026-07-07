import 'server-only';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getCached, setCache } from '@/lib/query-cache';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const id = cookieStore.get('session_user_id')?.value;
  if (!id) return null;

  const cacheKey = `currentUser:${id}`;
  const cached = getCached<{ id: string; username: string; email: string; avatarUrl: string | null; createdAt: Date }>(cacheKey);
  if (cached) return cached;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, email: true, avatarUrl: true, createdAt: true },
  });

  if (user) setCache(cacheKey, user, 5000);
  return user;
}
