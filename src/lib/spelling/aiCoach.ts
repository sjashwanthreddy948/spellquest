import { MistakeType, SpellingWord } from '@/types';
import { getAllWords } from '@/data/words';

export interface CoachAdvice {
  headline: string;
  syllableBreakdown: string;
  memoryTrick: string;
  patternExplanation: string;
  recommendedPracticeWords: string[];
  encouragingCheer: string;
}

const MNEMONIC_VAULT: Record<string, string> = {
  necessary: 'A shirt has 1 Collar (one C) and 2 Sleeves (two Ss) = ne-C-e-SS-ary!',
  beautiful: 'Big Elephants Are Under The Igloo For Useful Lessons!',
  separate: 'There is A RAT in the middle of sep-A-RAT-e!',
  environment: 'Keep the IRON clean in the env-IRON-ment!',
  friend: 'A true fri-END is a friend till the END!',
  believe: 'Never be-LIE-ve a LIE!',
  calendar: 'Check the D-A-R at the end of calen-DAR!',
  embarrass: 'I turn Really Red (RR) and So Shy (SS) = emba-RR-a-SS!',
  disappoint: 'One S, Two Ps: DIS + APPOINT!',
  accommodate: 'Two Cats and Two Mice: 2 Cs and 2 Ms!',
  island: 'An island IS LAND surrounded by deep water!',
  doubt: 'Never doubt the silent B sitting in doubt!',
  science: 'S and C explore the wonders of SCI-ENCE!',
  knowledge: 'Put what you KNOW on the LEDGE for knowledge!',
  government: 'GOVERN + MENT: Never leave the N behind!',
  pronunciation: 'No "OUN" here! Just pro-NUN-ci-a-tion!',
  rhythm: 'Rhythm Helps Your Two Hips Move!',
  dessert: 'Dessert has two Ss because you always want Sweet Stuff twice! Desert has only one S because sand is dry.',
};

/**
 * Generates rich, pedagogically grounded coaching advice tailored to a 5th-grade student
 */
export function generateCoachAdvice(
  word: SpellingWord,
  mistakeType?: MistakeType,
  submittedInput?: string
): CoachAdvice {
  const normWord = word.word.toLowerCase();
  const syllablesStr = word.syllables.map((s) => s.toUpperCase()).join(' • ');

  // Look up memory trick
  let memoryTrick = word.mnemonic || MNEMONIC_VAULT[normWord] || '';
  if (!memoryTrick) {
    if (word.spelling_pattern === 'suffix_ful') {
      memoryTrick = 'Remember: The suffix -ful always drops one L! Helpful, careful, beautiful.';
    } else if (word.spelling_pattern === 'double_letter') {
      memoryTrick = `Look out for the twin letters guarding the short vowel!`;
    } else if (word.spelling_pattern === 'silent_letter') {
      memoryTrick = `Some letters are silent ninjas. They do not make a sound, but they must be there!`;
    } else {
      memoryTrick = `Say each syllable aloud: ${syllablesStr}. Hear every sound!`;
    }
  }

  // Find 3 similar words for targeted practice
  const allWords = getAllWords();
  const similarWords = allWords
    .filter((w) => w.id !== word.id && (w.spelling_pattern === word.spelling_pattern || w.level === word.level))
    .slice(0, 3)
    .map((w) => w.word);

  let headline = `Let's master "${word.word}" together! 💡`;
  let patternExplanation = word.hint;

  if (mistakeType === 'double_letter') {
    headline = `Twin Letters Alert! 👯`;
    patternExplanation = `Double consonants often follow short vowel sounds to protect them. Notice where the twins sit in "${word.word}".`;
  } else if (mistakeType === 'silent_letter') {
    headline = `Silent Ninja Letter! 🥷`;
    patternExplanation = `English kept historical spellings like silent K, W, and B. Once you spot them, you never forget!`;
  } else if (mistakeType === 'suffix_prefix') {
    headline = `Word Building Magic! 🧩`;
    patternExplanation = `When you add a prefix or suffix, check if letters change or stay the same.`;
  } else if (mistakeType === 'vowel_confusion') {
    headline = `Vowel Teamwork! 🤝`;
    patternExplanation = `When two vowels go walking, the first one often does the talking! Check your vowel pair.`;
  }

  const cheers = [
    `You are expanding your brain power with every word! 🚀`,
    `Great adventurers learn from every step. You have got this! ⭐`,
    `Your spelling instincts are getting sharper by the minute! 💎`,
    `Every master was once a beginner. Keep your streak alive! 🔥`,
  ];
  const encouragingCheer = cheers[Math.floor(Math.random() * cheers.length)];

  return {
    headline,
    syllableBreakdown: syllablesStr,
    memoryTrick,
    patternExplanation,
    recommendedPracticeWords: similarWords.length === 3 ? similarWords : ['careful', 'helpful', 'beautiful'],
    encouragingCheer,
  };
}
