'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GameMode, SpellingWord, VerificationResult } from '@/types';
import { getAllWords, getWordsByLevel } from '@/data/words';
import { analyzePerformance, selectNextAdaptiveWord } from '@/lib/spelling/adaptive';
import { useGameStore } from '@/lib/game/gameStore';
import { SpellItMode } from '@/components/modes/SpellItMode';
import { SpeedSpellMode } from '@/components/modes/SpeedSpellMode';
import { MissingLettersMode } from '@/components/modes/MissingLettersMode';
import { WordScrambleMode } from '@/components/modes/WordScrambleMode';
import { FindMistakeMode } from '@/components/modes/FindMistakeMode';
import { MemoryChallengeMode } from '@/components/modes/MemoryChallengeMode';
import { BossBattleMode } from '@/components/modes/BossBattleMode';
import confetti from 'canvas-confetti';
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';

const MODE_TABS: { id: GameMode; label: string; icon: string }[] = [
  { id: 'spell_it', label: 'Spell It', icon: '🎧' },
  { id: 'speed_spell', label: 'Speed', icon: '⚡' },
  { id: 'missing_letters', label: 'Missing', icon: '🧩' },
  { id: 'word_scramble', label: 'Scramble', icon: '🔤' },
  { id: 'find_mistake', label: 'Spot', icon: '🔍' },
  { id: 'memory_challenge', label: 'Memory', icon: '🧠' },
  { id: 'boss_battle', label: 'Boss', icon: '👑' },
];

function PlayHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, recordAttempt, completeStage } = useGameStore();

  const modeParam = (searchParams.get('mode') as GameMode) || 'spell_it';
  const worldIdParam = searchParams.get('world') || state.profile.activeWorldId || 'world-1';
  const stageNumParam = parseInt(searchParams.get('stage') || '1', 10);

  const [activeMode, setActiveMode] = useState<GameMode>(modeParam);
  const [currentWord, setCurrentWord] = useState<SpellingWord | null>(null);
  const [historyWordIds, setHistoryWordIds] = useState<string[]>([]);
  
  // Session tracking (10 words per challenge)
  const [wordCounter, setWordCounter] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [earnedSessionXp, setEarnedSessionXp] = useState(0);

  const activeWorld = state.worlds.find((w) => w.id === worldIdParam) || state.worlds[0];
  const currentStageObj = activeWorld.stages.find((s) => s.stageNumber === stageNumParam);
  const targetWords = currentStageObj?.wordsCount || 5;
  const allWords = getAllWords();

  const loadNextWord = () => {
    const adaptiveProfile = analyzePerformance(state.attempts);
    const { word } = selectNextAdaptiveWord(
      allWords,
      state.srsQueue,
      state.profile.level,
      adaptiveProfile,
      historyWordIds
    );
    setCurrentWord(word);
    setHistoryWordIds((prev) => [...prev.slice(-10), word.id]);
  };

  useEffect(() => {
    loadNextWord();
  }, [activeMode, worldIdParam]);

  const handleAttempt = (result: VerificationResult, responseTimeMs: number) => {
    if (!currentWord) return;
    const cluesCount = result.cluesUsed || 0;
    const { xpBonus } = recordAttempt(
      currentWord,
      result.inputWord,
      result.isCorrect,
      responseTimeMs,
      cluesCount > 0,
      activeMode,
      1,
      cluesCount
    );

    if (result.isCorrect) {
      setCorrectCount((c) => c + 1);
    }
    setEarnedSessionXp((x) => x + xpBonus);
  };

  const handleNextWord = () => {
    if (wordCounter >= targetWords) {
      // Stage challenge completed!
      setIsSessionComplete(true);
      const score = correctCount * 100;
      const stars = correctCount >= targetWords ? 3 : correctCount >= Math.ceil(targetWords * 0.6) ? 2 : 1;
      completeStage(worldIdParam, stageNumParam, stars, score);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      return;
    }

    setWordCounter((c) => c + 1);
    loadNextWord();
  };

  const handleRestartSession = () => {
    setWordCounter(1);
    setCorrectCount(0);
    setEarnedSessionXp(0);
    setIsSessionComplete(false);
    loadNextWord();
  };

  const handleModeChange = (mode: GameMode) => {
    setActiveMode(mode);
    setWordCounter(1);
    setCorrectCount(0);
    setIsSessionComplete(false);
    router.push(`/play?mode=${mode}&world=${worldIdParam}&stage=${stageNumParam}`);
  };

  // Mobile Result Screen (Requirement 14)
  if (isSessionComplete) {
    const accuracy = Math.round((correctCount / targetWords) * 100);

    return (
      <div className="w-full max-w-sm mx-auto p-6 rounded-3xl bg-slate-900 border border-amber-400/50 text-center space-y-5 shadow-2xl animate-in zoom-in-95 mt-4">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-4xl shadow-lg animate-bounce">
          🎉
        </div>

        <div>
          <span className="text-xs font-black tracking-widest uppercase text-amber-400">
            CHALLENGE COMPLETE
          </span>
          <h2 className="text-2xl font-black text-white mt-1">GREAT JOB!</h2>
          <p className="text-3xl font-black text-amber-300 mt-2">
            {correctCount} / {targetWords} <span className="text-base text-slate-400">({accuracy}%)</span>
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 py-1">
          <div className="px-4 py-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-black">
            +{earnedSessionXp || (correctCount * 100)} XP ⭐
          </div>
          <div className="px-4 py-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-black">
            🔥 {state.profile.streakDays} Word Streak
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => router.push('/adventure')}
            className="w-full min-h-[50px] flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 active:scale-95 transition cursor-pointer"
          >
            <span>CONTINUE →</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleRestartSession}
            className="w-full min-h-[44px] py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 active:scale-95 transition cursor-pointer"
          >
            Review & Play Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 pt-1 pb-4 animate-in fade-in duration-200">
      {/* Mode Switcher Horizontal Scroll Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {MODE_TABS.map((tab) => {
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleModeChange(tab.id)}
              className={`flex-shrink-0 min-h-[38px] flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Game Mode */}
      <div>
        {activeMode === 'spell_it' && (
          <SpellItMode
            word={currentWord}
            wordNumber={wordCounter}
            totalWords={10}
            stageTitle={activeWorld.name}
            onAttemptCompleted={handleAttempt}
            onNextWord={handleNextWord}
            hearts={state.profile.hearts}
            streak={state.profile.streakDays}
            xp={state.profile.xp}
          />
        )}

        {activeMode === 'speed_spell' && (
          <SpeedSpellMode
            words={allWords}
            onFinish={(score) => {
              completeStage(worldIdParam, stageNumParam, 3, score);
            }}
          />
        )}

        {activeMode === 'missing_letters' && (
          <MissingLettersMode
            word={currentWord}
            onCompleted={(isCorrect) => {
              recordAttempt(currentWord, currentWord.word, isCorrect, 3000, false, 'missing_letters');
            }}
            onNextWord={handleNextWord}
          />
        )}

        {activeMode === 'word_scramble' && (
          <WordScrambleMode
            word={currentWord}
            onCompleted={(isCorrect) => {
              recordAttempt(currentWord, currentWord.word, isCorrect, 3000, false, 'word_scramble');
            }}
            onNextWord={handleNextWord}
          />
        )}

        {activeMode === 'find_mistake' && (
          <FindMistakeMode
            word={currentWord}
            onCompleted={(isCorrect) => {
              recordAttempt(currentWord, currentWord.word, isCorrect, 2500, false, 'find_mistake');
            }}
            onNextWord={handleNextWord}
          />
        )}

        {activeMode === 'memory_challenge' && (
          <MemoryChallengeMode
            word={currentWord}
            onCompleted={(isCorrect) => {
              recordAttempt(currentWord, currentWord.word, isCorrect, 2000, false, 'memory_challenge');
            }}
            onNextWord={handleNextWord}
          />
        )}

        {activeMode === 'boss_battle' && (
          <BossBattleMode
            world={activeWorld}
            words={getWordsByLevel(activeWorld.id === 'world-1' ? 1 : 2)}
            onVictory={() => {
              completeStage(worldIdParam, 6, 3, 1000);
            }}
            onRetry={() => {
              handleModeChange('spell_it');
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full" />
        </div>
      }
    >
      <PlayHubContent />
    </Suspense>
  );
}
