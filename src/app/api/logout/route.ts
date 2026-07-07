import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';
import { validateCsrf } from '@/lib/csrf';

export async function POST(request: Request) {
  if (!(await validateCsrf(request))) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }

  const cookieStore = await cookies();
  const id = cookieStore.get('session_user_id')?.value;

  if (id) {
    const rl = rateLimit(`logout:${id}`, { limit: 5, windowMs: 60000 });
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  cookieStore.delete('session_user_id');
  return NextResponse.json({ success: true });
}
