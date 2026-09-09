import { DiffToken, MistakeType, SpellingWord, VerificationResult } from '@/types';

/**
 * Calculates the Levenshtein distance between two strings
 */
export function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Generates character-level diff tokens comparing the user's input with the target word.
 */
export function generateDiffTokens(input: string, target: string): DiffToken[] {
  const s1 = input.toLowerCase().trim();
  const s2 = target.toLowerCase().trim();
  const m = s1.length;
  const n = s2.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],
          dp[i][j - 1],
          dp[i - 1][j - 1]
        );
      }
    }
  }

  const tokens: DiffToken[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && s1[i - 1] === s2[j - 1]) {
      tokens.unshift({
        type: 'match',
        char: s1[i - 1],
        expectedChar: s2[j - 1],
        index: i - 1,
      });
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      tokens.unshift({
        type: 'substitute',
        char: s1[i - 1],
        expectedChar: s2[j - 1],
        index: i - 1,
      });
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      tokens.unshift({
        type: 'delete',
        char: s1[i - 1],
        index: i - 1,
      });
      i--;
    } else {
      tokens.unshift({
        type: 'insert',
        char: s2[j - 1],
        expectedChar: s2[j - 1],
        index: j - 1,
      });
      j--;
    }
  }

  return tokens;
}

const SILENT_LETTERS_MAP: Record<string, string[]> = {
  k: ['knife', 'knight', 'know', 'knee', 'knot', 'knock', 'knuckle'],
  w: ['write', 'wrong', 'wrist', 'sword', 'wrap', 'wreck', 'answer'],
  b: ['doubt', 'debt', 'climb', 'thumb', 'crumb', 'lamb', 'comb', 'subtle'],
  g: ['sign', 'gnome', 'design', 'foreign', 'campaign'],
  l: ['talk', 'walk', 'half', 'calm', 'salmon', 'could', 'should', 'would'],
  h: ['honest', 'hour', 'ghost', 'rhyme', 'school', 'echo', 'character'],
  t: ['listen', 'castle', 'whistle', 'fasten', 'witch', 'match'],
  s: ['island', 'aisle'],
  c: ['muscle', 'scene', 'scent', 'science', 'scissors'],
  n: ['autumn', 'column', 'hymn'],
  p: ['psychology', 'receipt', 'pterodactyl'],
};

/**
 * Categorizes the type of spelling mistake made
 */
