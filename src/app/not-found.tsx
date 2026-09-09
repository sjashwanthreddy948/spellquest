import React from 'react';
import Link from 'next/link';
import { Compass, Home, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border-2 border-slate-750 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-4xl shadow-inner">
          🌱
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Oops! This page wandered away. 🌱
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Let’s get you back to your adventure where words and stages are waiting!
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
