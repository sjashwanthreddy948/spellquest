'use client';

import React, { useState } from 'react';
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
  ChevronDown,
} from 'lucide-react';
import { useGameStore } from '@/lib/game/gameStore';

export default function MobileParentTeacherDashboard() {
  const { state, setRole } = useGameStore();

  const [expandedSection, setExpandedSection] = useState<'graph' | 'patterns' | 'revision'>('graph');

  const categoryStats: Record<string, { total: number; correct: number }> = {
    'Silent Letters': { total: 14, correct: 9 }, // 64%
    'Double Letters': { total: 21, correct: 15 }, // 71%
    'Vowel Teams': { total: 18, correct: 14 }, // 78%
    'Suffixes & Prefixes': { total: 20, correct: 17 }, // 85%
    'Basic School Words': { total: 32, correct: 30 }, // 94%
  };

  const tenDayData = [
    { day: 'D1', acc: 58 },
    { day: 'D2', acc: 60 },
    { day: 'D3', acc: 62 },
    { day: 'D4', acc: 65 },
    { day: 'D5', acc: 68 },
    { day: 'D6', acc: 71 },
    { day: 'D7', acc: 73 },
    { day: 'D8', acc: 77 },
    { day: 'D9', acc: 79 },
    { day: 'D10', acc: 81 },
  ];

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="w-full space-y-4 pt-3 pb-8 animate-in fade-in duration-200 print:p-0 print:m-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black uppercase text-indigo-400 block tracking-wider">
            Educator Insights
          </span>
          <h1 className="text-xl font-black text-white">{state.profile.name}'s Academic Progress</h1>
        </div>

        <button
          onClick={handlePrint}
          className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition print:hidden"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print</span>
        </button>
      </div>

      {/* 30-Second Summary Stack Cards (Requirement 19 & 20) */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-3 rounded-2xl bg-slate-900 border-2 border-slate-750 shadow">
          <span className="text-[9px] uppercase font-bold text-slate-200 block">Baseline</span>
          <span className="text-xl font-black text-slate-100">58%</span>
          <span className="text-[9px] text-slate-300 font-medium block mt-0.5">Day 1</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900 border-2 border-emerald-500/40 shadow">
          <span className="text-[9px] uppercase font-bold text-emerald-400 block">Current</span>
          <span className="text-xl font-black text-emerald-400">81%</span>
          <span className="text-[9px] text-emerald-300 font-bold block mt-0.5">↑ +23%</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900 border-2 border-slate-750 shadow">
          <span className="text-[9px] uppercase font-bold text-slate-200 block">Mastered</span>
          <span className="text-xl font-black text-amber-300">426</span>
          <span className="text-[9px] text-slate-300 font-medium block mt-0.5">Words</span>
        </div>
      </div>

      {/* 10-Day Progress Curve (Requirement 4 & 20) */}
      <div className="p-4 rounded-3xl bg-slate-900 border-2 border-indigo-500/40 shadow space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> 10-Day Progress Curve
          </h2>
          <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30">
            58% → 81%
          </span>
        </div>

        {/* Responsive Bar Curve */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-750">
          <div className="h-28 w-full flex items-end justify-between gap-1.5 px-1 pt-4">
            {tenDayData.map((d, i) => {
              const heightPercent = ((d.acc - 50) / 50) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-mono font-bold text-amber-300">
                    {d.acc}%
                  </span>
                  <div className="w-full bg-slate-900 rounded-t h-20 flex items-end p-0.5">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-indigo-600 to-amber-400 transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-slate-300">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pattern Proficiency Cards (Requirement 19 & 20) */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow space-y-3">
        <div className="flex items-center gap-1.5">
          <Brain className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-black text-white uppercase tracking-wider">
            Pattern Proficiency Breakdown
          </h2>
        </div>

        <div className="space-y-2.5 pt-1">
          {Object.entries(categoryStats).map(([catName, stats]) => {
            const pct = Math.round((stats.correct / stats.total) * 100);
            let color = 'from-emerald-500 to-teal-400';
            if (pct < 70) color = 'from-rose-500 to-amber-500';
            else if (pct < 80) color = 'from-amber-500 to-yellow-400';

            return (
              <div key={catName} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">{catName}</span>
                  <span className="font-mono text-white">{pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
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

      {/* Words Needing Revision as Mobile Cards (Requirement 20) */}
      <div className="p-4 rounded-3xl bg-slate-900 border-2 border-slate-750 shadow space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-black text-white uppercase tracking-wider">
              Words Needing Revision
            </h2>
          </div>
          <span className="text-[10px] font-bold text-slate-200">
            {state.srsQueue.filter((i) => i.status !== 'mastered').length} in Queue
          </span>
        </div>

        <div className="space-y-2">
          {state.srsQueue
            .filter((i) => i.status !== 'mastered')
            .slice(0, 4)
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
                  {item.status === 'learning' ? 'Active Retry' : 'Scheduled'}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Back to Student View Button */}
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
