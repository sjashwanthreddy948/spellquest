import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 p-0.5 shadow-xl shadow-amber-500/20 animate-pulse">
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
          🌟
        </div>
      </div>
      <p className="text-sm font-bold text-amber-300 tracking-wide animate-pulse">
        Preparing your adventure...
      </p>
    </div>
  );
}
