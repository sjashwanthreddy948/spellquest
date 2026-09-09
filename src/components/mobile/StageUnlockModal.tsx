'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useGameStore } from '@/lib/game/gameStore';
import { playLevelUpSound } from '@/lib/spelling/audio';

export const StageUnlockModal: React.FC = () => {
  const { state, clearStageUnlockCelebration } = useGameStore();

  const unlocked = state.justUnlockedStage;

  useEffect(() => {
    if (unlocked) {
      playLevelUpSound();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
      });
    }
  }, [unlocked]);

  if (!unlocked) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-amber-400/80 p-6 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center text-4xl shadow-xl shadow-amber-500/30 animate-bounce">
          🎉
        </div>

        <div>
          <span className="text-[11px] font-black tracking-widest text-amber-400 uppercase">
            VICTORY ACHIEVED!
          </span>
          <h2 className="text-2xl font-black text-white mt-1">NEW STAGE UNLOCKED!</h2>
          <div className="mt-3 p-3 rounded-2xl bg-slate-950/90 border-2 border-slate-750 shadow-inner">
            <span className="text-xs text-slate-200 font-bold">Unlocked:</span>
            <p className="text-base font-black text-amber-300">
              Stage {unlocked.stageNumber}: {unlocked.stageTitle}
            </p>
          </div>
          <p className="text-xs text-slate-200 mt-2 font-medium">Your spelling adventure continues forward!</p>
        </div>

        <button
          onClick={clearStageUnlockCelebration}
          autoFocus
          className="w-full min-h-[52px] flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 active:scale-95 transition cursor-pointer"
        >
          <span>LET'S GO! 🚀</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
