# SpellQuest

> **Listen. Spell. Learn. Master.**  
> An interactive spelling adventure designed to help children build spelling confidence through listening, progressive levels, friendly feedback, and game-based progression.

---

## Overview

SpellQuest is a learning-focused educational platform that turns English spelling practice into an adventure. Designed for elementary and middle school students, the application balances multi-sensory auditory phonics, structured vocabulary progression, constructive error diffing, and spaced repetition memory scheduling.

The experience is crafted mobile-first to feel like a native educational game on smartphones and tablets, while expanding into an intuitive desktop learning experience.

---

## Features

- **🎮 Adventure-Based Progression**: Complete stages across diverse worlds (Word Garden, Spelling Forest, Grammar Kingdom, Challenge Mountain, Word Galaxy).
- **🔊 Listen & Spell**: High-fidelity speech synthesis with pace adjustment (0.7x to 1.1x) and multi-accent options (US, UK, AUS, Indian English).
- **🌱 Friendly Error Diagnostics**: Character-level diff highlights show exact slips (e.g. single vs double consonants, tricky vowels) with positive feedback.
- **🧠 Spaced Repetition System (SRS)**: Adaptive review queue re-tests previously challenging words at expanding intervals until permanent mastery.
- **🎯 Daily Missions & Streaks**: Encourages manageable daily practice sessions (10–15 words per day) without fatigue.
- **🏆 Rewards & Mascots**: Earn adventure coins and XP to unlock fantasy companions (Sparky the Dragon, Pip the Owl, Luna the Fox) and speller titles.
- **📊 Parent & Educator Portal**: PIN-protected analytics displaying authentic attempt history, accuracy trends, and words in review.
- **🔒 Child-Safe & Privacy-First**: Passwordless account restoration, no photos, no public feeds, and minimal personal data collection.

---

## Learning System

SpellQuest follows a proven pedagogical cycle:

```text
LISTEN 🔊 ──> TYPE ✏️ ──> LEARN 🌱 ──> LEVEL UP ⭐
```

1. **Multi-Sensory Auditory Input**: Words are spoken aloud with accompanying contextual sentences and syllable breakdowns.
2. **Deterministic Mistake Alignment**: Uses modified Damerau-Levenshtein distance algorithms to pinpoint exact transposition, omission, or duplication errors.
3. **Mnemonic Coaching**: Helpful memory hooks (e.g. *"1 Collar & 2 Sleeves = ne-C-e-SS-ary"* or *"-ful only has one L"*) clarify tricky rules.
4. **Adaptive Practice Engine**: Balances 60% new curriculum vocabulary, 25% spaced repetition review, and 15% consolidation challenges.
5. **Anti-Frustration Safeguards**: Clue systems and automatic difficulty scaling keep children motivated through tough words.

---

## Game System

### Worlds & Stages
- **🌱 World 1: Word Garden** (Foundation CVC words, short vowels, and consonant blends)
- **🌳 World 2: Spelling Forest** (Silent letters, doubled consonants, and common suffixes)
- **🏰 World 3: Grammar Kingdom** (Prefixes, vowel combinations, and academic vocabulary)
- **🌋 World 4: Challenge Mountain** (Multi-syllable traps, irregular spellings)
- **🌌 World 5: Word Galaxy** (Latin & Greek roots, advanced phonetics)

### Game Modes
- **Spell It**: Core listening adventure mode with progressive clues.
- **Word Scramble**: Unscramble mixed-up letter tiles to form words.
- **Missing Letters**: Fill in the blank letter slots with visual cues.
- **Find the Mistake**: Proofreading challenge identifying misspelled letters.
- **Memory Challenge**: Memorize syllables before the letters disappear.
- **Speed Spell**: Fast-paced 30-second reflex spelling drill.
- **Boss Battle**: High-stakes stage review testing chapter mastery.

---

## Technology Stack

- **Framework**: Next.js 16 (App Router, Server & Client Components)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS (Dark Fantasy Educational Theme, responsive down to 320px)
- **Icons**: Lucide React
- **Audio**: Web Speech Synthesis API & Web Audio API (procedural SFX synthesizer)
- **Celebrations**: Canvas Confetti
- **State & Storage**: Offline-First Local Registry + Optional Supabase PostgreSQL Sync

