'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { SpellingWord } from '@/types';
import { playWord, playCorrectSound, playTryAgainSound } from '@/lib/spelling/audio';
import confetti from 'canvas-confetti';

interface FindMistakeModeProps {
  word: SpellingWord;
  onCompleted: (isCorrect: boolean) => void;
  onNextWord: () => void;
}

interface ChoiceItem {
  text: string;
  isCorrectSpelling: boolean;
}

export const FindMistakeMode: React.FC<FindMistakeModeProps> = ({
  word,
  onCompleted,
  onNextWord,
}) => {
  const [choices, setChoices] = useState<ChoiceItem[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Generate 1 correct word and 3 plausible misspellings from common_mistakes or generator
    const correct = word.word;
    const mistakes = [...word.common_mistakes];
    // Pad mistakes if fewer than 3
    if (mistakes.length < 3) {
      mistakes.push(correct.replace('e', 'a'));
      mistakes.push(correct.length > 5 ? correct.slice(0, -2) + correct.slice(-1) : correct + 'e');
      mistakes.push(correct + 's');
    }

    const setOfChoices: ChoiceItem[] = [
      { text: correct, isCorrectSpelling: true },
      { text: mistakes[0], isCorrectSpelling: false },
      { text: mistakes[1], isCorrectSpelling: false },
      { text: mistakes[2], isCorrectSpelling: false },
    ];

    setChoices(setOfChoices.sort(() => Math.random() - 0.5));
    setSelectedIdx(null);
    setIsSubmitted(false);
    playWord(word.word);
  }, [word]);

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedIdx(idx);
    setIsSubmitted(true);

    const chosen = choices[idx];
    if (chosen.isCorrectSpelling) {
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
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-xl bg-teal-950 text-teal-300 border border-teal-500/30">
          Find the Mistake Mode
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
        <h3 className="text-lg font-black text-white">Which one is the REAL correct spelling?</h3>
        <p className="text-xs text-slate-200 mt-1 font-medium">
          Three sneaky impostors are trying to trick you. Spot the true spelling!
        </p>
      </div>

      {/* 4 Choices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {choices.map((choice, i) => {
          let btnStyle = 'bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-white font-bold';

          if (isSubmitted) {
            if (choice.isCorrectSpelling) {
              btnStyle = 'bg-emerald-950/80 border-2 border-emerald-400 text-emerald-300 font-black';
            } else if (selectedIdx === i) {
              btnStyle = 'bg-rose-950/80 border-2 border-rose-400 text-rose-300 line-through';
            } else {
              btnStyle = 'bg-slate-900/70 border border-slate-750 text-slate-300 opacity-70';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={isSubmitted}
              className={`p-4 rounded-2xl border text-lg sm:text-xl font-bold tracking-wider flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md ${btnStyle}`}
            >
              <span>{choice.text}</span>
              {isSubmitted && choice.isCorrectSpelling && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
              {isSubmitted && selectedIdx === i && !choice.isCorrectSpelling && (
                <XCircle className="w-5 h-5 text-rose-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Outcome / Next Button */}
      {isSubmitted && (
        <div className="space-y-4 pt-2">
          <div
            className={`p-3 rounded-xl text-sm font-bold ${
              choices[selectedIdx!]?.isCorrectSpelling
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/60 border border-amber-500/40 text-amber-300'
            }`}
          >
            {choices[selectedIdx!]?.isCorrectSpelling ? (
              <span>🎉 Eagle eyes! You caught the impostors!</span>
            ) : (
              <span>💡 Good try! The authentic spelling is "{word.word}".</span>
            )}
          </div>

          <button
            onClick={onNextWord}
            autoFocus
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-base shadow-lg cursor-pointer"
          >
            <span>Next Challenge</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
