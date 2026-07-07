import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/src/lib/auth';

const POLL_INTERVAL = 10000;
const KEEPALIVE_INTERVAL = 30000;

export async function GET(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = currentUser.id;
  let lastCreatedAt: Date | null = null;
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      async function poll() {
        if (closed) return;
        try {
          const where: Record<string, unknown> = { userId };
          if (lastCreatedAt) {
            where.createdAt = { gt: lastCreatedAt };
          }

          const newNotifs = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
              anime: {
                select: { id: true, anilistId: true, title: true, imageUrl: true },
              },
            },
          });

          if (newNotifs.length > 0) {
            lastCreatedAt = newNotifs[0].createdAt;
            const unreadCount = await prisma.notification.count({
              where: { userId, read: false },
            });

            for (const notif of newNotifs.reverse()) {
              const data = JSON.stringify({ notification: notif, unreadCount });
              controller.enqueue(new TextEncoder().encode(`event: notification\ndata: ${data}\n\n`));
            }
          }
        } catch {
          // polling error — ignore, retry next cycle
        }
      }

      async function keepAlive() {
        if (closed) return;
        controller.enqueue(new TextEncoder().encode(`: keepalive\n\n`));
      }

      const pollTimer = setInterval(poll, POLL_INTERVAL);
      const kaTimer = setInterval(keepAlive, KEEPALIVE_INTERVAL);

      request.signal.addEventListener('abort', () => {
        closed = true;
        clearInterval(pollTimer);
        clearInterval(kaTimer);
      });

      poll();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
