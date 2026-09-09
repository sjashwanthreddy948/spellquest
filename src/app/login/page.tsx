'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, User, Phone, Zap } from 'lucide-react';
import { useGameStore } from '@/lib/game/gameStore';
import { playClickSound, playCorrectSound } from '@/lib/spelling/audio';

export default function MobileLoginPage() {
  const router = useRouter();
  const { login, state } = useGameStore();

  const [name, setName] = useState(state.currentUser?.isLoggedIn ? state.profile?.name : '');
  const [contact, setContact] = useState(
    state.currentUser?.isLoggedIn ? (state.profile?.contact || state.currentUser?.contact || '') : ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your student name');
      return;
    }
    if (!contact.trim()) {
      setErrorMsg('Please enter your mobile number or email ID');
      return;
    }

    setIsLoading(true);
    playCorrectSound();
    try {
      await login(name, contact);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setIsLoading(true);
    playCorrectSound();
    try {
      await login('Alex Speller', 'demo@spellquest.app');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto min-h-[85vh] flex flex-col justify-center space-y-5 pt-4 pb-12 animate-in fade-in duration-200">
      
      {/* Animated Mascot Welcome Banner */}
      <div className="text-center space-y-3">
        <div className="relative w-28 h-28 mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400 p-0.5 bg-gradient-to-tr from-amber-400 to-orange-500">
          <div className="relative w-full h-full rounded-[22px] overflow-hidden">
            <Image
              src="/images/sparky.jpg"
              alt="Sparky Welcome Mascot"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/40 text-amber-300 text-xs font-black shadow-sm mb-1.5">
            <span>✨ Welcome Back!</span>
            <span>•</span>
            <span>No Password Needed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Resume Your Quest 🎒
          </h1>
          <p className="text-xs text-slate-200 font-medium">
            Enter your name & mobile number or email to continue
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border-2 border-slate-750 shadow-2xl space-y-4">
        
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-950/80 border-2 border-rose-500/50 text-xs text-rose-300 font-bold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Student's Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" /> Student's Name
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

          {/* Mobile No or Email ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" /> Mobile No or Email ID
            </label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                setErrorMsg('');
              }}
              placeholder="e.g. 9876543210 or student@school.com"
              className="w-full min-h-[50px] py-3 px-4 rounded-2xl bg-slate-950 border-2 border-slate-700 focus:border-amber-400 focus:outline-none text-base font-bold text-white placeholder:text-slate-400 transition"
            />
            <p className="text-[11px] text-slate-300 font-medium">
              🔒 Safe & passwordless login for kids and parents.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[54px] flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 active:scale-95 transition cursor-pointer"
          >
            <span>{isLoading ? 'OPENING ADVENTURE...' : 'LOG IN TO QUEST 🚀'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Quick Demo Option */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-750"></div>
          <span className="flex-shrink mx-3 text-slate-300 text-xs font-bold uppercase">or</span>
          <div className="flex-grow border-t border-slate-750"></div>
        </div>

        <button
          type="button"
          onClick={handleQuickDemo}
          disabled={isLoading}
          className="w-full min-h-[46px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border-2 border-indigo-500/40 text-amber-300 font-bold text-xs active:scale-95 transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Instant Play as Maya (Demo Profile)</span>
        </button>

        {/* Create Account Link */}
        <div className="pt-2 border-t border-slate-750 text-center">
          <p className="text-xs text-slate-200 font-medium">
            New adventurer?{' '}
            <Link
              href="/register"
              onClick={() => playClickSound()}
              className="text-amber-400 hover:text-amber-300 font-black underline cursor-pointer"
            >
              Create free account & choose companion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
