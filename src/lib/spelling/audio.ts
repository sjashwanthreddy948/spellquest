/**
 * SpellQuest Audio Engine
 * High-clarity speech synthesis prioritizing clear female voices by default,
 * customizable voice selector options, rate/pitch customization, and offline Web Audio SFX.
 */

const VOICE_PREF_KEY = 'spellquest_preferred_voice_uri';
const RATE_PREF_KEY = 'spellquest_speech_rate';
const PITCH_PREF_KEY = 'spellquest_speech_pitch';

let selectedVoice: SpeechSynthesisVoice | null = null;
let allAvailableVoices: SpeechSynthesisVoice[] = [];
let voiceChangeListeners: Array<() => void> = [];

export function subscribeToVoiceChanges(listener: () => void) {
  voiceChangeListeners.push(listener);
  return () => {
    voiceChangeListeners = voiceChangeListeners.filter((l) => l !== listener);
  };
}

// Priority keywords for clear, child-friendly female voices
export const FEMALE_VOICE_KEYWORDS = [
  'zira',
  'jenny',
  'aria',
  'ava',
  'samantha',
  'victoria',
  'karen',
  'fiona',
  'tessa',
  'moira',
  'stephanie',
  'cora',
  'hazel',
  'susan',
  'catherine',
  'clara',
  'amy',
  'emma',
  'olivia',
  'serena',
  'salli',
  'joanna',
  'ivy',
  'kendra',
  'kimberly',
  'allison',
  'female',
  'natural (female)',
  'google us english',
];

export const MALE_VOICE_KEYWORDS = [
  'david',
  'mark',
  'george',
  'daniel',
  'richard',
  'james',
  'male',
  'guy',
  'christopher',
  'eric',
  'stefan',
  'ryan',
  'tom',
  'brian',
  'alex',
  'fred',
  'ralph',
];

export function isFemaleVoice(voice: SpeechSynthesisVoice): boolean {
  const name = voice.name.toLowerCase();
  const uri = voice.voiceURI.toLowerCase();
  if (MALE_VOICE_KEYWORDS.some((kw) => name.includes(kw) || uri.includes(kw))) {
    return false;
  }
  return FEMALE_VOICE_KEYWORDS.some((kw) => name.includes(kw) || uri.includes(kw));
}

export function getVoiceDisplayName(voice: SpeechSynthesisVoice): string {
  const name = voice.name
    .replace(/^Microsoft\s+/i, '')
    .replace(/\s+Online\s+\(Natural\)/i, ' Natural')
    .replace(/\s+Desktop/i, '')
    .replace(/\s+-\s+English.*$/i, '');
  
  const female = isFemaleVoice(voice);
  const lang = voice.lang || 'en-US';
  return `${name} (${female ? 'Female' : 'Voice'}, ${lang})`;
}

/**
 * Finds the highest-quality female voice available on the host device
 */
function findBestFemaleVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // 1. Natural / Online high quality female voices first
  const highQualityFemale = voices.find((v) => {
    const name = v.name.toLowerCase();
    return (
      v.lang.startsWith('en') &&
      (name.includes('jenny') || name.includes('aria') || name.includes('natural')) &&
      !MALE_VOICE_KEYWORDS.some((m) => name.includes(m))
    );
  });
  if (highQualityFemale) return highQualityFemale;

  // 2. Clear standard female voices (Zira on Windows, Samantha/Victoria on Mac, Google US English)
  const standardFemale = voices.find((v) => {
    const name = v.name.toLowerCase();
    return (
      v.lang.startsWith('en') &&
      FEMALE_VOICE_KEYWORDS.some((kw) => name.includes(kw)) &&
      !MALE_VOICE_KEYWORDS.some((m) => name.includes(m))
    );
  });
  if (standardFemale) return standardFemale;

  // 3. Any English voice not explicitly named male
  const anyNonMale = voices.find((v) => {
    const name = v.name.toLowerCase();
    return v.lang.startsWith('en') && !MALE_VOICE_KEYWORDS.some((m) => name.includes(m));
  });
  if (anyNonMale) return anyNonMale;

  return voices[0] || null;
}

export function initSpeechVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  const updateVoices = () => {
    const rawVoices = window.speechSynthesis.getVoices();
    if (!rawVoices || rawVoices.length === 0) return;

    allAvailableVoices = rawVoices.filter((v) => v.lang.startsWith('en'));
    if (allAvailableVoices.length === 0) {
      allAvailableVoices = rawVoices;
    }

    // Check saved preference first
    const savedUri = localStorage.getItem(VOICE_PREF_KEY);
    if (savedUri) {
      const matched = allAvailableVoices.find((v) => v.voiceURI === savedUri);
      if (matched) {
        selectedVoice = matched;
        voiceChangeListeners.forEach((l) => l());
        return;
      }
    }

    // Default to best female voice
    selectedVoice = findBestFemaleVoice(allAvailableVoices);
    voiceChangeListeners.forEach((l) => l());
  };

  updateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

