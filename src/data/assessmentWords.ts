import { AssessmentQuestion, AssessmentResult, SpellingWord } from '@/types';
import { CURATED_WORDS } from './words';

// Calibrated 25-word diagnostic battery spanning Grades 1 to 7/8
export const ASSESSMENT_WORDS: AssessmentQuestion[] = [
  // Tier 1: Foundation (Very easy)
  { word: CURATED_WORDS.find((w) => w.word === 'sun')!, category: 'Foundation CVC' },
  { word: CURATED_WORDS.find((w) => w.word === 'jump')!, category: 'Foundation Blend' },
  { word: CURATED_WORDS.find((w) => w.word === 'star')!, category: 'Foundation Vowel' },
  { word: CURATED_WORDS.find((w) => w.word === 'rain')!, category: 'Foundation Team' },
  { word: CURATED_WORDS.find((w) => w.word === 'book')!, category: 'Double Vowel' },

  // Tier 2: Basic School & Consonant Blends
  { word: CURATED_WORDS.find((w) => w.word === 'garden')!, category: 'Basic Compound' },
  { word: CURATED_WORDS.find((w) => w.word === 'teacher')!, category: 'Basic Suffix' },
  { word: CURATED_WORDS.find((w) => w.word === 'running')!, category: 'Doubled Consonant' },
  { word: CURATED_WORDS.find((w) => w.word === 'careful')!, category: 'Suffix -ful' },
  { word: CURATED_WORDS.find((w) => w.word === 'knife')!, category: 'Silent Consonant' },

  // Tier 3: Intermediate 5th-Grade Vocabulary
  { word: CURATED_WORDS.find((w) => w.word === 'school')!, category: 'Silent H Pattern' },
  { word: CURATED_WORDS.find((w) => w.word === 'friend')!, category: 'Vowel Team ie/ei' },
  { word: CURATED_WORDS.find((w) => w.word === 'beautiful')!, category: 'Multi-Syllable Suffix' },
  { word: CURATED_WORDS.find((w) => w.word === 'important')!, category: 'Multi-Syllable Academic' },
  { word: CURATED_WORDS.find((w) => w.word === 'different')!, category: 'Double Letter Medial' },

  // Tier 4: Tricky Spellings & Confusing Words
  { word: CURATED_WORDS.find((w) => w.word === 'doubt')!, category: 'Silent B' },
  { word: CURATED_WORDS.find((w) => w.word === 'science')!, category: 'Silent C Pattern' },
  { word: CURATED_WORDS.find((w) => w.word === 'island')!, category: 'Silent S Pattern' },
  { word: CURATED_WORDS.find((w) => w.word === 'believe')!, category: 'Vowel Rule ie' },
  { word: CURATED_WORDS.find((w) => w.word === 'remember')!, category: 'Syllabic Repetition' },

  // Tier 5: Advanced & Academic Vocabulary
  { word: CURATED_WORDS.find((w) => w.word === 'necessary')!, category: 'Double S / Single C' },
  { word: CURATED_WORDS.find((w) => w.word === 'environment')!, category: 'Silent N in Stem' },
  { word: CURATED_WORDS.find((w) => w.word === 'knowledge')!, category: 'Silent K + DGE' },
  { word: CURATED_WORDS.find((w) => w.word === 'separate')!, category: 'Middle Vowel Trap' },
  { word: CURATED_WORDS.find((w) => w.word === 'embarrass')!, category: 'Dual Double Consonant' },
];

/**
 * Computes diagnostic starting level and strengths/weaknesses from assessment results
 */
export function evaluateAssessment(
  answers: { word: SpellingWord; isCorrect: boolean; responseTimeMs: number; mistakeType?: string }[]
): AssessmentResult {
  const totalQuestions = answers.length;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  const totalTime = answers.reduce((acc, a) => acc + a.responseTimeMs, 0);
  const averageResponseTimeMs = Math.round(totalTime / totalQuestions);

  // Group by pattern / level performance
  const patternStrengths: Record<string, number> = {};
  const patternWeaknesses: Record<string, number> = {};

  answers.forEach((ans) => {
    const patternKey = ans.word.spelling_pattern;
    if (ans.isCorrect) {
      patternStrengths[patternKey] = (patternStrengths[patternKey] || 0) + 1;
    } else {
      patternWeaknesses[patternKey] = (patternWeaknesses[patternKey] || 0) + 1;
    }
  });

  // Level calculation algorithm:
  // Accuracy >= 88%: Level 4 (Ready for high academic mastery)
  // Accuracy >= 70%: Level 3 (Great foundation, ready for intermediate adventure)
  // Accuracy >= 45%: Level 2 (Pattern explorer - double letters, silent letters)
  // Accuracy < 45%: Level 1 (Warm foundation, fun confidence boost)
  let recommendedLevel = 1;
  let recommendedWorldId = 'world-1';
  let summaryMessage = '';

  if (accuracy >= 85) {
    recommendedLevel = 4;
    recommendedWorldId = 'world-4';
    summaryMessage =
      "🌟 Outstanding Word Power! You demonstrated incredible spelling instincts and sharp pattern recognition. You're diving straight into high-flying adventures!";
  } else if (accuracy >= 68) {
    recommendedLevel = 3;
    recommendedWorldId = 'world-3';
    summaryMessage =
      "🚀 Awesome Job! You have a solid grasp of primary words and are ready to tackle tricky vowel teams, double consonants, and exciting new vocabulary!";
  } else if (accuracy >= 45) {
    recommendedLevel = 2;
    recommendedWorldId = 'world-2';
    summaryMessage =
      "🌳 Great Word Explorer! You already know lots of everyday words. We're going to explore fun secret patterns like silent letters and double letters together!";
  } else {
    recommendedLevel = 1;
    recommendedWorldId = 'world-1';
    summaryMessage =
      "🌱 Fantastic Start! Every great adventurer starts at the Word Garden. You're going to level up fast, collect awesome rewards, and become a spelling champion!";
  }

  return {
    totalQuestions,
    correctCount,
    accuracy,
    averageResponseTimeMs,
    recommendedLevel,
    recommendedWorldId,
    patternStrengths,
    patternWeaknesses,
    summaryMessage,
  };
}
