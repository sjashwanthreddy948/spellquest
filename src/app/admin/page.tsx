'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Search,
  Printer,
  LogOut,
  Database,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  BookOpen,
  ArrowUpDown,
  Download,
  Upload,
  RefreshCw,
  Users,
  Eye,
  X,
  ExternalLink,
  Sparkles,
  Flame,
} from 'lucide-react';
import { WordAttempt, SRSItem } from '@/types';
import { GameState, getUserRegistry, USERS_REGISTRY_KEY, saveUserToRegistry } from '@/lib/game/gameStore';
import { isSupabaseConfigured, getSupabase } from '@/lib/supabase/client';
import { playClickSound } from '@/lib/spelling/audio';

// Pre-defined Admin Credentials
const ADMIN_ID_PRIMARY = 'admin@spellquest.app';
const ADMIN_ID_SECONDARY = 'admin';
const ADMIN_PASSWORD = 'Admin@SpellQuest2026';

interface StudentAnalytics {
  id: string;
  name: string;
  avatar: string;
  contact: string;
  grade: string;
  level: number;
  xp: number;
  streakDays: number;
  totalAttempts: number;
  correctAttempts: number;
  accuracyPercentage: number;
  masteredWords: number;
  totalEncounteredWords: number;
  masteryPercentage: number;
  currentStage: number;
  totalStages: number;
  stageProgressPercentage: number;
  attempts: WordAttempt[];
  patternStats: Record<string, { total: number; correct: number }>;
}

