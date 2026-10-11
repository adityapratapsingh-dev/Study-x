import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Test, DifficultyLevel } from '../../types';
import { ActiveExamView } from './ActiveExamView';
import { ExamResultView } from './ExamResultView';
import {
  FileCheck,
  Plus,
  Sparkles,
  Clock,
  Award,
  CheckCircle,
  Play,
  RotateCcw,
  Trash2,
  Filter,
  BarChart,
  HelpCircle,
  Layers,
} from 'lucide-react';

export const TestHub: React.FC = () => {
  const {
    tests,
    selectedSubjectId,
    subjects,
    activeTest,
    startTest,
    finishTest,
    cancelActiveTest,
    latestAttempt,
    setLatestAttempt,
    testAttempts,
    deleteTest,
    setIsAiQuizModalOpen,
    searchQuery,
  } = useWorkspace();

  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [selectedHistoricalAttempt, setSelectedHistoricalAttempt] = useState<string | null>(null);

  // If in active exam mode
  if (activeTest) {
    return (
      <ActiveExamView
        test={activeTest}
        onFinish={(attempt) => {
          finishTest(attempt);
        }}
        onCancel={cancelActiveTest}
      />
    );
  }

  // If viewing latest or historical result
  const attemptToView = selectedHistoricalAttempt
    ? testAttempts.find((a) => a.id === selectedHistoricalAttempt)
    : latestAttempt;

  if (attemptToView) {
    const matchingTest = tests.find((t) => t.id === attemptToView.testId) || {
      id: attemptToView.testId,
      title: attemptToView.testTitle,
      description: 'Historical test session',
      subjectId: attemptToView.subjectId,
      examType: attemptToView.examType || 'CHAPTER_WISE',
      targetExam: 'JEE' as const,
      estimatedMinutes: Math.round(attemptToView.durationSeconds / 60) || 10,
      totalMarks: attemptToView.totalMarks || 100,
      positiveMarks: 4,
      negativeMarks: 1,
      difficulty: 'Medium' as DifficultyLevel,
      questions: [],
      createdAt: attemptToView.completedAt,
      tags: [],
    };

    return (
      <ExamResultView
        test={matchingTest}
        attempt={attemptToView}
        onRetake={() => {
          setSelectedHistoricalAttempt(null);
          setLatestAttempt(null);
          startTest(matchingTest.id);
        }}
        onBackToCatalog={() => {
          setSelectedHistoricalAttempt(null);
          setLatestAttempt(null);
        }}
      />
    );
  }

  // Filter tests
  const filteredTests = tests.filter((t) => {
    if (selectedSubjectId && t.subjectId !== selectedSubjectId) return false;
    if (difficultyFilter !== 'all' && t.difficulty !== difficultyFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchTag = t.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 p-6 md:p-8 bg-slate-950 text-slate-100 overflow-y-auto max-w-7xl mx-auto w-full space-y-8">
      
      {/* Top Banner & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Test & Exam Simulator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Test yourself with timed practice tests, instant AI diagnostic scoring, hint support, and detailed question breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-hub-generate-quiz"
            onClick={() => setIsAiQuizModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate AI Test</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-400">Difficulty:</span>
          {['all', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-3 py-1 text-xs rounded-lg capitalize transition cursor-pointer font-medium ${
                difficultyFilter === diff
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredTests.length} practice {filteredTests.length === 1 ? 'exam' : 'exams'}
        </span>
      </div>

      {/* Test Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTests.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
            <FileCheck className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-base font-semibold text-slate-300">No practice tests match your criteria.</p>
            <p className="text-xs text-slate-500 mt-1">Create one or use our AI Generator to build an exam from any topic.</p>
            <button
              onClick={() => setIsAiQuizModalOpen(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition"
            >
              Generate AI Test Now
            </button>
          </div>
        ) : (
          filteredTests.map((test) => {
            const sub = subjects.find((s) => s.id === test.subjectId);
            const attempts = testAttempts.filter((a) => a.testId === test.id);
            const bestAttempt = attempts.reduce<null | typeof attempts[0]>(
              (best, curr) => (!best || curr.percentage > best.percentage ? curr : best),
              null
            );

            return (
              <div
                key={test.id}
                id={`test-card-${test.id}`}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group shadow-sm hover:shadow-indigo-500/5"
              >
                <div>
                  {/* Top Subject & Difficulty line */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="px-2.5 py-0.5 rounded text-[11px] font-bold"
                      style={{
                        backgroundColor: `${sub?.color || '#3B82F6'}20`,
                        color: sub?.color || '#3B82F6',
                      }}
                    >
                      {sub?.code || 'General'}
                    </span>

                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        test.difficulty === 'Hard'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          : test.difficulty === 'Medium'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      }`}
                    >
                      {test.difficulty}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                    {test.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {test.description}
                  </p>

                  {/* Metadata line */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800/60">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{test.estimatedMinutes} mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{test.questions.length} Questions</span>
                    </div>
                  </div>

                  {/* Best score badge if attempted */}
                  {bestAttempt && (
                    <div className="mt-2.5 flex items-center justify-between text-xs bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400">High Score:</span>
                      <span
                        className={`font-bold ${
                          bestAttempt.percentage >= 80 ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {bestAttempt.percentage}% ({bestAttempt.score}/{bestAttempt.totalQuestions})
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-800">
                  <button
                    onClick={() => startTest(test.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{bestAttempt ? 'Retake Exam' : 'Take Exam'}</span>
                  </button>

                  <button
                    onClick={() => deleteTest(test.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
                    title="Delete Practice Exam"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Recent Test History Section */}
      {testAttempts.length > 0 && (
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Recent Test Attempts History ({testAttempts.length})
              </h2>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 divide-y divide-slate-800/60 overflow-hidden">
            {testAttempts.slice(0, 5).map((att) => {
              const sub = subjects.find((s) => s.id === att.subjectId);
              return (
                <div
                  key={att.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-850 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                        att.percentage >= 80
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {att.percentage}%
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{att.testTitle}</h4>
                      <p className="text-xs text-slate-400">
                        {sub?.name || 'General'} • {new Date(att.completedAt).toLocaleDateString()} at{' '}
                        {new Date(att.completedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedHistoricalAttempt(att.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition cursor-pointer"
                  >
                    View Diagnostic Breakdown
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
