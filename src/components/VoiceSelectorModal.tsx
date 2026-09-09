'use client';

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Check,
  RotateCcw,
  Sparkles,
  X,
  Sliders,
  Play,
  Heart,
} from 'lucide-react';
import {
  getAvailableVoices,
  getCurrentVoice,
  setSelectedVoice,
  resetToDefaultFemaleVoice,
  previewVoice,
  isFemaleVoice,
  getVoiceDisplayName,
  getSpeechSettings,
  setSpeechSettings,
  subscribeToVoiceChanges,
} from '@/lib/spelling/audio';

interface VoiceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSelectorModal: React.FC<VoiceSelectorModalProps> = ({ isOpen, onClose }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoiceState] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState<number>(0.86);
  const [pitch, setPitch] = useState<number>(1.1);
  const [previewingUri, setPreviewingUri] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'female' | 'all'>('female');

  useEffect(() => {
    const update = () => {
      const v = getAvailableVoices();
      setVoices(v);
      setCurrentVoiceState(getCurrentVoice());
      const s = getSpeechSettings();
      setRate(s.rate);
      setPitch(s.pitch);
    };

    update();
    const unsub = subscribeToVoiceChanges(update);
    return unsub;
  }, [isOpen]);

  if (!isOpen) return null;

  const femaleVoices = voices.filter(isFemaleVoice);
  const displayedVoices = activeTab === 'female' && femaleVoices.length > 0 ? femaleVoices : voices;

  const handleSelect = (voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice.voiceURI);
    setCurrentVoiceState(voice);
    // Give immediate auditory feedback with the chosen voice
    previewVoice(voice, `Selected ${voice.name.split(' ')[1] || 'female voice'}!`, rate, pitch);
  };

  const handleTest = (voice: SpeechSynthesisVoice, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewingUri(voice.voiceURI);
    previewVoice(voice, 'SpellQuest! Listen, spell, and learn with me!', rate, pitch);
    setTimeout(() => {
      setPreviewingUri(null);
    }, 2500);
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    setSpeechSettings(newRate, pitch);
    if (currentVoice) {
      previewVoice(currentVoice, 'Listening pace updated!', newRate, pitch);
    }
  };

  const handlePitchChange = (newPitch: number) => {
    setPitch(newPitch);
    setSpeechSettings(rate, newPitch);
    if (currentVoice) {
      previewVoice(currentVoice, 'Voice pitch updated!', rate, newPitch);
    }
  };

  const handleReset = () => {
    const def = resetToDefaultFemaleVoice();
    setRate(0.86);
    setPitch(1.1);
    setSpeechSettings(0.86, 1.1);
    if (def) {
      setCurrentVoiceState(def);
      previewVoice(def, 'Restored to default clear female voice!', 0.86, 1.1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-black">
              🎙️
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white leading-tight">
                Voice & Pronunciation
              </h2>
              <p className="text-[11px] text-slate-200 font-medium">
                Clear Female Voice Default & Custom Speech
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Active Voice Spotlight Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-purple-500/15 border-2 border-amber-500/40 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Active Speaking Voice
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">
                {currentVoice ? getVoiceDisplayName(currentVoice) : 'Auto Clear Female Voice'}
              </p>
            </div>
            {currentVoice && (
              <button
                onClick={(e) => handleTest(currentVoice, e)}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-slate-950" />
                <span>Test</span>
              </button>
            )}
          </div>

          {/* Speed & Pitch Controls */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border-2 border-slate-750 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" /> Speech Rate (Pacing)
              </span>
              <span className="text-xs font-black text-amber-400">
                {rate.toFixed(2)}x {rate < 0.8 ? '🐢 Slow' : rate <= 0.9 ? '🌟 Friendly' : '⚡ Normal'}
              </span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.1"
              step="0.05"
              value={rate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-300">
              <span>0.6x Syllable Pace</span>
              <span>0.86x Recommended</span>
              <span>1.1x Fast</span>
            </div>
          </div>

          {/* Voice List Filter Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase text-slate-200 tracking-wider">
                Select Voice
              </span>
              <div className="flex bg-slate-950 p-0.5 rounded-xl border border-slate-750 text-[11px]">
                <button
                  onClick={() => setActiveTab('female')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    activeTab === 'female'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  👩 Recommended Female
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  🌐 All Voices ({voices.length})
                </button>
              </div>
            </div>

            {/* List of Voices */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {displayedVoices.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-300 bg-slate-950/80 rounded-2xl border border-slate-750">
                  No system voices loaded yet. Browser voices will appear automatically.
                </div>
              ) : (
                displayedVoices.map((voice) => {
                  const isSelected = currentVoice?.voiceURI === voice.voiceURI;
                  const isFemale = isFemaleVoice(voice);
                  const isTesting = previewingUri === voice.voiceURI;

                  return (
                    <div
                      key={voice.voiceURI}
                      onClick={() => handleSelect(voice)}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-indigo-950/70 border-amber-400 shadow-md shadow-amber-400/20'
                          : 'bg-slate-950/80 hover:bg-slate-850 border-slate-750 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 font-black'
                              : isFemale
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : isFemale ? '👩' : '🎙️'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {voice.name.replace(/^Microsoft\s+/i, '')}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-300">
                            <span>{voice.lang}</span>
                            {isFemale && (
                              <>
                                <span>•</span>
                                <span className="text-rose-400 font-bold">Clear Female</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={(e) => handleTest(voice, e)}
                          className={`min-h-[34px] px-2.5 py-1 rounded-xl text-[11px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                            isTesting
                              ? 'bg-amber-400 text-slate-950 border-amber-400 font-black animate-pulse'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isTesting ? 'Playing...' : 'Test'}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(voice);
                          }}
                          className={`min-h-[34px] px-3 py-1 rounded-xl text-[11px] font-black transition cursor-pointer ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          }`}
                        >
                          {isSelected ? 'Active' : 'Choose'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-750 bg-slate-900/90 flex items-center justify-between gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-amber-300 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Female Voice</span>
          </button>

          <button
            onClick={onClose}
            className="min-h-[40px] px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