---

## Authentication

SpellQuest provides a child-friendly, passwordless registration and login system:
- **Registration**: Student chooses display name, parent contact (email or phone), starting level, companion, and avatar.
- **Session Persistence**: Progress, stage unlocks, XP, coins, and attempts are stored securely per account.
- **Multi-Account Registry**: Seamlessly switches between registered students on the same family device.
- **Guest Exploration**: Visitors can explore the public landing page, How It Works, and preview challenges without creating an account.

---

## Database

SpellQuest supports hybrid persistence:
1. **Offline-First Mode**: Stores student accounts, stage progression, daily missions, and SRS review items locally via browser storage.
2. **Cloud PostgreSQL (Supabase)**: When environment variables are provided, progress automatically synchronizes with Supabase with Row Level Security (RLS).

---

## Local Development

### Prerequisites
- Node.js 18.17+ or 20+
- npm or pnpm

### Getting Started

```bash
# Clone the repository
git clone https://github.com/sjashwanthreddy948/spellquest.git
cd spellquest

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Optional: Supabase PostgreSQL connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# Optional: Google Gemini API Key for dynamic coaching hints
GEMINI_API_KEY=
```

*(Note: If environment variables are omitted, SpellQuest runs in offline-first mode with built-in pedagogical heuristics).*

---

## Supabase Setup

To initialize Supabase tables and Row Level Security:
1. Create a new project on [Supabase](https://supabase.com).
2. Navigate to the **SQL Editor**.
3. Run the SQL statements located in `supabase/schema.sql`.
4. Copy your project URL and anon public key into `.env.local`.

---

## PWA (Progressive Web App)

SpellQuest is configured as an installable Progressive Web App:
- Web App Manifest: `public/manifest.json`
- Mobile Viewport: `viewport-fit=cover` with safe-area padding
- Custom Icon: `public/icon.svg`
- Non-intrusive install banner for mobile Safari and Chrome

---

## Deployment

### Vercel Deployment

1. Push your code to GitHub.
2. Import the repository into [Vercel](https://vercel.com/new).
3. Under **Build & Development Settings**, keep defaults:
   - Framework Preset: **Next.js**
   - Build Command: `next build`
   - Output Directory: `.next`
4. Add any optional environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
5. Click **Deploy**.

---

## Project Structure

```text
spellquest/
├── public/                     # Static assets (images, icons, manifest)
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public)/           # Landing, About, How It Works, Contact, Privacy, Terms
│   │   ├── (auth)/             # Login, Register
│   │   ├── (student)/          # Dashboard, Adventure, Play, Achievements, Shop, Profile
│   │   ├── (parent)/           # Parent/Teacher Dashboard
│   │   ├── icon.svg            # Brand Vector Favicon
│   │   ├── not-found.tsx       # Custom 404
│   │   ├── error.tsx           # Global Error Boundary
│   │   ├── loading.tsx         # Loading State
│   │   └── layout.tsx          # Root Layout with AppShell & SEO
│   ├── components/             # Reusable UI & Game components
│   │   ├── AppShell.tsx        # Public vs App shell router
│   │   ├── PublicNavbar.tsx    # Desktop & mobile public header
│   │   ├── Footer.tsx          # Complete desktop & mobile footer
│   │   ├── modes/              # 7 Spelling game modes
│   │   └── mobile/             # Mobile navigation & modals
│   ├── data/                   # Vocabulary lists, worlds, achievements
│   ├── lib/
│   │   ├── game/               # gameStore.ts (state & accounts)
│   │   ├── spelling/           # diff, audio, srs, adaptive logic
│   │   └── supabase/           # Supabase client wrapper
│   └── types/                  # TypeScript definitions
├── supabase/
│   └── schema.sql              # PostgreSQL schema & RLS policies
├── README.md                   # Project documentation
└── package.json
```

---

## Developer Credit

**Developed by S. Jashwanth Reddy**  
© 2026 SpellQuest. All rights reserved.
