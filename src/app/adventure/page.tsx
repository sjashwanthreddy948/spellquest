'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Star,
  Lock,
  CheckCircle2,
  Play,
  Swords,
  ChevronDown,
  Sparkles,
  ArrowDown,
} from 'lucide-react';
import { useGameStore } from '@/lib/game/gameStore';
import { GameWorld, WorldStage } from '@/types';
import { playClickSound } from '@/lib/spelling/audio';

export default function MobileAdventurePage() {
  const router = useRouter();
  const { state } = useGameStore();

  const [selectedWorldId, setSelectedWorldId] = useState<string>(
    state.profile.activeWorldId || 'world-1'
  );

  const activeWorld = state.worlds.find((w) => w.id === selectedWorldId) || state.worlds[0];

  const handlePlayStage = (stage: WorldStage) => {
    if (!stage.unlocked) return;
    playClickSound();
    if (stage.isBoss) {
      router.push(`/play?mode=boss_battle&world=${activeWorld.id}&stage=${stage.stageNumber}`);
    } else {
      router.push(`/play?mode=spell_it&world=${activeWorld.id}&stage=${stage.stageNumber}`);
    }
  };

  const worldBannerImage =
    activeWorld.id === 'world-2' ? '/images/world_caverns.jpg' : '/images/world_woods.jpg';

  const companionImage =
    state.profile.companionId === 'pip'
      ? '/images/pip.jpg'
      : state.profile.companionId === 'luna'
      ? '/images/luna.jpg'
      : '/images/sparky.jpg';

  return (
    <div className="w-full space-y-5 pt-3 pb-8 animate-in fade-in duration-200">
      {/* Guest notice if not logged in */}
      {!state.currentUser?.isLoggedIn && (
        <div className="p-3.5 rounded-2xl bg-amber-950/60 border-2 border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs shadow-md">
          <div className="flex items-center gap-2 text-slate-200 text-center sm:text-left">
            <span className="text-lg">🎒</span>
            <span className="font-semibold">
              Exploring as Guest. Create a free account to permanently save your stage stars, XP, and companion!
            </span>
          </div>
          <Link
            href="/register"
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shrink-0 shadow transition"
          >
            Create Free Account
          </Link>
        </div>
      )}

      {/* World Switcher Dropdown / Pills */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
          Adventure Realm
        </span>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {state.worlds.map((world) => {
            const isSelected = world.id === activeWorld.id;
            return (
              <button
                key={world.id}
                onClick={() => {
                  playClickSound();
                  setSelectedWorldId(world.id);
                }}
                className={`flex-shrink-0 min-h-[44px] flex items-center gap-2 px-3.5 py-2 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-400/20'
                    : world.unlocked
                    ? 'bg-slate-900 border-slate-750 text-slate-200 font-bold hover:bg-slate-800'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300 font-medium'
                }`}
              >
                <span className="text-lg">{world.icon}</span>
                <span className="text-xs">{world.name}</span>
                {!world.unlocked && <Lock className="w-3 h-3 ml-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Illustrated Fantasy World Banner with Companion */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/40 group">
        <div className="relative h-44 sm:h-52 w-full">
          <Image
            src={worldBannerImage}
            alt={activeWorld.name}
            fill
            className="object-cover group-hover:scale-105 transition duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
        </div>

        <div className="absolute inset-0 p-4 sm:p-5 flex items-end justify-between">
          <div className="space-y-1 max-w-[70%]">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-amber-400/40 text-amber-300 text-[10px] font-black backdrop-blur-md">
              <span>{activeWorld.icon}</span>
              <span>{activeWorld.levelRange}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white drop-shadow">
              {activeWorld.name}
            </h2>
            <p className="text-[11px] text-slate-200 line-clamp-2 drop-shadow leading-tight">
              {activeWorld.description}
            </p>
          </div>

          {/* Cheerful Companion Mascot Widget */}
          <div className="flex flex-col items-center">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-xl border-2 border-amber-400 animate-bounce">
              <Image
                src={companionImage}
                alt="Companion"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-[9px] font-bold text-amber-300 mt-1 bg-slate-950/90 px-1.5 py-0.5 rounded-md border border-amber-400/30">
              Cheering!
            </span>
          </div>
        </div>
      </div>

      {/* Vertical Winding Path (Requirement 11) */}
      <div className="space-y-3 pt-1">
        <div className="text-center">
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-200 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-750">
            Journey Trail
          </span>
        </div>

        <div className="flex flex-col items-center space-y-4 relative">
          {activeWorld.stages.map((stage, idx) => {
            const isUnlocked = stage.unlocked;
            const isCompleted = stage.stars > 0;
            const isCurrent = isUnlocked && !isCompleted;
            const isBoss = stage.isBoss;

            return (
              <React.Fragment key={stage.stageNumber}>
                {/* Connecting Line Between Stages */}
                {idx > 0 && (
                  <div className="flex flex-col items-center my-0.5">
                    <div
                      className={`w-1 h-6 rounded-full transition-colors ${
                        isUnlocked ? 'bg-amber-400' : 'bg-slate-750'
                      }`}
                    />
                    <ArrowDown
                      className={`w-3.5 h-3.5 -mt-1 ${
                        isUnlocked ? 'text-amber-400 animate-bounce' : 'text-slate-600'
                      }`}
                    />
                  </div>
                )}

                {/* Stage Card (Requirement 12) */}
                <div
                  className={`w-full rounded-3xl p-4 sm:p-5 border-2 transition-all duration-200 shadow-lg ${
                    isCurrent
                      ? 'bg-gradient-to-br from-indigo-950/90 via-slate-900 to-amber-950/50 border-amber-400 ring-2 ring-amber-400/30 shadow-amber-500/20'
                      : isCompleted
                      ? 'bg-slate-900/95 border-emerald-500/50'
                      : isBoss
                      ? isUnlocked
                        ? 'bg-gradient-to-br from-rose-950 via-slate-900 to-amber-950 border-rose-500'
                        : 'bg-slate-900/70 border-slate-750 opacity-90'
                      : 'bg-slate-900/70 border-slate-750 opacity-90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                            isBoss
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : isCurrent
                              ? 'bg-amber-400 text-slate-950 font-extrabold'
                              : isCompleted
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-200 border border-slate-700 font-bold'
                          }`}
                        >
                          {isBoss ? '👑 Boss Battle' : `⭐ Stage ${stage.stageNumber}`}
                        </span>

                        {isCompleted && (
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < stage.stars
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-600 stroke-[2]'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <h3 className="text-base font-black text-white">{stage.title}</h3>
                      <p className="text-xs text-slate-200 leading-snug font-medium">{stage.description}</p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      ) : isUnlocked ? (
                        <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center animate-pulse border border-amber-400/40">
                          <Sparkles className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center">
                          <Lock className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Play Action / Lock Requirement */}
                  <div className="mt-3 pt-3 border-t border-slate-750 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-200">
                      {stage.wordsCount} Spelling Words
                    </span>

                    {isUnlocked ? (
                      <button
                        onClick={() => handlePlayStage(stage)}
                        className={`min-h-[44px] px-5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer ${
                          isBoss
                            ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                        }`}
                      >
                        {isBoss ? <Swords className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                        <span>{isCompleted ? 'PLAY AGAIN' : 'PLAY'}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-200 font-bold bg-slate-950/90 px-2.5 py-1 rounded-lg border border-slate-750 shadow-sm">
                        🔒 Complete Stage {stage.stageNumber - 1} to unlock
                      </span>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
