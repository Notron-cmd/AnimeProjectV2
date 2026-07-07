import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      new URL("/login?error=google_auth_failed", request.url)
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", request.url)
    );
  }

  // Exchange authorization code for tokens
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.redirect(
      new URL("/login?error=token_exchange_failed", request.url)
    );
  }

  const tokens = await tokenResponse.json();
  const accessToken = tokens.access_token;

  // Get user info from Google
  const userInfoResponse = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!userInfoResponse.ok) {
    return NextResponse.redirect(
      new URL("/login?error=userinfo_failed", request.url)
    );
  }

  const googleUser = await userInfoResponse.json();
  const googleId = googleUser.id;
  const email = googleUser.email?.toLowerCase();
  const name = googleUser.name;
  const avatarUrl = googleUser.picture;

  if (!email) {
    return NextResponse.redirect(
      new URL("/login?error=no_email", request.url)
    );
  }

  // Find or create user
  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId }, { email }] },
  });

  if (user) {
    // Link googleId if user exists by email but without googleId
    if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, avatarUrl: avatarUrl ?? user.avatarUrl },
      });
    }
  } else {
    // Create new user
    const baseUsername = name
      ? name.toLowerCase().replace(/\s+/g, "_")
      : email.split("@")[0];
    let username = baseUsername;

    // Ensure unique username
    let counter = 1;
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}_${counter}`;
      counter++;
    }

    user = await prisma.user.create({
      data: {
        username,
        email,
        googleId,
        avatarUrl: avatarUrl ?? null,
      },
    });
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set("session_user_id", user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.redirect(new URL("/", request.url));
}
