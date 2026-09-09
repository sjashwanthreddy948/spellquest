'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Flame,
  Sparkles,
  Trophy,
  LogOut,
  TrendingUp,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { useGameStore } from '@/lib/game/gameStore';
import {
  playClickSound,
  getCurrentVoice,
  getVoiceDisplayName,
  isFemaleVoice,
  subscribeToVoiceChanges,
} from '@/lib/spelling/audio';
import { VoiceSelectorModal } from '@/components/VoiceSelectorModal';

export default function MobileProfilePage() {
  const router = useRouter();
  const { state, logout } = useGameStore();

  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceName, setVoiceName] = useState<string>('Clear Female Voice');
  const [isFemale, setIsFemale] = useState<boolean>(true);

  useEffect(() => {
    const updateVoice = () => {
      const v = getCurrentVoice();
      if (v) {
        setVoiceName(getVoiceDisplayName(v));
        setIsFemale(isFemaleVoice(v));
      }
    };
    updateVoice();
    return subscribeToVoiceChanges(updateVoice);
  }, []);

  const companionImage =
    state.profile.companionId === 'pip'
      ? '/images/pip.jpg'
      : state.profile.companionId === 'luna'
      ? '/images/luna.jpg'
      : '/images/sparky.jpg';

  const unlockedBadgesCount = state.achievements.filter((a) => a.unlocked).length;
  const correctCount = state.attempts.filter((a) => a.isCorrect).length;
  const accuracy =
    state.attempts.length > 0 ? Math.round((correctCount / state.attempts.length) * 100) : 0;
  const masteredWordsCount = state.srsQueue.filter((i) => i.status === 'mastered').length;

  const handleLogout = async () => {
    playClickSound();
    await logout();
    router.push('/login');
  };

  return (
    <div className="w-full space-y-5 pt-3 pb-8 animate-in fade-in duration-200">
      
      {/* Guest Notice if unauthenticated */}
      {!state.currentUser?.isLoggedIn && (
        <div className="p-4 rounded-3xl bg-indigo-950/70 border-2 border-indigo-500/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Guest Mode (0 Scores)</span>
            </div>
            <p className="text-xs text-slate-200">
              Your profile builds and records scores only after you create an account or log in!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow transition active:scale-95 whitespace-nowrap"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow transition active:scale-95 whitespace-nowrap"
            >
              Build Profile
            </Link>
          </div>
        </div>
      )}

      {/* Profile Hero (Requirement 18) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col items-center text-center space-y-3">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 p-1 shadow-xl">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-4xl">
              {state.profile.avatar}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full overflow-hidden border-2 border-slate-900 shadow">
            <Image
              src={companionImage}
              alt="Companion"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <h1 className="text-xl font-black text-white">{state.profile.name}</h1>
          <p className="text-xs font-bold text-amber-400">{state.profile.title}</p>
          {state.profile.contact && (
            <span className="text-[11px] text-slate-200 mt-0.5 block font-mono font-medium">
              📱 {state.profile.contact}
            </span>
          )}
        </div>

        {/* 3 Mobile Badges */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-black">
            ⭐ {state.profile.grade || `Level ${state.profile.level}`}
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-black flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-amber-400" /> {state.profile.streakDays} Day Streak
          </span>
          <Link
            href="/achievements"
            className="px-3 py-1 rounded-xl bg-yellow-950/60 border border-yellow-500/30 text-yellow-300 text-xs font-black flex items-center gap-1 active:scale-95 transition"
          >
            <Trophy className="w-3.5 h-3.5" /> {unlockedBadgesCount} Badges
          </Link>
        </div>
      </div>

      {/* Progress Cards Stack (Requirement 18 & 19) */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-slate-750 shadow-md space-y-3">
        <span className="text-[11px] font-black uppercase text-slate-200 tracking-wider">
          Progress Summary
        </span>

        <div className="grid grid-cols-3 gap-2 py-1 text-center">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-750">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Accuracy</span>
            <p className="text-xl font-black text-emerald-400 mt-0.5">{accuracy}%</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-750">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Practiced</span>
            <p className="text-xl font-black text-white mt-0.5">{state.attempts.length}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-750">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Mastered</span>
            <p className="text-xl font-black text-amber-300 mt-0.5">{masteredWordsCount}</p>
          </div>
        </div>
      </div>

      {/* Companion & Customization Card with Real Image */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border-2 border-slate-750 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow border border-amber-500/40">
            <Image
              src={companionImage}
              alt="Equipped Companion"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Equipped Companion</span>
            <span className="text-[11px] text-amber-400 font-medium">{state.profile.companion}</span>
          </div>
        </div>
        <Link
          href="/shop"
          className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 active:scale-95 transition"
        >
          Change
        </Link>
      </div>

      {/* Voice & Audio Pronunciation Settings Card */}
      <div className="p-4 rounded-3xl bg-slate-900/90 border-2 border-slate-750 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-xl flex-shrink-0">
            {isFemale ? '👩' : '🎙️'}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-white block truncate">Speaking Voice</span>
            <span className="text-[11px] text-amber-400 font-medium block truncate">{voiceName}</span>
          </div>
        </div>
        <button
          onClick={() => {
            playClickSound();
            setShowVoiceModal(true);
          }}
          className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow active:scale-95 transition cursor-pointer flex-shrink-0"
        >
          Voice Options
        </button>
      </div>

      {/* Student Academic Performance Summary */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-black text-white">Academic Performance & Accuracy</h3>
          </div>
          <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg">
            {accuracy}% Accuracy
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Practiced</span>
            <span className="text-base sm:text-lg font-black text-white mt-0.5 block">{state.attempts.length}</span>
            <span className="text-[9px] text-slate-400 block">attempts</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">Correct</span>
            <span className="text-base sm:text-lg font-black text-emerald-400 mt-0.5 block">{correctCount}</span>
            <span className="text-[9px] text-emerald-400/80 block">spelled right</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-amber-500/30">
            <span className="text-[10px] uppercase font-bold text-amber-400 block">Mastered</span>
            <span className="text-base sm:text-lg font-black text-amber-300 mt-0.5 block">{masteredWordsCount}</span>
            <span className="text-[9px] text-amber-400/80 block">words</span>
          </div>
        </div>
      </div>

      {/* Auth Actions */}
      <div className="flex gap-2">
        <Link
          href="/login"
          className="flex-1 min-h-[48px] flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-400/40 text-amber-300 text-xs font-black active:scale-95 transition cursor-pointer"
        >
          <span>🔑 Log In / Switch</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex-1 min-h-[48px] flex items-center justify-center gap-1.5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-rose-400 text-xs font-black active:scale-95 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Voice Selection & Pronunciation Modal */}
      <VoiceSelectorModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
      />
    </div>
  );
}
