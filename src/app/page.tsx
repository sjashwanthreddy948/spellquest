'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  Volume2,
  Heart,
  Play,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  LogIn,
  UserPlus,
  Trophy,
  Coins,
} from 'lucide-react';
import { playClickSound } from '@/lib/spelling/audio';
import { useGameStore } from '@/lib/game/gameStore';

const COMPANION_SHOWCASE = [
  {
    name: 'Sparky the Dragon',
    desc: 'Breathes courage & power into tough spellings!',
    image: '/images/sparky.jpg',
    badge: '🐲 Fire Companion',
    color: 'border-orange-500/40 bg-orange-950/30',
  },
  {
    name: 'Pip the Wizard Owl',
    desc: 'Guides you with clever mnemonics & syllable clues!',
    image: '/images/pip.jpg',
    badge: '🦉 Wisdom Companion',
    color: 'border-blue-500/40 bg-blue-950/30',
  },
  {
    name: 'Luna the Star Fox',
    desc: 'Spreads magic stars for high streak combos!',
    image: '/images/luna.jpg',
    badge: '🦊 Star Companion',
    color: 'border-purple-500/40 bg-purple-950/30',
  },
];

export default function MobileLandingPage() {
  const { state } = useGameStore();
  const isLoggedIn = state.currentUser?.isLoggedIn;

  return (
    <div className="w-full space-y-6 pt-2 pb-12 animate-in fade-in duration-200">
      
      {/* 3D Fantasy Game Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/40 group">
        <div className="relative h-56 sm:h-72 w-full">
          <Image
            src="/images/hero.jpg"
            alt="SpellQuest Magical Realm"
            fill
            className="object-cover group-hover:scale-105 transition duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-amber-400/50 text-amber-300 text-[11px] font-black shadow-lg backdrop-blur-md">
            <span>✨ 5th-Grade Spelling Quest</span>
            <span>•</span>
            <span>Listen. Spell. Master.</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-lg leading-tight">
            Turn English Spelling Into <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              An Epic Fantasy Adventure! 🚀
            </span>
          </h1>
        </div>
      </div>

      {/* Main Call to Actions */}
      <div className="space-y-2.5 max-w-sm mx-auto">
        <Link
          href="/adventure"
          onClick={() => playClickSound()}
          className="w-full min-h-[54px] flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 active:scale-95 transition cursor-pointer"
        >
          <Compass className="w-5 h-5" />
          <span>START ADVENTURE</span>
        </Link>

        {/* Passwordless Register & Login Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/register"
            onClick={() => playClickSound()}
            className="min-h-[46px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/50 text-amber-300 font-black text-xs shadow active:scale-95 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>Register (No Pass)</span>
          </Link>

          <Link
            href="/login"
            onClick={() => playClickSound()}
            className="min-h-[46px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-400/50 text-indigo-200 font-black text-xs shadow active:scale-95 transition cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-indigo-400" />
            <span>Student Log In</span>
          </Link>
        </div>
      </div>

      {/* Meet Your Pet Companions Graphic Showcase */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐾</span>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Choose Your Adventure Mascot
            </h3>
          </div>
          <span className="text-[10px] font-bold text-amber-400">Picks at Signup!</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {COMPANION_SHOWCASE.map((comp) => (
            <div
              key={comp.name}
              className={`p-3.5 rounded-3xl border-2 ${comp.color} shadow-xl flex sm:flex-col items-center gap-3 text-left sm:text-center transition hover:scale-[1.02]`}
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border border-white/10">
                <Image
                  src={comp.image}
                  alt={comp.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase text-amber-400 block">
                  {comp.badge}
                </span>
                <h4 className="text-xs sm:text-sm font-black text-white">{comp.name}</h4>
                <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                  {comp.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Treasure Loot Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 p-4 shadow-xl flex items-center gap-4">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 border border-amber-500/40">
          <Image
            src="/images/chest.jpg"
            alt="Treasure Chest"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-amber-400 tracking-wider">
            <Coins className="w-3 h-3 fill-amber-400" /> Real Gamification & Rewards
          </div>
          <h4 className="text-sm sm:text-base font-black text-white">
            Unlock Star Chests & Magic Worlds
          </h4>
          <p className="text-xs text-slate-300">
            Earn coins, unlock companions, and climb from Apprentice to Master Wizard!
          </p>
        </div>
      </div>

      {/* Interactive Mobile Spelling Loop Preview */}
      <div className="p-4 rounded-3xl bg-slate-900 border-2 border-slate-750 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">
            Game Loop Preview
          </span>
          <div className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-750 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-sm">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-300 block font-medium">Hear Word:</span>
              <span className="font-bold text-white text-sm">"Beautiful"</span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-500/30">
            3 Syllables
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-750 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-300 font-medium">
            <span>Visual Diff Feedback:</span>
            <span className="text-amber-400 font-bold">Smart Analysis</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-sm tracking-wider font-bold">
            <span className="text-emerald-400">b-e-a-u-t-i-</span>
            <span className="text-amber-400 bg-amber-500/20 px-1 rounded border border-amber-400/40">f-u-l</span>
          </div>
          <p className="text-[11px] text-slate-200 pt-0.5 font-medium">
            💡 <em>"Remember: <strong>B-E-A-U-tiful</strong> birds fly in the sky!"</em>
          </p>
        </div>
      </div>
    </div>
  );
}
