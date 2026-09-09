'use client';

import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if dismissed previously
    const dismissed = localStorage.getItem('spellquest_pwa_dismissed');
    if (dismissed) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('spellquest_pwa_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-14 left-4 right-4 z-50 max-w-md mx-auto p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-amber-400/50 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-2.5">
        <span className="text-2xl">📱</span>
        <div>
          <h4 className="text-xs font-black text-white">Install SpellQuest App</h4>
          <p className="text-[11px] text-slate-200 font-medium">Play offline & enjoy full-screen adventure!</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={handleInstall}
          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow transition cursor-pointer"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-lg text-slate-300 hover:text-white"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
