import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/AppShell';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#020617',
};

export const metadata: Metadata = {
  title: 'SpellQuest — Interactive Spelling Adventure for Children',
  description:
    'A fun interactive spelling adventure that helps children practice spelling through listening, challenges, feedback, and progressive levels.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SpellQuest',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'SpellQuest — Interactive Spelling Adventure for Children',
    description:
      'A fun interactive spelling adventure that helps children practice spelling through listening, challenges, feedback, and progressive levels.',
    siteName: 'SpellQuest',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

