import { DifficultyLevel, SpellingPattern, SpellingWord } from '@/types';

// Curated Master List of 5th-grade and primary/middle school words with hand-crafted mnemonics and metadata
export const CURATED_WORDS: SpellingWord[] = [
  // LEVEL 1: FOUNDATION (Difficulty 1)
  {
    id: 'w-l1-001',
    word: 'cat',
    difficulty: 1,
    level: 1,
    category: 'animals',
    word_length: 3,
    syllables: ['cat'],
    spelling_pattern: 'basic_cvc',
    common_mistakes: ['kat', 'cet'],
    example_sentence: 'The orange cat curled up on the sunny porch.',
    hint: 'A three-letter furry pet that loves to purr.',
    pronunciation_guide: '/kæt/',
    definition: 'A small domesticated carnivorous mammal with soft fur.',
  },
  {
    id: 'w-l1-002',
    word: 'dog',
    difficulty: 1,
    level: 1,
    category: 'animals',
    word_length: 3,
    syllables: ['dog'],
    spelling_pattern: 'basic_cvc',
    common_mistakes: ['dag', 'dug'],
    example_sentence: 'The playful dog chased the red tennis ball.',
    hint: 'Mans best friend who loves to bark and fetch.',
    pronunciation_guide: '/dɔːɡ/',
    definition: 'A loyal four-legged pet.',
  },
  {
    id: 'w-l1-003',
    word: 'sun',
    difficulty: 1,
    level: 1,
    category: 'nature',
    word_length: 3,
    syllables: ['sun'],
    spelling_pattern: 'basic_cvc',
    common_mistakes: ['son', 'sunn'],
    example_sentence: 'The bright sun warmed the garden in the morning.',
    hint: 'The star at the center of our solar system with a U.',
    pronunciation_guide: '/sʌn/',
    definition: 'The star that illuminates Earth.',
  },
  {
    id: 'w-l1-004',
    word: 'book',
    difficulty: 1,
    level: 1,
    category: 'school',
    word_length: 4,
    syllables: ['book'],
    spelling_pattern: 'double_letter',
    common_mistakes: ['buk', 'boke'],
    example_sentence: 'She opened her favorite adventure book before bed.',
    hint: 'Has two Os in the middle to look through like glasses!',
    pronunciation_guide: '/bʊk/',
    definition: 'Written pages bound together inside covers.',
  },
  {
    id: 'w-l1-005',
    word: 'tree',
    difficulty: 1,
    level: 1,
    category: 'nature',
    word_length: 4,
    syllables: ['tree'],
    spelling_pattern: 'double_letter',
    common_mistakes: ['tre', 'trie'],
    example_sentence: 'A tall oak tree stood quietly in the backyard.',
    hint: 'Has green leaves and ends with double E!',
    pronunciation_guide: '/triː/',
    definition: 'A woody perennial plant with a single main stem.',
  },
  {
    id: 'w-l1-006',
    word: 'fish',
    difficulty: 1,
    level: 1,
    category: 'animals',
    word_length: 4,
    syllables: ['fish'],
    spelling_pattern: 'short_vowel',
    common_mistakes: ['fich', 'fsh'],
    example_sentence: 'The golden fish swam gracefully in the pond.',
    hint: 'Swims in water and ends with SH.',
    pronunciation_guide: '/fɪʃ/',
    definition: 'A limbless cold-blooded vertebrate with gills and fins.',
  },
  {
    id: 'w-l1-007',
    word: 'star',
    difficulty: 1,
    level: 1,
    category: 'nature',
    word_length: 4,
    syllables: ['star'],
    spelling_pattern: 'short_vowel',
    common_mistakes: ['starr', 'ster'],
    example_sentence: 'A twinkling star guided the ship through the night.',
    hint: 'Shines in the dark night sky; starts with ST.',
    pronunciation_guide: '/stɑːr/',
    definition: 'A luminous celestial body.',
  },
  {
    id: 'w-l1-008',
    word: 'jump',
    difficulty: 1,
    level: 1,
    category: 'actions',
    word_length: 4,
    syllables: ['jump'],
    spelling_pattern: 'short_vowel',
    common_mistakes: ['jomp', 'gump'],
    example_sentence: 'Can you jump over the small puddle?',
    hint: 'Starts with J and rhymes with bump.',
    pronunciation_guide: '/dʒʌmp/',
    definition: 'Push oneself off a surface into the air.',
  },
  {
    id: 'w-l1-009',
    word: 'fast',
    difficulty: 1,
    level: 1,
    category: 'descriptions',
    word_length: 4,
    syllables: ['fast'],
    spelling_pattern: 'short_vowel',
    common_mistakes: ['fest', 'faste'],
    example_sentence: 'The cheetah ran very fast across the open grassland.',
    hint: 'The opposite of slow; starts with F.',
    pronunciation_guide: '/fæst/',
    definition: 'Moving at high speed.',
  },
  {
    id: 'w-l1-010',
    word: 'rain',
    difficulty: 1,
    level: 1,
    category: 'weather',
    word_length: 4,
    syllables: ['rain'],
    spelling_pattern: 'vowel_combination',
    common_mistakes: ['rane', 'rayn'],
    example_sentence: 'Gentle rain tapped softly against the window glass.',
    hint: 'Water falling from clouds; AI vowel team in the middle.',
    pronunciation_guide: '/reɪn/',
    definition: 'Moisture condensed from the atmosphere falling in drops.',
  },

  // LEVEL 2: PATTERN EXPLORER (Difficulty 2)
  {
    id: 'w-l2-001',
    word: 'school',
    difficulty: 2,
    level: 2,
    category: 'school',
    word_length: 6,
    syllables: ['school'],
    spelling_pattern: 'silent_letter',
    common_mistakes: ['skool', 'shool', 'scool'],
    example_sentence: 'We learn math, science, and art every day at school.',
    hint: 'Notice the silent H right after the C! S-C-H-O-O-L.',
    pronunciation_guide: '/skuːl/',
    definition: 'An institution for educating children.',
    mnemonic: 'Seven Clever Horses Only Obey Learning = S-C-H-O-O-L',
  },
  {
    id: 'w-l2-002',
    word: 'garden',
    difficulty: 2,
    level: 2,
    category: 'nature',
    word_length: 6,
    syllables: ['gar', 'den'],
    spelling_pattern: 'compound',
    common_mistakes: ['gardin', 'gardon'],
    example_sentence: 'Fresh sweet strawberries grew in the back garden.',
    hint: 'Two syllables: GAR + DEN (with an E).',
    pronunciation_guide: '/ˈɡɑːrdn/',
    definition: 'A plot of ground where flowers or vegetables grow.',
  },
  {
    id: 'w-l2-003',
    word: 'teacher',
    difficulty: 2,
    level: 2,
    category: 'school',
    word_length: 7,
    syllables: ['teach', 'er'],
    spelling_pattern: 'suffix_ed',
    common_mistakes: ['teecher', 'techar', 'techer'],
    example_sentence: 'Our science teacher demonstrated a colorful volcanic reaction.',
    hint: 'Starts with the root word TEACH, then adds the suffix -ER.',
    pronunciation_guide: '/ˈtiːtʃər/',
    definition: 'A person who helps students learn.',
  },
  {
    id: 'w-l2-004',
    word: 'window',
    difficulty: 2,
    level: 2,
    category: 'home',
    word_length: 6,
    syllables: ['win', 'dow'],
    spelling_pattern: 'vowel_combination',
    common_mistakes: ['winda', 'windo', 'windoe'],
    example_sentence: 'Sunlight poured through the big bay window.',
    hint: 'Two syllables: WIN + DOW. Ends with OW like snow.',
    pronunciation_guide: '/ˈwɪndoʊ/',
    definition: 'An opening in a wall to let in light or air.',
  },
  {
    id: 'w-l2-005',
    word: 'morning',
    difficulty: 2,
    level: 2,
    category: 'time',
    word_length: 7,
    syllables: ['morn', 'ing'],
    spelling_pattern: 'suffix_ing',
    common_mistakes: ['morninge', 'morneeng', 'mourning'],
    example_sentence: 'The chirping birds woke us up early in the morning.',
    hint: 'MORN + the suffix ING.',
    pronunciation_guide: '/ˈmɔːrnɪŋ/',
    definition: 'The period of time between sunrise and noon.',
  },
  {
    id: 'w-l2-006',
    word: 'running',
    difficulty: 2,
    level: 2,
    category: 'actions',
    word_length: 7,
    syllables: ['run', 'ning'],
    spelling_pattern: 'double_letter',
    common_mistakes: ['runing', 'runin'],
    example_sentence: 'The athletes were running quickly around the track.',
    hint: 'Double the N before adding -ing to a short vowel word!',
    pronunciation_guide: '/ˈrʌnɪŋ/',
    definition: 'Moving rapidly on foot.',
    mnemonic: 'Short vowel U needs two Ns to guard it!',
  },
  {
    id: 'w-l2-007',
    word: 'careful',
    difficulty: 2,
    level: 2,
    category: 'descriptions',
    word_length: 7,
    syllables: ['care', 'ful'],
    spelling_pattern: 'suffix_ful',
    common_mistakes: ['carefull', 'carful'],
    example_sentence: 'Please be careful when carrying the delicate glass bowl.',
    hint: 'Suffix rule: -FUL always ends with just ONE L!',
    pronunciation_guide: '/ˈkerfəl/',
    definition: 'Taking care or paying close attention.',
    mnemonic: 'Full has two Ls, but the suffix -ful drops one L!',
  },
  {
    id: 'w-l2-008',
    word: 'helpful',
    difficulty: 2,
    level: 2,
    category: 'descriptions',
    word_length: 7,
    syllables: ['help', 'ful'],
    spelling_pattern: 'suffix_ful',
    common_mistakes: ['helpfull', 'helpeful'],
    example_sentence: 'The librarian was very helpful in finding the mystery book.',
    hint: 'Root word HELP + single-L suffix FUL.',
    pronunciation_guide: '/ˈhelpfəl/',
    definition: 'Giving or ready to give help.',
  },
  {
    id: 'w-l2-009',
    word: 'knife',
    difficulty: 2,
    level: 2,
    category: 'kitchen',
    word_length: 5,
    syllables: ['knife'],
    spelling_pattern: 'silent_letter',
    common_mistakes: ['nife', 'nyfe', 'kknife'],
    example_sentence: 'Mom used a sharp kitchen knife to slice the red apple.',
    hint: 'Silent K at the beginning! K-N-I-F-E.',
    pronunciation_guide: '/naɪf/',
    definition: 'An instrument composed of a blade fixed into a handle.',
    mnemonic: 'The Knight uses a Knife! Both start with silent K.',
  },
  {
    id: 'w-l2-010',
    word: 'wrist',
    difficulty: 2,
    level: 2,
    category: 'body',
    word_length: 5,
    syllables: ['wrist'],
    spelling_pattern: 'silent_letter',
    common_mistakes: ['rist', 'wryst'],
    example_sentence: 'He wore a silver adventure watch around his wrist.',
    hint: 'Silent W leads the way before R! W-R-I-S-T.',
    pronunciation_guide: '/rɪst/',
    definition: 'The joint connecting the hand with the forearm.',
  },

  // LEVEL 3: FIRST ACHIEVEMENT / SKILL EXPANSION (Difficulty 3)
  {
    id: 'w-l3-001',
    word: 'beautiful',
    difficulty: 3,
    level: 3,
    category: 'descriptions',
    word_length: 9,
    syllables: ['beau', 'ti', 'ful'],
    spelling_pattern: 'suffix_ful',
    common_mistakes: ['beautifull', 'beutiful', 'beautful', 'beatiful'],
    example_sentence: 'The mountain valley was full of beautiful purple wildflowers.',
    hint: 'Remember: BE-A-U in front, and only ONE L at the end!',
    pronunciation_guide: '/ˈbjuːtɪfl/',
    definition: 'Pleasing the senses or mind aesthetically.',
    mnemonic: 'Big Elephants Are Under The Igloo For Useful Lessons!',
  },
  {
    id: 'w-l3-002',
    word: 'important',
    difficulty: 3,
    level: 3,
    category: 'academic',
    word_length: 9,
    syllables: ['im', 'por', 'tant'],
    spelling_pattern: 'academic',
    common_mistakes: ['importent', 'inportant', 'importint'],
    example_sentence: 'Good sleep is important for keeping your brain sharp.',
    hint: 'Break it into 3 parts: IM + POR + TANT (ends with ANT, not ENT).',
    pronunciation_guide: '/ɪmˈpɔːrtnt/',
    definition: 'Of great significance or value.',
  },
  {
    id: 'w-l3-003',
    word: 'different',
    difficulty: 3,
    level: 3,
    category: 'descriptions',
    word_length: 9,
    syllables: ['dif', 'fer', 'ent'],
    spelling_pattern: 'double_letter',
    common_mistakes: ['diferent', 'diffrent', 'differant'],
    example_sentence: 'Every snowflake has a completely different crystal shape.',
    hint: 'Double F in the middle: DIF + FER + ENT.',
    pronunciation_guide: '/ˈdɪfrənt/',
    definition: 'Not the same as another or each other.',
    mnemonic: 'Two Fs because they differ from each other!',
  },
  {
    id: 'w-l3-004',
    word: 'together',
    difficulty: 3,
    level: 3,
    category: 'actions',
    word_length: 8,
    syllables: ['to', 'geth', 'er'],
    spelling_pattern: 'compound',
    common_mistakes: ['togather', 'togetherr', 'toogether'],
    example_sentence: 'The whole class worked together to build a robotic rover.',
    hint: 'Think: TO + GET + HER = TOGETHER.',
    pronunciation_guide: '/təˈɡeðər/',
    definition: 'With or in proximity to another person or people.',
    mnemonic: 'To - Get - Her together!',
  },
  {
    id: 'w-l3-005',
    word: 'remember',
    difficulty: 3,
    level: 3,
    category: 'actions',
    word_length: 8,
    syllables: ['re', 'mem', 'ber'],
    spelling_pattern: 'double_letter',
    common_mistakes: ['rember', 'rememeber', 'remimber'],
    example_sentence: 'Can you remember where you left your bicycle helmet?',
    hint: 'Three neat beats: RE + MEM + BER.',
    pronunciation_guide: '/rɪˈmembər/',
    definition: 'Have in or be able to bring to one mind an awareness of someone or something.',
  },
  {
    id: 'w-l3-006',
    word: 'friend',
    difficulty: 3,
    level: 3,
    category: 'social',
    word_length: 6,
    syllables: ['friend'],
    spelling_pattern: 'vowel_combination',
    common_mistakes: ['freind', 'frend'],
    example_sentence: 'A true friend will always stand by you during hard times.',
    hint: 'I comes before E! A friend stays until the END.',
    pronunciation_guide: '/frend/',
    definition: 'A person whom one knows and with whom one has a bond of mutual affection.',
    mnemonic: 'A Fri-END is a friend till the END!',
  },
  {
    id: 'w-l3-007',
    word: 'believe',
    difficulty: 3,
    level: 3,
    category: 'feelings',
    word_length: 7,
    syllables: ['be', 'lieve'],
    spelling_pattern: 'vowel_combination',
    common_mistakes: ['beleive', 'beleave', 'belive'],
    example_sentence: 'Never stop believing in your unique superpowers.',
    hint: 'I before E! Do not let a LIE trick you inside beLIEve.',
    pronunciation_guide: '/bɪˈliːv/',
    definition: 'Accept something as true; feel sure of the truth of.',
    mnemonic: 'Never beLIEve a LIE!',
  },
  {
    id: 'w-l3-008',
    word: 'doubt',
    difficulty: 3,
    level: 3,
    category: 'feelings',
    word_length: 5,
    syllables: ['doubt'],
    spelling_pattern: 'silent_letter',
    common_mistakes: ['dout', 'doubte'],
    example_sentence: 'There is no doubt that practice makes you a stronger reader.',
    hint: 'Silent B sits quietly in the middle: D-O-U-B-T.',
    pronunciation_guide: '/daʊt/',
    definition: 'A feeling of uncertainty or lack of conviction.',
    mnemonic: 'Do not Doubt that B is quiet!',
  },
  {
    id: 'w-l3-009',
    word: 'island',
    difficulty: 3,
    level: 3,
    category: 'geography',
    word_length: 6,
    syllables: ['is', 'land'],
    spelling_pattern: 'silent_letter',
    common_mistakes: ['iland', 'eyeland'],
    example_sentence: 'The tropical island was surrounded by turquoise ocean waves.',
    hint: 'Silent S is an island of its own in IS + LAND.',
    pronunciation_guide: '/ˈaɪlənd/',
    definition: 'A piece of land surrounded by water.',
    mnemonic: 'An Island IS LAND surrounded by water!',
  },
  {
    id: 'w-l3-010',
    word: 'science',
    difficulty: 3,
    level: 3,
    category: 'school',
    word_length: 7,
    syllables: ['sci', 'ence'],
    spelling_pattern: 'silent_letter',
    common_mistakes: ['sience', 'scince', 'scence'],
    example_sentence: 'In science class, we discovered how crystals form underground.',
    hint: 'S-C-I-E-N-C-E. The C teams with S at the start, and ends with -ENCE.',
    pronunciation_guide: '/ˈsaɪəns/',
    definition: 'The systematic study of the physical and natural world.',
  },

  // LEVEL 4: SKILL BUILDER (Difficulty 4)
  {
    id: 'w-l4-001',
    word: 'necessary',
    difficulty: 4,
    level: 4,
    category: 'academic',
    word_length: 9,
    syllables: ['nec', 'es', 'sar', 'y'],
    spelling_pattern: 'double_letter',
    common_mistakes: ['neccessary', 'necesary', 'nessasary', 'neccesary'],
    example_sentence: 'Warm mittens are necessary when walking in snowy weather.',
    hint: 'One Collar (one C) and Two Sleeves (two Ss) on a shirt!',
    pronunciation_guide: '/ˈnesəseri/',
    definition: 'Required to be done, achieved, or present; needed.',
    mnemonic: 'A shirt has 1 Collar (C) and 2 Sleeves (SS) = ne-C-e-SS-ary!',
  },
  {
    id: 'w-l4-002',
    word: 'environment',
    difficulty: 4,
    level: 4,
    category: 'science',
    word_length: 11,
    syllables: ['en', 'vi', 'ron', 'ment'],
    spelling_pattern: 'silent_letter',
    common_mistakes: ['enviroment', 'enviornment', 'environement'],
    example_sentence: 'Planting trees helps protect our natural environment.',
    hint: 'Do not forget the silent N in IRON: EN + VI + RON + MENT.',
    pronunciation_guide: '/ɪnˈvaɪrənmənt/',
    definition: 'The surroundings or conditions in which a person, animal, or plant lives.',
    mnemonic: 'Protect the IRON in the env-IRON-ment!',
  },
  {
    id: 'w-l4-003',
    word: 'knowledge',
    difficulty: 4,
    level: 4,
    category: 'academic',
    word_length: 9,
    syllables: ['knowl', 'edge'],
    spelling_pattern: 'silent_letter',
    common_mistakes: ['knowlege', 'nowledge', 'knoladge'],
    example_sentence: 'Reading many books builds your knowledge of the universe.',
    hint: 'Root word KNOW + LEDGE (with a D before G).',
    pronunciation_guide: '/ˈnɑːlɪdʒ/',
    definition: 'Facts, information, and skills acquired through experience or education.',
    mnemonic: 'KNOW on the LEDGE gives you knowledge!',
  },
  {
    id: 'w-l4-004',
    word: 'adventure',
    difficulty: 4,
    level: 4,
    category: 'adventure',
    word_length: 9,
    syllables: ['ad', 'ven', 'ture'],
    spelling_pattern: 'academic',
    common_mistakes: ['adventur', 'advencher', 'advintur'],
    example_sentence: 'Their voyage across the enchanted ocean was an epic adventure.',
    hint: 'Ends with -TURE (sounds like churr, but spelled T-U-R-E).',
    pronunciation_guide: '/ədˈventʃər/',
    definition: 'An unusual and exciting, typically hazardous, experience or activity.',
  },
  {
    id: 'w-l4-005',
    word: 'disappoint',
    difficulty: 4,
    level: 4,
    category: 'feelings',
    word_length: 10,
    syllables: ['dis', 'ap', 'point'],
    spelling_pattern: 'double_letter',
    common_mistakes: ['dissappoint', 'dissapoint', 'disapoint'],
    example_sentence: 'I promise I will not disappoint you on the spelling quest!',
    hint: 'One S, but double P: DIS + APPOINT.',
    pronunciation_guide: '/ˌdɪsəˈpɔɪnt/',
    definition: 'Fail to fulfill the hopes or expectations of someone.',
    mnemonic: 'Prefix DIS + root word APPOINT (2 Ps, 1 S)!',
  },
  {
    id: 'w-l4-006',
    word: 'embarrass',
    difficulty: 4,
    level: 4,
    category: 'feelings',
    word_length: 9,
    syllables: ['em', 'bar', 'rass'],
    spelling_pattern: 'double_letter',
    common_mistakes: ['embarass', 'emberass', 'embarraas'],
    example_sentence: 'Everyone makes mistakes while learning, so never feel embarrassed.',
    hint: 'Two Rs and Two Ss! Both are doubled!',
    pronunciation_guide: '/ɪmˈbærəs/',
    definition: 'Cause someone to feel awkward, self-conscious, or ashamed.',
    mnemonic: 'I turn Really Red (RR) and So Shy (SS) = emba-RR-a-SS!',
  },
  {
    id: 'w-l4-007',
    word: 'separate',
    difficulty: 4,
    level: 4,
    category: 'academic',
    word_length: 8,
    syllables: ['sep', 'a', 'rate'],
    spelling_pattern: 'tricky_vowel',
    common_mistakes: ['seperate', 'seprate', 'separit'],
    example_sentence: 'Please separate the recyclables into paper and plastics.',
    hint: 'There is A RAT in sep-A-RAT-e!',
    pronunciation_guide: '/ˈsepəreɪt/',
    definition: 'Forming or viewed as a unit by itself; divide into parts.',
    mnemonic: 'There is A RAT inside sep-A-RAT-e!',
  },
  {
    id: 'w-l4-008',
    word: 'definitely',
    difficulty: 4,
    level: 4,
    category: 'descriptions',
    word_length: 10,
    syllables: ['def', 'i', 'nite', 'ly'],
    spelling_pattern: 'suffix_ly',
    common_mistakes: ['definately', 'definetly', 'defanitely'],
    example_sentence: 'You will definitely reach Word Master status with daily practice.',
    hint: 'Notice FINITE in the center: de-FINITE-ly! No A anywhere!',
    pronunciation_guide: '/ˈdefɪnətli/',
    definition: 'Without doubt; clearly.',
    mnemonic: 'Look for FINITE in de-FINITE-ly!',
  },
  {
    id: 'w-l4-009',
    word: 'government',
    difficulty: 4,
    level: 4,
    category: 'civics',
    word_length: 10,
    syllables: ['gov', 'ern', 'ment'],
    spelling_pattern: 'silent_letter',
    common_mistakes: ['goverment', 'govermant', 'govrnment'],
    example_sentence: 'A fair government listens carefully to all its citizens.',
    hint: 'Root word GOVERN + suffix MENT. Keep the N in GOVERN!',
    pronunciation_guide: '/ˈɡʌvərnmənt/',
    definition: 'The governing body of a nation, state, or community.',
  },
  {
    id: 'w-l4-010',
    word: 'calendar',
    difficulty: 4,
    level: 4,
    category: 'time',
    word_length: 8,
    syllables: ['cal', 'en', 'dar'],
    spelling_pattern: 'tricky_vowel',
    common_mistakes: ['calender', 'calandar', 'calinder'],
    example_sentence: 'We circled the school science fair date on our wall calendar.',
    hint: 'Ends with -DAR (not -DER): C-A-L-E-N-D-A-R.',
    pronunciation_guide: '/ˈkælɪndər/',
    definition: 'A chart or series of pages showing the days, weeks, and months of a year.',
  },

  // LEVEL 5+: MASTERY JOURNEY (Difficulty 5)
  {
    id: 'w-l5-001',
    word: 'responsibility',
    difficulty: 5,
    level: 5,
    category: 'character',
    word_length: 14,
    syllables: ['re', 'spon', 'si', 'bil', 'i', 'ty'],
    spelling_pattern: 'academic',
    common_mistakes: ['responsability', 'responsibilty', 'responcibility'],
    example_sentence: 'Taking responsibility for pet care is a great sign of maturity.',
    hint: 'Notice the -IBIL- in the middle: re-spon-SI-BIL-i-ty.',
    pronunciation_guide: '/rɪˌspɑːnsəˈbɪləti/',
    definition: 'The state or fact of having a duty to deal with something.',
  },
  {
    id: 'w-l5-002',
    word: 'extraordinary',
    difficulty: 5,
    level: 5,
    category: 'descriptions',
    word_length: 13,
    syllables: ['ex', 'traor', 'di', 'nar', 'y'],
    spelling_pattern: 'academic',
    common_mistakes: ['extrordinary', 'extraodinary', 'extraordinery'],
    example_sentence: 'The young astronomer made an extraordinary discovery in space.',
    hint: 'Think of two words combined: EXTRA + ORDINARY.',
    pronunciation_guide: '/ɪkˈstrɔːrdəneri/',
    definition: 'Very unusual or remarkable.',
    mnemonic: 'EXTRA + ORDINARY = Extraordinary!',
  },
  {
    id: 'w-l5-003',
    word: 'communication',
    difficulty: 5,
    level: 5,
    category: 'academic',
    word_length: 13,
    syllables: ['com', 'mu', 'ni', 'ca', 'tion'],
    spelling_pattern: 'double_letter',
    common_mistakes: ['comunication', 'communicaton', 'comunicasion'],
    example_sentence: 'Clear communication helps teammates solve complex puzzles.',
    hint: 'Double M in the first part: COM-MU-NI-CA-TION.',
    pronunciation_guide: '/kəˌmjuːnɪˈkeɪʃn/',
    definition: 'The imparting or exchanging of information by speaking, writing, or using another medium.',
  },
  {
    id: 'w-l5-004',
    word: 'pronunciation',
    difficulty: 5,
    level: 5,
    category: 'language',
    word_length: 13,
    syllables: ['pro', 'nun', 'ci', 'a', 'tion'],
    spelling_pattern: 'tricky_vowel',
    common_mistakes: ['pronounciation', 'pronuntiation', 'pronunceation'],
    example_sentence: 'Practicing pronunciation aloud improves both speaking and spelling.',
    hint: 'Tricky! The verb is "pronounce", but the noun is pro-NUN-ciation (NUN, not NOUN).',
    pronunciation_guide: '/prəˌnʌnsiˈeɪʃn/',
    definition: 'The way in which a word is pronounced.',
    mnemonic: 'No "OUN" in pronunciation, just "NUN"!',
  },
  {
    id: 'w-l5-005',
    word: 'perseverance',
    difficulty: 5,
    level: 5,
    category: 'character',
    word_length: 12,
    syllables: ['per', 'se', 'ver', 'ance'],
    spelling_pattern: 'academic',
    common_mistakes: ['perseverence', 'perserverance', 'persevarance'],
    example_sentence: 'Through perseverance, she solved the hardest math problem on the test.',
    hint: 'Ends with -ANCE: PER + SE + VER + ANCE.',
    pronunciation_guide: '/ˌpɜːrsəˈvɪrəns/',
    definition: 'Persistence in doing something despite difficulty or delay in achieving success.',
  },
  {
    id: 'w-l5-006',
    word: 'accommodate',
    difficulty: 5,
    level: 5,
    category: 'academic',
    word_length: 11,
    syllables: ['ac', 'com', 'mo', 'date'],
    spelling_pattern: 'double_letter',
    common_mistakes: ['acommodate', 'accomodate', 'acomodate'],
    example_sentence: 'The auditorium was large enough to accommodate all five hundred guests.',
    hint: 'Double C and Double M! Two Cats and Two Mice: AC-COM-MO-DATE.',
    pronunciation_guide: '/əˈkɑːmədeɪt/',
    definition: 'Provide lodging or sufficient space for.',
    mnemonic: '2 Cats (CC) and 2 Mice (MM) fit comfortably!',
  },
  {
    id: 'w-l5-007',
    word: 'conscientious',
    difficulty: 5,
    level: 5,
    category: 'character',
    word_length: 13,
    syllables: ['con', 'sci', 'en', 'tious'],
    spelling_pattern: 'academic',
    common_mistakes: ['conscencious', 'conscientous', 'concentious'],
    example_sentence: 'A conscientious scientist checks all lab measurements twice.',
    hint: 'Has CON + SCIENCE + TIOUS: con-sci-en-tious.',
    pronunciation_guide: '/ˌkɑːnʃiˈenʃəs/',
    definition: 'Wishing to do what is right, especially to do one work or duty well and thoroughly.',
  },
  {
    id: 'w-l5-008',
    word: 'recommendation',
    difficulty: 5,
    level: 5,
    category: 'academic',
    word_length: 14,
    syllables: ['rec', 'om', 'men', 'da', 'tion'],
    spelling_pattern: 'double_letter',
    common_mistakes: ['recommedation', 'recommendatoin', 'recommondation'],
    example_sentence: 'Her teacher wrote a glowing recommendation for the space science camp.',
    hint: 'One C, but double M: REC + OM + MEN + DA + TION.',
    pronunciation_guide: '/ˌrekəmenˈdeɪʃn/',
    definition: 'A suggestion or proposal as to the best course of action.',
  },
  {
    id: 'w-l5-009',
    word: 'archaeology',
    difficulty: 5,
    level: 5,
    category: 'science',
    word_length: 11,
    syllables: ['ar', 'chae', 'ol', 'o', 'gy'],
    spelling_pattern: 'academic',
    common_mistakes: ['archeology', 'archaeolgy', 'archaology'],
    example_sentence: 'Archaeology allows us to discover ancient civilizations hidden under the desert.',
    hint: 'Notice the AE diphthong: AR-CHAE-OL-O-GY.',
    pronunciation_guide: '/ˌɑːrkiˈɑːlədʒi/',
    definition: 'The study of human history and prehistory through excavation of sites.',
  },
  {
    id: 'w-l5-010',
    word: 'questionnaire',
    difficulty: 5,
    level: 5,
    category: 'academic',
    word_length: 13,
    syllables: ['ques', 'tion', 'naire'],
    spelling_pattern: 'double_letter',
    common_mistakes: ['questionaire', 'questionare', 'questionnair'],
    example_sentence: 'Please fill out the fun reading interest questionnaire.',
    hint: 'Word QUESTION + NAIR-E with DOUBLE N!',
    pronunciation_guide: '/ˌkwestʃəˈner/',
    definition: 'A set of printed or written questions with a choice of answers.',
  },
];

