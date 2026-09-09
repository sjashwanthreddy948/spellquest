export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type SpellingPattern =
  | 'basic_cvc'
  | 'short_vowel'
  | 'long_vowel'
  | 'double_letter'
  | 'silent_letter'
  | 'vowel_combination'
  | 'suffix_ful'
  | 'suffix_less'
  | 'suffix_ly'
  | 'suffix_ing'
  | 'suffix_ed'
  | 'suffix_tion'
  | 'prefix_un'
  | 'prefix_dis'
  | 'prefix_re'
  | 'tricky_vowel'
  | 'compound'
  | 'academic'
  | 'general';

export type MistakeType =
  | 'double_letter'
  | 'silent_letter'
  | 'vowel_confusion'
  | 'suffix_prefix'
  | 'missing_letter'
  | 'extra_letter'
  | 'transposition'
  | 'phonetic_substitution'
  | 'general_typo';

export interface SpellingWord {
  id: string;
  word: string;
  difficulty: DifficultyLevel;
  level: number; // 1 to 5+
  category: string;
  word_length: number;
  syllables: string[];
  spelling_pattern: SpellingPattern;
  common_mistakes: string[];
  example_sentence: string;
  hint: string;
  pronunciation_guide: string;
  definition: string;
  mnemonic?: string;
}

export type DiffTokenType = 'match' | 'insert' | 'delete' | 'substitute';

export interface DiffToken {
  type: DiffTokenType;
  char: string;
  expectedChar?: string;
  index: number;
}

export interface VerificationResult {
  isCorrect: boolean;
  inputWord: string;
  targetWord: string;
  diffTokens: DiffToken[];
  mistakeType?: MistakeType;
  mistakeExplanation?: string;
  mnemonic?: string;
  encouragement: string;
  baseXp?: number;
  cluesDeduction?: number;
  cluesUsed?: number;
  xpEarned: number;
  coinsEarned: number;
  isFirstAttempt: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  contact?: string; // Mobile phone number or Email ID
  grade: string;
  level: number; // 1 to 5+
  spellingLevel?: number; // 1: Grade 3 Apprentice, 2: Grade 4 Explorer, 3: Grade 5 Champion, 4: Grade 6 Wizard
  xp: number;
  coins: number;
  streakDays: number;
  lastActiveDate: string;
  completedAssessment: boolean;
  activeWorldId: string;
  currentStage: number;
  hearts: number;
  maxHearts: number;
  avatar: string;
  title: string;
  companion: string;
  companionId?: string;
  unlockedAvatars: string[];
  unlockedTitles: string[];
  unlockedCompanions: string[];
}

export type GameMode =
  | 'spell_it'
  | 'speed_spell'
  | 'missing_letters'
  | 'word_scramble'
  | 'find_mistake'
  | 'memory_challenge'
  | 'boss_battle';

export interface WordAttempt {
  id: string;
  studentId: string;
  wordId: string;
  word: string;
  submittedAnswer: string;
  isCorrect: boolean;
  attemptNumber: number;
  responseTimeMs: number;
  hintUsed: boolean;
  cluesUsed?: number;
  mistakeType?: MistakeType;
  timestamp: string;
  gameMode: GameMode;
}

export interface SRSItem {
  wordId: string;
  word: string;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewedDate: string;
  status: 'learning' | 'reviewing' | 'mastered';
  consecutiveCorrect: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  rewardXp: number;
  rewardCoins: number;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'accuracy' | 'streak' | 'mastery' | 'adventure' | 'speed';
}

export interface WorldStage {
  stageNumber: number;
  title: string;
  description: string;
  isBoss: boolean;
  stars: number; // 0-3
  unlocked: boolean;
  highScore: number;
  wordsCount: number;
}

export interface GameWorld {
  id: string;
  name: string;
  icon: string;
  themeColor: string;
  bgGradient: string;
  description: string;
  levelRange: string;
  requiredXp: number;
  unlocked: boolean;
  bossName: string;
  bossAvatar: string;
  bossHp: number;
  stages: WorldStage[];
}

export interface AssessmentQuestion {
  word: SpellingWord;
  category: string;
}

export interface AssessmentResult {
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  averageResponseTimeMs: number;
  recommendedLevel: number;
  recommendedWorldId: string;
  patternStrengths: Record<string, number>;
  patternWeaknesses: Record<string, number>;
  summaryMessage: string;
}
