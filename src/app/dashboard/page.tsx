'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Flame,
  Sparkles,
  Play,
  CheckCircle2,
  RotateCcw,
  Compass,
  Zap,
  Target,
  Trophy,
} from 'lucide-react';
import { useGameStore } from '@/lib/game/gameStore';
import { getWeakWords } from '@/lib/spelling/srs';
import { playClickSound } from '@/lib/spelling/audio';

export default function MobileDashboardPage() {
  const { state } = useGameStore();
  const weakWords = getWeakWords(state.srsQueue);

  const activeWorld = state.worlds.find((w) => w.id === state.profile.activeWorldId) || state.worlds[0];
  const currentStageNum = state.profile.currentStage || 1;
  const currentStageObj = activeWorld.stages.find((s) => s.stageNumber === currentStageNum) || activeWorld.stages[0];

  const companionImage =
    state.profile.companionId === 'pip'
      ? '/images/pip.jpg'
      : state.profile.companionId === 'luna'
      ? '/images/luna.jpg'
      : '/images/sparky.jpg';

  // Tree stage visual
  const streak = state.profile.streakDays;
  let treeStage = '🌱';
  let treeTitle = 'Sprout Stage';

  if (streak >= 30) {
    treeStage = '🌳🏆';
    treeTitle = 'Grand Master Arbor';
  } else if (streak >= 20) {
    treeStage = '🌲✨';
    treeTitle = 'Enchanted Evergreen';
  } else if (streak >= 10) {
    treeStage = '🌳';
    treeTitle = 'Flourishing Oak';
  }

  return (
    <div className="w-full space-y-4 pt-3 pb-6 animate-in fade-in duration-200">
      
      {/* Greeting Banner with Companion Avatar */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Hi {state.profile.name}! 🚀
          </h1>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <span className="flex items-center gap-1 text-amber-400">
              <Flame className="w-3.5 h-3.5 fill-amber-400" /> {state.profile.streakDays} Day Streak
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> {state.profile.xp.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* Companion Avatar */}
        <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-400">
          <Image
            src={companionImage}
            alt="Companion"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Main Adventure Stage Card with Fantasy Backdrop */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/40 group">
        <div className="relative h-44 sm:h-48 w-full">
          <Image
            src="/images/world_woods.jpg"
            alt="Adventure Realm"
            fill
            className="object-cover group-hover:scale-105 transition duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        </div>

        <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeWorld.icon}</span>
              <div>
                <h2 className="text-sm sm:text-base font-black text-white drop-shadow">
                  {activeWorld.name}
                </h2>
                <span className="text-[11px] font-bold text-amber-300 drop-shadow block">
                  Stage {currentStageNum}: {currentStageObj.title}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 shadow">
              Current
            </span>
          </div>

          <div className="space-y-2">
            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-200">
                <span>Stage Progress</span>
                <span className="font-mono text-amber-300 font-black">
                  {Math.min(100, Math.round((currentStageNum / activeWorld.stages.length) * 100))}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round((currentStageNum / activeWorld.stages.length) * 100))}%`,
                  }}
                />
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href={`/play?mode=spell_it&world=${activeWorld.id}&stage=${currentStageNum}`}
              onClick={() => playClickSound()}
              className="w-full min-h-[46px] flex items-center justify-center gap-2 py-2.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>CONTINUE ADVENTURE →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Launch Action Pills */}
      <div className="grid grid-cols-2 gap-2.5">
        <Link
          href="/play?mode=speed_spell"
          onClick={() => playClickSound()}
          className="min-h-[48px] p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-center gap-2 text-xs font-black text-amber-300 active:scale-95 transition shadow-sm"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Speed Spell (30s)</span>
        </Link>

        <Link
          href="/adventure"
          onClick={() => playClickSound()}
          className="min-h-[48px] p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-center gap-2 text-xs font-black text-indigo-300 active:scale-95 transition shadow-sm"
        >
          <Compass className="w-4 h-4 text-indigo-400" />
          <span>Adventure Map</span>
        </Link>
      </div>

      {/* Compact Daily Mission Card (Requirement 16) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black text-white">🎯 Today's Mission</h3>
          </div>
          <span className="text-[11px] font-bold text-amber-400">
            +{state.dailyMissions.reduce((acc, m) => acc + (m.completed ? 0 : m.rewardXp), 0)} XP
          </span>
        </div>

        <div className="space-y-2.5">
          {state.dailyMissions.map((m) => (
            <div key={m.id} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-750 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1.5 text-slate-200">
                  {m.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-500" />
                  )}
                  <span>{m.title}</span>
                </div>
                <span className="font-mono text-amber-300">
                  {m.current}/{m.target}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-850 overflow-hidden">
                <div
                  className={`h-full ${m.completed ? 'bg-emerald-400' : 'bg-amber-400'} transition-all`}
                  style={{ width: `${Math.min(100, (m.current / m.target) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 30-Day Tree Growth Mini Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/30 to-slate-900 border border-emerald-500/30 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl filter drop-shadow-md">{treeStage}</span>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold block">
              Growth Tracker
            </span>
            <h4 className="text-sm font-black text-white">{treeTitle}</h4>
            <span className="text-[11px] text-slate-200 block font-medium">Day {streak} of 30 complete</span>
          </div>
        </div>
        <Link
          href="/profile"
          className="text-xs font-bold text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 active:scale-95 transition"
        >
          Stats →
        </Link>
      </div>

      {/* Weak Words Spotlight */}
      {weakWords.length > 0 && (
        <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-white flex items-center gap-1.5">
              <span>🧠</span> Review Queue
            </span>
            <Link
              href="/play?mode=spell_it"
              className="text-[11px] font-bold text-amber-400 hover:underline"
            >
              Practice All
            </Link>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {weakWords.slice(0, 4).map((item) => (
              <Link
                key={item.wordId}
                href="/play?mode=spell_it"
                className="flex-shrink-0 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-amber-200 active:scale-95 transition"
              >
                {item.word}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