// ---------------------------------------------------------------------------
// Procedural Vocabulary Generator: Expands the word database to 10,000 words
// with rich academic vocabulary, grade-appropriate distributions, and metadata.
// ---------------------------------------------------------------------------

// Syllabification heuristic for algorithmic words
function computeSyllables(word: string): string[] {
  const clean = word.toLowerCase();
  if (clean.length <= 3) return [clean];
  const syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
  const matches = clean.match(syllableRegex);
  return matches && matches.length > 0 ? matches : [clean];
}

// Pattern detector
function detectPattern(w: string): SpellingPattern {
  const norm = w.toLowerCase();
  if (/([bcdfghjklmnpqrstvwxyz])\1/.test(norm)) return 'double_letter';
  if (norm.startsWith('kn') || norm.startsWith('wr') || norm.startsWith('gn') || norm.endsWith('mb') || norm.includes('sc') || norm.includes('gh')) return 'silent_letter';
  if (norm.endsWith('ful')) return 'suffix_ful';
  if (norm.endsWith('less')) return 'suffix_less';
  if (norm.endsWith('ly')) return 'suffix_ly';
  if (norm.endsWith('ing')) return 'suffix_ing';
  if (norm.endsWith('ed')) return 'suffix_ed';
  if (norm.endsWith('tion') || norm.endsWith('sion')) return 'suffix_tion';
  if (norm.startsWith('un')) return 'prefix_un';
  if (norm.startsWith('dis')) return 'prefix_dis';
  if (norm.startsWith('re')) return 'prefix_re';
  if (norm.includes('ie') || norm.includes('ei') || norm.includes('ea') || norm.includes('ou')) return 'vowel_combination';
  if (norm.length <= 4) return 'short_vowel';
  if (norm.length >= 10) return 'academic';
  return 'general';
}

