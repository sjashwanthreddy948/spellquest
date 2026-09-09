import React from 'react';
import { FileText, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Terms of Use — SpellQuest Educational Platform',
  description:
    'Review the terms of service and conditions for using the SpellQuest spelling learning application.',
};

export default function TermsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-750 text-amber-300 text-xs font-bold">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span>Terms & Conditions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Terms of Use
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Please read these terms before embarking on your SpellQuest adventure.
        </p>
        <p className="text-xs text-slate-400">Effective Date: September 2026</p>
      </div>

      {/* Main Content */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-slate-750 space-y-6 text-sm text-slate-300 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Educational Purpose</h2>
          <p>
            SpellQuest is designed as an interactive educational practice aid to assist children in strengthening English spelling and phonics skills through gamified repetition.
          </p>
          <p className="text-xs text-slate-400 italic">
            Note: SpellQuest is an educational software game and does not claim to provide certified clinical speech pathology, medical treatment, or guaranteed exam results.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Acceptable Use & Supervision</h2>
          <p>
            SpellQuest is intended for elementary and middle school students under the guidance of parents, guardians, or teachers. Users agree to use the platform solely for lawful educational purposes and agree not to disrupt, reverse-engineer, or attempt unauthorized access to server infrastructure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. User Accounts & Progress</h2>
          <p>
            Account creation requires a student display name and contact identifier. You are responsible for maintaining the confidentiality of any parent PIN credentials used to access administrative analytics dashboards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Intellectual Property</h2>
          <p>
            All game mechanics, illustrations, branding, UI components, pedagogical word databases, and source code are the intellectual property of SpellQuest and developer S. Jashwanth Reddy, protected under applicable copyright and intellectual property laws.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">5. Service Availability & Changes</h2>
          <p>
            We strive to maintain continuous availability and smooth performance across desktop and mobile devices. SpellQuest reserves the right to enhance, modify, or update game stages, vocabulary lists, and audio features to improve pedagogical effectiveness.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">6. Limitation of Liability</h2>
          <p>
            To the extent permitted by law, SpellQuest and its developer are provided on an &quot;as is&quot; basis without warranties of uninterrupted uptime or fitness for specialized competitive examinations.
          </p>
        </section>

      </div>

      <div className="text-center text-xs text-slate-400">
        © 2026 SpellQuest • Developed by S. Jashwanth Reddy
      </div>

    </div>
  );
}
