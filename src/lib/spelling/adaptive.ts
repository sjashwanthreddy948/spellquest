import { MistakeType, SpellingWord, SRSItem, WordAttempt } from '@/types';
import { getDueWords, getWeakWords } from './srs';

export interface AdaptiveProfile {
  consecutiveMistakes: number;
  consecutiveCorrect: number;
  recentAccuracy: number; // 0 - 100 over last 10 attempts
  averageResponseTimeMs: number;
  activeWeakPatterns: Record<string, number>;
  difficultyModifier: number; // -1 (easier), 0 (normal), +1 (boost)
  inFrustrationMode: boolean;
}

/**
 * Evaluates recent attempt history and updates adaptive state
 */
export function analyzePerformance(recentAttempts: WordAttempt[]): AdaptiveProfile {
  if (!recentAttempts || recentAttempts.length === 0) {
    return {
      consecutiveMistakes: 0,
      consecutiveCorrect: 0,
      recentAccuracy: 100,
      averageResponseTimeMs: 4000,
      activeWeakPatterns: {},
      difficultyModifier: 0,
      inFrustrationMode: false,
    };
  }

  // Last 10 attempts
  const windowAttempts = recentAttempts.slice(-10);
  const correctCount = windowAttempts.filter((a) => a.isCorrect).length;
  const recentAccuracy = Math.round((correctCount / windowAttempts.length) * 100);

  const totalTime = windowAttempts.reduce((acc, curr) => acc + curr.responseTimeMs, 0);
  const averageResponseTimeMs = Math.round(totalTime / windowAttempts.length);

  // Consecutive checks from the end
  let consecutiveMistakes = 0;
  let consecutiveCorrect = 0;

  for (let i = recentAttempts.length - 1; i >= 0; i--) {
    if (!recentAttempts[i].isCorrect) {
      if (consecutiveCorrect === 0) consecutiveMistakes++;
      else break;
    } else {
      if (consecutiveMistakes === 0) consecutiveCorrect++;
      else break;
    }
  }

  // Count mistake pattern frequencies
  const activeWeakPatterns: Record<string, number> = {};
  recentAttempts.slice(-20).forEach((attempt) => {
    if (!attempt.isCorrect && attempt.mistakeType) {
      activeWeakPatterns[attempt.mistakeType] = (activeWeakPatterns[attempt.mistakeType] || 0) + 1;
    }
  });

  // Anti-frustration condition: 2 or more mistakes in a row or < 40% recent accuracy
  const inFrustrationMode = consecutiveMistakes >= 2 || (windowAttempts.length >= 5 && recentAccuracy < 40);

  let difficultyModifier = 0;
  if (inFrustrationMode) {
    difficultyModifier = -1; // Drop difficulty for confidence building
  } else if (consecutiveCorrect >= 4 && recentAccuracy >= 85) {
    difficultyModifier = 1; // Increase difficulty gradually
  }

  return {
    consecutiveMistakes,
    consecutiveCorrect,
    recentAccuracy,
    averageResponseTimeMs,
    activeWeakPatterns,
    difficultyModifier,
    inFrustrationMode,
  };
}

/**
 * 60 / 20 / 15 / 5 Smart Word Selection Algorithm
 *
 * 60% appropriate new words matching student level and stage
 * 20% previously difficult words from SRS queue
 * 15% mastered reinforcement to keep confidence high
 * 5% surprise challenge (slight stretch above current level)
 */
export function selectNextAdaptiveWord(
  allWords: SpellingWord[],
  srsQueue: SRSItem[],
  studentLevel: number,
  adaptiveProfile: AdaptiveProfile,
  excludeWordIds: string[] = []
): { word: SpellingWord; selectionType: 'new' | 'srs_review' | 'reinforcement' | 'challenge' | 'anti_frustration' } {
  // Filter out recently practiced words in the same session
  const availablePool = allWords.filter((w) => !excludeWordIds.includes(w.id));
  const pool = availablePool.length > 0 ? availablePool : allWords;

  // 1. Anti-frustration intervention
  if (adaptiveProfile.inFrustrationMode) {
    // Check if there is a specific pattern weakness (e.g. double_letter, suffix_ful)
    const weakPatterns = Object.entries(adaptiveProfile.activeWeakPatterns).sort((a, b) => b[1] - a[1]);
    const topWeakness = weakPatterns.length > 0 ? weakPatterns[0][0] : null;

    // Pick an easier word at (studentLevel - 1) or difficulty 1-2 with comforting pattern
    const easyWords = pool.filter(
      (w) => w.difficulty <= 2 || w.level <= Math.max(1, studentLevel - 1)
    );

    if (topWeakness) {
      const patternWord = easyWords.find((w) => w.spelling_pattern.includes(topWeakness));
      if (patternWord) return { word: patternWord, selectionType: 'anti_frustration' };
    }

    if (easyWords.length > 0) {
      const randomEasy = easyWords[Math.floor(Math.random() * easyWords.length)];
      return { word: randomEasy, selectionType: 'anti_frustration' };
    }
  }

  // 2. Probabilistic word picker based on 60 / 20 / 15 / 5 distribution
  const rand = Math.random() * 100;

  // 20% SRS review due
  if (rand < 20) {
    const dueQueue = getDueWords(srsQueue);
    if (dueQueue.length > 0) {
      const targetItem = dueQueue[Math.floor(Math.random() * dueQueue.length)];
      const matchWord = pool.find((w) => w.id === targetItem.wordId || w.word.toLowerCase() === targetItem.word.toLowerCase());
      if (matchWord) return { word: matchWord, selectionType: 'srs_review' };
    }

    const weakQueue = getWeakWords(srsQueue);
    if (weakQueue.length > 0) {
      const targetItem = weakQueue[Math.floor(Math.random() * weakQueue.length)];
      const matchWord = pool.find((w) => w.id === targetItem.wordId || w.word.toLowerCase() === targetItem.word.toLowerCase());
      if (matchWord) return { word: matchWord, selectionType: 'srs_review' };
    }
  }

  // 15% Mastered reinforcement (for confidence and retention verification)
  if (rand >= 20 && rand < 35) {
    const masteredItems = srsQueue.filter((i) => i.status === 'mastered');
    if (masteredItems.length > 0) {
      const targetItem = masteredItems[Math.floor(Math.random() * masteredItems.length)];
      const matchWord = pool.find((w) => w.id === targetItem.wordId || w.word.toLowerCase() === targetItem.word.toLowerCase());
      if (matchWord) return { word: matchWord, selectionType: 'reinforcement' };
    }
  }

  // 5% Surprise challenge (stretch word)
  if (rand >= 95) {
    const challengeWords = pool.filter((w) => w.level === studentLevel + 1 || w.difficulty >= 4);
    if (challengeWords.length > 0) {
      const word = challengeWords[Math.floor(Math.random() * challengeWords.length)];
      return { word, selectionType: 'challenge' };
    }
  }

  // 60% (Default) Target level new words
  const effectiveLevel = Math.max(1, Math.min(5, studentLevel + adaptiveProfile.difficultyModifier));
  const levelWords = pool.filter((w) => w.level === effectiveLevel);

  if (levelWords.length > 0) {
    const word = levelWords[Math.floor(Math.random() * levelWords.length)];
    return { word, selectionType: 'new' };
  }

  // Fallback to random word in pool
  const fallback = pool[Math.floor(Math.random() * pool.length)];
  return { word: fallback, selectionType: 'new' };
}