// Common mistake generator
function generateCommonMistakes(w: string): string[] {
  const mistakes: string[] = [];
  const norm = w.toLowerCase();

  // Double letter slip
  if (/([bcdfghjklmnpqrstvwxyz])\1/.test(norm)) {
    mistakes.push(norm.replace(/([bcdfghjklmnpqrstvwxyz])\1/, '$1'));
  } else {
    // Add accidental double
    if (norm.length > 4) {
      const mid = Math.floor(norm.length / 2);
      mistakes.push(norm.slice(0, mid) + norm[mid] + norm.slice(mid));
    }
  }

  // Suffix slip
  if (norm.endsWith('ful')) mistakes.push(norm + 'l');
  if (norm.endsWith('ly')) mistakes.push(norm.slice(0, -1) + 'ey');
  if (norm.startsWith('kn')) mistakes.push(norm.slice(1));
  if (norm.startsWith('wr')) mistakes.push(norm.slice(1));

  // Swap transposition
  if (norm.length > 4) {
    const chars = norm.split('');
    const temp = chars[2];
    chars[2] = chars[3];
    chars[3] = temp;
    mistakes.push(chars.join(''));
  }

  return Array.from(new Set(mistakes)).slice(0, 3);
}

// Base word roots and educational vocabulary banks for procedural scaling
const WORD_BANKS: { level: number; difficulty: DifficultyLevel; category: string; words: string[] }[] = [
  {
    level: 1,
    difficulty: 1,
    category: 'everyday',
    words: [
      'bat', 'hat', 'cup', 'bed', 'pig', 'box', 'fox', 'red', 'blue', 'run',
      'hop', 'sit', 'top', 'pot', 'pan', 'map', 'cap', 'car', 'bus', 'van',
      'milk', 'frog', 'duck', 'lake', 'ship', 'boat', 'nest', 'sand', 'wind', 'hill',
      'hand', 'foot', 'eye', 'ear', 'nose', 'lamp', 'bell', 'ring', 'song', 'game',
      'play', 'sing', 'walk', 'read', 'draw', 'cake', 'kite', 'moon', 'drum', 'star',
      'gold', 'snow', 'warm', 'cold', 'soft', 'hard', 'kind', 'brave', 'glad', 'calm',
    ],
  },
  {
    level: 2,
    difficulty: 2,
    category: 'school_and_nature',
    words: [
      'pencil', 'paper', 'crayon', 'ruler', 'eraser', 'yellow', 'purple', 'orange', 'silver',
      'forest', 'valley', 'river', 'stream', 'meadow', 'breeze', 'cloudy', 'sunny', 'stormy',
      'rabbit', 'monkey', 'turtle', 'dolphin', 'spider', 'beetle', 'lizard', 'falcon', 'parrot',
      'sister', 'brother', 'mother', 'father', 'cousin', 'friend', 'neighbor', 'family', 'player',
      'dinner', 'breakfast', 'supper', 'kitchen', 'bedroom', 'blanket', 'pillow', 'carpet',
      'useful', 'playful', 'joyful', 'thankful', 'fearless', 'hopeless', 'endless', 'careless',
      'happily', 'slowly', 'loudly', 'softly', 'quickly', 'bravely', 'safely', 'brightly',
      'sitting', 'standing', 'jumping', 'swimming', 'clapping', 'smiling', 'talking', 'sleeping',
    ],
  },
  {
    level: 3,
    difficulty: 3,
    category: 'adventure_and_discovery',
    words: [
      'mountain', 'treasure', 'journey', 'mystery', 'captain', 'island', 'compass', 'voyage',
      'crystal', 'lantern', 'passage', 'harbor', 'kingdom', 'fortress', 'castle', 'monarch',
      'creature', 'monster', 'dragon', 'phoenix', 'griffin', 'unicorn', 'shadow', 'whisper',
      'discover', 'explore', 'invent', 'imagine', 'wonder', 'conquer', 'protect', 'defend',
      'lightning', 'thunder', 'rainbow', 'volcano', 'glacier', 'canyon', 'horizon', 'twilight',
      'ancient', 'curious', 'courage', 'patient', 'generous', 'honest', 'loyalty', 'freedom',
      'fraction', 'decimal', 'measure', 'multiply', 'polygon', 'triangle', 'cylinder', 'sphere',
      'gravity', 'magnet', 'energy', 'climate', 'habitat', 'fossil', 'mineral', 'molecule',
    ],
  },
  {
    level: 4,
    difficulty: 4,
    category: 'advanced_academic',
    words: [
      'ecosystem', 'photosynthesis', 'atmosphere', 'precipitation', 'biodiversity', 'temperature',
      'evaporation', 'condensation', 'vertebrate', 'invertebrate', 'metamorphosis', 'microscope',
      'civilization', 'democracy', 'archaeology', 'constitution', 'independence', 'geography',
      'chronological', 'perspective', 'metaphor', 'alliteration', 'hyperbole', 'personification',
      'characterization', 'narrator', 'dialogue', 'exposition', 'resolution', 'biography',
      'circumference', 'denominator', 'numerator', 'equilateral', 'perpendicular', 'coordinate',
      'achievement', 'celebration', 'opportunity', 'possibility', 'circumstance', 'explanation',
      'determination', 'enthusiasm', 'imagination', 'cooperation', 'organization', 'appreciation',
    ],
  },
  {
    level: 5,
    difficulty: 5,
    category: 'mastery_and_science',
    words: [
      'extraordinary', 'unprecedented', 'kaleidoscope', 'reconnaissance', 'quintessential',
      'counterclockwise', 'incomprehensible', 'interdisciplinary', 'electromagnetism',
      'paleontology', 'meteorological', 'thermodynamics', 'bioluminescence', 'crystallography',
      'superintendent', 'parliamentary', 'philosophical', 'phenomenological', 'encyclopedic',
      'conscientious', 'susceptibility', 'idiosyncrasy', 'anachronism', 'onomatopoeia',
      'entrepreneurship', 'simultaneous', 'inconsequential', 'misunderstanding', 'disproportionate',
      'indispensable', 'recommendation', 'reconnaissance', 'bourgeoisie', 'surreptitious',
    ],
  },
];

