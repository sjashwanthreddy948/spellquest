'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Flame, Coins, Compass, Trophy, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { useGameStore } from '@/lib/game/gameStore';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { state } = useGameStore();

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

            {/* Avatar or Log In Button */}
            {state.currentUser?.isLoggedIn ? (
              <Link
                href="/dashboard"
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-md flex items-center justify-center hover:scale-105 transition"
                title={`${state.profile.name} - Level ${state.profile.level}`}
              >
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-base">
                  {state.profile.avatar}
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow transition active:scale-95 whitespace-nowrap"
              >
                Log In
              </Link>
            )}
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
    </>
  );
};
