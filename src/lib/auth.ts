import 'server-only';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const id = cookieStore.get('session_user_id')?.value;
  if (!id) return null;
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, email: true, avatarUrl: true, createdAt: true },
  });
}
