'use client';

import { useEffect, useState } from 'react';
import {
  Achievement,
  DailyMission,
  GameWorld,
  SpellingWord,
  SRSItem,
  StudentProfile,
  WordAttempt,
} from '@/types';
import { GAME_WORLDS } from '@/data/worlds';
import { INITIAL_ACHIEVEMENTS, INITIAL_DAILY_MISSIONS } from '@/data/achievements';
import { recordSRSAttempt } from '@/lib/spelling/srs';
import { getSupabase } from '@/lib/supabase/client';

const STORAGE_KEY = 'spellquest_game_state_v2';

export interface AuthUser {
  contact?: string;
  email?: string;
  name: string;
  isLoggedIn: boolean;
}

export interface UnlockedStageNotification {
  worldId: string;
  stageNumber: number;
  stageTitle: string;
}

export interface GameState {
  currentUser: AuthUser;
  profile: StudentProfile;
  worlds: GameWorld[];
  srsQueue: SRSItem[];
  attempts: WordAttempt[];
  dailyMissions: DailyMission[];
  achievements: Achievement[];
  userRole: 'student' | 'parent';
  parentPin: string;
  justUnlockedStage: UnlockedStageNotification | null;
}

// Initial default profile representing our 5th-grade learner
const DEFAULT_PROFILE: StudentProfile = {
  id: 'student-maya-01',
  name: 'Maya',
  grade: 'Grade 5',
  level: 3,
  xp: 12450,
  coins: 480,
  streakDays: 8,
  lastActiveDate: new Date().toISOString(),
  completedAssessment: true,
  activeWorldId: 'world-1',
  currentStage: 2,
  hearts: 3,
  maxHearts: 3,
  avatar: '🧙‍♀️',
  title: 'Word Explorer',
  companion: 'Sparky the Dragon 🐲',
  unlockedAvatars: ['🧙‍♀️', '🦊', '🚀', '🐱', '🤖'],
  unlockedTitles: ['Word Explorer', 'Spelling Knight', 'Pattern Seeker'],
  unlockedCompanions: ['Sparky the Dragon 🐲', 'Barnaby the Owl 🦉'],
};

// Seed 30-day attempt history to populate reports & graphs realistically
function generateSeedAttempts(): WordAttempt[] {
  const attempts: WordAttempt[] = [];
  const wordsList = ['beautiful', 'necessary', 'environment', 'running', 'school', 'friend', 'together', 'important'];
  const now = Date.now();

  for (let day = 14; day >= 0; day--) {
    const dayTimestamp = now - day * 86400000;
    const attemptsCount = 4 + Math.floor(Math.random() * 5);

    for (let i = 0; i < attemptsCount; i++) {
      const isPast = day > 7;
      const isCorrect = Math.random() < (isPast ? 0.62 : 0.83);
      const word = wordsList[Math.floor(Math.random() * wordsList.length)];

      attempts.push({
        id: `att-seed-${day}-${i}`,
        studentId: 'student-maya-01',
        wordId: `w-${word}`,
        word,
        submittedAnswer: isCorrect ? word : word.slice(0, -1),
        isCorrect,
        attemptNumber: isCorrect ? 1 : 2,
        responseTimeMs: 2200 + Math.floor(Math.random() * 1500),
        hintUsed: false,
        mistakeType: isCorrect ? undefined : 'double_letter',
        timestamp: new Date(dayTimestamp + i * 300000).toISOString(),
        gameMode: 'spell_it',
      });
    }
  }

  return attempts;
}

const SEED_SRS_QUEUE: SRSItem[] = [
  { wordId: 'w-l3-001', word: 'beautiful', intervalDays: 7, easeFactor: 2.6, repetitions: 4, nextReviewDate: new Date(Date.now() + 5 * 86400000).toISOString(), lastReviewedDate: new Date().toISOString(), status: 'mastered', consecutiveCorrect: 4 },
  { wordId: 'w-l2-001', word: 'school', intervalDays: 14, easeFactor: 2.7, repetitions: 5, nextReviewDate: new Date(Date.now() + 10 * 86400000).toISOString(), lastReviewedDate: new Date().toISOString(), status: 'mastered', consecutiveCorrect: 5 },
  { wordId: 'w-l2-007', word: 'careful', intervalDays: 3, easeFactor: 2.4, repetitions: 3, nextReviewDate: new Date(Date.now() + 2 * 86400000).toISOString(), lastReviewedDate: new Date().toISOString(), status: 'reviewing', consecutiveCorrect: 2 },
  { wordId: 'w-l4-001', word: 'necessary', intervalDays: 1, easeFactor: 2.2, repetitions: 1, nextReviewDate: new Date(Date.now() - 3600000).toISOString(), lastReviewedDate: new Date().toISOString(), status: 'learning', consecutiveCorrect: 0 },
  { wordId: 'w-l4-002', word: 'environment', intervalDays: 0, easeFactor: 2.1, repetitions: 0, nextReviewDate: new Date().toISOString(), lastReviewedDate: new Date().toISOString(), status: 'learning', consecutiveCorrect: 0 },
  { wordId: 'w-l3-003', word: 'different', intervalDays: 7, easeFactor: 2.5, repetitions: 4, nextReviewDate: new Date(Date.now() + 4 * 86400000).toISOString(), lastReviewedDate: new Date().toISOString(), status: 'mastered', consecutiveCorrect: 4 },
];

