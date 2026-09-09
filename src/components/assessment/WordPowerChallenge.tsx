'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Trophy, ArrowRight, Compass, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ASSESSMENT_WORDS, evaluateAssessment } from '@/data/assessmentWords';
import { AssessmentResult, SpellingWord } from '@/types';
import { AudioControls } from '@/components/AudioControls';
import { useGameStore } from '@/lib/game/gameStore';
import { playCorrectSound, playLevelUpSound, playTryAgainSound } from '@/lib/spelling/audio';

export const WordPowerChallenge: React.FC = () => {
  const router = useRouter();
  const { updateProfile } = useGameStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [answers, setAnswers] = useState<
    { word: SpellingWord; isCorrect: boolean; responseTimeMs: number; mistakeType?: string }[]
  >([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const currentItem = ASSESSMENT_WORDS[currentIndex];

  useEffect(() => {
    setInputVal('');
    setStartTime(Date.now());
    if (inputRef.current) inputRef.current.focus();
  }, [currentIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isCompleted) return;

    const responseTimeMs = Date.now() - startTime;
    const isCorrect = inputVal.trim().toLowerCase() === currentItem.word.word.toLowerCase();

    if (isCorrect) {
      playCorrectSound();
    } else {
      playTryAgainSound();
    }

    const nextAnswers = [
      ...answers,
      {
        word: currentItem.word,
        isCorrect,
        responseTimeMs,
        mistakeType: isCorrect ? undefined : currentItem.word.spelling_pattern,
      },
    ];
    setAnswers(nextAnswers);

    if (currentIndex + 1 >= ASSESSMENT_WORDS.length) {
      // Finished all 25 words!
      const result = evaluateAssessment(nextAnswers);
      setAssessmentResult(result);
      setIsCompleted(true);
      playLevelUpSound();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
      });

      // Update student profile with diagnosed level and starting world
      updateProfile({
        level: result.recommendedLevel,
        activeWorldId: result.recommendedWorldId,
        completedAssessment: true,
      });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  if (isCompleted && assessmentResult) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900/95 border border-indigo-500/40 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center text-5xl shadow-2xl shadow-amber-500/30">
          🌟
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-widest text-amber-400">
            CHALLENGE COMPLETE!
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
            Word Power Level: {assessmentResult.recommendedLevel}
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
            {assessmentResult.summaryMessage}
          </p>
        </div>

        {/* Diagnostic Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2">
          <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-slate-750 shadow-inner">
            <span className="text-[11px] font-bold text-slate-200 uppercase">Accuracy</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">{assessmentResult.accuracy}%</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-slate-750 shadow-inner">
            <span className="text-[11px] font-bold text-slate-200 uppercase">Words Mastered</span>
            <p className="text-2xl font-black text-amber-300 mt-1">
              {assessmentResult.correctCount} / {assessmentResult.totalQuestions}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-slate-750 col-span-2 sm:col-span-1 shadow-inner">
            <span className="text-[11px] font-bold text-slate-200 uppercase">Avg Response Time</span>
            <p className="text-2xl font-black text-indigo-300 mt-1">
              {(assessmentResult.averageResponseTimeMs / 1000).toFixed(1)}s
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push('/adventure')}
          className="w-full flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/25 hover:scale-105 transition cursor-pointer"
        >
          <span>Begin Your Word Adventure</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center space-y-6">
      {/* Progress Header */}
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-bold">
        <span className="text-amber-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Word Power Challenge
        </span>
        <span className="text-slate-300">
          Word {currentIndex + 1} of {ASSESSMENT_WORDS.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / ASSESSMENT_WORDS.length) * 100}%` }}
        />
      </div>

      {/* Audio Play Area */}
      <div className="py-4">
        <AudioControls
          word={currentItem.word.word}
          syllables={currentItem.word.syllables}
          exampleSentence={currentItem.word.example_sentence}
          autoPlayOnMount={true}
        />
        <p className="text-xs text-slate-200 text-center mt-3 font-semibold">
          🎧 Type what you hear. Do your best — every word helps calibrate your adventure!
        </p>
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type the word you heard..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          autoFocus
          className="w-full py-4 px-6 rounded-2xl bg-slate-900 border-2 border-indigo-500/30 focus:border-amber-400 focus:outline-none text-2xl font-bold text-center text-white tracking-widest shadow-2xl transition"
        />

        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-base shadow-lg shadow-amber-500/20 disabled:opacity-40 cursor-pointer"
        >
          Submit & Next Word ⚡
        </button>
      </form>
    </div>
  );
};
