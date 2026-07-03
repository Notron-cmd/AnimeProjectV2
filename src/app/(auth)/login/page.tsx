"use client";

import { Suspense, useEffect, useRef, useState, FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginUser } from "@/src/app/actions/auth";

function LoginForm() {
  const illustrationRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
   
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("newUser")) {
      setSuccessMessage("Akun berhasil dibuat! Silakan masukkan password untuk masuk.");
    }
  }, [searchParams]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (illustrationRef.current) {
        const moveX = (e.clientX - window.innerWidth / 2) / 50;
        const moveY = (e.clientY - window.innerHeight / 2) / 50;
        illustrationRef.current.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setSubmitStatus('submitting');
  setErrorMessage(null);
  setSuccessMessage(null);

  const formData = new FormData(e.currentTarget);

  try {
    const result = await loginUser(null, formData);
    
    if (result?.error) {
      setErrorMessage(result.error);
      setSubmitStatus('idle'); 
    }
    
  } catch (err) {
    if (err instanceof Error && 'digest' in err && typeof err.digest === 'string' && err.digest.startsWith('NEXT_REDIRECT')) {
      return;
    }
    setErrorMessage("Terjadi kesalahan koneksi. Silakan coba lagi.");
    setSubmitStatus('idle');
  }
};

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-background text-foreground overflow-x-hidden">
      
      {/* SISI KIRI: Cinematic Illustration */}
      <section className="relative hidden h-screen w-full md:flex md:w-1/2 lg:w-3/5 items-end justify-start overflow-hidden bg-muted/30">
        <div 
          ref={illustrationRef}
          className="absolute inset-0 z-0 h-full w-full bg-cover bg-center transition-transform duration-1000 ease-out opacity-70 mix-blend-screen" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200')",
            transform: "scale(1.05)" 
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <div className="relative z-20 p-10 max-w-2xl mb-10">
          <div className="flex items-center gap-3 mb-4 group">
            <span className="material-symbols-outlined text-primary text-3xl font-bold">
              visibility
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">AniVision</h1>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-3">Your Window Into Infinite Worlds.</h2>
          <p className="text-muted-foreground text-base max-w-lg leading-relaxed">
            Join the elite circle of anime enthusiasts. Experience high-density intelligence, predictive tracking, and a cinematic database designed for the next generation of viewers.
          </p>
        </div>
      </section>

      {/* SISI KANAN: Login Form */}
      <section className="flex flex-1 items-center justify-center bg-background p-6 md:w-1/2 lg:w-2/5 min-h-screen overflow-y-auto py-12">
        <div className="w-full max-w-md my-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="text-center md:text-left">
            <div className="md:hidden flex items-center justify-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">
                visibility
              </span>
              <span className="text-2xl font-bold text-foreground">AniVision</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground mb-1">Welcome Back</h3>
            <p className="text-sm text-muted-foreground">Access your premium personalized anime feed.</p>
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Banner Pesan Sukses Registrasi Akun Baru */}
          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2 animate-fadeIn">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Banner Pesan Error Gagal Login */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2 animate-fadeIn">
              <span className="material-symbols-outlined text-sm">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* PERBAIKAN: Pasang onSubmit dan atribut name pada input tag */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block" htmlFor="email">
                Email Address
              </label>
              <div className="relative group rounded-lg border border-input bg-card transition-all focus-within:ring-1 focus-within:ring-ring focus-within:border-ring">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-xl">
                  mail
                </span>
                <input 
                  className="w-full bg-transparent py-2.5 pl-10 pr-4 text-foreground border-none focus:ring-0 placeholder:text-muted-foreground/40 text-sm outline-none" 
                  id="email" 
                  name="email" // Penting untuk formData.get("email")
                  placeholder="name@example.com" 
                  type="email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block" htmlFor="password">
                  Password
                </label>
                <Link className="text-xs text-primary hover:underline transition-colors font-medium" href="#">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group rounded-lg border border-input bg-card transition-all focus-within:ring-1 focus-within:ring-ring focus-within:border-ring">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors text-xl">
                  lock
                </span>
                <input 
                  className="w-full bg-transparent py-2.5 pl-10 pr-10 text-foreground border-none focus:ring-0 placeholder:text-muted-foreground/40 text-sm outline-none" 
                  id="password" 
                  name="password" // Penting untuk formData.get("password")
                  placeholder="••••••••" 
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button dengan status loading */}
            <button 
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-sm cursor-pointer text-sm flex items-center justify-center gap-2" 
              type="submit"
              disabled={submitStatus === 'submitting'}
            >
              {submitStatus === 'submitting' ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Login to AniVision</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative bg-background px-3 text-xs uppercase text-muted-foreground font-medium">
              Or continue with
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid gap-3">
            <button className="flex items-center justify-center gap-2 rounded-lg border border-input bg-card py-2 text-foreground hover:bg-muted transition-colors text-sm active:scale-95 duration-150 cursor-pointer">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span className="font-medium">Google</span>
            </button>
          </div>

          {/* Footer Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link className="text-primary hover:underline font-semibold underline-offset-4" href="/register">
                Sign Up
              </Link>
            </p>
          </div>

        </div>
      </section>

      {/* Footer Meta Credits */}
      <footer className="fixed bottom-0 right-0 w-full md:w-2/5 px-6 py-4 flex items-center justify-between border-t border-border/10 pointer-events-none z-30">
        <span className="text-xs text-muted-foreground/30 select-none">© 2026 AniVision. Premium Anime Intelligence.</span>
        <div className="flex gap-4 pointer-events-auto">
          <Link className="text-xs text-muted-foreground hover:text-primary transition-colors" href="#">Privacy</Link>
          <Link className="text-xs text-muted-foreground hover:text-primary transition-colors" href="#">Terms</Link>
        </div>
      </footer>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}