import { NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/csrf';

export async function GET() {
  try {
    const token = await generateCsrfToken();
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