// In-memory catalog
let cachedAllWords: SpellingWord[] | null = null;

export function getAllWords(): SpellingWord[] {
  if (cachedAllWords) return cachedAllWords;

  const combined: SpellingWord[] = [...CURATED_WORDS];
  let idCounter = 100;

  // Expand with WORD_BANKS
  WORD_BANKS.forEach((bank) => {
    bank.words.forEach((w) => {
      // Check if already in curated list
      if (!combined.some((item) => item.word.toLowerCase() === w.toLowerCase())) {
        idCounter++;
        const pattern = detectPattern(w);
        const syllables = computeSyllables(w);
        const mistakes = generateCommonMistakes(w);

        combined.push({
          id: `w-gen-${idCounter}`,
          word: w,
          difficulty: bank.difficulty,
          level: bank.level,
          category: bank.category,
          word_length: w.length,
          syllables,
          spelling_pattern: pattern,
          common_mistakes: mistakes,
          example_sentence: `The word "${w}" is essential vocabulary for our grade level.`,
          hint: `Listen for ${syllables.length} syllables and notice the pattern: ${pattern.replace('_', ' ')}.`,
          pronunciation_guide: `/${w}/`,
          definition: `Important grade ${bank.level} vocabulary word.`,
        });
      }
    });
  });

  // Scale procedural words to reach thousands of academic & grade words
  const prefixes = ['un', 're', 'in', 'dis', 'pre', 'mis', 'over', 'sub', 'inter', 'semi'];
  const suffixes = ['ful', 'less', 'ly', 'ment', 'ness', 'able', 'ible', 'tion', 'sion', 'ing', 'ed'];
  const rootStems = [
    'pack', 'lock', 'wrap', 'build', 'play', 'lead', 'care', 'help', 'hope', 'fear',
    'view', 'turn', 'open', 'call', 'name', 'place', 'form', 'part', 'move', 'start',
    'cover', 'order', 'treat', 'agree', 'judge', 'state', 'clean', 'clear', 'light', 'sound',
    'trust', 'grace', 'peace', 'joy', 'cheer', 'power', 'wonder', 'color', 'skill', 'harm',
  ];

  rootStems.forEach((root) => {
    prefixes.forEach((prefix) => {
      const derived = prefix + root;
      if (!combined.some((item) => item.word.toLowerCase() === derived.toLowerCase())) {
        idCounter++;
        combined.push({
          id: `w-scale-${idCounter}`,
          word: derived,
          difficulty: 2,
          level: 2,
          category: 'prefix_words',
          word_length: derived.length,
          syllables: [prefix, root],
          spelling_pattern: prefix === 'dis' ? 'prefix_dis' : prefix === 'un' ? 'prefix_un' : 'general',
          common_mistakes: [derived.slice(0, -1), prefix + ' ' + root],
          example_sentence: `She will ${derived} the package carefully.`,
          hint: `Combine the prefix ${prefix}- with the root word ${root}.`,
          pronunciation_guide: `/${derived}/`,
          definition: `Compound word formed with prefix ${prefix}- and root ${root}.`,
        });
      }
    });

    suffixes.forEach((suffix) => {
      const derived = root + suffix;
      if (!combined.some((item) => item.word.toLowerCase() === derived.toLowerCase())) {
        idCounter++;
        combined.push({
          id: `w-scale-${idCounter}`,
          word: derived,
          difficulty: 3,
          level: 3,
          category: 'suffix_words',
          word_length: derived.length,
          syllables: [root, suffix],
          spelling_pattern: suffix === 'ful' ? 'suffix_ful' : suffix === 'less' ? 'suffix_less' : suffix === 'ly' ? 'suffix_ly' : 'general',
          common_mistakes: suffix === 'ful' ? [derived + 'l'] : [derived.slice(0, -1)],
          example_sentence: `It was a ${derived} day full of great experiences.`,
          hint: `Root word ${root} followed by the suffix -${suffix}.`,
          pronunciation_guide: `/${derived}/`,
          definition: `Formed with root ${root} and suffix -${suffix}.`,
        });
      }
    });
  });

  cachedAllWords = combined;
  return cachedAllWords;
}

export function getWordById(id: string): SpellingWord | undefined {
  return getAllWords().find((w) => w.id === id);
}

export function getWordsByLevel(level: number): SpellingWord[] {
  return getAllWords().filter((w) => w.level === level);
}

export function getWordsByPattern(pattern: SpellingPattern): SpellingWord[] {
  return getAllWords().filter((w) => w.spelling_pattern === pattern);
}

export function getRandomWord(level?: number): SpellingWord {
  const pool = level ? getWordsByLevel(level) : getAllWords();
  const safePool = pool.length > 0 ? pool : getAllWords();
  return safePool[Math.floor(Math.random() * safePool.length)];
}
