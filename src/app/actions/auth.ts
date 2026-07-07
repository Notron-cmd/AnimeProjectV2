'use server';

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { validateEmail, validatePassword, validateUsername } from "@/lib/validation";

export async function registerUser(prevState: unknown, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  const nameErr = validateUsername(name);
  if (nameErr) return { error: nameErr };

  const emailErr = validateEmail(email);
  if (emailErr) return { error: emailErr };

  const passErr = validatePassword(password);
  if (passErr) return { error: passErr };

  const h = await headers();
  const ip = h.get('x-forwarded-for') ?? 'unknown';
  const rl = rateLimit(`register:${ip}`, { limit: 5, windowMs: 60000 });
  if (!rl.allowed) return { error: "Too many attempts. Please try again later." };

  let isSuccess = false;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email ini sudah terdaftar. Silakan gunakan email lain." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username: name,
        email,
        password: hashedPassword,
      },
    });

    isSuccess = true;

  } catch {
    return { error: "Terjadi kesalahan pada server. Coba lagi nanti." };
  }

  if (isSuccess) {
    redirect('/login');
  }
}

export async function loginUser(prevState: unknown, formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  const emailErr = validateEmail(email);
  if (emailErr) return { error: "Email atau password salah." };

  if (!password || password.length < 6) {
    return { error: "Email atau password salah." };
  }

  const h = await headers();
  const ip = h.get('x-forwarded-for') ?? 'unknown';
  const rl = rateLimit(`login:${ip}`, { limit: 10, windowMs: 60000 });
  if (!rl.allowed) return { error: "Too many attempts. Please try again later." };

  let isLoginSuccess = false;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Email atau password salah." };
    }

    if (!user.password) {
      return { error: "Akun ini menggunakan Google Login. Silakan masuk dengan Google." };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: "Email atau password salah." };
    }

    const cookieStore = await cookies();
    cookieStore.set("session_user_id", user.id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    isLoginSuccess = true;

  } catch {
    return { error: "Terjadi kesalahan pada server. Coba lagi nanti." };
  }

  if (isLoginSuccess) {
    redirect("/");
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("session_user_id");
  redirect("/");
}