'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Target, Trophy, User } from 'lucide-react';
import { playClickSound } from '@/lib/spelling/audio';

interface NavTab {
  href: string;
  label: string;
  icon: React.ElementType;
}

const TABS: NavTab[] = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/adventure', label: 'Adventure', icon: Compass },
  { href: '/play', label: 'Practice', icon: Target },
  { href: '/achievements', label: 'Rewards', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
];

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  // Hide bottom navigation on full-immersion game screens if desired, or keep universally available
  const isPlayingActiveStage = pathname.startsWith('/play') && false; // Keep visible for consistent app navigation

  if (isPlayingActiveStage) return null;

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/90 border-t border-slate-800/80 shadow-[0_-8px_24px_rgba(0,0,0,0.5)] pb-[env(safe-area-inset-bottom,0.5rem)] pt-1"
    >
      <div className="max-w-md mx-auto px-2 flex items-center justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            pathname === tab.href ||
            (tab.href === '/dashboard' && pathname === '/') ||
            (tab.href === '/play' && pathname.startsWith('/play')) ||
            (tab.href === '/adventure' && pathname.startsWith('/adventure')) ||
            (tab.href === '/achievements' && (pathname.startsWith('/achievements') || pathname.startsWith('/shop')));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => playClickSound()}
              className="flex-1 min-w-[56px] min-h-[52px] flex flex-col items-center justify-center gap-1 py-1 rounded-2xl transition-all duration-200 active:scale-90 select-none group"
            >
              <div
                className={`relative px-4 py-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 font-black scale-105'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span
                className={`text-[10px] tracking-wide transition-colors ${
                  isActive ? 'font-black text-amber-400' : 'font-semibold text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
