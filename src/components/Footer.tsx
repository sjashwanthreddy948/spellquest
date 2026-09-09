'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, BookOpen, Sparkles } from 'lucide-react';
import { playClickSound } from '@/lib/spelling/audio';

export const Footer: React.FC = () => {
  // Mobile accordion states
  const [productOpen, setProductOpen] = useState(false);
  const [learningOpen, setLearningOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const productLinks = [
    { label: 'Adventure', href: '/adventure' },
    { label: 'Practice', href: '/play' },
    { label: 'Progress', href: '/dashboard' },
    { label: 'Achievements', href: '/achievements' },
  ];

  const learningLinks = [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'About SpellQuest', href: '/about' },
    { label: 'Daily Practice', href: '/play' },
  ];

  const supportLinks = [
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
  ];

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-300 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Desktop Footer Grid */}
        <div className="hidden md:grid md:grid-cols-5 gap-8 pb-10 border-b border-slate-800/70">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <Link
              href="/"
              onClick={() => playClickSound()}
              className="flex items-center gap-2.5 group select-none inline-flex"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                SPELLQUEST
              </span>
            </Link>

            <p className="text-xs font-semibold text-amber-300">
              Listen. Spell. Learn. Master.
            </p>

            <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
              Interactive spelling practice designed to help children build spelling confidence through listening, progressive levels, and friendly feedback.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              PRODUCT
            </h4>
            <ul className="space-y-2.5 text-xs">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => playClickSound()}
                    className="text-slate-300 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              LEARNING
            </h4>
            <ul className="space-y-2.5 text-xs">
              {learningLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => playClickSound()}
                    className="text-slate-300 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              SUPPORT
            </h4>
            <ul className="space-y-2.5 text-xs">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => playClickSound()}
                    className="text-slate-300 hover:text-white transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Mobile Accordion Footer */}
        <div className="md:hidden space-y-4 pb-8 border-b border-slate-800/70">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white">SpellQuest</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-xs text-amber-300 font-medium">
              Listen. Spell. Learn. Master.
            </p>
          </div>

          {/* Product Accordion */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
            <button
              onClick={() => setProductOpen(!productOpen)}
              className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-white text-left"
            >
              <span>Product</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  productOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {productOpen && (
              <ul className="p-3.5 pt-0 space-y-2 text-xs border-t border-slate-800/60">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => playClickSound()}
                      className="block py-1 text-slate-300 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Learning Accordion */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
            <button
              onClick={() => setLearningOpen(!learningOpen)}
              className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-white text-left"
            >
              <span>Learning</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  learningOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {learningOpen && (
              <ul className="p-3.5 pt-0 space-y-2 text-xs border-t border-slate-800/60">
                {learningLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => playClickSound()}
                      className="block py-1 text-slate-300 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Support Accordion */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
            <button
              onClick={() => setSupportOpen(!supportOpen)}
              className="w-full flex items-center justify-between p-3.5 text-xs font-bold text-white text-left"
            >
              <span>Support</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  supportOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {supportOpen && (
              <ul className="p-3.5 pt-0 space-y-2 text-xs border-t border-slate-800/60">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => playClickSound()}
                      className="block py-1 text-slate-300 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* Bottom Copyright & Developer Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
          <div>
            <span>© 2026 SpellQuest. All rights reserved.</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="text-slate-400">Developed by</span>
            <span className="font-semibold text-slate-200">S. Jashwanth Reddy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
