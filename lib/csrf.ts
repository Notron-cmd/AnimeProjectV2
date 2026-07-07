import { cookies } from 'next/headers';
import crypto from 'crypto';

const CSRF_COOKIE = '_csrf_token';

export async function generateCsrfToken(): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60,
  });
  return token;
}

export async function validateCsrf(request: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value;
  if (!cookieToken) return false;

  const headerToken = request.headers.get('x-csrf-token');
  if (headerToken && cookieToken === headerToken) return true;

  try {
    const cloned = request.clone();
    const body = await cloned.json();
    if (body._csrf && body._csrf === cookieToken) return true;
  } catch {}

  return false;
}