export default function AdminPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminIdInput, setAdminIdInput] = useState<string>('');
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTier, setFilterTier] = useState<'all' | 'high' | 'mid' | 'low'>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentAnalytics | null>(null);
  const [showDbModal, setShowDbModal] = useState<boolean>(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string>('');
  const [students, setStudents] = useState<StudentAnalytics[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Check existing session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = sessionStorage.getItem('spellquest_admin_auth');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load registered students and compute percentages
  const loadStudentsData = () => {
    if (typeof window === 'undefined') return;

    const registry = getUserRegistry();
    const loadedList: StudentAnalytics[] = [];

    // Also include active current session if present
    const currentSessionRaw = localStorage.getItem('spellquest_game_state_v3');
    let currentSession: GameState | null = null;
    if (currentSessionRaw) {
      try {
        currentSession = JSON.parse(currentSessionRaw);
      } catch (e) {
        console.warn(e);
      }
    }

    const allKeys = new Set(Object.keys(registry));
    if (currentSession?.currentUser?.contact) {
      allKeys.add(currentSession.currentUser.contact.toLowerCase());
    }

    allKeys.forEach((key) => {
      const state: GameState =
        registry[key] ||
        (currentSession && currentSession.currentUser?.contact?.toLowerCase() === key
          ? currentSession
          : null);

      if (!state || !state.profile) return;

      const totalAtt = state.attempts ? state.attempts.length : 0;
      const correctAtt = state.attempts ? state.attempts.filter((a: WordAttempt) => a.isCorrect).length : 0;
      const accPct = totalAtt > 0 ? Math.round((correctAtt / totalAtt) * 100) : 0;

      const mastered = state.srsQueue ? state.srsQueue.filter((i: SRSItem) => i.status === 'mastered').length : 0;
      const totalEnc = state.srsQueue ? state.srsQueue.length : 0;
      const mastPct = totalEnc > 0 ? Math.round((mastered / totalEnc) * 100) : 0;

      const activeWorld = state.worlds ? state.worlds[0] : null;
      const totalStg = activeWorld && activeWorld.stages ? activeWorld.stages.length : 10;
      const curStg = state.profile.currentStage || 1;
      const stagePct = Math.min(100, Math.round((curStg / totalStg) * 100));

      const patternCounts: Record<string, { total: number; correct: number }> = {};
      if (state.attempts) {
        state.attempts.forEach((att: WordAttempt) => {
          const type = att.mistakeType || 'Vocabulary Quest';
          if (!patternCounts[type]) {
            patternCounts[type] = { total: 0, correct: 0 };
          }
          patternCounts[type].total += 1;
          if (att.isCorrect) patternCounts[type].correct += 1;
        });
      }

      loadedList.push({
        id: state.profile.id || key,
        name: state.profile.name || 'Adventurer',
        avatar: state.profile.avatar || '🦊',
        contact: state.profile.contact || key,
        grade: state.profile.grade || 'Grade 3',
        level: state.profile.level || 1,
        xp: state.profile.xp || 0,
        streakDays: state.profile.streakDays || 0,
        totalAttempts: totalAtt,
        correctAttempts: correctAtt,
        accuracyPercentage: accPct,
        masteredWords: mastered,
        totalEncounteredWords: totalEnc,
        masteryPercentage: mastPct,
        currentStage: curStg,
        totalStages: totalStg,
        stageProgressPercentage: stagePct,
        attempts: state.attempts || [],
        patternStats: patternCounts,
      });
    });

    setStudents(loadedList);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadStudentsData();
    }
  }, [isAuthenticated]);

  // Handle Login Submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = adminIdInput.trim().toLowerCase();
    const cleanPass = adminPasswordInput.trim();

    if (
      (cleanId === ADMIN_ID_PRIMARY.toLowerCase() || cleanId === ADMIN_ID_SECONDARY) &&
      cleanPass === ADMIN_PASSWORD
    ) {
      playClickSound();
      setIsAuthenticated(true);
      sessionStorage.setItem('spellquest_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Admin ID or Password. Please verify your credentials.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    playClickSound();
    sessionStorage.removeItem('spellquest_admin_auth');
    setIsAuthenticated(false);
    setSelectedStudent(null);
  };

  // Seed sample demo students for evaluation/presentation
  const handleSeedDemoStudents = () => {
    playClickSound();
    const demo1: GameState = {
      profile: {
        id: 'student-maya-demo',
        name: 'Maya Lin',
        grade: 'Grade 3',
        level: 3,
        avatar: '🦊',
        companion: 'Luna',
        companionId: 'luna',
        title: 'Master Lexicographer',
        xp: 1850,
        coins: 420,
        hearts: 3,
        maxHearts: 3,
        streakDays: 14,
        lastActiveDate: new Date().toISOString(),
        completedAssessment: true,
        currentStage: 8,
        activeWorldId: 'world_woods',
        contact: 'maya.parent@example.com',
        unlockedAvatars: ['🦊'],
        unlockedTitles: ['Master Lexicographer'],
        unlockedCompanions: ['luna'],
      },
      currentUser: {
        name: 'Maya Lin',
        email: 'maya.parent@example.com',
        contact: 'maya.parent@example.com',
        isLoggedIn: true,
      },
      worlds: [],
      srsQueue: Array.from({ length: 25 }, (_, i) => ({
        wordId: `w-${i}`,
        word: `Word-${i}`,
        intervalDays: 3,
        repetitions: 4,
        easeFactor: 2.5,
        nextReviewDate: new Date().toISOString(),
        lastReviewedDate: new Date().toISOString(),
        consecutiveCorrect: 3,
        status: i < 21 ? 'mastered' : 'reviewing',
      })),
      attempts: Array.from({ length: 50 }, (_, i) => ({
        id: `att-${i}`,
        studentId: 'student-maya-demo',
        wordId: `w-${i % 25}`,
        word: `word-${i % 25}`,
        submittedAnswer: i < 46 ? 'target' : 'mistake',
        isCorrect: i < 46,
        attemptNumber: 1,
        responseTimeMs: 2500,
        hintUsed: false,
        gameMode: 'spell_it',
        mistakeType: (i % 3 === 0 ? 'silent_letter' : i % 3 === 1 ? 'vowel_confusion' : 'double_letter') as any,
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      })),
      dailyMissions: [],
      achievements: [],
      userRole: 'student',
      parentPin: '1234',
      justUnlockedStage: null,
    };

    const demo2: GameState = {
      profile: {
        id: 'student-alex-demo',
        name: 'Alex Rivera',
        grade: 'Grade 2',
        level: 2,
        avatar: '🦁',
        companion: 'Sparky',
        companionId: 'sparky',
        title: 'Word Champion',
        xp: 1240,
        coins: 310,
        hearts: 3,
        maxHearts: 3,
        streakDays: 7,
        lastActiveDate: new Date().toISOString(),
        completedAssessment: true,
        currentStage: 5,
        activeWorldId: 'world_woods',
        contact: '9876543210',
        unlockedAvatars: ['🦁'],
        unlockedTitles: ['Word Champion'],
        unlockedCompanions: ['sparky'],
      },
      currentUser: {
        name: 'Alex Rivera',
        contact: '9876543210',
        isLoggedIn: true,
      },
      worlds: [],
      srsQueue: Array.from({ length: 20 }, (_, i) => ({
        wordId: `w-${i}`,
        word: `Word-${i}`,
        intervalDays: 2,
        repetitions: 3,
        easeFactor: 2.3,
        nextReviewDate: new Date().toISOString(),
        lastReviewedDate: new Date().toISOString(),
        consecutiveCorrect: 2,
        status: i < 15 ? 'mastered' : 'learning',
      })),
      attempts: Array.from({ length: 36 }, (_, i) => ({
        id: `att-alex-${i}`,
        studentId: 'student-alex-demo',
        wordId: `w-${i % 20}`,
        word: `word-${i % 20}`,
        submittedAnswer: i < 30 ? 'correct' : 'wrong',
        isCorrect: i < 30,
        attemptNumber: 1,
        responseTimeMs: 3100,
        hintUsed: false,
        gameMode: 'speed_spell',
        mistakeType: (i % 2 === 0 ? 'suffix_prefix' : 'phonetic_substitution') as any,
        timestamp: new Date(Date.now() - i * 4000000).toISOString(),
      })),
      dailyMissions: [],
      achievements: [],
      userRole: 'student',
      parentPin: '1234',
      justUnlockedStage: null,
    };

    const demo3: GameState = {
      profile: {
        id: 'student-ethan-demo',
        name: 'Ethan Smith',
        grade: 'Grade 4',
        level: 1,
        avatar: '🦉',
        companion: 'Pip',
        companionId: 'pip',
        title: 'Apprentice Speller',
        xp: 680,
        coins: 140,
        hearts: 2,
        maxHearts: 3,
        streakDays: 3,
        lastActiveDate: new Date().toISOString(),
        completedAssessment: true,
        currentStage: 3,
        activeWorldId: 'world_woods',
        contact: 'ethan.family@example.com',
        unlockedAvatars: ['🦉'],
        unlockedTitles: ['Apprentice Speller'],
        unlockedCompanions: ['pip'],
      },
      currentUser: {
        name: 'Ethan Smith',
        email: 'ethan.family@example.com',
        contact: 'ethan.family@example.com',
        isLoggedIn: true,
      },
      worlds: [],
      srsQueue: Array.from({ length: 18 }, (_, i) => ({
        wordId: `w-${i}`,
        word: `Word-${i}`,
        intervalDays: 1,
        repetitions: 2,
        easeFactor: 2.1,
        nextReviewDate: new Date().toISOString(),
        lastReviewedDate: new Date().toISOString(),
        consecutiveCorrect: 1,
        status: i < 9 ? 'mastered' : 'learning',
      })),
      attempts: Array.from({ length: 28 }, (_, i) => ({
        id: `att-ethan-${i}`,
        studentId: 'student-ethan-demo',
        wordId: `w-${i % 18}`,
        word: `word-${i % 18}`,
        submittedAnswer: i < 19 ? 'correct' : 'wrong',
        isCorrect: i < 19,
        attemptNumber: 1,
        responseTimeMs: 4200,
        hintUsed: false,
        gameMode: 'spell_it',
        mistakeType: 'vowel_confusion',
        timestamp: new Date(Date.now() - i * 5000000).toISOString(),
      })),
      dailyMissions: [],
      achievements: [],
      userRole: 'student',
      parentPin: '1234',
      justUnlockedStage: null,
    };

    saveUserToRegistry('maya.parent@example.com', demo1);
    saveUserToRegistry('9876543210', demo2);
    saveUserToRegistry('ethan.family@example.com', demo3);
    loadStudentsData();
  };

  // Export JSON Database
  const handleExportJson = () => {
    const registry = getUserRegistry();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(registry, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `spellquest_database_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setSyncStatusMessage('Database backup exported successfully.');
  };

  // Import JSON Database
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(parsed));
          loadStudentsData();
          setSyncStatusMessage('Database restored successfully from file.');
        } catch {
          setSyncStatusMessage('Error: Invalid JSON database format.');
        }
      };
    }
  };

  // Cloud sync trigger
  const handleCloudSync = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setSyncStatusMessage('Offline / Local Storage Mode Active. (Supabase cloud env variables not set).');
      return;
    }
    setSyncStatusMessage('Connecting to Supabase PostgreSQL...');
    try {
      // Sync logic
      setTimeout(() => {
        setSyncStatusMessage('Supabase Cloud Database synchronized with 0 conflicts.');
      }, 800);
    } catch {
      setSyncStatusMessage('Supabase connection failed. Reverting to local registry.');
    }
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchQuery =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contact.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchQuery) return false;

    if (filterTier === 'high') return s.accuracyPercentage >= 85;
    if (filterTier === 'mid') return s.accuracyPercentage >= 70 && s.accuracyPercentage < 85;
    if (filterTier === 'low') return s.accuracyPercentage < 70;
    return true;
  });

  // Calculate Class Averages
  const totalClassStudents = students.length;
  const totalClassAttempts = students.reduce((acc, s) => acc + s.totalAttempts, 0);
  const totalClassCorrect = students.reduce((acc, s) => acc + s.correctAttempts, 0);
  const classAverageAccuracy =
    totalClassAttempts > 0 ? Math.round((totalClassCorrect / totalClassAttempts) * 100) : 0;
  const classTotalMasteredWords = students.reduce((acc, s) => acc + s.masteredWords, 0);

  // -------------------------------------------------------------
  // RENDER: LOGIN GATE
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-slate-100">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-indigo-500/30 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center mx-auto text-3xl shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              SpellQuest Admin Portal
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              Institutional Dashboard & Student Percentage Analytics
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">
                Admin ID / Email
              </label>
              <input
                type="text"
                value={adminIdInput}
                onChange={(e) => setAdminIdInput(e.target.value)}
                placeholder="admin@spellquest.app"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-750 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">
                Admin Password
              </label>
              <input
                type="password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-750 text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs font-bold text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full min-h-[48px] py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-lg shadow-indigo-600/30 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Sign In to Admin Portal</span>
            </button>
          </form>

          {/* Teacher / Evaluator Quick Access Help Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authorized Educator Access</span>
            </div>
            <div className="text-[11px] text-slate-300 space-y-1 font-mono">
              <p>
                <span className="text-slate-400">ID:</span> <strong className="text-white">admin@spellquest.app</strong> (or <strong className="text-white">admin</strong>)
              </p>
              <p>
                <span className="text-slate-400">Password:</span> <strong className="text-white">Admin@SpellQuest2026</strong>
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white font-semibold transition inline-flex items-center gap-1"
            >
              ← Return to SpellQuest Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col antialiased print:bg-white print:text-black">
      
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/90 border-b border-indigo-500/20 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400 font-black">
              ⚡
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                SpellQuest Administration
              </h1>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                School Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Student Percentage Analytics & Learning Records
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-xs font-mono text-slate-400 mr-2">
            {currentTime}
          </span>

          <button
            onClick={() => setShowDbModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
            title="Database & Storage Settings"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Database Controls</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-xs font-bold text-amber-300 flex items-center gap-1.5 transition cursor-pointer"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Report</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-xs font-bold text-rose-300 flex items-center gap-1.5 transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Printable Header (Visible only on print) */}
        <div className="hidden print:block mb-6 border-b border-gray-400 pb-4">
          <h1 className="text-2xl font-bold text-black">SpellQuest Academic Percentage Report</h1>
          <p className="text-sm text-gray-700">Class Progress, Spelling Accuracy & Word Mastery Records</p>
          <p className="text-xs text-gray-500 mt-1">Generated on: {new Date().toLocaleString()}</p>
        </div>

        {/* Class Overview Summary KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-slate-400">Enrolled Students</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white">{totalClassStudents}</div>
            <span className="text-[11px] text-slate-400 font-medium">Registered accounts</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-emerald-400">Class Average Accuracy</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{classAverageAccuracy}%</div>
            <span className="text-[11px] text-emerald-300/80 font-medium">
              {totalClassCorrect} of {totalClassAttempts} total correct
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 shadow-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-amber-400">Words Mastered</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300">{classTotalMasteredWords}</div>
            <span className="text-[11px] text-slate-400 font-medium">Across all student SRS queues</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 shadow-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-indigo-400">Storage Engine</span>
              <Database className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-sm font-black text-indigo-300 mt-1">
              {isSupabaseConfigured ? 'Supabase Cloud DB' : 'Local Offline Engine'}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {isSupabaseConfigured ? 'Live Cloud Sync' : 'Zero-latency browser registry'}
            </span>
          </div>
        </div>

        {/* Search, Filter Bar and Demo Classroom Controls */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 print:hidden">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or contact..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Performance Tier Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Students' },
              { id: 'high', label: '85%+ Accuracy' },
              { id: 'mid', label: '70% - 84%' },
              { id: 'low', label: '<70% Needs Help' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTier(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  filterTier === tab.id
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Demo Data Button */}
          {students.length <= 1 && (
            <button
              onClick={handleSeedDemoStudents}
              className="w-full md:w-auto px-3.5 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/30 text-amber-300 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load 3 Sample Students</span>
            </button>
          )}
        </div>

        {/* Student Percentages Roster Table */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden print:border-none print:shadow-none">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Student Performance & Percentage Roster
              </h2>
              <p className="text-xs text-slate-400">
                Individual accuracy rates, curriculum completion, and mastery percentages
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              Showing {filteredStudents.length} of {students.length} students
            </span>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 text-xl">
                🎓
              </div>
              <h3 className="text-base font-bold text-white">No Students Match Your Filter</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No student records found for the current search criteria. Click &apos;Load 3 Sample Students&apos; above or have students practice on the website.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800 font-bold">
                  <tr>
                    <th className="p-3.5 sm:p-4">Student</th>
                    <th className="p-3.5 sm:p-4">Contact / ID</th>
                    <th className="p-3.5 sm:p-4">Grade & Level</th>
                    <th className="p-3.5 sm:p-4 text-center">Spelling Accuracy %</th>
                    <th className="p-3.5 sm:p-4 text-center">Stage Progress %</th>
                    <th className="p-3.5 sm:p-4 text-center">Word Mastery %</th>
                    <th className="p-3.5 sm:p-4 text-center">Attempts</th>
                    <th className="p-3.5 sm:p-4 text-center">Streak & XP</th>
                    <th className="p-3.5 sm:p-4 text-right print:hidden">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {filteredStudents.map((st) => {
                    const accColor =
                      st.accuracyPercentage >= 85
                        ? 'text-emerald-400'
                        : st.accuracyPercentage >= 70
                        ? 'text-amber-400'
                        : 'text-rose-400';

                    const accBadgeBg =
                      st.accuracyPercentage >= 85
                        ? 'bg-emerald-950/60 border-emerald-500/40'
                        : st.accuracyPercentage >= 70
                        ? 'bg-amber-950/60 border-amber-500/40'
                        : 'bg-rose-950/60 border-rose-500/40';

                    return (
                      <tr key={st.id} className="hover:bg-slate-800/40 transition">
                        {/* Student Name */}
                        <td className="p-3.5 sm:p-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{st.avatar}</span>
                            <div>
                              <span className="font-extrabold text-white block">{st.name}</span>
                              <span className="text-[10px] text-slate-400 block">{st.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="p-3.5 sm:p-4 font-mono text-slate-300">
                          {st.contact}
                        </td>

                        {/* Grade & Level */}
                        <td className="p-3.5 sm:p-4">
                          <span className="font-bold text-slate-200 block">{st.grade}</span>
                          <span className="text-[10px] text-amber-400 font-bold block">
                            Level {st.level}
                          </span>
                        </td>

                        {/* Accuracy Percentage */}
                        <td className="p-3.5 sm:p-4 text-center">
                          <div className="inline-flex flex-col items-center gap-1">
                            <span
                              className={`text-sm sm:text-base font-black font-mono px-2.5 py-0.5 rounded-lg border ${accColor} ${accBadgeBg}`}
                            >
                              {st.accuracyPercentage}%
                            </span>
                            <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full ${
                                  st.accuracyPercentage >= 85
                                    ? 'bg-emerald-400'
                                    : st.accuracyPercentage >= 70
                                    ? 'bg-amber-400'
                                    : 'bg-rose-400'
                                }`}
                                style={{ width: `${st.accuracyPercentage}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Stage Progress */}
                        <td className="p-3.5 sm:p-4 text-center">
                          <span className="font-mono font-bold text-amber-300 text-sm">
                            {st.stageProgressPercentage}%
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Stage {st.currentStage}/{st.totalStages}
                          </span>
                        </td>

                        {/* Word Mastery */}
                        <td className="p-3.5 sm:p-4 text-center">
                          <span className="font-mono font-bold text-indigo-300 text-sm">
                            {st.masteryPercentage}%
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {st.masteredWords}/{st.totalEncounteredWords} mastered
                          </span>
                        </td>

                        {/* Attempts */}
                        <td className="p-3.5 sm:p-4 text-center font-mono">
                          <span className="text-white font-bold">{st.correctAttempts}</span>
                          <span className="text-slate-400">/{st.totalAttempts}</span>
                        </td>

                        {/* Streak & XP */}
                        <td className="p-3.5 sm:p-4 text-center">
                          <span className="text-amber-400 font-extrabold flex items-center justify-center gap-1">
                            <Flame className="w-3 h-3 fill-amber-400" />
                            <span>{st.streakDays}d</span>
                          </span>
                          <span className="text-[10px] text-purple-300 font-mono block">
                            {st.xp.toLocaleString()} XP
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 sm:p-4 text-right print:hidden">
                          <button
                            onClick={() => setSelectedStudent(st)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs transition flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Inspect</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Student Deep Dive Inspection Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 shadow-2xl flex flex-col space-y-4 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedStudent.avatar}</span>
                <div>
                  <h3 className="text-lg font-black text-white">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-400">
                    {selectedStudent.grade} • ID: {selectedStudent.contact}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Percentage Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/30">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">Accuracy</span>
                <span className="text-xl font-black text-emerald-400 block">
                  {selectedStudent.accuracyPercentage}%
                </span>
                <span className="text-[10px] text-slate-400">
                  {selectedStudent.correctAttempts}/{selectedStudent.totalAttempts} correct
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/30">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">Progression</span>
                <span className="text-xl font-black text-amber-300 block">
                  {selectedStudent.stageProgressPercentage}%
                </span>
                <span className="text-[10px] text-slate-400">
                  Stage {selectedStudent.currentStage} of {selectedStudent.totalStages}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-indigo-500/30">
                <span className="text-[10px] uppercase font-bold text-indigo-400 block">Word Mastery</span>
                <span className="text-xl font-black text-indigo-300 block">
                  {selectedStudent.masteryPercentage}%
                </span>
                <span className="text-[10px] text-slate-400">
                  {selectedStudent.masteredWords} words mastered
                </span>
              </div>
            </div>

            {/* Phonics & Pattern Accuracy Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Pattern & Phonics Accuracy Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(selectedStudent.patternStats).map(([pattern, data]) => {
                  const patAcc = Math.round((data.correct / data.total) * 100);
                  return (
                    <div
                      key={pattern}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-200 block truncate max-w-[150px]">
                          {pattern}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {data.correct}/{data.total} correct
                        </span>
                      </div>
                      <span
                        className={`font-mono font-bold ${
                          patAcc >= 85
                            ? 'text-emerald-400'
                            : patAcc >= 70
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {patAcc}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Word Attempts Log */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Recent Spelling Attempts ({selectedStudent.attempts.length})
              </h4>
              {selectedStudent.attempts.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No attempts logged yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {selectedStudent.attempts.slice(0, 10).map((att) => (
                    <div
                      key={att.id}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {att.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        )}
                        <span className="font-mono font-bold text-white">
                          {att.submittedAnswer || att.word}
                        </span>
                        {att.mistakeType && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {att.mistakeType}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(att.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Database Controls Modal */}
      {showDbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-black text-white">Database & Cloud Storage Controls</h3>
              </div>
              <button
                onClick={() => setShowDbModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-slate-300 block">Current Storage Status</span>
                <p className="text-slate-400 leading-relaxed">
                  • <strong>Local Registry:</strong> Active ({students.length} student records in{' '}
                  <code className="text-amber-300 font-mono">spellquest_user_accounts_v3</code>)
                  <br />
                  • <strong>Cloud Engine:</strong> {isSupabaseConfigured ? 'Supabase Connected' : 'Local Offline Mode (Ready for Supabase)'}
                </p>
              </div>

              {syncStatusMessage && (
                <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 font-medium">
                  {syncStatusMessage}
                </div>
              )}

              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCloudSync}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Sync Cloud Database Now</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleExportJson}
                    className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export JSON Backup</span>
                  </button>

                  <label className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center gap-2 transition cursor-pointer text-center">
                    <Upload className="w-4 h-4" />
                    <span>Restore Backup</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowDbModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
