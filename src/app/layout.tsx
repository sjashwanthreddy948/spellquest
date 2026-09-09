import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MobileTopHeader } from '@/components/mobile/MobileTopHeader';
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';
import { StageUnlockModal } from '@/components/mobile/StageUnlockModal';
import { PWAInstallBanner } from '@/components/mobile/PWAInstallBanner';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0f172a',
};

export const metadata: Metadata = {
  title: 'SpellQuest AI - Mobile Spelling Adventure',
  description:
    'An app-like adaptive spelling adventure game designed for 5th-grade students with spaced repetition, anti-frustration AI coach, and parent analytics.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SpellQuest',
  },
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased`}
      >
        <MobileTopHeader />
        <PWAInstallBanner />
        <StageUnlockModal />
        
        {/* Mobile-first centered app shell that naturally expands to tablets and desktop */}
        <main className="flex-1 w-full max-w-md md:max-w-2xl lg:max-w-5xl mx-auto pb-32 px-3 sm:px-4">
          {children}
        </main>

        <MobileBottomNav />
      </body>
    </html>
  );
}
