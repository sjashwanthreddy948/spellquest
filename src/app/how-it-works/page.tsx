import React from 'react';
import Link from 'next/link';
import { Volume2, Keyboard, CheckCircle, RefreshCw, Trophy, Unlock, ArrowRight, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'How It Works — SpellQuest Spelling Learning Loop',
  description:
    'Learn how SpellQuest guides children through listening, typing, targeted feedback, spaced repetition review, and stage progression.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      step: '01',
      title: 'Listen to the Word',
      icon: Volume2,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      description:
        'A clear voice speaks the word in isolation and reads an illustrative contextual sentence. Children can replay the audio or hear slow syllable enunciations.',
      example: '🔊 "Beautiful... The garden has beautiful flowers."',
    },
    {
      step: '02',
      title: 'Type the Spelling',
      icon: Keyboard,
      color: 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400',
      description:
        'Learners type what they hear. On mobile devices, large touch-friendly buttons prevent typing slips while desktop users can type on their keyboard.',
      example: '⌨️ Input: [ b - e - a - u - t - i - f - u - l ]',
    },
    {
      step: '03',
      title: 'Receive Instant, Clear Feedback',
      icon: CheckCircle,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      description:
        'Instead of an unhelpful red cross, SpellQuest analyzes letter sequences and shows friendly coaching tips for common traps like double letters or silent vowels.',
      example: '🌱 Feedback: "Almost! The suffix -ful only uses one L."',
    },
    {
      step: '04',
      title: 'Practice Difficult Words Again',
      icon: RefreshCw,
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
      description:
        'Words that posed a challenge are added to the student review queue. They reappear at calculated intervals until the child spells them correctly twice in a row.',
      example: '🧠 Smart Review: Returning 3 tricky words to strengthen memory.',
    },
    {
      step: '05',
      title: 'Complete the Stage',
      icon: Trophy,
      color: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30 text-yellow-400',
      description:
        'Each stage features 5 to 8 carefully chosen words. Achieving high accuracy earns up to 3 stars, adventure coins for avatars, and experience points.',
      example: '⭐ Stage 1 Cleared: +300 XP, 3 Stars, 20 Coins earned!',
    },
    {
      step: '06',
      title: 'Unlock the Next Adventure',
      icon: Unlock,
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
      description:
        'Completing a stage unlocks the next path on the Adventure Map, guiding learners through Word Garden, Spelling Forest, Grammar Kingdom, and Challenge Mountain.',
      example: '🔓 Unlocked: Stage 2 "Petal Pathway" is now accessible!',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-750 text-amber-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Step-by-Step Learning Guide</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          How SpellQuest Works
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Our six-step learning cycle balances auditory phonics, interactive spelling practice, respectful mistake analysis, and progressive game motivation.
        </p>
      </div>

      {/* 6 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.step}
              className={`p-6 sm:p-7 rounded-3xl bg-slate-900 border-2 ${st.color} space-y-4 shadow-lg hover:translate-y-[-2px] transition duration-200`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-750 text-slate-200">
                  Step {st.step}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {st.description}
                </p>
              </div>

              {/* Sample Card */}
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-xs text-amber-300">
                {st.example}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-500/10 border-2 border-slate-750 text-center space-y-4">
        <h3 className="text-2xl font-black text-white">
          Ready to Start Your Child’s Quest?
        </h3>
        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Create a free account in 30 seconds with no password required and begin Stage 1.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition"
        >
          <span>Begin Free Adventure</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