export const INITIAL_GAME_STATE: GameState = {
  currentUser: {
    email: 'maya@spellquest.app',
    name: 'Maya',
    isLoggedIn: true,
  },
  profile: DEFAULT_PROFILE,
  worlds: GAME_WORLDS,
  srsQueue: SEED_SRS_QUEUE,
  attempts: generateSeedAttempts(),
  dailyMissions: INITIAL_DAILY_MISSIONS,
  achievements: INITIAL_ACHIEVEMENTS,
  userRole: 'student',
  parentPin: '1234',
  justUnlockedStage: null,
};

export function useGameStore() {
  const [state, setState] = useState<GameState>(INITIAL_GAME_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState(parsed);
      }
    } catch (e) {
      console.warn('Could not read game state from localStorage', e);
    }
    setIsHydrated(true);
  }, []);

  const persist = (nextState: GameState) => {
    setState(nextState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (e) {
      console.warn('Could not write game state to localStorage', e);
    }
  };

  const login = async (name: string, contact: string) => {
    const resolvedName = name.trim() || 'Young Adventurer';
    const resolvedContact = contact.trim();
    const nextState: GameState = {
      ...state,
      currentUser: {
        contact: resolvedContact,
        email: resolvedContact.includes('@') ? resolvedContact : undefined,
        name: resolvedName,
        isLoggedIn: true,
      },
      profile: {
        ...state.profile,
        name: resolvedName,
        contact: resolvedContact,
      },
    };
    persist(nextState);
    return true;
  };

  const register = async (
    name: string,
    contact: string,
    spellingLevel: number = 3,
    companionId: string = 'sparky',
    avatar: string = '🧙‍♀️'
  ) => {
    const resolvedName = name.trim() || 'Young Adventurer';
    const resolvedContact = contact.trim();
    const gradeNumber = Math.min(6, Math.max(3, spellingLevel + 2));
    const gradeString = `Grade ${gradeNumber}`;

    const titlesByLevel: Record<number, string> = {
      1: 'Apprentice Speller',
      2: 'Word Explorer',
      3: 'Spelling Champion',
      4: 'Master Wizard',
    };

    const companionNames: Record<string, string> = {
      sparky: 'Sparky the Dragon 🐲',
      pip: 'Pip the Wizard Owl 🦉',
      luna: 'Luna the Star Fox 🦊',
      barnaby: 'Barnaby the Bear 🐻',
    };

    const nextState: GameState = {
      ...state,
      currentUser: {
        contact: resolvedContact,
        email: resolvedContact.includes('@') ? resolvedContact : undefined,
        name: resolvedName,
        isLoggedIn: true,
      },
      profile: {
        ...state.profile,
        name: resolvedName,
        contact: resolvedContact,
        grade: gradeString,
        level: spellingLevel,
        spellingLevel,
        title: titlesByLevel[spellingLevel] || 'Spelling Champion',
        companion: companionNames[companionId] || state.profile.companion,
        companionId,
        avatar,
      },
    };
    persist(nextState);
    return true;
  };

  const logout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign out error:', err);
      }
    }
    const nextState: GameState = {
      ...state,
      currentUser: { email: '', name: 'Guest', isLoggedIn: false },
    };
    persist(nextState);
  };

  const recordAttempt = (
    word: SpellingWord,
    submittedAnswer: string,
    isCorrect: boolean,
    responseTimeMs: number,
    hintUsed: boolean,
    gameMode: any,
    attemptNumber: number = 1,
    cluesCount: number = 0
  ) => {
    const cluesUsed = cluesCount > 0 ? cluesCount : (hintUsed ? 1 : 0);
    const newAttempt: WordAttempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      studentId: state.profile.id,
      wordId: word.id,
      word: word.word,
      submittedAnswer,
      isCorrect,
      attemptNumber,
      responseTimeMs,
      hintUsed,
      cluesUsed,
      mistakeType: isCorrect ? undefined : word.spelling_pattern as any,
      timestamp: new Date().toISOString(),
      gameMode,
    };

    const existingSRS = state.srsQueue.find((i) => i.wordId === word.id || i.word.toLowerCase() === word.word.toLowerCase());
    const { item: updatedSRS, isNowMastered } = recordSRSAttempt(existingSRS, word.id, word.word, isCorrect);

    const nextSRSQueue = existingSRS
      ? state.srsQueue.map((i) => (i.wordId === updatedSRS.wordId ? updatedSRS : i))
      : [...state.srsQueue, updatedSRS];

    // Base XP: 100 for 1st attempt, 50 for 2nd attempt
    // Every clue deducts 25 XP (and 2 coins) from the points gained!
    const baseXp = attemptNumber === 1 ? 100 : 50;
    const deduction = cluesUsed * (attemptNumber === 1 ? 25 : 10);
    const xpBonus = isCorrect ? Math.max(25, baseXp - deduction) : 10;
    const coinBonus = isCorrect ? Math.max(2, 10 - cluesUsed * 2) : 1;

    const nextMissions = state.dailyMissions.map((m) => {
      if (m.id === 'm-1') {
        const nextCur = Math.min(m.target, m.current + 1);
        return { ...m, current: nextCur, completed: nextCur >= m.target };
      }
      if (m.id === 'm-2' && isNowMastered) {
        const nextCur = Math.min(m.target, m.current + 1);
        return { ...m, current: nextCur, completed: nextCur >= m.target };
      }
      return m;
    });

    const nextProfile: StudentProfile = {
      ...state.profile,
      xp: state.profile.xp + xpBonus,
      coins: state.profile.coins + coinBonus,
      level: Math.floor((state.profile.xp + xpBonus) / 4000) + 1,
    };

    const nextState: GameState = {
      ...state,
      profile: nextProfile,
      attempts: [...state.attempts, newAttempt],
      srsQueue: nextSRSQueue,
      dailyMissions: nextMissions,
    };

    persist(nextState);
    return { xpBonus, coinBonus, isNowMastered };
  };

  const completeStage = (worldId: string, stageNumber: number, starsEarned: number, score: number) => {
    let unlockedStageInfo: UnlockedStageNotification | null = null;

    const nextWorlds = state.worlds.map((w) => {
      if (w.id !== worldId) return w;

      const nextStages = w.stages.map((st) => {
        if (st.stageNumber === stageNumber) {
          return {
            ...st,
            stars: Math.max(st.stars, starsEarned),
            highScore: Math.max(st.highScore, score),
          };
        }
        // Unlock next stage if this one completed with >= 1 star
        if (st.stageNumber === stageNumber + 1 && starsEarned >= 1) {
          if (!st.unlocked) {
            unlockedStageInfo = {
              worldId,
              stageNumber: st.stageNumber,
              stageTitle: st.title,
            };
          }
          return { ...st, unlocked: true };
        }
        return st;
      });

      return { ...w, stages: nextStages };
    });

    const nextProfile = {
      ...state.profile,
      coins: state.profile.coins + starsEarned * 20,
      xp: state.profile.xp + starsEarned * 150,
      currentStage: Math.max(state.profile.currentStage, stageNumber + 1),
    };

    persist({
      ...state,
      worlds: nextWorlds,
      profile: nextProfile,
      justUnlockedStage: unlockedStageInfo || state.justUnlockedStage,
    });
  };

  const clearStageUnlockCelebration = () => {
    persist({ ...state, justUnlockedStage: null });
  };

  const unlockWorld = (worldId: string) => {
    const nextWorlds = state.worlds.map((w) => (w.id === worldId ? { ...w, unlocked: true } : w));
    persist({ ...state, worlds: nextWorlds });
  };

  const setRole = (role: 'student' | 'parent') => {
    persist({ ...state, userRole: role });
  };

  const updateProfile = (partial: Partial<StudentProfile>) => {
    persist({ ...state, profile: { ...state.profile, ...partial } });
  };

  const buyItem = (type: 'avatar' | 'title' | 'companion', name: string, price: number): boolean => {
    if (state.profile.coins < price) return false;

    const nextCoins = state.profile.coins - price;
    const nextProfile = { ...state.profile, coins: nextCoins };

    if (type === 'avatar') {
      nextProfile.unlockedAvatars = [...nextProfile.unlockedAvatars, name];
      nextProfile.avatar = name;
    } else if (type === 'title') {
      nextProfile.unlockedTitles = [...nextProfile.unlockedTitles, name];
      nextProfile.title = name;
    } else if (type === 'companion') {
      nextProfile.unlockedCompanions = [...nextProfile.unlockedCompanions, name];
      nextProfile.companion = name;
    }

    persist({ ...state, profile: nextProfile });
    return true;
  };

  return {
    state,
    isHydrated,
    login,
    register,
    logout,
    recordAttempt,
    completeStage,
    clearStageUnlockCelebration,
    unlockWorld,
    setRole,
    updateProfile,
    buyItem,
  };
}
