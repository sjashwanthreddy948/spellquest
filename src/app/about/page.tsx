import React from 'react';
import Link from 'next/link';
import { BookOpen, Compass, Sparkles, Target, Trophy, Clock, Heart, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About SpellQuest — Purposeful Spelling Practice for Children',
  description:
    'Learn about SpellQuest, an engaging educational spelling platform combining phonics patterns, multi-sensory listening, and progressive challenges.',
};

export default function AboutPage() {
  const pillars = [
    {
      icon: Target,
      title: 'Interactive Spelling Challenges',
      description:
        'Children engage with words through audio dictation, unscrambling, missing letters, and proofreading rather than dull memorization sheets.',
    },
    {
      icon: Compass,
      title: 'Progressive Levels & Worlds',
      description:
        'Learning begins with basic phonetic patterns and advances systematically into compound words, silent consonants, and complex suffixes.',
    },
    {
      icon: Heart,
      title: 'Supportive, Constructive Feedback',
      description:
        'Instead of punishing mistakes, SpellQuest highlights exact slip-ups (such as doubled letters or tricky vowels) so children learn where to focus.',
    },
    {
      icon: Clock,
      title: 'Smart Spaced Repetition',
      description:
        'Words that pose a challenge are gently scheduled to reappear in future sessions until genuine mastery and retention are achieved.',
    },
    {
      icon: Trophy,
      title: 'Wholesome Motivation & Rewards',
      description:
        'Learners earn experience points, unlock companion mascots, and complete daily missions that celebrate effort and consistency.',
    },
    {
      icon: ShieldCheck,
      title: 'Child-Safe & Privacy-First',
      description:
        'Designed from the ground up for safety: no public chat, no profile photo uploads, and no invasive personal data collection.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-750 text-amber-300 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          About SpellQuest
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          SpellQuest is a learning-focused spelling game designed to make spelling practice more engaging, approachable, and confidence-building for children.
        </p>
      </div>

      {/* Main Philosophy Block */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-slate-750 shadow-xl space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Why Spelling Practice Matters
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Confidence in spelling is closely linked with expressive writing and reading comprehension. Traditional spelling drills often rely on static flashcards or rote word lists, which can quickly feel tedious and frustrating for young learners.
        </p>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          SpellQuest transforms this experience by presenting spelling as a step-by-step adventure. Children listen attentively, type their answer, receive immediate friendly hints, and watch their virtual world blossom as their vocabulary expands.
        </p>
      </div>

      {/* 6 Core Pillars Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-white text-center sm:text-left">
          Core Pillars of SpellQuest
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-6 rounded-2xl bg-slate-900/80 border-2 border-slate-750 space-y-3 hover:border-amber-400/40 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">{pillar.title}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Developer & Project Background Note */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Creator
        </span>
        <h4 className="text-lg font-bold text-white">
          Developed with care by S. Jashwanth Reddy
        </h4>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Built as an independent educational project focused on thoughtful interaction design, mobile accessibility, and clean pedagogical software architecture.
        </p>
        <div className="pt-2">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-sm shadow-md transition"
          >
            <span>Start Exploring SpellQuest</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
