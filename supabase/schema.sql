-- ========================================================================
-- SpellQuest AI - Production PostgreSQL / Supabase Schema
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Auth accounts: student or parent/teacher)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'parent', 'teacher')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. STUDENTS TABLE (Child profiles)
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade TEXT NOT NULL DEFAULT 'Grade 5',
    level INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    coins INTEGER NOT NULL DEFAULT 0,
    streak_days INTEGER NOT NULL DEFAULT 0,
    best_streak INTEGER NOT NULL DEFAULT 0,
    completed_assessment BOOLEAN NOT NULL DEFAULT FALSE,
    active_world_id TEXT NOT NULL DEFAULT 'world-1',
    avatar TEXT NOT NULL DEFAULT '🧙‍♀️',
    title TEXT NOT NULL DEFAULT 'Word Explorer',
    companion TEXT NOT NULL DEFAULT 'Sparky the Dragon 🐲',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. WORDS TABLE (10,000 Structured English Words)
CREATE TABLE IF NOT EXISTS words (
    id TEXT PRIMARY KEY,
    word TEXT UNIQUE NOT NULL,
    difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
    level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 5),
    category TEXT NOT NULL,
    word_length INTEGER NOT NULL,
    syllables TEXT[] NOT NULL,
    spelling_pattern TEXT NOT NULL,
    common_mistakes TEXT[] NOT NULL DEFAULT '{}',
    example_sentence TEXT NOT NULL,
    hint TEXT NOT NULL,
    pronunciation_guide TEXT,
    definition TEXT,
    mnemonic TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_words_level ON words(level);
CREATE INDEX IF NOT EXISTS idx_words_difficulty ON words(difficulty);
CREATE INDEX IF NOT EXISTS idx_words_pattern ON words(spelling_pattern);

-- 4. WORD ATTEMPTS (Every spelling attempt logged for analytics)
CREATE TABLE IF NOT EXISTS word_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    word_id TEXT REFERENCES words(id) ON DELETE SET NULL,
    word TEXT NOT NULL,
    submitted_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    response_time_ms INTEGER NOT NULL,
    hint_used BOOLEAN NOT NULL DEFAULT FALSE,
    mistake_type TEXT,
    game_mode TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attempts_student_time ON word_attempts(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attempts_correct ON word_attempts(student_id, is_correct);

-- 5. REVIEW QUEUE (Spaced Repetition System: SM-2 / Leitner)
CREATE TABLE IF NOT EXISTS review_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    word_id TEXT REFERENCES words(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    interval_days NUMERIC NOT NULL DEFAULT 0,
    ease_factor NUMERIC NOT NULL DEFAULT 2.5,
    repetitions INTEGER NOT NULL DEFAULT 0,
    consecutive_correct INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('learning', 'reviewing', 'mastered')),
    next_review_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_reviewed_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_review_queue_due ON review_queue(student_id, next_review_date);

-- 6. MASTERED WORDS (Permanently retained vocabulary)
CREATE TABLE IF NOT EXISTS mastered_words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    word_id TEXT REFERENCES words(id) ON DELETE CASCADE,
    mastered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, word_id)
);

-- 7. ACHIEVEMENTS & STUDENT ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL,
    max_progress INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS student_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    achievement_id TEXT REFERENCES achievements(id) ON DELETE CASCADE,
    progress INTEGER NOT NULL DEFAULT 0,
    unlocked BOOLEAN NOT NULL DEFAULT FALSE,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(student_id, achievement_id)
);

-- 8. DAILY MISSIONS
CREATE TABLE IF NOT EXISTS daily_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    mission_key TEXT NOT NULL,
    current_progress INTEGER NOT NULL DEFAULT 0,
    target_progress INTEGER NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    date DATE DEFAULT CURRENT_DATE,
    UNIQUE(student_id, mission_key, date)
);

-- 9. LEARNING REPORTS (Generated 10-day and 30-day summaries for parents/teachers)
CREATE TABLE IF NOT EXISTS learning_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    report_type TEXT NOT NULL CHECK (report_type IN ('10_day', '30_day', 'diagnostic')),
    starting_accuracy NUMERIC NOT NULL,
    current_accuracy NUMERIC NOT NULL,
    words_practiced INTEGER NOT NULL,
    words_mastered INTEGER NOT NULL,
    weak_patterns JSONB NOT NULL DEFAULT '{}',
    strong_patterns JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE mastered_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_reports ENABLE ROW LEVEL SECURITY;

-- Students can only read/write their own records
CREATE POLICY "Student access policy" ON students
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Attempts access policy" ON word_attempts
    FOR ALL USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));

CREATE POLICY "Review queue access policy" ON review_queue
    FOR ALL USING (student_id IN (SELECT id FROM students WHERE user_id = auth.uid()));
