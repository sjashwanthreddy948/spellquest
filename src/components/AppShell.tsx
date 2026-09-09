'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { PublicNavbar } from '@/components/PublicNavbar';
import { Footer } from '@/components/Footer';
import { MobileTopHeader } from '@/components/mobile/MobileTopHeader';
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';
import { StageUnlockModal } from '@/components/mobile/StageUnlockModal';
import { PWAInstallBanner } from '@/components/mobile/PWAInstallBanner';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  const isPublicPage =
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/how-it-works' ||
    pathname === '/contact' ||
    pathname === '/privacy' ||
    pathname === '/terms';

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isPlayScreen = pathname.startsWith('/play') || pathname.startsWith('/assessment');
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950">
        <main className="flex-1 w-full">{children}</main>
      </div>
    );
  }

  if (isPublicPage) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950">
        <PublicNavbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased">
        <MobileTopHeader />
        <main className="flex-1 w-full max-w-md mx-auto px-4 py-6 flex flex-col justify-center">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  if (isPlayScreen) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased">
        <MobileTopHeader />
        <StageUnlockModal />
        <main className="flex-1 w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4 py-4">
          {children}
        </main>
      </div>
    );
  }

  // Authenticated Student App Pages (/adventure, /dashboard, /achievements, /shop, /profile)
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased">
      <MobileTopHeader />
      <PWAInstallBanner />
      <StageUnlockModal />
      <main className="flex-1 w-full max-w-md md:max-w-2xl lg:max-w-5xl mx-auto pb-12 px-3 sm:px-4 pt-2">
        {children}
      </main>
      <Footer />
      <div className="h-16 md:hidden" /> {/* Spacer for fixed mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
};
