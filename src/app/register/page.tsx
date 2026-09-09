'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Compass,
  Star,
  Shield,
  Zap,
} from 'lucide-react';
import { useGameStore } from '@/lib/game/gameStore';
import { playClickSound, playLevelUpSound } from '@/lib/spelling/audio';

const SPELLING_LEVELS = [
  {
    level: 1,
    badge: '🌟',
    grade: 'Grade 3',
    title: 'Apprentice Speller',
    description: '3-5 letter words, phonics foundations & basic vowel patterns',
    sampleWords: ['magic', 'brave', 'garden'],
    color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-300',
  },
  {
    level: 2,
    badge: '🚀',
    grade: 'Grade 4',
    title: 'Word Explorer',
    description: 'Compound words, silent letters & double consonants',
    sampleWords: ['knight', 'running', 'careful'],
    color: 'from-blue-500/20 to-indigo-600/20 border-blue-500/40 text-blue-300',
  },
  {
    level: 3,
    badge: '⚔️',
    grade: 'Grade 5',
    title: 'Spelling Champion',
    description: '5th-grade adventure words, tricky suffixes (-tion, -able) & prefixes',
    sampleWords: ['beautiful', 'necessary', 'adventure'],
    color: 'from-amber-500/25 to-orange-600/25 border-amber-500/60 text-amber-300',
    recommended: true,
  },
  {
    level: 4,
    badge: '👑',
    grade: 'Grade 6',
    title: 'Master Wizard',
    description: 'Greek & Latin roots, advanced vocabulary & complex multi-syllables',
    sampleWords: ['mysterious', 'environment', 'curiosity'],
    color: 'from-purple-500/20 to-pink-600/20 border-purple-500/40 text-purple-300',
  },
];

const COMPANIONS = [
  {
    id: 'sparky',
    name: 'Sparky',
    title: 'Baby Dragon',
    image: '/images/sparky.jpg',
    element: '🔥 Courage',
  },
  {
    id: 'pip',
    name: 'Pip',
    title: 'Wizard Owl',
    image: '/images/pip.jpg',
    element: '✨ Wisdom',
  },
  {
    id: 'luna',
    name: 'Luna',
    title: 'Star Fox',
    image: '/images/luna.jpg',
    element: '🌟 Magic',
  },
];

const AVATARS = ['🧙‍♀️', '🦊', '🚀', '🐱', '🤖', '🦁', '🦄', '🐲'];

