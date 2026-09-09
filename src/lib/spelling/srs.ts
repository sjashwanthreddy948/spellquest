import { SRSItem } from '@/types';

// Intervals in days: immediate (same session), 4 hours (0.17 days), 1 day, 3 days, 7 days, 14 days
const INTERVAL_DAYS = [0, 0.17, 1, 3, 7, 14];
const MASTERY_REPETITIONS_REQUIRED = 4; // Word must be correctly recalled across at least 4 intervals

/**
 * Calculates next review timestamp based on days from now
 */
export function calculateNextReviewDate(days: number): string {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  return date.toISOString();
}

/**
 * Updates an SRS item after an attempt according to SM-2/Leitner spacing
 */
export function recordSRSAttempt(
  existingItem: SRSItem | undefined,
  wordId: string,
  word: string,
  isCorrect: boolean
): { item: SRSItem; isNowMastered: boolean } {
  const nowStr = new Date().toISOString();

  if (!existingItem) {
    // First time word is tracked
    if (isCorrect) {
      const nextDate = calculateNextReviewDate(INTERVAL_DAYS[1]);
      return {
        item: {
          wordId,
          word,
          intervalDays: INTERVAL_DAYS[1],
          easeFactor: 2.5,
          repetitions: 1,
          nextReviewDate: nextDate,
          lastReviewedDate: nowStr,
          status: 'learning',
          consecutiveCorrect: 1,
        },
        isNowMastered: false,
      };
    } else {
      // Mistake: queue for immediate review in same session
      return {
        item: {
          wordId,
          word,
          intervalDays: 0,
          easeFactor: 2.3,
          repetitions: 0,
          nextReviewDate: nowStr,
          lastReviewedDate: nowStr,
          status: 'learning',
          consecutiveCorrect: 0,
        },
        isNowMastered: false,
      };
    }
  }

  // Updating existing item
  let repetitions = existingItem.repetitions;
  let consecutiveCorrect = existingItem.consecutiveCorrect;
  let easeFactor = existingItem.easeFactor;
  let intervalDays = existingItem.intervalDays;
  let isNowMastered = false;

  if (isCorrect) {
    consecutiveCorrect += 1;
    repetitions += 1;
    easeFactor = Math.min(2.8, easeFactor + 0.1);

    // Pick next interval index
    const intervalIdx = Math.min(repetitions, INTERVAL_DAYS.length - 1);
    intervalDays = INTERVAL_DAYS[intervalIdx];

    // Check mastery condition: at least 4 successful intervals & 3+ consecutive correct
    if (repetitions >= MASTERY_REPETITIONS_REQUIRED && consecutiveCorrect >= 3) {
      isNowMastered = existingItem.status !== 'mastered';
    }
  } else {
    // On mistake: reset consecutive correct and drop back to interval 0 or 1
    consecutiveCorrect = 0;
    repetitions = Math.max(0, repetitions - 1);
    easeFactor = Math.max(1.3, easeFactor - 0.2);
    intervalDays = 0; // Immediate re-test
  }

  const status: 'learning' | 'reviewing' | 'mastered' =
    repetitions >= MASTERY_REPETITIONS_REQUIRED && consecutiveCorrect >= 3
      ? 'mastered'
      : repetitions > 1
      ? 'reviewing'
      : 'learning';

  const nextReviewDate = intervalDays === 0 ? nowStr : calculateNextReviewDate(intervalDays);

  return {
    item: {
      ...existingItem,
      intervalDays,
      easeFactor,
      repetitions,
      nextReviewDate,
      lastReviewedDate: nowStr,
      status,
      consecutiveCorrect,
    },
    isNowMastered,
  };
}

/**
 * Returns all words due for review right now
 */
export function getDueWords(queue: SRSItem[]): SRSItem[] {
  const now = new Date().getTime();
  return queue.filter((item) => {
    if (item.status === 'mastered') return false;
    const dueTime = new Date(item.nextReviewDate).getTime();
    return dueTime <= now;
  });
}

/**
 * Returns words currently in the learning queue (needing revision)
 */
export function getWeakWords(queue: SRSItem[]): SRSItem[] {
  return queue.filter((item) => item.status === 'learning' || item.consecutiveCorrect < 2);
}

/**
 * Returns statistics for dashboard charts
 */
export function getSRSStats(queue: SRSItem[]) {
  const total = queue.length;
  const mastered = queue.filter((item) => item.status === 'mastered').length;
  const reviewing = queue.filter((item) => item.status === 'reviewing').length;
  const learning = queue.filter((item) => item.status === 'learning').length;
  const due = getDueWords(queue).length;

  return {
    total,
    mastered,
    reviewing,
    learning,
    due,
    masteryRate: total > 0 ? Math.round((mastered / total) * 100) : 0,
  };
}
