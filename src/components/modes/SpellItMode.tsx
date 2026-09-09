'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Volume2,
  Heart,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useGameStore } from '@/lib/game/gameStore';
import { SpellingWord, VerificationResult } from '@/types';
import { verifySpelling } from '@/lib/spelling/diff';
import {
  playWord,
  playWordSlowly,
  playClickSound,
  getCurrentVoice,
  isFemaleVoice,
  subscribeToVoiceChanges,
} from '@/lib/spelling/audio';
import { generateCoachAdvice } from '@/lib/spelling/aiCoach';
import { VoiceSelectorModal } from '@/components/VoiceSelectorModal';
import confetti from 'canvas-confetti';

interface SpellItModeProps {
  word: SpellingWord;
  wordNumber?: number;
  totalWords?: number;
  stageTitle?: string;
  onAttemptCompleted: (result: VerificationResult, responseTimeMs: number) => void;
  onNextWord: () => void;
  hearts?: number;
  streak?: number;
  xp?: number;
}

export const SpellItMode: React.FC<SpellItModeProps> = ({
  word,
  wordNumber = 1,
  totalWords = 10,
  stageTitle = 'Stage 1',
  onAttemptCompleted,
  onNextWord,
  hearts = 3,
  streak = 0,
  xp = 0,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [attemptCount, setAttemptCount] = useState(1);
  const [hintLevel, setHintLevel] = useState(0);
  const [deductionAlert, setDeductionAlert] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(() => Date.now());
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceName, setVoiceName] = useState<string>('Female Voice');
  const [isFemale, setIsFemale] = useState<boolean>(true);

  const { state } = useGameStore();
  const companionImage =
    state.profile.companionId === 'pip'
      ? '/images/pip.jpg'
      : state.profile.companionId === 'luna'
      ? '/images/luna.jpg'
      : '/images/sparky.jpg';

  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamic potential points gained remaining for this word
  const potentialPoints =
    attemptCount === 1
      ? Math.max(25, 100 - hintLevel * 25)
      : Math.max(20, 50 - hintLevel * 10);

  useEffect(() => {
    const updateVoice = () => {
      const v = getCurrentVoice();
      if (v) {
        const short = v.name.replace(/^Microsoft\s+/i, '').split(' ')[0] || 'Voice';
        setVoiceName(short);
        setIsFemale(isFemaleVoice(v));
      }
    };
    updateVoice();
    return subscribeToVoiceChanges(updateVoice);
  }, []);

  useEffect(() => {
    setInputVal('');
    setAttemptCount(1);
    setHintLevel(0);
    setDeductionAlert(null);
    setStartTime(Date.now());
    setVerificationResult(null);
    setIsPlayingAudio(false);
  }, [word]);

  const handlePlayAudio = async (slow: boolean = false) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    playClickSound();
    try {
      if (slow) {
        await playWordSlowly(word.word, word.syllables);
      } else {
        await playWord(word.word);
      }
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || verificationResult) return;

    // Mobile keyboard handling: blur input to tuck keyboard away smoothly
    if (inputRef.current) {
      inputRef.current.blur();
    }

    playClickSound();
    const responseTimeMs = Date.now() - startTime;
    const result = verifySpelling(inputVal, word, attemptCount, hintLevel > 0, hintLevel);

    setVerificationResult(result);
    onAttemptCompleted(result, responseTimeMs);

    if (result.isCorrect && attemptCount === 1) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#6366f1'],
      });
    }
  };

  const handleTryAgain = () => {
    playClickSound();
    setAttemptCount((prev) => prev + 1);
    setVerificationResult(null);
    setInputVal('');
    setStartTime(Date.now());
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleUseHint = () => {
    if (hintLevel >= 3) return;
    playClickSound();
    const nextLevel = hintLevel + 1;
    setHintLevel(nextLevel);
    setDeductionAlert(`-25 Points Deducted (Clue ${nextLevel} used)`);
  };

  const coach = generateCoachAdvice(word, verificationResult?.mistakeType, inputVal);

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center space-y-4 pt-1 animate-in fade-in duration-200">
      
      {/* Mobile Game Top Status Bar (Requirement 7) */}
      <div className="w-full flex items-center justify-between text-xs font-bold px-1">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-xl border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> {xp} XP
          </span>
          <span className="flex items-center gap-1 text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-500/30">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {streak} Streak
          </span>
          <span className="text-[11px] font-bold text-amber-300 bg-amber-950/40 px-2 py-1 rounded-xl border border-amber-500/30" title="Points gained if spelled correctly">
            ⭐ {potentialPoints} pts
          </span>
        </div>

        <span className="font-mono text-slate-300 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
          Word {wordNumber} / {totalWords}
        </span>
      </div>

      {/* Center Audio Stage with Explicit Tap-to-Play Button (Requirement 33) */}
      {!verificationResult && (
        <div className="w-full py-4 flex flex-col items-center space-y-3">
          {/* Animated Pet Companion Encourager */}
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-xl border-2 border-amber-400 animate-bounce flex-shrink-0">
              <Image
                src={companionImage}
                alt="Companion Mascot"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs shadow-md">
              <p className="font-bold text-white leading-tight">
                {isPlayingAudio ? '🔊 Listen carefully!' : '🐾 Ready? Tap to hear!'}
              </p>
              <span className="text-[10px] text-amber-400 font-bold block mt-0.5">
                {state.profile.companion}
              </span>
            </div>
          </div>

          <div className="relative">
            {isPlayingAudio && (
              <div className="absolute -inset-2 rounded-full bg-amber-400/40 animate-ping" />
            )}
            <button
              type="button"
              onClick={() => handlePlayAudio(false)}
              disabled={isPlayingAudio}
              className="relative min-w-[200px] min-h-[58px] flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/25 active:scale-95 transition cursor-pointer"
            >
              <Volume2 className={`w-6 h-6 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              <span>{isPlayingAudio ? 'Speaking...' : '🔊 PLAY WORD'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePlayAudio(true)}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold active:scale-95 transition cursor-pointer"
            >
              🐢 Say Slowly
            </button>

            {hintLevel < 3 ? (
              <button
                type="button"
                onClick={handleUseHint}
                className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-indigo-950/80 border border-amber-400/40 text-amber-300 text-xs font-bold active:scale-95 transition cursor-pointer flex items-center gap-1 shadow-sm"
                title="Use clue (-25 points from reward)"
              >
                <span>💡 Clue {hintLevel + 1}</span>
                <span className="text-rose-400 text-[10px]">(-25 pts)</span>
              </button>
            ) : (
              <span className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold flex items-center">
                💡 All 3 Clues Used
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setShowVoiceModal(true);
              }}
              className="min-h-[44px] px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold active:scale-95 transition cursor-pointer flex items-center gap-1.5"
              title="Change Voice & Pronunciation Pacing"
            >
              <span>{isFemale ? '👩' : '🎙️'}</span>
              <span className="max-w-[70px] truncate">{voiceName}</span>
            </button>
          </div>

          {/* Clue Deduction Notification Banner */}
          {deductionAlert && (
            <div className="w-full py-1.5 px-3 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold text-center animate-in fade-in flex items-center justify-center gap-1.5 shadow-md">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{deductionAlert} • Points Gained: {potentialPoints} XP</span>
            </div>
          )}

          {/* Hint Progressive Disclosure */}
          {hintLevel > 0 && (
            <div className="w-full p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 text-center space-y-1 animate-in fade-in">
              <div className="flex items-center justify-between text-[10px] font-bold text-indigo-300 border-b border-indigo-500/20 pb-1 mb-1">
                <span>CLUES REVEALED ({hintLevel}/3)</span>
                <span className="text-rose-400 font-bold">-{hintLevel * 25} Points Deducted</span>
              </div>
              {hintLevel >= 1 && (
                <p>
                  💡 <strong>Syllables:</strong> {word.syllables.join(' • ')}
                </p>
              )}
              {hintLevel >= 2 && (
                <p>
                  💡 <strong>Clue:</strong> {word.hint}
                </p>
              )}
              {hintLevel >= 3 && (
                <p className="font-mono tracking-widest text-amber-300 font-bold">
                  {word.word[0].toUpperCase()}
                  {word.word.slice(1, -1).split('').map(() => ' _ ').join('')}
                  {word.word[word.word.length - 1].toUpperCase()}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Input or Mobile Feedback (Requirement 7 & 15) */}
      {verificationResult ? (
        /* Mobile Feedback Card (Requirement 15) */
        <div className="w-full rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4 text-center animate-in zoom-in-95">
          {verificationResult.isCorrect ? (
            <div className="space-y-3">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400 animate-bounce">
                <Image
                  src="/images/chest.jpg"
                  alt="Victory Treasure Chest"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="text-xl font-black text-emerald-400">
                  {verificationResult.encouragement}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Correct word: <strong className="text-emerald-300 font-mono text-base">{verificationResult.targetWord}</strong>
                </p>
              </div>

              {/* Point breakdown showing clue deduction */}
              {(verificationResult.cluesUsed || 0) > 0 ? (
                <div className="p-3.5 rounded-2xl bg-slate-950/90 border-2 border-amber-500/40 text-xs space-y-1.5 text-left max-w-xs mx-auto shadow-md">
                  <div className="flex justify-between font-bold text-slate-200">
                    <span>Base Word Reward:</span>
                    <span className="font-mono text-white">+{verificationResult.baseXp || 100} XP</span>
                  </div>
                  <div className="flex justify-between font-bold text-rose-400">
                    <span>Clues Deducted ({verificationResult.cluesUsed} used × 25):</span>
                    <span className="font-mono">-{verificationResult.cluesDeduction || ((verificationResult.cluesUsed || 0) * 25)} XP</span>
                  </div>
                  <div className="flex justify-between font-black text-emerald-400 pt-1 border-t border-slate-750 text-sm">
                    <span>Points Gained:</span>
                    <span className="font-mono text-base">+{verificationResult.xpEarned} XP ⭐</span>
                  </div>
                  <div className="flex justify-between font-bold text-amber-300 text-[11px]">
                    <span>Coins Gained:</span>
                    <span className="font-mono">+{verificationResult.coinsEarned} Coins 🪙</span>
                  </div>
                </div>
              ) : (
                <div className="inline-flex items-center gap-3 py-1.5 px-4 rounded-xl bg-emerald-950/80 border-2 border-emerald-500/40 text-xs font-black text-emerald-300">
                  <span>🌟 No Clues Used! Full +{verificationResult.xpEarned} XP Gained!</span>
                  <span>•</span>
                  <span>+{verificationResult.coinsEarned} Coins 🪙</span>
                </div>
              )}

              <button
                onClick={onNextWord}
                autoFocus
                className="w-full min-h-[52px] flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-base shadow-lg active:scale-95 transition cursor-pointer"
              >
                <span>CONTINUE →</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌱</span>
                <h3 className="text-lg font-black text-amber-300">
                  Almost! Let's fix this together!
                </h3>
              </div>

              {/* Mobile Before / After Comparison */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border-2 border-slate-750 space-y-2 text-xs shadow-inner">
                <div>
                  <span className="text-slate-200 font-bold block">You wrote:</span>
                  <span className="font-mono text-base font-bold text-rose-300 line-through">
                    {verificationResult.inputWord}
                  </span>
                </div>
                <div>
                  <span className="text-slate-200 font-bold block">Correct:</span>
                  <span className="font-mono text-base font-black text-emerald-300">
                    {verificationResult.targetWord}
                  </span>
                </div>
              </div>

              {/* Memory Trick / Coach */}
              <div className="p-3 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-xs text-indigo-200">
                <span className="font-bold text-amber-300 block mb-0.5">💡 Remember:</span>
                <p className="leading-relaxed">
                  {coach.memoryTrick || verificationResult.mistakeExplanation}
                </p>
              </div>

              {/* 48px+ Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleTryAgain}
                  autoFocus
                  className="flex-1 min-h-[48px] flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm active:scale-95 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>TRY AGAIN</span>
                </button>

                <button
                  onClick={onNextWord}
                  className="flex-1 min-h-[48px] flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm active:scale-95 transition cursor-pointer"
                >
                  <span>SKIP →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Form with 48px+ Touch Buttons */
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type the word..."
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              className="w-full min-h-[56px] py-3.5 px-4 rounded-2xl bg-slate-900 border-2 border-indigo-500/40 focus:border-amber-400 focus:outline-none text-xl sm:text-2xl font-bold text-center text-white tracking-wider shadow-inner transition"
            />
          </div>

          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="w-full min-h-[52px] flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition cursor-pointer"
          >
            <span>CHECK ANSWER</span>
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </form>
      )}

      {/* Hearts Lives Counter */}
      <div className="pt-2 flex items-center justify-center gap-1.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Heart
            key={i}
            className={`w-5 h-5 ${
              i < hearts ? 'fill-rose-500 text-rose-500' : 'text-slate-500 stroke-[2] opacity-75'
            }`}
          />
        ))}
      </div>

      {/* Voice & Pronunciation Modal */}
      <VoiceSelectorModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
      />
    </div>
  );
};