export default function MobileRegisterPage() {
  const router = useRouter();
  const { register } = useGameStore();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number>(3); // Grade 5 default
  const [selectedCompanion, setSelectedCompanion] = useState<string>('sparky');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🧙‍♀️');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    if (!contact.trim()) {
      setErrorMsg('Please enter your mobile number or email ID');
      return;
    }

    setIsLoading(true);
    playLevelUpSound();
    try {
      await register(name, contact, selectedLevel, selectedCompanion, selectedAvatar);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen pb-16 pt-2 space-y-5 animate-in fade-in duration-200">
      
      {/* Visual Header Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30">
        <div className="relative h-44 sm:h-52 w-full">
          <Image
            src="/images/hero.jpg"
            alt="SpellQuest Adventure"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </div>

        <div className="absolute bottom-3 left-4 right-4 text-center sm:text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black shadow-md">
            <span>✨ Join the Adventure</span>
            <span>•</span>
            <span>No Password Needed</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
            Start Your Spelling Quest 🚀
          </h1>
        </div>
      </div>

      {/* Registration Form Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border-2 border-slate-750 shadow-2xl space-y-5">
        <form onSubmit={handleRegister} className="space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-950/80 border-2 border-rose-500/50 text-xs text-rose-300 font-bold text-center">
              {errorMsg}
            </div>
          )}

          {/* 1. Student Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" /> 1. Student's Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrorMsg('');
              }}
              placeholder="e.g. Maya or Leo"
              className="w-full min-h-[50px] py-3 px-4 rounded-2xl bg-slate-950 border-2 border-slate-700 focus:border-amber-400 focus:outline-none text-base font-bold text-white placeholder:text-slate-400 transition"
            />
          </div>

          {/* 2. Mobile Number or Email ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" /> 2. Mobile No or Email ID
            </label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                setErrorMsg('');
              }}
              placeholder="e.g. 9876543210 or parent@email.com"
              className="w-full min-h-[50px] py-3 px-4 rounded-2xl bg-slate-950 border-2 border-slate-700 focus:border-amber-400 focus:outline-none text-base font-bold text-white placeholder:text-slate-400 transition"
            />
            <p className="text-[11px] text-slate-200 font-medium">
              💡 No password required! We use this to save your adventure progress.
            </p>
          </div>

          {/* 3. Spelling Writing Level Picker */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" /> 3. Spelling Writing Level
              </label>
              <Link
                href="/assessment"
                className="text-[11px] font-bold text-indigo-300 hover:text-indigo-200 underline"
              >
                Placement Quiz 🎯
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SPELLING_LEVELS.map((lvl) => {
                const isSelected = selectedLevel === lvl.level;
                return (
                  <div
                    key={lvl.level}
                    onClick={() => {
                      playClickSound();
                      setSelectedLevel(lvl.level);
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-950/90 border-amber-400 shadow-lg shadow-amber-400/20 scale-[1.02]'
                        : 'bg-slate-950/80 border-slate-750 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{lvl.badge}</span>
                        <div>
                          <span className="text-xs font-black text-white block">
                            {lvl.grade}
                          </span>
                          <span className="text-[10px] font-bold text-amber-400 block">
                            {lvl.title}
                          </span>
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                      ) : lvl.recommended ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[9px] font-black border border-amber-400/40">
                          Popular
                        </span>
                      ) : null}
                    </div>

                    <p className="text-[10px] text-slate-200 leading-tight font-medium">
                      {lvl.description}
                    </p>

                    <div className="flex items-center gap-1 text-[9px] font-mono text-slate-300 pt-0.5">
                      <span className="text-slate-400 font-bold">Words:</span>
                      {lvl.sampleWords.map((w, idx) => (
                        <span
                          key={w}
                          className="px-1 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 font-semibold"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Choose Starter Mascot Companion */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 4. Choose Your Companion Pet
            </label>

            <div className="grid grid-cols-3 gap-2.5">
              {COMPANIONS.map((comp) => {
                const isSelected = selectedCompanion === comp.id;
                return (
                  <div
                    key={comp.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedCompanion(comp.id);
                    }}
                    className={`p-2 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-400/20 border-amber-400 shadow-md shadow-amber-400/30 scale-105'
                        : 'bg-slate-950/80 border-slate-750 hover:border-slate-600'
                    }`}
                  >
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow border border-slate-700">
                      <Image
                        src={comp.image}
                        alt={comp.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block leading-none">
                        {comp.name}
                      </span>
                      <span className="text-[9px] font-bold text-amber-400 block mt-0.5">
                        {comp.element}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Choose Avatar */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-black uppercase text-slate-200 tracking-wider block">
              5. Pick Your Hero Avatar
            </label>
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
              {AVATARS.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => {
                    playClickSound();
                    setSelectedAvatar(av);
                  }}
                  className={`min-w-[42px] min-h-[42px] rounded-xl text-xl flex items-center justify-center border-2 transition cursor-pointer ${
                    selectedAvatar === av
                      ? 'bg-amber-400/20 border-amber-400 scale-110 shadow-md'
                      : 'bg-slate-950 border-slate-750 hover:border-slate-600'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[56px] flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 active:scale-95 transition cursor-pointer mt-3"
          >
            <Zap className="w-5 h-5 fill-slate-950" />
            <span>{isLoading ? 'CREATING QUEST...' : 'START MY ADVENTURE 🚀'}</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-750 text-center">
          <p className="text-xs text-slate-200 font-medium">
            Already registered?{' '}
            <Link
              href="/login"
              onClick={() => playClickSound()}
              className="text-amber-400 hover:text-amber-300 font-black underline cursor-pointer"
            >
              Log in here (no password)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