// Auto-run in browser context with retry checks
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  initSpeechVoices();
  setTimeout(initSpeechVoices, 50);
  setTimeout(initSpeechVoices, 200);
  setTimeout(initSpeechVoices, 600);
  setTimeout(initSpeechVoices, 1500);
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  if (allAvailableVoices.length === 0) {
    initSpeechVoices();
  }
  return allAvailableVoices;
}

export function getCurrentVoice(): SpeechSynthesisVoice | null {
  if (!selectedVoice) {
    initSpeechVoices();
  }
  return selectedVoice;
}

export function setSelectedVoice(voiceURI: string): void {
  const voices = getAvailableVoices();
  const matched = voices.find((v) => v.voiceURI === voiceURI);
  if (matched) {
    selectedVoice = matched;
    if (typeof window !== 'undefined') {
      localStorage.setItem(VOICE_PREF_KEY, voiceURI);
    }
    voiceChangeListeners.forEach((l) => l());
  }
}

export function resetToDefaultFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  const female = findBestFemaleVoice(voices);
  if (female) {
    selectedVoice = female;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(VOICE_PREF_KEY);
    }
    voiceChangeListeners.forEach((l) => l());
  }
  return selectedVoice;
}

export function getSpeechSettings(): { rate: number; pitch: number } {
  if (typeof window === 'undefined') return { rate: 0.86, pitch: 1.1 };
  const savedRate = localStorage.getItem(RATE_PREF_KEY);
  const savedPitch = localStorage.getItem(PITCH_PREF_KEY);
  return {
    rate: savedRate ? parseFloat(savedRate) : 0.86,
    pitch: savedPitch ? parseFloat(savedPitch) : 1.1,
  };
}

export function setSpeechSettings(rate: number, pitch: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RATE_PREF_KEY, rate.toString());
  localStorage.setItem(PITCH_PREF_KEY, pitch.toString());
  voiceChangeListeners.forEach((l) => l());
}

/**
 * Preview a specific voice with sample speech
 */
export function previewVoice(
  voice: SpeechSynthesisVoice,
  sampleText: string = 'SpellQuest! Listen, spell, and learn together!',
  rate?: number,
  pitch?: number
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const settings = getSpeechSettings();
  const utterance = new SpeechSynthesisUtterance(sampleText);
  utterance.voice = voice;
  utterance.rate = rate ?? settings.rate;
  utterance.pitch = pitch ?? settings.pitch;
  utterance.lang = voice.lang || 'en-US';
  window.speechSynthesis.speak(utterance);
}

/**
 * Speaks a word clearly with the active female/custom voice
 */
export function playWord(word: string, customRate?: number, customPitch?: number): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    // Ensure we have a voice picked
    if (!selectedVoice) {
      initSpeechVoices();
      if (!selectedVoice && window.speechSynthesis.getVoices().length > 0) {
        const raw = window.speechSynthesis.getVoices();
        allAvailableVoices = raw.filter((v) => v.lang.startsWith('en')) || raw;
        selectedVoice = findBestFemaleVoice(allAvailableVoices);
      }
    }

    const settings = getSpeechSettings();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = customRate ?? settings.rate;
    utterance.pitch = customPitch ?? settings.pitch;
    utterance.lang = 'en-US';

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Speaks a word slowly (Say Slowly 🐢) with deliberate syllable pacing
 */
export async function playWordSlowly(word: string, syllables?: string[]): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const settings = getSpeechSettings();
  const slowRate = Math.max(0.55, settings.rate * 0.72);

  if (syllables && syllables.length > 1) {
    for (let i = 0; i < syllables.length; i++) {
      await playWord(syllables[i], slowRate, settings.pitch);
      await new Promise((r) => setTimeout(r, 220));
    }
  } else {
    await playWord(word, slowRate, settings.pitch);
  }
}

/**
 * Speaks the context sentence
 */
export function playSentence(sentence: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    if (!selectedVoice) {
      initSpeechVoices();
    }

    const settings = getSpeechSettings();
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = Math.max(0.75, settings.rate * 0.95);
    utterance.pitch = settings.pitch;
    utterance.lang = 'en-US';

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

// ---------------------------------------------------------------------------
// Web Audio API Synthesizer (Instant SFX, 100% offline, zero asset downloads)
// ---------------------------------------------------------------------------

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCorrectSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gain.gain.setValueAtTime(0, now + idx * 0.08);
    gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.4);
  });
}

export function playTryAgainSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(329.63, now);
  osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.25);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.35);
}

export function playCoinSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(987.77, now);
  osc.frequency.setValueAtTime(1318.51, now + 0.07);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.4);
}

export function playLevelUpSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.12);

    gain.gain.setValueAtTime(0.2, now + idx * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.12);
    osc.stop(now + idx * 0.12 + 0.55);
  });
}

export function playBossHitSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.3);
}

export function playBossDefeatedSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [392, 523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.14);

    gain.gain.setValueAtTime(0.25, now + idx * 0.14);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.14);
    osc.stop(now + idx * 0.14 + 0.65);
  });
}

export function playClickSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.06);
}
