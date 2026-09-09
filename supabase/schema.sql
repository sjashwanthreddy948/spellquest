-- SpellQuest PostgreSQL Database Schema for Supabase
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- 1. Student Profiles Table
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT UNIQUE,
  email TEXT,
  grade TEXT DEFAULT 'Grade 3',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 50,
  streak_days INTEGER DEFAULT 1,
  current_stage INTEGER DEFAULT 1,
  avatar TEXT DEFAULT '🦊',
  companion_id TEXT DEFAULT 'luna',
  title TEXT DEFAULT 'Apprentice Speller',
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Word Practice Attempts Table
CREATE TABLE IF NOT EXISTS word_attempts (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL,
  word TEXT NOT NULL,
  submitted_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  attempt_number INTEGER DEFAULT 1,
  response_time_ms INTEGER DEFAULT 0,
  mistake_type TEXT,
  game_mode TEXT DEFAULT 'spell_it',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Spaced Repetition Mastery Table
CREATE TABLE IF NOT EXISTS srs_mastery (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL,
  word TEXT NOT NULL,
  interval_days INTEGER DEFAULT 1,
  ease_factor NUMERIC DEFAULT 2.5,
  repetitions INTEGER DEFAULT 0,
  status TEXT DEFAULT 'learning',
  consecutive_correct INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) with open anon policies for client-side demo
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE srs_mastery ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Allow public read access" ON students FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public insert/update access" ON students FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public read attempts" ON word_attempts FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public insert attempts" ON word_attempts FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public read srs" ON srs_mastery FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Allow public insert srs" ON srs_mastery FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
