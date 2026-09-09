'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, MessageSquare, Play, Sliders } from 'lucide-react';
import {
  initSpeechVoices,
  playSentence,
  playWord,
  playWordSlowly,
  getCurrentVoice,
  isFemaleVoice,
  subscribeToVoiceChanges,
} from '@/lib/spelling/audio';
import { VoiceSelectorModal } from './VoiceSelectorModal';

interface AudioControlsProps {
  word: string;
  syllables?: string[];
  exampleSentence?: string;
  autoPlayOnMount?: boolean;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  word,
  syllables,
  exampleSentence,
  autoPlayOnMount = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeType, setActiveType] = useState<'normal' | 'slow' | 'sentence' | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [voiceName, setVoiceName] = useState<string>('Female Voice');
  const [isFemale, setIsFemale] = useState<boolean>(true);

  const handlePlayNormal = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setActiveType('normal');
    try {
      await playWord(word);
    } finally {
      setIsPlaying(false);
      setActiveType(null);
    }
  };

  useEffect(() => {
    initSpeechVoices();
    const updateVoice = () => {
      const v = getCurrentVoice();
      if (v) {
        const shortName = v.name.replace(/^Microsoft\s+/i, '').split(' ')[0] || 'Voice';
        setVoiceName(shortName);
        setIsFemale(isFemaleVoice(v));
      }
    };
    updateVoice();
    const unsub = subscribeToVoiceChanges(updateVoice);

    if (autoPlayOnMount) {
      handlePlayNormal();
    }
    return unsub;
  }, [word]);

  const handlePlaySlowly = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setActiveType('slow');
    try {
      await playWordSlowly(word, syllables);
    } finally {
      setIsPlaying(false);
      setActiveType(null);
    }
  };

  const handlePlaySentence = async () => {
    if (isPlaying || !exampleSentence) return;
    setIsPlaying(true);
    setActiveType('sentence');
    try {
      await playSentence(exampleSentence);
    } finally {
      setIsPlaying(false);
      setActiveType(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Big Play Word Button */}
      <div className="relative group">
        {/* Animated Glow Rings when Playing */}
        {isPlaying && activeType === 'normal' && (
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-indigo-500 rounded-full blur-md opacity-75 animate-ping" />
        )}

        <button
          onClick={handlePlayNormal}
          disabled={isPlaying}
          className="relative flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-lg sm:text-xl shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all disabled:opacity-80 cursor-pointer"
        >
          <Volume2 className={`w-7 h-7 ${isPlaying && activeType === 'normal' ? 'animate-bounce' : ''}`} />
          <span>{isPlaying && activeType === 'normal' ? 'Speaking...' : 'Play Word'}</span>
        </button>
      </div>

      {/* Secondary Audio Controls: Say Slowly & Context Sentence */}
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={handlePlaySlowly}
          disabled={isPlaying}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
            activeType === 'slow'
              ? 'bg-indigo-600/30 border-indigo-400 text-indigo-300'
              : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title="Pronounce each syllable slowly and distinctly"
        >
          <span className="text-base">🐢</span>
          <span>Say Slowly</span>
        </button>

        {exampleSentence && (
          <button
            onClick={handlePlaySentence}
            disabled={isPlaying}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              activeType === 'sentence'
                ? 'bg-purple-600/30 border-purple-400 text-purple-300'
                : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Listen to the word inside a context sentence"
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>Example</span>
          </button>
        )}

        {/* Voice Selector / Settings Trigger */}
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-all cursor-pointer shadow-sm active:scale-95"
          title="Choose speaking voice (Clear Female voice default) and adjust pacing"
        >
          <span>{isFemale ? '👩' : '🎙️'}</span>
          <span className="max-w-[70px] sm:max-w-[100px] truncate">{voiceName}</span>
          <Sliders className="w-3 h-3 text-amber-400" />
        </button>
      </div>

      {/* Voice Selection & Speech Speed Modal */}
      <VoiceSelectorModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  );
};
