# SpellQuest AI 🚀

> **Listen. Spell. Learn. Master.**  
> A mobile-first, app-like adaptive spelling adventure game designed for 5th-grade students to achieve measurable spelling mastery within 30 days.

---

## 📱 Mobile-First Redesign & App Experience

SpellQuest AI is engineered specifically for smartphones (tested across 320px, 360px, 375px, 390px, 412px, 430px) and expands seamlessly to tablets (768px, 1024px) and desktop.

### What Makes It Feel Like a Native App:
1. **Full-Screen Mobile App Shell**:
   - **Compact Context-Aware Header**: Greeting & streak on hub tabs; back arrow & stage details on game screens.
   - **Fixed Bottom Navigation Bar**: 5 primary tabs with 48px+ touch targets:
     - 🏠 **Home** (`/dashboard`): Continue adventure card, daily missions, and 30-day Tree of Life visualizer.
     - 🗺️ **Adventure** (`/adventure`): Vertical winding path from Stage 1 → 2 → 3 → 4 → 5 → 👑 Boss.
     - 🎯 **Practice** (`/play`): Touch-first spelling game supporting all 7 game modes.
     - 🏆 **Rewards** (`/achievements`): 2-column mobile badge grid and trophy hall.
     - 👤 **Profile** (`/profile`): Dedicated profile card, accuracy stats, companion manager, and PIN-protected parent portal access.
2. **Touch-First Mobile Spelling Game**:
   - Prominent **[ 🔊 PLAY WORD ]** button (resolves mobile browser autoplay restrictions).
   - 56px height, 20px font touch input that stays visible above the mobile keyboard.
   - 52px height child-friendly **[ CHECK ANSWER ]** button.
   - Stage progress indicator (`Stage 2`, `Word 4 / 10`, `⭐ 650 XP`, `🔥 6 Streak`, `❤️ ❤️ ❤️`).
   - Mobile Result Screen after each 10-word challenge with score, XP bonus, and streak animation.
3. **Stage Unlock Celebration**:
   - When a stage is completed, an animated mobile celebration modal pops up:  
     `🎉 NEW STAGE UNLOCKED! 🌳 Stage 2. Your adventure continues! [ LET'S GO! ]`
4. **Zero Horizontal Overflow Guarantee**:
   - Enforced `max-width: 100vw` and `overflow-x: hidden` across all screens down to 320px width.
5. **PWA (Progressive Web App)**:
   - Web App Manifest (`public/manifest.json`).
   - Mobile viewport configuration with safe-area insets (`viewport-fit=cover`).
   - Standalone display mode with custom theme color (`#0f172a`).
   - Friendly non-intrusive install prompt banner (`PWAInstallBanner`).

---

## 🎮 The Core Learning Loop

`LISTEN → THINK → TYPE → CHECK → LEARN → REPEAT → MASTER`

- **Deterministic Spelling Engine**: Damerau-Levenshtein alignment highlighting only the exact character slip (e.g. `beautifull` vs `beautiful`).
- **Pedagogical Feedback**: 100% positive, encouraging tone with zero harsh shaming.
- **AI Learning Coach**: Memory tricks (e.g. *"1 Collar & 2 Sleeves = ne-C-e-SS-ary"*) and targeted 3-word practice sets.
- **Adaptive Difficulty Engine**: 60% new target words, 20% spaced repetition queue, 15% reinforcement, 5% surprise challenge.
- **Anti-Frustration Safeguard**: Automatically reduces difficulty and provides warm-ups after consecutive errors.
- **Spaced Repetition System (SRS)**: Multi-day intervals (same session → 4 hours → 1 day → 3 days → 7 days).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS (Mobile-First responsive system)
- **Icons**: Lucide React
- **Celebrations**: Canvas Confetti
- **Audio**: Web Speech Synthesis API & Web Audio API (procedural SFX synthesizer)
- **Database**: Supabase PostgreSQL + hybrid offline-first LocalStorage persistence
- **PWA**: Web App Manifest & Service Worker / Standalone App Shell

---

## 🚀 Getting Started

### Local Development

1. Clone and install dependencies:
   ```bash
   cd spellinglearning
   npm install
   ```

2. Start the development server (configured to port 3005):
   ```bash
   npm run dev
   ```

3. Open **`http://localhost:3005`** in your browser (or use your phone's browser connected to the local network).

---

## 🔐 Authentication & Session Persistence

- **Login Screen**: `/login` (Supports instant one-tap login as demo student **Maya**).
- **Register Screen**: `/register` (Name, Email, Password).
- **Profile Screen**: `/profile` (Session details, settings, and PIN-protected parent portal access).
- Sessions persist seamlessly across page refreshes and browser restarts.

---

## 📊 Parent & Educator Dashboard

- Access via the **Profile** tab or `/parent-dashboard` with PIN **`1234`**.
- Features 30-second executive summary cards, 10-day milestone progress curves, pattern proficiency breakdown, revision queue, and print/export report card functionality.

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project into your Vercel Dashboard.
3. Build command: `npm run build`
4. Output directory: `.next`
5. (Optional) Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `GEMINI_API_KEY` in Environment Variables.
6. Deploy!
