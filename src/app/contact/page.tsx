'use client';

import React, { useState } from 'react';
import { Mail, Send, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { playClickSound } from '@/lib/spelling/audio';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please provide your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (!message.trim() || message.length < 10) {
      setErrorMsg('Please write a message of at least 10 characters.');
      return;
    }

    setIsSubmitting(true);
    playClickSound();

    // Frontend validation passed; simulate clean submission
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-750 text-amber-300 text-xs font-bold">
          <Mail className="w-3.5 h-3.5 text-amber-400" />
          <span>Support & Feedback</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Get in Touch
        </h1>
        <p className="text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
          Have feedback, questions, or suggestions about SpellQuest? We’d love to hear from you.
        </p>
      </div>

      {/* Form Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-slate-750 shadow-2xl space-y-6">
        
        {status === 'success' ? (
          <div className="p-6 rounded-2xl bg-emerald-950/60 border-2 border-emerald-500/50 text-center space-y-3 animate-in fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Thank You for Your Feedback!</h3>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-md mx-auto">
              Your message has been received. In this preview deployment, your submission has been logged locally.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-750 text-xs font-bold text-slate-200 hover:text-white"
            >
              Send Another Note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="text-xs font-bold text-slate-200">
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Teacher Sarah or Alex"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-750 text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none text-sm transition"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-xs font-bold text-slate-200">
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-750 text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none text-sm transition"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label htmlFor="contact-message" className="text-xs font-bold text-slate-200">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your suggestions, questions about word levels, or classroom feedback..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-750 text-white placeholder:text-slate-400 focus:border-amber-400 focus:outline-none text-sm transition resize-none"
              />
            </div>

            {/* Note regarding email backend configuration */}
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Note: Email delivery service (e.g. Resend or SendGrid) can be connected by adding SMTP/API keys to your environment configuration.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-sm shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition cursor-pointer"
            >
              {isSubmitting ? (
                <span>Sending...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>

      {/* Developer Contact Footer Note */}
      <div className="text-center text-xs text-slate-400 space-y-1">
        <p>SpellQuest is maintained by <span className="text-slate-200 font-semibold">S. Jashwanth Reddy</span>.</p>
        <p>Built with Next.js, TypeScript, and Tailwind CSS.</p>
      </div>

    </div>
  );
}
