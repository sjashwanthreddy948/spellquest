'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Flame, Coins, ArrowLeft, Heart, Shield, LogIn, Sliders } from 'lucide-react';
import { useGameStore } from '@/lib/game/gameStore';
import { playClickSound } from '@/lib/spelling/audio';
import { VoiceSelectorModal } from '@/components/VoiceSelectorModal';

export const MobileTopHeader: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useGameStore();
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const isPlayScreen = pathname.startsWith('/play');
  const isAssessment = pathname.startsWith('/assessment');
  const isAuthScreen = pathname === '/login' || pathname === '/register';

  // Dynamic greeting based on hours
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (isAuthScreen) {
    return (
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/90 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
        <Link
          href="/"
          className="min-h-[44px] flex items-center gap-1 text-slate-300 hover:text-white font-bold text-xs sm:text-sm active:scale-95 transition"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Home</span>
        </Link>
        <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
          {pathname === '/login' ? 'Student Log In' : 'Create Account'}
        </span>
        <div className="w-10" />
      </header>
    );
  }

  if (isPlayScreen || isAssessment) {
    return (
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/90 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => {
            playClickSound();
            router.push('/adventure');
          }}
          className="min-h-[44px] min-w-[44px] flex items-center gap-1 text-slate-300 hover:text-white font-bold text-sm active:scale-95 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-amber-400" />
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-amber-300">
          <span>Stage {state.profile.currentStage}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playClickSound();
              setShowVoiceModal(true);
            }}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 text-sm active:scale-95 transition cursor-pointer"
            title="Speaking Voice & Pacing Options"
          >
            👩
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${
                  i < state.profile.hearts ? 'fill-rose-500 text-rose-500' : 'text-slate-500 stroke-[2] opacity-75'
                }`}
              />
            ))}
          </div>
        </div>
        <VoiceSelectorModal
          isOpen={showVoiceModal}
          onClose={() => setShowVoiceModal(false)}
        />
      </header>
    );
  }

  const isLoggedIn = state.currentUser?.isLoggedIn;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/90 border-b border-slate-750 px-4 py-3 flex items-center justify-between">
      {/* Brand & Greeting */}
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 p-0.5 shadow-md shadow-amber-500/10">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-sm">
            ⚡
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-200 font-bold block leading-none">
            {isLoggedIn ? `${greeting}! 👋` : 'Welcome! 👋'}
          </span>
          <span className="text-sm font-black text-white tracking-tight leading-snug">
            {isLoggedIn ? state.profile.name : 'SpellQuest'}
          </span>
        </div>
      </Link>

      {/* Right Controls: Voice settings & Log In button or Gamification Stats */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            playClickSound();
            setShowVoiceModal(true);
          }}
          className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-sm active:scale-95 transition cursor-pointer"
          title="Speaking Voice & Speed"
        >
          👩
        </button>

        {!isLoggedIn ? (
          <Link
            href="/login"
            className="min-h-[38px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md active:scale-95 transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In</span>
          </Link>
        ) : (
          <>
            {/* Streak */}
            <div
              className="min-h-[36px] flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-950/50 border border-amber-500/30 text-amber-400 text-xs font-extrabold shadow-sm"
              title="Day Streak"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{state.profile.streakDays}d</span>
            </div>

            {/* Coins */}
            <Link
              href="/shop"
              className="min-h-[36px] flex items-center gap-1 px-2.5 py-1 rounded-xl bg-yellow-950/50 border border-yellow-500/30 text-yellow-300 text-xs font-extrabold shadow-sm active:scale-95 transition"
              title="Coins"
            >
              <Coins className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span>{state.profile.coins}</span>
            </Link>

            {/* Avatar Profile */}
            <Link
              href="/profile"
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-md flex items-center justify-center active:scale-95 transition ml-0.5"
              title="Profile"
            >
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-sm">
                {state.profile.avatar}
              </div>
            </Link>
          </>
        )}
      </div>

      <VoiceSelectorModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
      />
    </header>
  );
};
