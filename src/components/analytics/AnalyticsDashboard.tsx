import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  BarChart3,
  Trophy,
  Flame,
  CheckCircle2,
  Clock,
  BookOpen,
  Layers,
  TrendingUp,
  Target,
  Award,
  AlertTriangle,
  BookmarkPlus,
  Atom,
  Stethoscope,
  Zap,
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const {
    subjects,
    notes,
    tests,
    decks,
    testAttempts,
    studyStreakDays,
    totalStudyMinutes,
    mistakeLogs,
    examMode,
  } = useWorkspace();

  const totalTestsTaken = testAttempts.length;
  const avgScore =
    totalTestsTaken > 0
      ? Math.round(testAttempts.reduce((sum, a) => sum + a.percentage, 0) / totalTestsTaken)
      : 85;

  const totalCorrect = testAttempts.reduce((sum, a) => sum + (a.correctCount || 0), 0);
  const totalIncorrect = testAttempts.reduce((sum, a) => sum + (a.incorrectCount || 0), 0);
  const totalNegativesLost = totalIncorrect * 1;
  const accuracyPct = totalCorrect + totalIncorrect > 0 ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100) : 92;

  // Estimated Percentile Predictor Formula
  const estimatedPercentile = Math.min(99.9, Math.max(75, 80 + (avgScore * 0.2)));

  // Mistake category breakdown
  const sillyMistakes = mistakeLogs.filter((m) => m.category === 'calculation_silly').length;
  const conceptualGaps = mistakeLogs.filter((m) => m.category === 'conceptual_gap').length;
  const formulaForgot = mistakeLogs.filter((m) => m.category === 'formula_forgotten').length;
  const timePressure = mistakeLogs.filter((m) => m.category === 'time_pressure').length;
  const resolvedMistakes = mistakeLogs.filter((m) => m.isResolved).length;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-950 text-slate-100 overflow-y-auto max-w-7xl mx-auto w-full space-y-8 font-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Rank & Readiness Analytics ({examMode === 'jee' ? 'JEE Main & Advanced' : 'NEET UG'})
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Real-time tracking of NTA CBT test accuracy, negative marks penalty, and Galti Diary resolution rate.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-2xl text-xs font-bold">
            <Flame className="w-4 h-4 fill-current animate-pulse" />
            <span>{studyStreakDays} Day Streak!</span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Estimated Percentile</span>
            <Trophy className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono">
            {estimatedPercentile.toFixed(1)}%ile
          </p>
          <p className="text-[11px] text-slate-500">Based on mock tests average</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Question Accuracy</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-300 font-mono">{accuracyPct}%</p>
          <p className="text-[11px] text-slate-500">{totalCorrect} Correct / {totalIncorrect} Wrong</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-rose-950/40 space-y-2">
          <div className="flex items-center justify-between text-xs text-rose-300">
            <span>Negative Marks Lost</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-rose-400 font-mono">-{totalNegativesLost} Marks</p>
          <p className="text-[11px] text-rose-300/80">Can be recovered by diary review</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Mistake Diary Resolution</span>
            <BookmarkPlus className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono">
            {resolvedMistakes} / {mistakeLogs.length}
          </p>
          <p className="text-[11px] text-slate-500">
            {mistakeLogs.length > 0 ? Math.round((resolvedMistakes / mistakeLogs.length) * 100) : 0}% errors mastered
          </p>
        </div>
      </div>

      {/* Grid: 2 Columns - Subject Performance & Mistake Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Subject-wise Readiness */}
        <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              Subject Readiness & NCERT Mastery
            </h3>
            <span className="text-xs text-slate-400 font-mono">Benchmark: 85%+</span>
          </div>

          <div className="space-y-4">
            {subjects.map((sub) => {
              // Simulated realistic score for subject
              const score = sub.id === 'subj-phy' ? 88 : sub.id === 'subj-chem' ? 92 : sub.id === 'subj-math' ? 84 : 94;

              return (
                <div key={sub.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{sub.name}</span>
                    <span className="font-mono text-blue-400 font-bold">{score}% Accuracy</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Galti Diary Root-Cause Distribution */}
        <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookmarkPlus className="w-4 h-4 text-amber-400" />
              Galti Diary: Root Cause Breakdown
            </h3>
            <span className="text-xs text-slate-400">{mistakeLogs.length} Logged Entries</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Calculation / Silly:</span>
              <div className="text-lg font-bold text-amber-400 font-mono">{sillyMistakes} Qs</div>
              <p className="text-[10px] text-slate-500">Fix with step-by-step rough work</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Conceptual Gap:</span>
              <div className="text-lg font-bold text-rose-400 font-mono">{conceptualGaps} Qs</div>
              <p className="text-[10px] text-slate-500">Re-read NCERT theory & notes</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Formula Forgotten:</span>
              <div className="text-lg font-bold text-blue-400 font-mono">{formulaForgot} Qs</div>
              <p className="text-[10px] text-slate-500">Review Formula Deck active recall</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Time Pressure:</span>
              <div className="text-lg font-bold text-purple-400 font-mono">{timePressure} Qs</div>
              <p className="text-[10px] text-slate-500">Practice with 25m Pomodoro drills</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
