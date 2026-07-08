'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Pencil, Share2 } from "lucide-react";
import { useToast } from '@/components/ui/toast';

export interface ProfileUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: string;
}

interface ProfileHeaderProps {
  user: ProfileUser | null;
  onAvatarChange?: () => void;
}

function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getJoinedLabel(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function ProfileHeader({ user, onAvatarChange }: ProfileHeaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const displayName = user?.username ?? 'Guest';
  const handle = user?.username ? `@${user.username.toLowerCase()}` : '@guest';
  const initials = getInitials(user?.username ?? '');
  const joinedLabel = user?.createdAt ? getJoinedLabel(user.createdAt) : '';
  const avatarUrl = user?.avatarUrl;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast('Maksimal ukuran foto 2MB', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        toast('Foto profil berhasil diubah!', 'success');
        window.dispatchEvent(new Event('avatar-updated'));
        onAvatarChange?.();
      } else {
        toast('Gagal mengunggah foto', 'error');
      }
    } catch {
      toast('Gagal mengunggah foto', 'error');
    }
  };

  return (
    <header className="bg-[#1e2023] rounded-xl border border-[#4a4455]/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
      {/* Background Banner Blur Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="bg-cover bg-center w-full h-full"
          style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDTx0qGTpv7tqMikLb6FOAwTK7V8Mh5mxCu0JfuW-fE3oyDpHI-fPup2YBfApgeOXTJodOyr3v5JXESmIEUNZ7JmRmPoo2cjF9qIJ65WEKx84yS4dU-xztQC_LuuVmQ1kUzlYHryeLWcv70xh8_g54WPOi0IuR884MCZtLzl6xz9t5cidKwy8CG0_fyUf96DkDFvLo0wyvH2QwY1ATHYOlvawPB62-1Y2sMQ952EMTLlkGPs5Oj1fxoD_uLBBnZihvgM3ggmNlDzg')` }}
        />
      </div>

      {/* Profile Avatar */}
      <div className="relative z-10 group">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-[#7c3aed] shrink-0 shadow-xl bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] flex items-center justify-center">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={displayName} width={128} height={128} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl md:text-4xl font-bold text-white tracking-wider select-none">
              {initials}
            </span>
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-1 -right-1 bg-[#7c3aed] text-white p-1.5 rounded-full border-2 border-[#1e2023] hover:bg-[#6d28d9] transition-colors cursor-pointer"
        >
          <Pencil className="text-sm" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Profile Details */}
      <div className="relative z-10 flex-grow text-center md:text-left space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-[#e2e2e6] font-sans">
          {displayName}
        </h1>
        <p className="text-base text-[#ccc3d8]">{handle}</p>
        {joinedLabel && (
          <p className="text-xs text-[#c4c7c9]">
            Joined {joinedLabel} • AniVision Member
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex gap-3 mt-4 md:mt-0 self-center md:self-start">
        <button className="bg-[#282a2d] border border-[#958da1] text-[#e2e2e6] hover:bg-[#333538] transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 cursor-pointer">
          <Share2 className="text-[18px]" /> Share
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="bg-[#7c3aed] text-white hover:opacity-90 transition-opacity px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 cursor-pointer">
          <Pencil className="text-[18px]" /> Edit Profile
        </button>
      </div>
    </header>
  );
}
