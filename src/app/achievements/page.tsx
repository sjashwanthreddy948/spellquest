'use client';

import React from 'react';
import { Trophy, Award, Lock, CheckCircle2 } from 'lucide-react';
import { useGameStore } from '@/lib/game/gameStore';

export default function MobileAchievementsPage() {
  const { state } = useGameStore();

  const unlockedCount = state.achievements.filter((a) => a.unlocked).length;
  const totalCount = state.achievements.length;

  return (
    <div className="w-full space-y-4 pt-3 pb-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
            Hall of Honors
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white">🏆 Badges & Awards</h1>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-black shadow-sm">
          <Award className="w-4 h-4 text-amber-400" />
          <span>
            {unlockedCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* 2-Column Mobile Rewards Grid (Requirement 17) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {state.achievements.map((badge) => {
          const isUnlocked = badge.unlocked;
          const percent = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

          return (
            <div
              key={badge.id}
              className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-2 text-center select-none ${
                isUnlocked
                  ? 'bg-slate-900 border-amber-400/70 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/70 border-slate-750 opacity-85'
              }`}
            >
              <div className="space-y-1.5">
                <div
                  className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-400/40'
                      : 'bg-slate-800 border border-slate-700 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                <div>
                  <h3 className="text-xs font-black text-white truncate w-full" title={badge.title}>
                    {badge.title}
                  </h3>
                  <p className="text-[10px] text-slate-200 line-clamp-2 leading-tight mt-0.5 font-medium">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[9px] font-mono font-bold text-slate-200">
                  <span>{isUnlocked ? 'Unlocked' : 'Progress'}</span>
                  <span>
                    {badge.progress}/{badge.maxProgress}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className={`h-full ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                        : 'bg-indigo-600'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
