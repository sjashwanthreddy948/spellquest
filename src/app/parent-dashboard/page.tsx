'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Brain,
  Shield,
  Printer,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import { useGameStore } from '@/lib/game/gameStore';

export default function MobileParentTeacherDashboard() {
  const { state, setRole } = useGameStore();

  const totalAttempts = state.attempts.length;
  const correctAttempts = state.attempts.filter((a) => a.isCorrect).length;
  const currentAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
  const masteredCount = state.srsQueue.filter((i) => i.status === 'mastered').length;
  const reviewCount = state.srsQueue.filter((i) => i.status !== 'mastered').length;

  // Derive genuine pattern stats from recorded attempts
  const patternCounts: Record<string, { total: number; correct: number }> = {};
  state.attempts.forEach((att) => {
    const key = att.mistakeType || 'General Vocabulary';
    if (!patternCounts[key]) {
      patternCounts[key] = { total: 0, correct: 0 };
    }
    patternCounts[key].total += 1;
    if (att.isCorrect) {
      patternCounts[key].correct += 1;
    }
  });

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="w-full space-y-5 pt-3 pb-8 animate-in fade-in duration-200 print:p-0 print:m-0">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black uppercase text-indigo-400 block tracking-wider">
            Educator & Parent Analytics
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {state.profile.name}&apos;s Academic Progress
          </h1>
        </div>

        <button
          onClick={handlePrint}
          className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition print:hidden cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Report</span>
        </button>
      </div>

      {/* Real Summary Metric Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
        <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-slate-750 shadow">
          <span className="text-[10px] uppercase font-bold text-slate-300 block">Total Practiced</span>
          <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">{totalAttempts}</span>
          <span className="text-[10px] text-slate-400 font-medium block">Attempts</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-emerald-500/40 shadow">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Accuracy</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5 block">
            {totalAttempts > 0 ? `${currentAccuracy}%` : '0%'}
          </span>
          <span className="text-[10px] text-emerald-300/80 font-medium block">
            {correctAttempts} correct
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border-2 border-slate-750 shadow">
          <span className="text-[10px] uppercase font-bold text-slate-300 block">Mastered</span>
          <span className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5 block">{masteredCount}</span>
          <span className="text-[10px] text-slate-400 font-medium block">Words</span>
        </div>
      </div>

      {/* Empty State vs Active Data Display */}
      {totalAttempts === 0 ? (
        <div className="p-6 rounded-3xl bg-slate-900/80 border-2 border-slate-750 text-center space-y-3 shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto text-xl">
            🌱
          </div>
          <h3 className="text-base font-bold text-white">No Spelling Attempts Recorded Yet</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            As {state.profile.name} plays stages in Word Garden, authentic performance trends, pattern mastery curves, and revision recommendations will be tracked here in real time.
          </p>
          <div className="pt-2">
            <Link
              href="/play?mode=spell_it"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow hover:bg-amber-300 transition"
            >
              <span>Launch First Spelling Stage</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Pattern Breakdown */}
          <div className="p-5 rounded-3xl bg-slate-900 border-2 border-slate-750 shadow space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-400" />
              <h2 className="text-xs font-black text-white uppercase tracking-wider">
                Pattern Proficiency
              </h2>
            </div>

            <div className="space-y-3 pt-1">
              {Object.entries(patternCounts).map(([pattern, stats]) => {
                const pct = Math.round((stats.correct / stats.total) * 100);
                let color = 'from-emerald-500 to-teal-400';
                if (pct < 70) color = 'from-rose-500 to-amber-500';
                else if (pct < 80) color = 'from-amber-500 to-yellow-400';

                return (
                  <div key={pattern} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-200 capitalize">{pattern.replace(/_/g, ' ')}</span>
                      <span className="font-mono text-white">
                        {pct}% ({stats.correct}/{stats.total})
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Words Needing Revision Queue */}
          <div className="p-5 rounded-3xl bg-slate-900 border-2 border-slate-750 shadow space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-black text-white uppercase tracking-wider">
                  Words in Review Queue
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-300">
                {reviewCount} word{reviewCount === 1 ? '' : 's'}
              </span>
            </div>

            {reviewCount === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                All practiced words currently have mastered status!
              </p>
            ) : (
              <div className="space-y-2">
                {state.srsQueue
                  .filter((i) => i.status !== 'mastered')
                  .slice(0, 6)
                  .map((item) => (
                    <div
                      key={item.wordId}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-750 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-bold text-white text-sm">{item.word}</span>
                        <span className="text-[10px] text-slate-300 block font-medium">
                          Repetitions: {item.repetitions} • Streak: {item.consecutiveCorrect}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                          item.status === 'learning'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                        }`}
                      >
                        {item.status === 'learning' ? 'Active Learning' : 'Reviewing'}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Return to Student Mode */}
      <button
        onClick={() => {
          setRole('student');
        }}
        className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 border-2 border-slate-750 text-slate-200 text-xs font-black active:scale-95 transition print:hidden cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Student Mode</span>
      </button>

    </div>
  );
}
