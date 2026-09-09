'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Coins, Check, Sparkles } from 'lucide-react';
import { useGameStore } from '@/lib/game/gameStore';
import { playCoinSound, playClickSound } from '@/lib/spelling/audio';
import confetti from 'canvas-confetti';

interface ShopItem {
  id: string;
  name: string;
  type: 'avatar' | 'title' | 'companion';
  price: number;
  preview: string;
  description: string;
}

const SHOP_ITEMS: ShopItem[] = [
  // Companions
  {
    id: 'comp-1',
    name: 'Pixel the Cyber-Pup 🐶',
    type: 'companion',
    price: 100,
    preview: '🐶⚡',
    description: 'Barks when you spot silent letters!',
  },
  {
    id: 'comp-2',
    name: 'Luna the Night Owl 🦉',
    type: 'companion',
    price: 200,
    preview: '🦉🌙',
    description: 'Wise companion, loves tricky vowel teams.',
  },
  {
    id: 'comp-3',
    name: 'Ignis the Phoenix 🦅',
    type: 'companion',
    price: 350,
    preview: '🦅🔥',
    description: 'Legendary bird of glowing spelling fire.',
  },
  {
    id: 'comp-4',
    name: 'Astro the Space Cat 🐱',
    type: 'companion',
    price: 250,
    preview: '🐱🚀',
    description: 'Hunts down extra letters in Word Galaxy.',
  },

  // Avatars
  {
    id: 'av-1',
    name: 'Dragon Rider',
    type: 'avatar',
    price: 80,
    preview: '🧝‍♀️',
    description: 'Champion of the Spelling Forest.',
  },
  {
    id: 'av-2',
    name: 'Galaxy Voyager',
    type: 'avatar',
    price: 150,
    preview: '👩‍🚀',
    description: 'Traverses cosmic word constellations.',
  },
  {
    id: 'av-3',
    name: 'Robo Scribe',
    type: 'avatar',
    price: 120,
    preview: '🤖',
    description: 'Powered by pure phonetic algorithms.',
  },

  // Titles
  {
    id: 'tit-1',
    name: 'Grammar Paladin',
    type: 'title',
    price: 50,
    preview: '🛡️',
    description: 'Defender of correct prefixes & suffixes.',
  },
  {
    id: 'tit-2',
    name: 'Lexicon Champion',
    type: 'title',
    price: 150,
    preview: '👑',
    description: 'Honorary title awarded to masters.',
  },
];

export default function MobileShopPage() {
  const { state, buyItem, updateProfile } = useGameStore();
  const [activeTab, setActiveTab] = useState<'companion' | 'avatar' | 'title'>('companion');

  const handlePurchase = (item: ShopItem) => {
    playClickSound();
    const isOwned =
      item.type === 'avatar'
        ? state.profile.unlockedAvatars.includes(item.name)
        : item.type === 'title'
        ? state.profile.unlockedTitles.includes(item.name)
        : state.profile.unlockedCompanions.includes(item.name);

    if (isOwned) {
      if (item.type === 'avatar') updateProfile({ avatar: item.preview });
      if (item.type === 'title') updateProfile({ title: item.name });
      if (item.type === 'companion') updateProfile({ companion: item.name });
      return;
    }

    const success = buyItem(item.type, item.name, item.price);
    if (success) {
      playCoinSound();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const filteredItems = SHOP_ITEMS.filter((i) => i.type === activeTab);

  return (
    <div className="w-full space-y-4 pt-3 pb-8 animate-in fade-in duration-200">
      {/* Header with Coin Balance */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
            Adventure Bazaar
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white">🛍️ Shop & Adopt</h1>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-yellow-950/60 border border-yellow-500/40 text-yellow-300 font-black text-xs sm:text-sm shadow">
          <Coins className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>{state.profile.coins}</span>
        </div>
      </div>

      {/* Guest Notice if unauthenticated */}
      {!state.currentUser?.isLoggedIn && (
        <div className="p-4 rounded-3xl bg-amber-950/60 border-2 border-amber-500/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-black text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Guest Bazaar (0 Coins)</span>
            </div>
            <p className="text-xs text-slate-200">
              Log in or create a profile to earn adventure coins from spelling games and adopt companions!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow transition active:scale-95 whitespace-nowrap"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow transition active:scale-95 whitespace-nowrap"
            >
              Build Profile
            </Link>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-750">
        {(['companion', 'avatar', 'title'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              playClickSound();
              setActiveTab(tab);
            }}
            className={`min-h-[40px] rounded-xl text-xs font-black capitalize transition cursor-pointer ${
              activeTab === tab
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {tab}s
          </button>
        ))}
      </div>

      {/* Items Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredItems.map((item) => {
          const isOwned =
            item.type === 'avatar'
              ? state.profile.unlockedAvatars.includes(item.name)
              : item.type === 'title'
              ? state.profile.unlockedTitles.includes(item.name)
              : state.profile.unlockedCompanions.includes(item.name);

          const isEquipped =
            (item.type === 'avatar' && state.profile.avatar === item.preview) ||
            (item.type === 'title' && state.profile.title === item.name) ||
            (item.type === 'companion' && state.profile.companion === item.name);

          const canAfford = state.profile.coins >= item.price;

          return (
            <div
              key={item.id}
              className="p-4 rounded-3xl bg-slate-900 border-2 border-slate-750 shadow-md flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border-2 border-slate-750 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                  {item.preview}
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-white text-xs sm:text-sm truncate">{item.name}</h3>
                  <p className="text-[10px] text-slate-200 line-clamp-1 font-medium">{item.description}</p>
                  <span className="text-[11px] font-black text-yellow-400 flex items-center gap-1 mt-0.5">
                    <Coins className="w-3 h-3 fill-yellow-400" /> {item.price} Coins
                  </span>
                </div>
              </div>

              {/* 44px+ touch button */}
              <button
                onClick={() => handlePurchase(item)}
                disabled={!isOwned && !canAfford}
                className={`min-h-[44px] min-w-[76px] px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer flex-shrink-0 shadow ${
                  isEquipped
                    ? 'bg-emerald-600/30 border border-emerald-400 text-emerald-300'
                    : isOwned
                    ? 'bg-slate-800 text-slate-200 border border-slate-700'
                    : canAfford
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    : 'bg-slate-950/80 text-slate-400 border border-slate-800 cursor-not-allowed'
                }`}
              >
                {isEquipped ? 'Equipped ✓' : isOwned ? 'Equip' : 'Adopt'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
