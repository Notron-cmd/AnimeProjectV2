'use client';

import React from 'react';

export default function ProfileHeader() {
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
      <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-[#7c3aed] shrink-0 shadow-xl">
        <img 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLRMPlQQyncZrPW41xO0vAreQ_IyHKWvKiu1FGYXdBWZ_nZYwKkfLB2BBoTy-vBv61xo0Chb0SeWwmScLcKFqIgPNuSjuSEYBJRoaXHPrE3GB2WjkURAnGeVYwGkwwjQOlUN_5vKq1nb_ggVvSKe1e7HKi2Urvb6qlSpMsj9aMCKvD6lbCRPnPSOUDQW8HrNfX2R7s9Tb2IrrTZ1sGJ8ZjwJMDXVHPexyzeTZeEkdf2_XOroKicsT9rP3N5csx1t1NxJ4cjpNBjA" 
          alt="User avatar" 
        />
      </div>

      {/* Profile Details & Stats */}
      <div className="relative z-10 flex-grow text-center md:text-left space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-[#e2e2e6] font-sans">Alex Mercer</h1>
        <p className="text-base text-[#ccc3d8]">@NightfallDrifter</p>
        <p className="text-xs text-[#c4c7c9]">Joined October 2022 • Premium Member</p>
        
        {/* Quick Stats Badges */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
          <div className="bg-[#282a2d] rounded-lg px-4 py-2 border border-[#4a4455]/50 flex items-center">
            <span className="font-semibold text-lg text-[#d2bbff]">142</span>
            <span className="text-xs text-[#ccc3d8] font-medium uppercase tracking-wider ml-2">Completed</span>
          </div>
          <div className="bg-[#282a2d] rounded-lg px-4 py-2 border border-[#4a4455]/50 flex items-center">
            <span className="font-semibold text-lg text-[#4cd7f6]">38</span>
            <span className="text-xs text-[#ccc3d8] font-medium uppercase tracking-wider ml-2">Reviews</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex gap-3 mt-4 md:mt-0 self-center md:self-start">
        <button className="bg-[#282a2d] border border-[#958da1] text-[#e2e2e6] hover:bg-[#333538] transition-colors px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 cursor-pointer">
          <span className="material-symbols-outlined text-[18px]"></span> Share
        </button>
        <button className="bg-[#7c3aed] text-white hover:opacity-90 transition-opacity px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 cursor-pointer">
          <span className="material-symbols-outlined text-[18px]"></span> Edit Profile
        </button>
      </div>
    </header>
  );
}