'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Flame, Coins, Shield, User, Compass, Trophy, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { useGameStore } from '@/lib/game/gameStore';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { state, setRole } = useGameStore();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const isParentView = pathname.startsWith('/parent-dashboard');

  const handleParentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (state.userRole === 'parent') {
      router.push('/parent-dashboard');
    } else {
      setShowPinModal(true);
    }
  };

  const verifyPin = (e: React.FormEvent) => {
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

  const navLinks = [
    { href: '/adventure', label: 'Adventure', icon: Compass },
    { href: '/play', label: 'Play Modes', icon: Sparkles },
    { href: '/dashboard', label: 'My Quest', icon: LayoutDashboard },
    { href: '/achievements', label: 'Badges', icon: Trophy },
    { href: '/shop', label: 'Bazaar', icon: ShoppingBag },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-indigo-500/20 shadow-lg shadow-indigo-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-purple-500 p-0.5 shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-amber-400 text-lg">
                ⚡
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                SpellQuest
              </span>
              <span className="text-[10px] text-slate-300 font-bold tracking-wider uppercase hidden sm:inline">
                Listen. Spell. Learn. Master.
              </span>
            </div>
          </Link>

          {/* Nav Links for Student */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600/30 text-amber-300 border border-indigo-400/30 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Gamification Stats */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold shadow-sm" title="Daily Streak">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse fill-amber-400" />
              <span>{state.profile.streakDays}d</span>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-yellow-950/40 border border-yellow-500/30 text-yellow-300 text-xs sm:text-sm font-bold shadow-sm" title="Adventure Coins">
              <Coins className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>{state.profile.coins}</span>
            </div>

            {/* XP */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-bold shadow-sm" title="Total XP">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{state.profile.xp.toLocaleString()} XP</span>
            </div>

            {/* Role Switcher */}
            {isParentView ? (
              <button
                onClick={() => {
                  setRole('student');
                  router.push('/dashboard');
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>Student View</span>
              </button>
            ) : (
              <button
                onClick={handleParentClick}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition shadow-sm"
                title="Teacher / Parent Analytics"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Parent/Teacher</span>
              </button>
            )}

            {/* Avatar Profile */}
            <Link
              href="/dashboard"
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-md flex items-center justify-center hover:scale-105 transition"
              title={`${state.profile.name} - Level ${state.profile.level}`}
            >
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-base">
                {state.profile.avatar}
              </div>
            </Link>
          </div>

        </div>

        {/* Mobile Subnav */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 bg-slate-950/90 text-xs font-semibold">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 ${
                  isActive ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Parent PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-indigo-500/30 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl">
                🔒
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Parent & Teacher Portal</h3>
                <p className="text-xs text-slate-200">Enter security PIN (Default: 1234)</p>
              </div>
            </div>

            <form onSubmit={verifyPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={6}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Enter 4-digit PIN..."
                  autoFocus
                  className="w-full text-center tracking-[0.4em] text-2xl font-bold py-3 px-4 rounded-xl bg-slate-950 border border-indigo-500/30 text-amber-300 focus:outline-none focus:border-amber-400"
                />
                {pinError && (
                  <p className="text-xs text-rose-400 mt-2 text-center">Incorrect PIN. Try default: 1234</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-md shadow-indigo-600/30"
                >
                  Unlock Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
