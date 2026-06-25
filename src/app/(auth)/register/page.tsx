"use client";

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  // State untuk efek FILL & warna ikon saat fokus
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // State simulasi submit form
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus('submitting');

    setTimeout(() => {
      setSubmitStatus('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-stretch overflow-hidden selection:bg-primary-container/30 bg-background text-on-surface font-sans">
      
      {/* KIRI: Cinematic Illustration (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden border-r border-outline-variant/30">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200" 
            alt="Cinematic Anime Background"
            fill
            priority
            className="object-cover opacity-40 pure-dark-blend"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 z-10"></div>
        
        {/* Brand Messaging */}
        <div className="relative z-20 px-12 max-w-xl text-left">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 flex items-center justify-center shadow-lg">
              <Image
                src="/Logo.png"         
                alt="AniVision Logo"
                width={80}             
                height={80}             
                className="object-contain p-1" 
              />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">AniVision</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight text-foreground">
            Welcome Back to the Intelligence Hub.
          </h1>
          <p className="text-base text-on-surface-variant/90 leading-relaxed">
            Log in to resume your cinematic journey, access custom analytics, and explore neural updates tailored to your identity.
          </p>
          
          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="bg-surface-container/60 backdrop-blur-md border border-outline-variant p-4 rounded-xl">
              <span className="material-symbols-outlined text-primary mb-2">auto_awesome</span>
              <h3 className="font-semibold text-foreground text-sm mb-1">Neural Sync</h3>
              <p className="text-xs text-on-surface-variant">Your watchlist synchronized effortlessly.</p>
            </div>
            <div className="bg-surface-container/60 backdrop-blur-md border border-outline-variant p-4 rounded-xl">
              <span className="material-symbols-outlined text-primary mb-2">security</span>
              <h3 className="font-semibold text-foreground text-sm mb-1">Encrypted Node</h3>
              <p className="text-xs text-on-surface-variant">Secure session keys guard your global account.</p>
            </div>
          </div>
        </div>
      </div>

      {/* KANAN: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-surface-container/30 p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Brand Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                  visibility
                </span>
              </div>
              <span className="text-xl font-bold text-primary tracking-tight">AniVision</span>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Access your identity</h2>
            <p className="text-sm text-on-surface-variant">Enter your credentials to establish connection.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <span 
                  className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    focusedField === 'email' ? 'text-primary' : 'text-on-surface-variant/60'
                  }`}
                  style={{ fontVariationSettings: focusedField === 'email' ? "'FILL' 1" : "'FILL' 0" }}
                >
                  alternate_email
                </span>
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200" 
                  id="email" 
                  name="email" 
                  placeholder="name@example.com" 
                  type="email" 
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <span 
                  className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    focusedField === 'password' ? 'text-primary' : 'text-on-surface-variant/60'
                  }`}
                  style={{ fontVariationSettings: focusedField === 'password' ? "'FILL' 1" : "'FILL' 0" }}
                >
                  lock
                </span>
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-base text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  type="password" 
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-start gap-3">
                <div className="flex items-center h-5">
                  <input 
                    className="w-4 h-4 rounded border-outline-variant bg-surface-container-highest text-primary-container focus:ring-primary-container focus:ring-offset-background" 
                    id="remember" 
                    type="checkbox"
                  />
                </div>
                <label className="text-xs text-on-surface-variant select-none cursor-pointer" htmlFor="remember">
                  Remember me
                </label>
              </div>
              <Link className="text-xs text-primary hover:underline transition-all font-medium" href="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button 
              className={`w-full py-3 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-150 shadow-md mt-4 active:scale-[0.98] cursor-pointer ${
                submitStatus === 'success' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-primary-container text-on-primary-container hover:bg-primary-container/90'
              }`}
              type="submit"
              disabled={submitStatus === 'submitting'}
            >
              {submitStatus === 'idle' && (
                <>
                  <span>Create Account</span>
                  <span className="material-symbols-outlined">login</span>
                </>
              )}
              {submitStatus === 'submitting' && (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  <span>Synchronizing...</span>
                </>
              )}
              {submitStatus === 'success' && (
                <>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Identity Verified</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-background px-4 text-on-surface-variant/60">
                or sign up with
              </span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid gap-4">
            <button className="flex items-center justify-center gap-2 py-3 bg-surface-container-high border border-outline-variant rounded-xl hover:bg-surface-container-highest transition-colors duration-200 cursor-pointer">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="currentColor"></path>
              </svg>
              <span className="text-xs font-medium">Google</span>
            </button>
          </div>

          {/* Switch To Register */}
          <div className="text-center pt-2">
            <p className="text-sm text-on-surface-variant">
              Already Have Account?{' '}
              <Link className="text-primary font-semibold hover:text-primary/80 transition-colors" href="/login">
                Login
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}