'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, ArrowRight, RotateCcw } from 'lucide-react';
import { SpellingWord } from '@/types';
import { playWord, playCorrectSound, playTryAgainSound } from '@/lib/spelling/audio';
import confetti from 'canvas-confetti';

interface MissingLettersModeProps {
  word: SpellingWord;
  onCompleted: (isCorrect: boolean) => void;
  onNextWord: () => void;
}

export const MissingLettersMode: React.FC<MissingLettersModeProps> = ({
  word,
  onCompleted,
  onNextWord,
}) => {
  const norm = word.word.toUpperCase();
  const [missingIndices, setMissingIndices] = useState<number[]>([]);
  const [userLetters, setUserLetters] = useState<Record<number, string>>({});
  const [options, setOptions] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Pick 1 or 2 indices to hide (preferably vowels or double letters or middle letters)
    const len = norm.length;
    const hideCount = len > 6 ? 2 : 1;
    const indicesToHide: number[] = [];

    // Avoid first letter if possible
    const candidates = Array.from({ length: len - 1 }, (_, i) => i + 1);
    while (indicesToHide.length < hideCount && candidates.length > 0) {
      const randIdx = Math.floor(Math.random() * candidates.length);
      indicesToHide.push(candidates[randIdx]);
      candidates.splice(randIdx, 1);
    }
    indicesToHide.sort((a, b) => a - b);
    setMissingIndices(indicesToHide);
    setUserLetters({});
    setIsSubmitted(false);
    setIsCorrect(false);

    // Build choices: correct letters + 4 random distractor alphabet letters
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const correctLetters = indicesToHide.map((i) => norm[i]);
    const distractors: string[] = [];
    while (distractors.length < 4) {
      const char = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (!correctLetters.includes(char) && !distractors.includes(char)) {
        distractors.push(char);
      }
    }
    const combinedOptions = [...correctLetters, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(combinedOptions);

    playWord(word.word);
  }, [word]);

  const handleTileClick = (letter: string) => {
    if (isSubmitted) return;

    // Find the first unfilled blank
    const unfilledIndex = missingIndices.find((idx) => !userLetters[idx]);
    if (unfilledIndex !== undefined) {
      setUserLetters((prev) => ({ ...prev, [unfilledIndex]: letter }));
    }
  };

  const handleResetSlot = (idx: number) => {
    if (isSubmitted) return;
    setUserLetters((prev) => {
      const copy = { ...prev };
      delete copy[idx];
      return copy;
    });
  };

  const handleCheck = () => {
    if (missingIndices.some((idx) => !userLetters[idx])) return;

    // Check correctness
    const allMatches = missingIndices.every((idx) => userLetters[idx] === norm[idx]);
    setIsCorrect(allMatches);
    setIsSubmitted(true);

    if (allMatches) {
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
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-500/30">
          Missing Letters Mode
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
        <p className="text-xs text-slate-400 font-medium">
          Fill in the missing letter tiles to complete the word:
        </p>
      </div>

      {/* Interactive Word Slots */}
      <div className="flex items-center justify-center gap-2 flex-wrap py-4">
        {norm.split('').map((char, idx) => {
          const isMissing = missingIndices.includes(idx);
          const chosen = userLetters[idx];

          if (!isMissing) {
            return (
              <div
                key={idx}
                className="w-11 h-13 sm:w-12 sm:h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center font-mono font-black text-2xl text-white shadow"
              >
                {char}
              </div>
            );
          }

          return (
            <button
              key={idx}
              onClick={() => handleResetSlot(idx)}
              className={`w-11 h-13 sm:w-12 sm:h-14 rounded-2xl flex items-center justify-center font-mono font-black text-2xl transition shadow-lg cursor-pointer ${
                chosen
                  ? isSubmitted
                    ? chosen === norm[idx]
                      ? 'bg-emerald-600/30 border-2 border-emerald-400 text-emerald-300'
                      : 'bg-rose-600/30 border-2 border-rose-400 text-rose-300'
                    : 'bg-amber-500/20 border-2 border-amber-400 text-amber-300'
                  : 'bg-slate-950 border-2 border-dashed border-indigo-400 text-indigo-300'
              }`}
              title={chosen ? 'Click to clear slot' : 'Empty slot'}
            >
              {chosen || '?'}
            </button>
          );
        })}
      </div>

      {/* Available Letter Tiles */}
      {!isSubmitted && (
        <div className="space-y-2">
          <span className="text-xs text-slate-200 font-bold">Click a letter to place it:</span>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {options.map((letter, i) => (
              <button
                key={i}
                onClick={() => handleTileClick(letter)}
                className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-indigo-600 border-2 border-slate-600 hover:border-indigo-400 font-mono font-black text-xl text-white shadow-md hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Check or Results Action */}
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
              ? '🎉 Perfect match! You placed the letters brilliantly!'
              : `Almost! The correct word was: ${norm}`}
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
          disabled={missingIndices.some((idx) => !userLetters[idx])}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-base shadow-lg disabled:opacity-40 cursor-pointer"
        >
          Check Letters
        </button>
      )}
    </div>
  );
};
