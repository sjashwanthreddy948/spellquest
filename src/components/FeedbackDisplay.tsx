'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, RotateCcw, ArrowRight, Lightbulb } from 'lucide-react';
import { DiffToken, SpellingWord, VerificationResult } from '@/types';
import { generateCoachAdvice } from '@/lib/spelling/aiCoach';
import { playCorrectSound, playTryAgainSound } from '@/lib/spelling/audio';

interface FeedbackDisplayProps {
  result: VerificationResult;
  word: SpellingWord;
  onTryAgain: () => void;
  onContinue: () => void;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  result,
  word,
  onTryAgain,
  onContinue,
}) => {
  const coach = generateCoachAdvice(word, result.mistakeType, result.inputWord);

  useEffect(() => {
    if (result.isCorrect) {
      playCorrectSound();
      if (result.isFirstAttempt) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
        });
      }
    } else {
      playTryAgainSound();
    }
  }, [result.isCorrect]);

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl p-6 backdrop-blur-xl border transition-all animate-in fade-in duration-300 shadow-2xl bg-slate-900/90 border-slate-700/60">
      {result.isCorrect ? (
        /* CORRECT CELEBRATION */
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/30">
            🎉
          </div>

          <div>
            <h2 className="text-2xl font-black text-emerald-400 tracking-tight">
              {result.encouragement}
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Correct word: <span className="font-bold text-emerald-300 tracking-wide">{result.targetWord}</span>
            </p>
          </div>

          {/* XP & Rewards */}
          <div className="flex items-center gap-3 py-2 px-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
            <span className="flex items-center gap-1 text-emerald-300 font-extrabold text-base">
              <Sparkles className="w-4 h-4 text-emerald-400" /> +{result.xpEarned} XP
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
            <span className="flex items-center gap-1 text-yellow-300 font-extrabold text-base">
              🪙 +{result.coinsEarned} Coins
            </span>
          </div>

          {/* Syllables & Mnemonic Recall */}
          {coach.memoryTrick && (
            <div className="w-full text-left p-3.5 rounded-2xl bg-slate-950/60 border border-emerald-500/20 text-xs text-slate-300 flex items-start gap-2.5">
              <span className="text-base">💡</span>
              <div>
                <span className="font-bold text-emerald-300">Spelling Secret: </span>
                <span>{coach.memoryTrick}</span>
              </div>
            </div>
          )}

          <button
            onClick={onContinue}
            autoFocus
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
          >
            <span>Continue Adventure</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* ENCOURAGING MISTAKE BREAKDOWN */
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
              🌱
            </div>
            <div>
              <h3 className="text-xl font-black text-amber-300 tracking-tight">
                {result.encouragement}
              </h3>
              <p className="text-xs text-slate-200 font-medium">Let's check the letters together!</p>
            </div>
          </div>

          {/* Detailed Letter Difference Visualizer */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border-2 border-slate-750 space-y-3 shadow-inner">
            {/* What you typed */}
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-200">You Wrote:</span>
              <div className="flex items-center gap-1.5 mt-1 font-mono text-xl sm:text-2xl font-black tracking-widest flex-wrap">
                {result.diffTokens.map((tok, idx) => {
                  if (tok.type === 'match') {
                    return (
                      <span key={idx} className="text-emerald-400 border-b-2 border-emerald-400/50 px-1">
                        {tok.char}
                      </span>
                    );
                  }
                  if (tok.type === 'delete') {
                    return (
                      <span key={idx} className="text-rose-400 bg-rose-950/50 border-b-2 border-rose-400 px-1 rounded" title="Extra letter">
                        {tok.char}
                      </span>
                    );
                  }
                  if (tok.type === 'substitute') {
                    return (
                      <span key={idx} className="text-amber-300 bg-amber-950/50 border-b-2 border-amber-400 px-1 rounded" title="Replace with correct letter">
                        {tok.char}
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Target word */}
            <div className="pt-2 border-t border-slate-750">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-200">Target Spelling:</span>
              <div className="flex items-center gap-1.5 mt-1 font-mono text-xl sm:text-2xl font-black tracking-widest text-emerald-300 flex-wrap">
                {result.targetWord.split('').map((char, idx) => (
                  <span key={idx} className="px-1 border-b-2 border-emerald-500/40">
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Coach Tip Card */}
          <div className="p-4 rounded-2xl bg-indigo-950/60 border-2 border-indigo-500/40 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-sm">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>{coach.headline}</span>
            </div>

            {result.mistakeExplanation && (
              <p className="text-xs text-slate-100 leading-relaxed font-medium">
                {result.mistakeExplanation}
              </p>
            )}

            {coach.memoryTrick && (
              <div className="p-2.5 rounded-xl bg-slate-900 border border-indigo-500/30 text-xs font-bold text-amber-300">
                ✨ {coach.memoryTrick}
              </div>
            )}

            {/* Syllables breakdown */}
            <div className="text-[11px] text-indigo-300/80 font-bold flex items-center gap-2 pt-1">
              <span>Syllables:</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-900/50 text-indigo-200 font-mono">
                {coach.syllableBreakdown}
              </span>
            </div>
          </div>

          {/* Actions: Try Again & Continue */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onTryAgain}
              autoFocus
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            <button
              onClick={onContinue}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm sm:text-base border border-slate-700 transition cursor-pointer"
            >
              <span>Next Word</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
