'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Sparkles, Menu, X, Compass, HelpCircle, Info, Mail, LogIn, UserCheck, LogOut } from 'lucide-react';
import { useGameStore } from '@/lib/game/gameStore';
import { playClickSound } from '@/lib/spelling/audio';

export const PublicNavbar: React.FC = () => {
  const pathname = usePathname();
  const { state, logout } = useGameStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = state.currentUser?.isLoggedIn;

  const publicLinks = [
    { href: '/how-it-works', label: 'How It Works', icon: HelpCircle },
    { href: '/adventure', label: 'Adventure', icon: Compass },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/90 border-b border-slate-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={() => playClickSound()}
          className="flex items-center gap-3 group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              SpellQuest
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </span>
            <span className="text-[10px] text-slate-300 font-semibold tracking-wide uppercase">
              Listen. Spell. Learn. Master.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {publicLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => playClickSound()}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-800 text-amber-300 border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => playClickSound()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-sm font-bold transition"
              >
                <span className="text-base">{state.profile.avatar}</span>
                <span>{state.profile.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-extrabold">
                  Lv.{state.profile.level}
                </span>
              </Link>

              <button
                onClick={() => {
                  playClickSound();
                  logout();
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 text-xs font-semibold transition cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => playClickSound()}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-200 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => playClickSound()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-sm shadow-md shadow-amber-500/20 active:scale-95 transition"
              >
                <span>Start Adventure</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {!isLoggedIn ? (
            <Link
              href="/register"
              onClick={() => playClickSound()}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-sm"
            >
              Start
            </Link>
          ) : (
            <Link
              href="/dashboard"
              onClick={() => playClickSound()}
              className="px-2.5 py-1 rounded-xl bg-slate-800 text-amber-300 text-xs font-bold border border-slate-700"
            >
              My Quest
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 border-t border-slate-800 bg-slate-950/95 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {publicLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  playClickSound();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-slate-800 text-amber-300 border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 text-amber-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-800 space-y-2">
            {isLoggedIn ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => {
                    playClickSound();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm"
                >
                  <span>Go to Student Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    playClickSound();
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-xl text-rose-400 hover:text-rose-300 text-xs font-bold"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => {
                    playClickSound();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>

                <Link
                  href="/register"
                  onClick={() => {
                    playClickSound();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
