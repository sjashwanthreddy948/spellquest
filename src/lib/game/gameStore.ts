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
import { getFreshWorlds } from '@/data/worlds';
import { getFreshAchievements, getFreshDailyMissions } from '@/data/achievements';
import { recordSRSAttempt } from '@/lib/spelling/srs';
import { getSupabase } from '@/lib/supabase/client';

export const STORAGE_KEY = 'spellquest_game_state_v3';
export const USERS_REGISTRY_KEY = 'spellquest_user_accounts_v3';

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

// Clean Guest profile for unauthenticated visitors
export const GUEST_PROFILE: StudentProfile = {
  id: 'guest',
  name: 'Guest Speller',
  grade: 'Grade 3',
  level: 1,
  xp: 0,
  coins: 0,
  streakDays: 0,
  lastActiveDate: new Date().toISOString(),
  completedAssessment: false,
  activeWorldId: 'world-1',
  currentStage: 1,
  hearts: 3,
  maxHearts: 3,
  avatar: '🧙‍♀️',
  title: 'Apprentice Speller',
  companion: 'Sparky the Dragon 🐲',
  unlockedAvatars: ['🧙‍♀️', '🦊', '🚀', '🐱', '🤖'],
  unlockedTitles: ['Apprentice Speller'],
  unlockedCompanions: ['Sparky the Dragon 🐲'],
};

export const INITIAL_GAME_STATE: GameState = {
  currentUser: {
    name: 'Guest',
    isLoggedIn: false,
  },
  profile: GUEST_PROFILE,
  worlds: getFreshWorlds(),
  srsQueue: [],
  attempts: [],
  dailyMissions: getFreshDailyMissions(),
  achievements: getFreshAchievements(),
  userRole: 'student',
  parentPin: '1234',
  justUnlockedStage: null,
};

export function getUserRegistry(): Record<string, GameState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(USERS_REGISTRY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveUserToRegistry(contactOrKey: string, userState: GameState) {
  if (typeof window === 'undefined' || !contactOrKey) return;
  try {
    const registry = getUserRegistry();
    const key = contactOrKey.toLowerCase().trim();
    registry[key] = userState;
    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(registry));
  } catch (e) {
    console.warn('Failed to save to user registry', e);
  }
}

export function useGameStore() {
  const [state, setState] = useState<GameState>(INITIAL_GAME_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      // Clear legacy storage keys and mock accounts
      if (localStorage.getItem('spellquest_game_state_v2')) {
        localStorage.removeItem('spellquest_game_state_v2');
      }
      if (localStorage.getItem('spellquest_game_state')) {
        localStorage.removeItem('spellquest_game_state');
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Avoid leaking any legacy mock student
        if (parsed.profile?.id === 'student-maya-01' || parsed.currentUser?.email === 'maya@spellquest.app') {
          localStorage.removeItem(STORAGE_KEY);
          setState(INITIAL_GAME_STATE);
        } else {
          setState(parsed);
        }
      } else {
        setState(INITIAL_GAME_STATE);
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
      const key = nextState.currentUser?.contact || nextState.currentUser?.email;
      if (nextState.currentUser?.isLoggedIn && key) {
        saveUserToRegistry(key, nextState);
      }
    } catch (e) {
      console.warn('Could not write game state to localStorage', e);
    }
  };

  const login = async (name: string, contact: string) => {
    const resolvedName = name.trim() || 'Young Adventurer';
    const normalizedContact = contact.trim().toLowerCase();
    const registry = getUserRegistry();

    let nextState: GameState;
    if (registry[normalizedContact]) {
      // Restore user's exact recorded progress
      const saved = registry[normalizedContact];
      nextState = {
        ...saved,
        currentUser: {
          ...saved.currentUser,
          contact: contact.trim(),
          email: contact.includes('@') ? contact.trim() : undefined,
          name: resolvedName || saved.currentUser.name,
          isLoggedIn: true,
        },
        profile: {
          ...saved.profile,
          name: resolvedName || saved.profile.name,
          contact: contact.trim(),
        },
      };
    } else {
      // New login for this contact - create fresh profile
      nextState = {
        ...INITIAL_GAME_STATE,
        currentUser: {
          contact: contact.trim(),
          email: contact.includes('@') ? contact.trim() : undefined,
          name: resolvedName,
          isLoggedIn: true,
        },
        profile: {
          ...GUEST_PROFILE,
          id: `student-${Date.now()}`,
          name: resolvedName,
          contact: contact.trim(),
          level: 1,
          xp: 0,
          coins: 50,
          streakDays: 1,
          currentStage: 1,
        },
        worlds: getFreshWorlds(),
        attempts: [],
        srsQueue: [],
        dailyMissions: getFreshDailyMissions(),
        achievements: getFreshAchievements(),
      };
    }

    persist(nextState);
    return true;
  };

  const register = async (
    name: string,
    contact: string,
    spellingLevel: number = 1,
    companionId: string = 'sparky',
    avatar: string = '🧙‍♀️'
  ) => {
    const resolvedName = name.trim() || 'Young Adventurer';
    const normalizedContact = contact.trim().toLowerCase();
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
      ...INITIAL_GAME_STATE,
      currentUser: {
        contact: contact.trim(),
        email: contact.includes('@') ? contact.trim() : undefined,
        name: resolvedName,
        isLoggedIn: true,
      },
      profile: {
        ...GUEST_PROFILE,
        id: `student-${Date.now()}`,
        name: resolvedName,
        contact: contact.trim(),
        grade: gradeString,
        level: spellingLevel,
        spellingLevel,
        title: titlesByLevel[spellingLevel] || 'Apprentice Speller',
        companion: companionNames[companionId] || 'Sparky the Dragon 🐲',
        companionId,
        avatar,
        xp: 0,
        coins: 50,
        streakDays: 1,
        currentStage: 1,
        completedAssessment: false,
      },
      worlds: getFreshWorlds(),
      attempts: [],
      srsQueue: [],
      dailyMissions: getFreshDailyMissions(),
      achievements: getFreshAchievements(),
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
    const key = state.currentUser?.contact || state.currentUser?.email;
    if (key) {
      saveUserToRegistry(key, state);
    }
    // Revert to clean guest
    const guestState: GameState = {
      ...INITIAL_GAME_STATE,
      worlds: getFreshWorlds(),
      attempts: [],
      srsQueue: [],
      dailyMissions: getFreshDailyMissions(),
      achievements: getFreshAchievements(),
    };
    persist(guestState);
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
    // Only record attempts and learning stats after student has logged in
    if (!state.currentUser?.isLoggedIn) {
      return { xpBonus: 0, coinBonus: 0, isNowMastered: false };
    }
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
