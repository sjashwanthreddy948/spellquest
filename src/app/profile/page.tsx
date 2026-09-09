'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Flame,
  Sparkles,
  Trophy,
  Shield,
  LogOut,
  Settings,
  Lock,
  ArrowRight,
  TrendingUp,
  Volume2,
  Sliders,
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
  const { state, logout, setRole } = useGameStore();

  const [showPinModal, setShowPinModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceName, setVoiceName] = useState<string>('Clear Female Voice');
  const [isFemale, setIsFemale] = useState<boolean>(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

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
    state.attempts.length > 0 ? Math.round((correctCount / state.attempts.length) * 100) : 82;

  const handleParentUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === state.parentPin) {
      setRole('parent');
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
      router.push('/parent-dashboard');
    } else {
      setPinError(true);
    }
  };

  const handleLogout = async () => {
    playClickSound();
    await logout();
    router.push('/login');
  };

  return (
    <div className="w-full space-y-5 pt-3 pb-8 animate-in fade-in duration-200">
      
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
            <p className="text-xl font-black text-white mt-0.5">{state.attempts.length || 347}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-750">
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Mastered</span>
            <p className="text-xl font-black text-amber-300 mt-0.5">218</p>
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

      {/* Educator / Parent Portal Unlock Button */}
      <div className="p-4 rounded-3xl bg-indigo-950/60 border-2 border-indigo-500/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-indigo-400" />
          <div>
            <h4 className="text-xs font-bold text-white">Parent & Teacher Portal</h4>
            <p className="text-[11px] text-slate-200 font-medium">PIN-protected academic reports</p>
          </div>
        </div>
        <button
          onClick={() => setShowPinModal(true)}
          className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-black text-white shadow active:scale-95 transition cursor-pointer"
        >
          Open Portal
        </button>
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

      {/* Parent PIN Modal Sheet */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-xs rounded-3xl bg-slate-900 border border-indigo-500/30 p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg">
                🔒
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Security PIN</h3>
                <p className="text-[11px] text-slate-400">Default PIN: 1234</p>
              </div>
            </div>

            <form onSubmit={handleParentUnlock} className="space-y-3">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="••••"
                autoFocus
                className="w-full min-h-[50px] text-center tracking-[0.4em] text-2xl font-bold py-2 rounded-xl bg-slate-950 border border-indigo-500/30 text-amber-300 focus:outline-none"
              />
              {pinError && (
                <p className="text-[11px] text-rose-400 text-center font-bold">
                  Incorrect PIN. Try 1234.
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 min-h-[44px] py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 min-h-[44px] py-2 rounded-xl bg-indigo-600 text-white text-xs font-black shadow"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Voice Selection & Pronunciation Modal */}
      <VoiceSelectorModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
      />
    </div>
  );
}
