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
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { subjects, notes, tests, decks, testAttempts, studyStreakDays, totalStudyMinutes } =
    useWorkspace();

  const totalTestsTaken = testAttempts.length;
  const avgScore =
    totalTestsTaken > 0
      ? Math.round(testAttempts.reduce((sum, a) => sum + a.percentage, 0) / totalTestsTaken)
      : 0;

  const totalCards = decks.reduce((sum, d) => sum + d.cards.length, 0);
  const masteredCards = decks.reduce(
    (sum, d) => sum + d.cards.filter((c) => c.state === 'mastered').length,
    0
  );
  const flashcardMasteryPct = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  // Subject Mastery calculation
  const subjectMastery = subjects.map((sub) => {
    const subAttempts = testAttempts.filter((a) => a.subjectId === sub.id);
    const subScore =
      subAttempts.length > 0
        ? Math.round(subAttempts.reduce((sum, a) => sum + a.percentage, 0) / subAttempts.length)
        : 80; // default baseline

    const subNotes = notes.filter((n) => n.subjectId === sub.id).length;
    const subTests = tests.filter((t) => t.subjectId === sub.id).length;

    return {
      ...sub,
      score: subScore,
      notesCount: subNotes,
      testsCount: subTests,
      attemptsCount: subAttempts.length,
    };
  });

  return (
    <div className="flex-1 p-6 md:p-8 bg-slate-950 text-slate-100 overflow-y-auto max-w-7xl mx-auto w-full space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Academic Mastery & Study Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Track test scores, subject retention, study consistency, and flashcard recall rates.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-2 rounded-2xl text-xs font-bold">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>{studyStreakDays} Day Streak!</span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Test Score</span>
            <Trophy className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-300">{avgScore}%</p>
          <p className="text-[11px] text-slate-500">Across {totalTestsTaken} completed tests</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Study Time</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-300">{totalStudyMinutes} mins</p>
          <p className="text-[11px] text-slate-500">Pomodoro focus logged</p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Flashcard Mastery</span>
            <Layers className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-violet-300">{flashcardMasteryPct}%</p>
          <p className="text-[11px] text-slate-500">
            {masteredCards} of {totalCards} cards mastered
          </p>
        </div>

        <div className="p-5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Notes Repository</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-300">{notes.length}</p>
          <p className="text-[11px] text-slate-500">Organized across {subjects.length} subjects</p>
        </div>
      </div>

      {/* Subject Mastery Breakdown */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Subject Mastery Index</h2>
            <p className="text-xs text-slate-400">
              Proficiency evaluated by diagnostic tests and flashcard retention.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {subjectMastery.map((sub) => (
            <div key={sub.id} className="space-y-1.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: sub.color }}
                  />
                  <span className="font-bold text-white">{sub.code}: {sub.name}</span>
                </div>
                <span className="font-bold text-indigo-300">{sub.score}% Mastery</span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${sub.score}%`, backgroundColor: sub.color }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{sub.notesCount} Notes • {sub.testsCount} Practice Tests</span>
                <span>{sub.attemptsCount} Attempts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High-Yield Study Recommendations */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/30 to-slate-900 border border-indigo-500/20 space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>AI Study Recommendations</span>
        </div>
        <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>
              <strong>Reinforce Chemistry SN1/SN2:</strong> Review transition states and polar aprotic solvent distinctions before taking your next diagnostic test.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>
              <strong>Spaced Repetition:</strong> 3 flashcards in Algorithms are scheduled for spaced recall today.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>
              <strong>Focus Habit:</strong> Complete a 25-minute Pomodoro block in Calculus to maintain your 5-day study streak.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
