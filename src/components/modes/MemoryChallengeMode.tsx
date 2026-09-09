'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Brain, Volume2, ArrowRight } from 'lucide-react';
import { SpellingWord } from '@/types';
import { playWord, playCorrectSound, playTryAgainSound } from '@/lib/spelling/audio';
import confetti from 'canvas-confetti';

interface MemoryChallengeModeProps {
  word: SpellingWord;
  onCompleted: (isCorrect: boolean) => void;
  onNextWord: () => void;
}

export const MemoryChallengeMode: React.FC<MemoryChallengeModeProps> = ({
  word,
  onCompleted,
  onNextWord,
}) => {
  const [phase, setPhase] = useState<'memorize' | 'hidden' | 'result'>('memorize');
  const [countdown, setCountdown] = useState(3);
  const [inputVal, setInputVal] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhase('memorize');
    setCountdown(3);
    setInputVal('');
    setIsCorrect(false);

    playWord(word.word);

    // 3-second memorization window
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setPhase('hidden');
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [word]);

  useEffect(() => {
    if (phase === 'hidden' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || phase !== 'hidden') return;

    const matches = inputVal.trim().toLowerCase() === word.word.toLowerCase();
    setIsCorrect(matches);
    setPhase('result');

    if (matches) {
      playCorrectSound();
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      onCompleted(true);
    } else {
      playTryAgainSound();
      onCompleted(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 rounded-3xl bg-slate-900/90 border border-indigo-500/30 text-center space-y-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-xl bg-pink-950 text-pink-300 border border-pink-500/30">
          Memory Flash Challenge
        </span>
        <button
          onClick={() => playWord(word.word)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-amber-300 text-xs font-bold hover:bg-slate-700"
        >
          <Volume2 className="w-4 h-4" />
          <span>Hear Word</span>
        </button>
      </div>

      {phase === 'memorize' && (
        <div className="space-y-6 py-6 animate-in zoom-in-95">
          <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
            <Eye className="w-5 h-5 animate-pulse" />
            <span>MEMORIZE THIS WORD ({countdown}s)</span>
          </div>

          <div className="py-6 px-4 rounded-3xl bg-slate-950 border-2 border-indigo-500/50 shadow-inner">
            <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-indigo-300 tracking-widest font-mono">
              {word.word.toUpperCase()}
            </h2>
            <p className="text-xs text-slate-200 mt-2 font-semibold">
              Syllables: <span className="text-amber-300 font-bold">{word.syllables.join(' • ')}</span>
            </p>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-amber-500 transition-all duration-1000"
              style={{ width: `${(countdown / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {phase === 'hidden' && (
        <form onSubmit={handleSubmit} className="space-y-6 py-4 animate-in fade-in">
          <div className="flex items-center justify-center gap-2 text-indigo-300 font-bold text-sm">
            <EyeOff className="w-5 h-5 text-indigo-400" />
            <span>Word is hidden! Recall from memory:</span>
          </div>

          <div className="py-6 px-4 rounded-3xl bg-slate-950 border-2 border-dashed border-indigo-500/50 shadow-inner">
            <div className="text-4xl text-indigo-400/80 font-mono tracking-widest font-black">
              {word.word.split('').map(() => '•').join(' ')}
            </div>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type the memorized word..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            autoFocus
            className="w-full py-4 px-6 rounded-2xl bg-slate-900 border-2 border-pink-500/50 focus:border-pink-400 focus:outline-none text-2xl font-bold text-center text-white placeholder:text-slate-400 tracking-widest shadow-2xl"
          />

          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-amber-500 text-slate-950 font-black text-base shadow-lg disabled:opacity-40 cursor-pointer"
          >
            Check Memory 🧠
          </button>
        </form>
      )}

      {phase === 'result' && (
        <div className="space-y-4 py-4 animate-in fade-in">
          <div
            className={`p-4 rounded-2xl text-base font-bold ${
              isCorrect
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/60 border border-amber-500/40 text-amber-300'
            }`}
          >
            {isCorrect ? (
              <p>🎉 Photographic Memory! You recalled "{word.word}" perfectly!</p>
            ) : (
              <div>
                <p>💡 Great mental gym workout!</p>
                <p className="text-xs mt-1 text-slate-300">
                  You typed: <span className="font-mono text-amber-400">{inputVal}</span> • Target: <span className="font-mono text-emerald-400">{word.word}</span>
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onNextWord}
            autoFocus
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-base shadow-lg cursor-pointer"
          >
            <span>Next Word</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
