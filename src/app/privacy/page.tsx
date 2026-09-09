import React from 'react';
import { Shield, Lock, EyeOff, UserCheck, Trash2 } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — SpellQuest Child-Safe Learning',
  description:
    'Read SpellQuest’s child-conscious privacy policy. Learn what data is used to save spelling progress and how your privacy is protected.',
};

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-750 text-amber-300 text-xs font-bold">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>Child Privacy & Safety First</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          SpellQuest is created for young learners. We believe educational software should collect the minimum information necessary to support learning.
        </p>
        <p className="text-xs text-slate-400">Last updated: September 2026</p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border-2 border-slate-750 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <EyeOff className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">No Photo Uploads</h3>
          <p className="text-xs text-slate-300">
            Children select friendly cartoon avatars (e.g. 🧙‍♀️, 🦊, 🤖). Real photographs are never requested or stored.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border-2 border-slate-750 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">No Public Social Feed</h3>
          <p className="text-xs text-slate-300">
            Student spelling attempts and progress are private to the student and their parent or educator.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border-2 border-slate-750 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Minimal Account Info</h3>
          <p className="text-xs text-slate-300">
            We only store a chosen display first name and a contact identifier (email or phone) to restore saved adventure progress.
          </p>
        </div>
      </div>

      {/* Detailed Policy Content */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-slate-750 space-y-6 text-sm text-slate-300 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p>
            When registering or using SpellQuest, we collect:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li><strong>Display Name:</strong> A first name or nickname chosen by the student or parent.</li>
            <li><strong>Contact Identifier:</strong> A parent email address or phone number used exclusively for session restoration.</li>
            <li><strong>Spelling Game Data:</strong> Words practiced, answers typed, timestamps, response duration, hints used, and unlocked stages.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. What We Explicitly Do NOT Collect</h2>
          <p>SpellQuest never requests or stores:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li>GPS or exact physical location data</li>
            <li>Camera photos, microphone audio recordings, or biometric identifiers</li>
            <li>Full legal government identification</li>
            <li>Commercial advertising tracking profiles</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. How Your Data Is Stored</h2>
          <p>
            SpellQuest uses an offline-first storage model. Your student progress is saved locally in your browser storage (IndexedDB / localStorage) and can sync to an authenticated PostgreSQL database (Supabase) with Row Level Security (RLS) when connected.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Audio & Speech Synthesis</h2>
          <p>
            Spelling pronunciation uses the standard browser SpeechSynthesis API or pre-rendered educational phonetic audio clips. No voice recordings of children are captured or transmitted to remote servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">5. Deletion & Parent Rights</h2>
          <p>
            Parents and educators have the right to inspect or permanently delete all recorded spelling progress at any time. Simply clear your browser storage or contact us to purge any synced database records.
          </p>
        </section>

      </div>

      <div className="text-center text-xs text-slate-400">
        SpellQuest • Developed by S. Jashwanth Reddy
      </div>

    </div>
  );
}
