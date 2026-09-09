'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  Volume2,
  Edit3,
  Sparkles,
  Trophy,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Brain,
  TrendingUp,
  MapPin,
  Target,
  BookOpen,
  Flame,
  Check,
  Lock,
  Unlock,
  Play,
  RotateCcw,
} from 'lucide-react';
import { playClickSound, playWord } from '@/lib/spelling/audio';
import { useGameStore } from '@/lib/game/gameStore';

export default function LandingPage() {
  const { state } = useGameStore();
  const isLoggedIn = state.currentUser?.isLoggedIn;

  const liveAttempts = state.attempts.length;
  const liveCorrect = state.attempts.filter((a) => a.isCorrect).length;
  const liveAccuracy = liveAttempts > 0 ? Math.round((liveCorrect / liveAttempts) * 100) : 0;
  const liveMastered = state.srsQueue.filter((i) => i.status === 'mastered').length;
  const liveReviewDue = state.srsQueue.filter((i) => new Date(i.nextReviewDate) <= new Date()).length;

  // Interactive Game Preview state
  const [previewInput, setPreviewInput] = useState('beautifull');
  const [previewChecked, setPreviewChecked] = useState(true);

  return (
    <div className="w-full space-y-16 sm:space-y-24 py-6 sm:py-12 animate-in fade-in duration-200">
      
      {/* 2. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-750 text-amber-300 text-xs sm:text-sm font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Interactive Spelling Adventure for Children</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Turn Spelling Into <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                an Adventure. 🚀
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Listen, spell, practice, and unlock your next adventure while building stronger spelling skills through structured, progressive levels.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href={isLoggedIn ? '/adventure' : '/register'}
                onClick={() => playClickSound()}
                className="w-full sm:w-auto min-h-[50px] flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 active:scale-95 transition cursor-pointer"
              >
                <Compass className="w-5 h-5" />
                <span>{isLoggedIn ? 'Continue Adventure' : 'Start Your Adventure'}</span>
              </Link>

              <Link
                href="/how-it-works"
                onClick={() => playClickSound()}
                className="w-full sm:w-auto min-h-[50px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border-2 border-slate-750 text-slate-200 hover:text-white font-bold text-sm transition"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>How It Works</span>
              </Link>
            </div>

            {/* Quick trust statement */}
            <p className="text-xs text-slate-400 pt-1">
              SpellQuest is designed for elementary students • Free passwordless registration
            </p>
          </div>

          {/* Right Column: Hero Graphic Banner */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/40 group">
              <div className="relative h-64 sm:h-80 w-full">
                <Image
                  src="/images/hero.jpg"
                  alt="SpellQuest Magical Realm with Companions"
                  fill
                  className="object-cover group-hover:scale-105 transition duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-750 backdrop-blur-md flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block">World 1</span>
                  <span className="text-sm font-extrabold text-white">🌱 Word Garden</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                  Stage 1 Ready
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS (4-STEP SECTION) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-750 text-amber-300 text-xs font-bold">
            <span>Simple 4-Step Cycle</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            A proven learning loop that helps children understand spelling patterns without frustration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-slate-900 border-2 border-slate-750 space-y-3 relative hover:border-amber-400/40 transition">
            <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
              01
            </span>
            <div className="text-3xl">🔊</div>
            <h3 className="text-lg font-black text-white">Listen</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Hear the word clearly with pronunciation speed control and example sentences.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-slate-900 border-2 border-slate-750 space-y-3 relative hover:border-amber-400/40 transition">
            <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
              02
            </span>
            <div className="text-3xl">✏️</div>
            <h3 className="text-lg font-black text-white">Spell</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Type what you hear using the touch-friendly interface or keyboard.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-slate-900 border-2 border-slate-750 space-y-3 relative hover:border-amber-400/40 transition">
            <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
              03
            </span>
            <div className="text-3xl">🌱</div>
            <h3 className="text-lg font-black text-white">Learn</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Get friendly feedback and understand mistakes with letter-by-letter diff highlights.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-slate-900 border-2 border-slate-750 space-y-3 relative hover:border-amber-400/40 transition">
            <span className="text-xs font-mono font-bold text-amber-400 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800">
              04
            </span>
            <div className="text-3xl">⭐</div>
            <h3 className="text-lg font-black text-white">Level Up</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Earn XP, unlock stages, celebrate streaks, and watch spelling confidence grow.
            </p>
          </div>

        </div>
      </section>

      {/* 4. PROFESSIONAL FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Features Built for Young Spellers
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Everything students need to stay motivated and build permanent spelling mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-slate-900/80 border-2 border-slate-750 space-y-2.5">
            <span className="text-2xl">🎮</span>
            <h3 className="text-base font-bold text-white">Adventure-Based Learning</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Progress through worlds and stages, turning repetitive word lists into an engaging journey.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border-2 border-slate-750 space-y-2.5">
            <span className="text-2xl">🔊</span>
            <h3 className="text-base font-bold text-white">Listen & Spell</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hear words spoken with clear articulation and contextual sentences before typing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border-2 border-slate-750 space-y-2.5">
            <span className="text-2xl">🧠</span>
            <h3 className="text-base font-bold text-white">Smart Practice</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Previously difficult words return at useful intervals for additional reinforcement.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border-2 border-slate-750 space-y-2.5">
            <span className="text-2xl">⭐</span>
            <h3 className="text-base font-bold text-white">Progress & Rewards</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Earn XP, badges, streaks, and achievements that reward effort rather than perfection.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border-2 border-slate-750 space-y-2.5">
            <span className="text-2xl">📈</span>
            <h3 className="text-base font-bold text-white">Progress Tracking</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              See spelling improvement over time with accurate statistics and pattern breakdowns.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border-2 border-slate-750 space-y-2.5">
            <span className="text-2xl">🗺️</span>
            <h3 className="text-base font-bold text-white">Progressive Levels</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Complete one stage to unlock the next, ensuring children build on mastered foundations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border-2 border-slate-750 space-y-2.5">
            <span className="text-2xl">🎯</span>
            <h3 className="text-base font-bold text-white">Daily Missions</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Short daily challenges encourage consistent, bite-sized practice without burnout.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border-2 border-slate-750 space-y-2.5">
            <span className="text-2xl">📚</span>
            <h3 className="text-base font-bold text-white">Large Vocabulary</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Structured vocabulary across multiple difficulty levels, covering core grade requirements.
            </p>
          </div>

        </div>
      </section>

      {/* 5. WHY SPELLQUEST (EDUCATIONAL APPROACH) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border-2 border-slate-750 shadow-2xl space-y-8">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Why SpellQuest?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              SpellQuest combines practice, repetition, immediate feedback, and game-based progression to make spelling practice more engaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Practice */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border-2 border-slate-750 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Practice</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Regular short challenges designed to fit comfortably into daily routines without feeling overwhelming.
              </p>
            </div>

            {/* Remember */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border-2 border-slate-750 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Remember</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Previously difficult words return at useful intervals so phonics rules and tricky letters stick.
              </p>
            </div>

            {/* Improve */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border-2 border-slate-750 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Improve</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Difficulty changes according to performance, ensuring students are challenged without feeling discouraged.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. GAME PREVIEW (INTERACTIVE / VISUAL PREVIEW) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-8">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Interactive Experience
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Spelling Challenge Preview
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            See how friendly feedback guides students through tricky spellings.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-slate-750 shadow-2xl space-y-6">
          
          {/* Audio Prompt */}
          <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <button
              onClick={() => playWord('beautiful')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30 font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>🔊 Listen carefully: &quot;beautiful&quot;</span>
            </button>
            <p className="text-xs text-slate-400 italic">
              &quot;The mountain trail was surrounded by beautiful flowers.&quot;
            </p>
          </div>

          {/* Typing Area */}
          <div className="space-y-3 max-w-md mx-auto text-center">
            <label className="text-xs font-bold text-slate-300">
              Type the word:
            </label>
            <div className="relative">
              <input
                type="text"
                value={previewInput}
                onChange={(e) => {
                  setPreviewInput(e.target.value);
                  setPreviewChecked(false);
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-slate-950 border-2 border-slate-750 text-white font-mono text-center text-lg sm:text-xl font-bold tracking-wider focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={() => setPreviewChecked(true)}
              className="w-full py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-md transition cursor-pointer"
            >
              CHECK ANSWER
            </button>
          </div>

          {/* Feedback Display */}
          {previewChecked && (
            <div className="p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-500/40 max-w-md mx-auto space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <span>🌱 Almost!</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                You added one extra <span className="text-amber-300 font-bold">L</span>. Words ending in the suffix <span className="text-emerald-300 font-mono font-bold">-ful</span> only use one L (as in <span className="font-mono text-white">beautiful</span>).
              </p>
            </div>
          )}

        </div>
      </section>

      {/* 7. ADVENTURE PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-slate-750 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Progress Through the Realm
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Complete a stage to unlock the next part of your adventure.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* World 1 */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/40 text-center space-y-1.5">
              <span className="text-2xl block">🌱</span>
              <span className="text-xs font-extrabold text-white block">Word Garden</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <Check className="w-3 h-3 stroke-[3]" /> Active
              </span>
            </div>

            {/* World 2 */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border-2 border-slate-750 text-center space-y-1.5 opacity-90">
              <span className="text-2xl block">🌳</span>
              <span className="text-xs font-bold text-white block">Spelling Forest</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-750">
                <Unlock className="w-3 h-3" /> Unlocks Lv.2
              </span>
            </div>

            {/* World 3 */}
            <div className="p-4 rounded-2xl bg-slate-950/50 border-2 border-slate-800 text-center space-y-1.5 opacity-70">
              <span className="text-2xl block">🏰</span>
              <span className="text-xs font-bold text-slate-300 block">Word Kingdom</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                <Lock className="w-3 h-3" /> Locked
              </span>
            </div>

            {/* World 4 */}
            <div className="p-4 rounded-2xl bg-slate-950/50 border-2 border-slate-800 text-center space-y-1.5 opacity-70">
              <span className="text-2xl block">🌌</span>
              <span className="text-xs font-bold text-slate-300 block">Word Galaxy</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                <Lock className="w-3 h-3" /> Locked
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* 8. SAMPLE PROGRESS DASHBOARD SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Personal Progress & Growth
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real progress metrics recorded accurately in your student profile upon login.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-slate-750 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-2xl">
                {isLoggedIn ? state.profile.avatar : '🧙‍♀️'}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block">
                  {isLoggedIn ? 'Your Active Journey' : 'New Account Preview (Clean State)'}
                </span>
                <span className="text-lg font-black text-white">
                  {isLoggedIn ? state.profile.name : '0 Scores Recorded'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-400 font-extrabold text-xs sm:text-sm">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>{isLoggedIn ? `${state.profile.streakDays} Day Streak` : '0 Day Streak'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-slate-750">
              <span className="text-[11px] font-bold text-slate-300 uppercase">Accuracy</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">
                {isLoggedIn ? `${liveAccuracy}%` : '0%'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-slate-750">
              <span className="text-[11px] font-bold text-slate-300 uppercase">Words Practiced</span>
              <p className="text-2xl font-black text-white mt-1">
                {isLoggedIn ? liveAttempts : 0}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-slate-750">
              <span className="text-[11px] font-bold text-slate-300 uppercase">Words Mastered</span>
              <p className="text-2xl font-black text-amber-300 mt-1">
                {isLoggedIn ? liveMastered : 0}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border-2 border-slate-750">
              <span className="text-[11px] font-bold text-slate-300 uppercase">Review Due</span>
              <p className="text-2xl font-black text-indigo-300 mt-1">
                {isLoggedIn ? `${liveReviewDue} words` : '0 words'}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center italic">
            * Accounts start clean with 0 scores. Scores, coins, and streaks build up exclusively as students practice after logging in.
          </p>
        </div>
      </section>

      {/* 9. DAILY LEARNING SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-slate-750 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2 max-w-lg mx-auto">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Consistent Daily Practice
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Short, focused practice sessions help keep learning manageable and enjoyable.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border-2 border-slate-750 space-y-4 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-sm font-black text-white">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Today&apos;s Mission</span>
            </div>

            {/* Mission 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-200">Practice 15 words</span>
                <span className="text-amber-400">12 / 15</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            {/* Mission 2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-200">Review 3 tricky words</span>
                <span className="text-emerald-400">2 / 3</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '66%' }} />
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href={isLoggedIn ? '/play' : '/register'}
              onClick={() => playClickSound()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-sm shadow-md transition cursor-pointer"
            >
              <span>{isLoggedIn ? 'Start Today\'s Practice' : 'Begin Free Learning'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
