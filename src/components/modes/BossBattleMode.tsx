'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Shield, Swords, Heart, Volume2, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameWorld, SpellingWord } from '@/types';
import { playWord, playCorrectSound, playTryAgainSound, playBossHitSound, playBossDefeatedSound } from '@/lib/spelling/audio';

interface BossBattleModeProps {
  world: GameWorld;
  words: SpellingWord[];
  onVictory: (coinsWon: number, xpWon: number) => void;
  onRetry: () => void;
}

export const BossBattleMode: React.FC<BossBattleModeProps> = ({
  world,
  words,
  onVictory,
  onRetry,
}) => {
  const maxBossHp = world.bossHp || 1000;
  const [bossHp, setBossHp] = useState(maxBossHp);
  const [playerHearts, setPlayerHearts] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [isBossDamaged, setIsBossDamaged] = useState(false);
  const [battleState, setBattleState] = useState<'fighting' | 'victory' | 'defeat'>('fighting');

  const inputRef = useRef<HTMLInputElement>(null);
  const currentWord = words[currentIndex % words.length];
  const damagePerHit = Math.ceil(maxBossHp / Math.min(words.length, 8));

  useEffect(() => {
    if (battleState === 'fighting' && currentWord) {
      playWord(currentWord.word);
      if (inputRef.current) inputRef.current.focus();
    }
  }, [currentIndex, battleState]);

  const handleAttack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || battleState !== 'fighting') return;

    const isMatch = inputVal.trim().toLowerCase() === currentWord.word.toLowerCase();

    if (isMatch) {
      playCorrectSound();
      playBossHitSound();
      setIsBossDamaged(true);
      setTimeout(() => setIsBossDamaged(false), 500);

      const nextHp = Math.max(0, bossHp - damagePerHit);
      setBossHp(nextHp);

      if (nextHp <= 0) {
        setBattleState('victory');
        playBossDefeatedSound();
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#ec4899', '#10b981', '#6366f1'],
        });
        onVictory(150, 600);
        return;
      }
    } else {
      playTryAgainSound();
      const nextHearts = playerHearts - 1;
      setPlayerHearts(nextHearts);

      if (nextHearts <= 0) {
        setBattleState('defeat');
        return;
      }
    }

    setInputVal('');
    setCurrentIndex((i) => i + 1);
  };

  if (battleState === 'victory') {
    return (
      <div className="w-full max-w-lg mx-auto p-8 rounded-3xl bg-slate-900/95 border-2 border-amber-500/50 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center text-5xl shadow-2xl shadow-amber-500/30 animate-bounce">
          👑
        </div>
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-extrabold">STAGE CLEARED!</span>
          <h2 className="text-3xl font-black text-white mt-1">BOSS DEFEATED!</h2>
          <p className="text-sm text-slate-300 mt-2">
            You conquered <strong className="text-amber-300">{world.bossName}</strong> and defended the realm of {world.name}!
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 py-3">
          <div className="px-5 py-3 rounded-2xl bg-amber-950/60 border border-amber-500/30 text-amber-300 font-black text-lg">
            🪙 +150 Coins
          </div>
          <div className="px-5 py-3 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-purple-300 font-black text-lg">
            ✨ +600 XP
          </div>
        </div>

        <button
          onClick={onRetry}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-base shadow-xl hover:scale-105 transition cursor-pointer"
        >
          Return to Adventure Map 🗺️
        </button>
      </div>
    );
  }

  if (battleState === 'defeat') {
    return (
      <div className="w-full max-w-lg mx-auto p-8 rounded-3xl bg-slate-900/95 border border-rose-500/40 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-4xl">
          🛡️
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">The Boss was Fierce!</h2>
          <p className="text-slate-300 text-sm mt-2">
            Don't worry, every great hero regroups! Practice a few words to recover and try again!
          </p>
        </div>

        <button
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-bold text-base shadow-xl cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Challenge Boss Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center space-y-6">
      {/* Boss Health Bar Arena */}
      <div className="w-full p-5 rounded-3xl bg-slate-900/90 border border-rose-500/30 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <span className={`text-4xl transition-transform duration-200 ${isBossDamaged ? 'scale-125 shake' : ''}`}>
              {world.bossAvatar}
            </span>
            <div>
              <h3 className="font-extrabold text-white text-base leading-tight">{world.bossName}</h3>
              <span className="text-[11px] text-rose-400 font-bold uppercase tracking-wider">World Guardian Boss</span>
            </div>
          </div>
          <span className="font-mono font-black text-rose-400 text-sm">
            {bossHp} / {maxBossHp} HP
          </span>
        </div>

        {/* Boss HP Bar */}
        <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-rose-950">
          <div
            className="h-full bg-gradient-to-r from-rose-600 via-amber-500 to-rose-500 transition-all duration-300"
            style={{ width: `${(bossHp / maxBossHp) * 100}%` }}
          />
        </div>

        {/* Player Hearts */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold">Hero Lives:</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < playerHearts ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Center Attack Stage */}
      <div className="py-2 flex flex-col items-center">
        <button
          onClick={() => playWord(currentWord.word)}
          className="p-5 rounded-full bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border-2 border-amber-400 text-amber-300 hover:scale-110 active:scale-95 transition shadow-lg cursor-pointer"
          title="Play Boss Spell"
        >
          <Volume2 className="w-8 h-8" />
        </button>
        <span className="text-xs text-slate-400 mt-2 font-medium">Listen and spell correctly to strike the Boss!</span>
      </div>

      {/* Spell Input */}
      <form onSubmit={handleAttack} className="w-full space-y-4">
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Cast spell (type word)..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          autoFocus
          className="w-full py-4 px-6 rounded-2xl bg-slate-900 border-2 border-rose-500/40 focus:border-amber-400 focus:outline-none text-2xl font-bold text-center text-white tracking-widest shadow-2xl"
        />

        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 text-white font-black text-base shadow-lg shadow-rose-600/30 disabled:opacity-40 cursor-pointer"
        >
          <Swords className="w-5 h-5" />
          <span>Strike with Spelling! ⚔️</span>
        </button>
      </form>
    </div>
  );
};