export function classifyMistake(input: string, target: string): MistakeType {
  const normInput = input.toLowerCase().trim();
  const normTarget = target.toLowerCase().trim();

  if (normInput === normTarget) return 'general_typo';

  // 1. Check for double letter slips (extra double or missing double)
  // e.g. beautifull vs beautiful, runing vs running, suprise vs surprise
  const doubleConsonantRegex = /([bcdfghjklmnpqrstvwxyz])\1/;
  const targetHasDouble = doubleConsonantRegex.test(normTarget);
  const inputHasDouble = doubleConsonantRegex.test(normInput);

  if (targetHasDouble !== inputHasDouble) {
    return 'double_letter';
  }

  // 2. Check for silent letters omission
  for (const [letter, words] of Object.entries(SILENT_LETTERS_MAP)) {
    if (words.some((w) => normTarget.includes(w) || w === normTarget)) {
      if (!normInput.includes(letter) && normTarget.includes(letter)) {
        return 'silent_letter';
      }
    }
  }

  // Common silent k/w/b/g prefixes/suffixes
  if (normTarget.startsWith('kn') && normInput.startsWith('n')) return 'silent_letter';
  if (normTarget.startsWith('wr') && normInput.startsWith('r')) return 'silent_letter';
  if (normTarget.startsWith('gn') && normInput.startsWith('n')) return 'silent_letter';
  if (normTarget.startsWith('ps') && normInput.startsWith('s')) return 'silent_letter';
  if (normTarget.endsWith('mb') && normInput.endsWith('m')) return 'silent_letter';
  if (normTarget.endsWith('mn') && normInput.endsWith('m')) return 'silent_letter';

  // 3. Check for suffix / prefix slips (-ful vs -full, -ly vs -ley, etc.)
  if (normTarget.endsWith('ful') && normInput.endsWith('full')) return 'suffix_prefix';
  if (normTarget.endsWith('full') && normInput.endsWith('ful')) return 'suffix_prefix';
  if (normTarget.endsWith('ly') && (normInput.endsWith('ley') || normInput.endsWith('li'))) return 'suffix_prefix';
  if (normTarget.endsWith('tion') && (normInput.endsWith('shun') || normInput.endsWith('sion'))) return 'suffix_prefix';
  if (normTarget.endsWith('sion') && normInput.endsWith('tion')) return 'suffix_prefix';
  if (normTarget.startsWith('dis') && normInput.startsWith('diss')) return 'suffix_prefix';
  if (normTarget.startsWith('mis') && normInput.startsWith('miss')) return 'suffix_prefix';

  // 4. Check for vowel confusion (ie vs ei, ea vs ee, ou vs ow, etc.)
  const vowelPairs = [
    ['ie', 'ei'],
    ['ea', 'ee'],
    ['ou', 'ow'],
    ['au', 'aw'],
    ['ai', 'ay'],
    ['oa', 'ow'],
    ['ey', 'y'],
  ];
  for (const [v1, v2] of vowelPairs) {
    if (
      (normTarget.includes(v1) && normInput.includes(v2)) ||
      (normTarget.includes(v2) && normInput.includes(v1))
    ) {
      return 'vowel_confusion';
    }
  }

  // 5. Check for transposition (adjacent letter swap)
  if (normInput.length === normTarget.length) {
    let diffCount = 0;
    const diffIndices: number[] = [];
    for (let k = 0; k < normInput.length; k++) {
      if (normInput[k] !== normTarget[k]) {
        diffCount++;
        diffIndices.push(k);
      }
    }
    if (
      diffCount === 2 &&
      diffIndices[1] === diffIndices[0] + 1 &&
      normInput[diffIndices[0]] === normTarget[diffIndices[1]] &&
      normInput[diffIndices[1]] === normTarget[diffIndices[0]]
    ) {
      return 'transposition';
    }
  }

  // 6. Phonetic substitution (ph -> f, c -> s, etc.)
  if (normTarget.includes('ph') && normInput.includes('f')) return 'phonetic_substitution';
  if (normTarget.includes('f') && normInput.includes('ph')) return 'phonetic_substitution';

  // 7. Length based missing / extra
  if (normInput.length < normTarget.length) return 'missing_letter';
  if (normInput.length > normTarget.length) return 'extra_letter';

  return 'general_typo';
}

/**
 * Child-friendly encouraging explanations for mistakes
 */
export function getMistakeExplanation(
  mistakeType: MistakeType,
  input: string,
  target: string,
  word?: SpellingWord
): string {
  const normTarget = target.toLowerCase();

  switch (mistakeType) {
    case 'double_letter': {
      if (input.length > target.length) {
        return `💡 Look closely at the double letters! "${target}" has only one of that letter here.`;
      }
      return `💡 Twins alert! "${target}" needs a double letter right in that spot.`;
    }
    case 'silent_letter': {
      return `💡 Sneaky silent letter! Some letters like to whisper quietly without making a sound in "${target}".`;
    }
    case 'vowel_confusion': {
      return `💡 Tricky vowel team! English vowels love to team up, like in "${target}".`;
    }
    case 'suffix_prefix': {
      if (normTarget.endsWith('ful')) {
        return `💡 Suffix secret: The ending "-ful" is written with only ONE 'l' (like beautiful, helpful, careful)!`;
      }
      return `💡 Watch the word ending or beginning! Let's check how the root word connects.`;
    }
    case 'transposition': {
      return `💡 Whoops, two letters switched places! Let's swap them back to the right order.`;
    }
    case 'missing_letter': {
      return `💡 Almost had it! One little letter got left behind. Take another listen.`;
    }
    case 'extra_letter': {
      return `💡 Great attempt! An extra passenger hopped into your word. Let's trim it down!`;
    }
    case 'phonetic_substitution': {
      return `💡 Sounds just like that! But English spells that sound in a special way here.`;
    }
    default: {
      return word?.hint || `💡 You're so close! Listen carefully to each sound and try again.`;
    }
  }
}

/**
 * Supportive and encouraging feedback message
 */
