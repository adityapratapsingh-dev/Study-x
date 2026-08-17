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
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    subjects,
    selectedSubjectId,
    setSelectedSubjectId,
    searchQuery,
    setSearchQuery,
    addNote,
    setIsAiQuizModalOpen,
    studyStreakDays,
    exportWorkspaceData,
    resetToSampleData,
  } = useWorkspace();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const tabs: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'notes', label: 'Notes Workspace', icon: BookOpen },
    { id: 'tests', label: 'Tests & Exams', icon: FileCheck },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'focus', label: 'Focus & Tasks', icon: Clock },
    { id: 'tutor', label: 'AI Tutor', icon: Bot },
    { id: 'analytics', label: 'Mastery', icon: BarChart3 },
  ];

  const handleQuickNewNote = () => {
    const newNote = addNote({
      title: 'Untitled Note',
      subjectId: selectedSubjectId || subjects[0]?.id || 'cs-algo',
    });
    setActiveTab('notes');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">StudyForge</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                  Workspace
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Smart Notes & Test Engine for Students</p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                id="global-search-input"
                placeholder="Search notes, tests, formulas, flashcards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
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

          {/* Quick Actions & Status */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Subject Filter Pill */}
            <div className="relative hidden lg:flex items-center">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                id="navbar-subject-filter"
                value={selectedSubjectId || 'all'}
                onChange={(e) => setSelectedSubjectId(e.target.value === 'all' ? null : e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none"
              >
                <option value="all">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code}: {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Streak Counter */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-lg text-xs font-semibold" title="Daily Study Streak">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{studyStreakDays}d streak</span>
            </div>

            {/* AI Test Creator Button */}
            <button
              id="nav-btn-ai-quiz"
              onClick={() => setIsAiQuizModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Generate AI Test</span>
              <span className="sm:hidden">AI Test</span>
            </button>

            {/* New Note Button */}
            <button
              id="nav-btn-new-note"
              onClick={handleQuickNewNote}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Note</span>
            </button>

            {/* Backup / Export Menu */}
            <div className="relative group">
              <button
                id="nav-btn-export"
                onClick={exportWorkspaceData}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg border border-slate-800 transition"
                title="Export Workspace JSON Backup"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Reset Data Confirmation */}
            <button
              id="nav-btn-reset"
              onClick={() => setIsResetConfirmOpen(true)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg border border-slate-800 transition"
              title="Reset to Sample Notes & Tests"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-1 -mb-px border-t border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl text-slate-200">
            <h3 className="text-lg font-bold text-white mb-2">Reset to Sample Student Data?</h3>
            <p className="text-sm text-slate-400 mb-6">
              This will reload the rich pre-configured student subjects, notes, tests, flashcard decks, and task records.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToSampleData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
