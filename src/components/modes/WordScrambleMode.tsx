'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, ArrowRight, RotateCcw } from 'lucide-react';
import { SpellingWord } from '@/types';
import { playWord, playCorrectSound, playTryAgainSound } from '@/lib/spelling/audio';
import confetti from 'canvas-confetti';

interface WordScrambleModeProps {
  word: SpellingWord;
  onCompleted: (isCorrect: boolean) => void;
  onNextWord: () => void;
}

interface TileItem {
  id: string;
  char: string;
}

export const WordScrambleMode: React.FC<WordScrambleModeProps> = ({
  word,
  onCompleted,
  onNextWord,
}) => {
  const norm = word.word.toUpperCase();
  const [bankTiles, setBankTiles] = useState<TileItem[]>([]);
  const [trayTiles, setTrayTiles] = useState<TileItem[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Break word into tiles and shuffle
    const letters = norm.split('').map((c, i) => ({ id: `${c}-${i}`, char: c }));
    let shuffled = [...letters].sort(() => Math.random() - 0.5);
    // Ensure shuffled is not identical to word
    if (shuffled.map((t) => t.char).join('') === norm && letters.length > 2) {
      shuffled = [shuffled[1], shuffled[0], ...shuffled.slice(2)];
    }
    setBankTiles(shuffled);
    setTrayTiles([]);
    setIsSubmitted(false);
    setIsCorrect(false);

    playWord(word.word);
  }, [word]);

  const handlePickTile = (tile: TileItem) => {
    if (isSubmitted) return;
    setBankTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setTrayTiles((prev) => [...prev, tile]);
  };

  const handleReturnTile = (tile: TileItem) => {
    if (isSubmitted) return;
    setTrayTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setBankTiles((prev) => [...prev, tile]);
  };

  const handleReset = () => {
    if (isSubmitted) return;
    setBankTiles([...bankTiles, ...trayTiles]);
    setTrayTiles([]);
  };

  const handleCheck = () => {
    const assembled = trayTiles.map((t) => t.char).join('');
    const matches = assembled === norm;
    setIsCorrect(matches);
    setIsSubmitted(true);

    if (matches) {
      playCorrectSound();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onCompleted(true);
    } else {
      playTryAgainSound();
      onCompleted(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 text-center space-y-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/30">
          Word Scramble Mode
        </span>
        <button
          onClick={() => playWord(word.word)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-amber-300 text-xs font-bold hover:bg-slate-700"
        >
          <Volume2 className="w-4 h-4" />
          <span>Hear Word</span>
        </button>
      </div>

      <div className="py-2">
        <p className="text-xs text-slate-200 font-semibold">
          Unscramble the letters to spell the word:
        </p>
      </div>

      {/* Word Assembly Tray */}
      <div className="p-4 rounded-2xl bg-slate-950 border-2 border-indigo-500/50 min-h-[76px] flex items-center justify-center gap-2 flex-wrap shadow-inner">
        {trayTiles.length === 0 ? (
          <span className="text-sm font-semibold text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
            Tap the scrambled letters below to place here
          </span>
        ) : (
          trayTiles.map((tile) => (
            <button
              key={tile.id}
              onClick={() => handleReturnTile(tile)}
              className="w-12 h-12 rounded-xl bg-gradient-to-t from-indigo-600 to-indigo-500 text-white font-mono font-black text-2xl shadow-md hover:scale-105 active:scale-95 transition cursor-pointer border border-indigo-400/40"
              title="Click to remove"
            >
              {tile.char}
            </button>
          ))
        )}
      </div>

      {/* Letter Bank */}
      {!isSubmitted && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 flex-wrap min-h-[52px]">
            {bankTiles.map((tile) => (
              <button
                key={tile.id}
                onClick={() => handlePickTile(tile)}
                className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-amber-300 font-mono font-black text-2xl shadow hover:scale-110 active:scale-90 transition cursor-pointer"
              >
                {tile.char}
              </button>
            ))}
          </div>

          {trayTiles.length > 0 && (
            <button
              onClick={handleReset}
              className="text-xs font-bold text-slate-200 hover:text-white bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 mx-auto transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset all letters</span>
            </button>
          )}
        </div>
      )}

      {/* Outcome / Actions */}
      {isSubmitted ? (
        <div className="space-y-4 pt-2">
          <div
            className={`p-3 rounded-xl text-sm font-bold ${
              isCorrect
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/60 border border-amber-500/40 text-amber-300'
            }`}
          >
            {isCorrect
              ? '🎉 Brilliant unscrambling! That is exact!'
              : `Nice attempt! The word was: ${norm}`}
          </div>
          <button
            onClick={onNextWord}
            autoFocus
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-base shadow-lg cursor-pointer"
          >
            <span>Next Word</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleCheck}
          disabled={trayTiles.length !== norm.length}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-base shadow-lg disabled:opacity-40 cursor-pointer"
        >
          Check Scramble
        </button>
      )}
    </div>
  );
};
