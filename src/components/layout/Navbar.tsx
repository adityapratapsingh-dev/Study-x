import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ActiveTab } from '../../types';
import {
  BookOpen,
  FileCheck,
  Layers,
  Clock,
  Bot,
  BarChart3,
  Search,
  Plus,
  Sparkles,
  Flame,
  Download,
  RotateCcw,
  GraduationCap,
  Filter,
  CheckCircle2,
  BookmarkPlus,
  Zap,
  Target,
  FlaskConical,
  Sigma,
  Stethoscope,
  Atom,
  Compass,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    examMode,
    setExamMode,
    searchQuery,
    setSearchQuery,
    addNote,
    setIsAiQuizModalOpen,
    studyStreakDays,
    exportWorkspaceData,
    resetToSampleData,
    mistakeLogs,
  } = useWorkspace();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const tabs: { id: ActiveTab; label: string; icon: React.ElementType; badge?: string | number }[] = [
    { id: 'jee', label: 'JEE Hub (PCM)', icon: Atom },
    { id: 'blueprint', label: 'JEE Blueprint (11/12/Dropper)', icon: Compass },
    { id: 'neet', label: 'NEET Hub (PCB)', icon: Stethoscope },
    { id: 'tests', label: 'NTA CBT Tests', icon: FileCheck },
    {
      id: 'mistakes',
      label: 'Mistake Notebook (Galti Diary)',
      icon: BookmarkPlus,
      badge: mistakeLogs.filter((m) => !m.isResolved).length || undefined,
    },
    { id: 'formulas', label: 'Formula Deck', icon: Zap },
    { id: 'planner', label: 'Daily Goals & Focus', icon: Target },
    { id: 'notes', label: 'NCERT Notes', icon: BookOpen },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'tutor', label: 'AI Rank Mentor', icon: Bot },
    { id: 'analytics', label: 'Performance & Rank', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand & Exam Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-white tracking-tight">RankForge</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                  JEE • NEET
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">All-in-One Competitive Exam Prep Hub</p>
            </div>

            {/* Quick Exam Mode Toggle Switch */}
            <div className="ml-2 hidden lg:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setExamMode('jee')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  examMode === 'jee'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Atom className="w-3.5 h-3.5" />
                JEE Main/Adv
              </button>
              <button
                onClick={() => setExamMode('neet')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  examMode === 'neet'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                NEET UG
              </button>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-sm hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                id="global-search-input"
                placeholder="Search PYQs, formulas, mistakes, chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & Streak */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold"
              title="Consecutive daily study streak"
            >
              <Flame className="w-4 h-4 fill-current animate-pulse" />
              <span>{studyStreakDays}d Streak</span>
            </div>

            {/* AI PYQ Drill generator button */}
            <button
              onClick={() => setIsAiQuizModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">AI Drill Generator</span>
            </button>

            {/* Export backup */}
            <button
              onClick={exportWorkspaceData}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition cursor-pointer"
              title="Backup your notes, mock scores & mistake diary"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Reset data */}
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition cursor-pointer"
              title="Reset to fresh JEE & NEET starter packs"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Navigation Scrollable Tabs Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white text-blue-700' : 'bg-rose-500/30 text-rose-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Reset Preparation Workspace?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This will restore all authentic JEE and NEET syllabus mock tests, formula cards, chapter weightages, and notes to fresh status.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToSampleData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-md"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
