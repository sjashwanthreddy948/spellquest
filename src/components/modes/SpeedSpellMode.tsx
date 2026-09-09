'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Timer, Zap, Trophy, RotateCcw, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SpellingWord } from '@/types';
import { playWord, playCorrectSound, playTryAgainSound, playLevelUpSound } from '@/lib/spelling/audio';

interface SpeedSpellModeProps {
  words: SpellingWord[];
  onFinish: (score: number, correctCount: number) => void;
}

export const SpeedSpellMode: React.FC<SpeedSpellModeProps> = ({ words, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const currentWord = words[currentIndex % words.length];

  // 30s Countdown timer
  useEffect(() => {
    if (!isStarted || isGameOver) return;
    if (timeLeft <= 0) {
      setIsGameOver(true);
      playLevelUpSound();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      onFinish(score, correctCount);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isGameOver, timeLeft, score, correctCount, onFinish]);

  // Read word on new index
  useEffect(() => {
    if (isStarted && !isGameOver && currentWord) {
      playWord(currentWord.word);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isStarted, isGameOver, currentIndex]);

  const handleStart = () => {
    setIsStarted(true);
    setTimeLeft(30);
    setScore(0);
    setCorrectCount(0);
    setCombo(0);
    setCurrentIndex(0);
    setIsGameOver(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isGameOver) return;

    const isMatch = inputVal.trim().toLowerCase() === currentWord.word.toLowerCase();

    if (isMatch) {
      playCorrectSound();
      const points = 100 + combo * 25;
      setScore((s) => s + points);
      setCorrectCount((c) => c + 1);
      setCombo((cb) => cb + 1);
    } else {
      playTryAgainSound();
      setCombo(0);
    }

    setInputVal('');
    setCurrentIndex((i) => i + 1);
  };

  if (!isStarted) {
    return (
      <div className="w-full max-w-lg mx-auto p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/30 text-center space-y-6 shadow-2xl">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/20">
          ⚡
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Speed Spell Blitz</h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Spell as many words as you can in <strong>30 seconds</strong>! Build your combo streak for massive bonus points!
          </p>
        </div>
        <button
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          Start 30-Second Challenge 🚀
        </button>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="w-full max-w-lg mx-auto p-8 rounded-3xl bg-slate-900/95 border border-indigo-500/40 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-4xl">
          🏆
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">Time's Up!</h2>
          <p className="text-slate-300 text-sm mt-1">Spectacular speed speller session!</p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-bold">Total Score</span>
            <p className="text-3xl font-black text-amber-300 mt-1">{score}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-bold">Words Spelled</span>
            <p className="text-3xl font-black text-emerald-400 mt-1">{correctCount}</p>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-base shadow-xl transition cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Play Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center space-y-6">
      {/* Timer & Score Header */}
      <div className="w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2 font-mono text-xl font-black text-amber-400">
          <Timer className="w-5 h-5 text-amber-400 animate-spin" />
          <span>{timeLeft}s</span>
        </div>

        <div className="flex items-center gap-4">
          {combo > 1 && (
            <span className="px-2.5 py-1 rounded-xl bg-orange-950/50 border border-orange-500/40 text-orange-300 text-xs font-black animate-pulse">
              🔥 {combo}x COMBO
            </span>
          )}
          <span className="text-lg font-black text-white">{score} pts</span>
        </div>
      </div>

      {/* Progress Countdown Bar */}
      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000"
          style={{ width: `${(timeLeft / 30) * 100}%` }}
        />
      </div>

      {/* Audio Play Button */}
      <div className="py-2 flex flex-col items-center">
        <button
          onClick={() => playWord(currentWord.word)}
          className="p-5 rounded-full bg-amber-500/20 border-2 border-amber-400/60 text-amber-300 hover:scale-110 active:scale-95 transition shadow-lg cursor-pointer"
          title="Replay word"
        >
          <Volume2 className="w-8 h-8" />
        </button>
        <span className="text-xs text-slate-400 mt-2 font-medium">Click to hear word again</span>
      </div>

      {/* Rapid Type Input */}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type fast & press Enter!"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          autoFocus
          className="w-full py-4 px-6 rounded-2xl bg-slate-900 border-2 border-amber-500/50 focus:border-amber-400 focus:outline-none text-2xl font-bold text-center text-white tracking-widest shadow-2xl"
        />

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-base shadow-lg cursor-pointer"
        >
          Submit Word ⚡
        </button>
      </form>
    </div>
  );
};