export function getEncouragingMessage(isCorrect: boolean, attemptNumber: number, distance: number): string {
  if (isCorrect) {
    if (attemptNumber === 1) {
      const msgs = [
        '🌟 Spectacular! Nailed it on the first try!',
        '🚀 Flawless spelling! You are flying high!',
        '🎉 Brilliant! Your spelling powers are leveling up!',
        '✨ Outstanding! Word Master in the making!',
        '🏆 Spot on! Perfect spelling!',
      ];
      return msgs[Math.floor(Math.random() * msgs.length)];
    } else {
      const msgs = [
        '👏 Way to stick with it! You conquered that word!',
        '⭐ Awesome comeback! That is true mastery!',
        '💪 Persistence pays off! You got it right!',
        '🌈 Beautiful job fixing that! Brain power boosted!',
      ];
      return msgs[Math.floor(Math.random() * msgs.length)];
    }
  }

  // Not correct
  if (distance === 1) {
    const msgs = [
      '🔥 Ooh, only ONE letter away! You are right there!',
      '⚡ Super close! Just a tiny slip, you can do this!',
      '🌱 You almost had it! Look closely at that spot!',
      '🎯 So close you can touch it! Give it one more shot!',
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  } else if (distance === 2) {
    const msgs = [
      '💡 Great effort! You have got the main sounds down!',
      '🌱 You are getting closer with each try! Let us fix it together!',
      '⭐ Good thinking! Check the middle letters carefully.',
      '🎈 Nice try! Take a deep breath and give it another go.',
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  } else {
    const msgs = [
      '🌱 Good try! Every word you practice makes your brain stronger.',
      '🎧 Listen to the pronunciation once more. You can do this!',
      '🛡️ Practice is how wizards learn their spells! Let us try again!',
      '✨ No worries at all! Let us break it down sound by sound.',
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
}

/**
 * Deterministic verification of spelling attempt
 */
export function verifySpelling(
  input: string,
  targetWord: SpellingWord,
  attemptNumber: number = 1,
  hintUsed: boolean = false,
  cluesCount: number = 0
): VerificationResult {
  const cleanInput = input.trim();
  const cleanTarget = targetWord.word.trim();
  const isCorrect = cleanInput.toLowerCase() === cleanTarget.toLowerCase();
  const distance = isCorrect ? 0 : levenshteinDistance(cleanInput.toLowerCase(), cleanTarget.toLowerCase());
  const diffTokens = generateDiffTokens(cleanInput, cleanTarget);

  let mistakeType: MistakeType | undefined;
  let mistakeExplanation: string | undefined;

  if (!isCorrect) {
    mistakeType = classifyMistake(cleanInput, cleanTarget);
    mistakeExplanation = getMistakeExplanation(mistakeType, cleanInput, cleanTarget, targetWord);
  }

  const encouragement = getEncouragingMessage(isCorrect, attemptNumber, distance);

  // Per-clue point deduction calculation:
  // Base points for correct 1st attempt: 100 XP & 10 Coins
  // Each clue used deducts 25 XP (and 2 coins) from the points gained!
  const cluesUsed = cluesCount > 0 ? cluesCount : (hintUsed ? 1 : 0);
  let baseXp = 0;
  let cluesDeduction = 0;
  let xpEarned = 0;
  let coinsEarned = 0;

  if (isCorrect) {
    if (attemptNumber === 1) {
      baseXp = 100;
      cluesDeduction = cluesUsed * 25;
      xpEarned = Math.max(25, baseXp - cluesDeduction);
      coinsEarned = Math.max(2, 10 - cluesUsed * 2);
    } else if (attemptNumber === 2) {
      baseXp = 50;
      cluesDeduction = cluesUsed * 10;
      xpEarned = Math.max(20, baseXp - cluesDeduction);
      coinsEarned = Math.max(2, 5 - cluesUsed);
    } else {
      baseXp = 30;
      cluesDeduction = cluesUsed * 5;
      xpEarned = Math.max(15, baseXp - cluesDeduction);
      coinsEarned = 2;
    }
  }

  return {
    isCorrect,
    inputWord: cleanInput,
    targetWord: cleanTarget,
    diffTokens,
    mistakeType,
    mistakeExplanation,
    mnemonic: targetWord.mnemonic,
    encouragement,
    baseXp,
    cluesDeduction,
    cluesUsed,
    xpEarned,
    coinsEarned,
    isFirstAttempt: attemptNumber === 1,
  };
}
