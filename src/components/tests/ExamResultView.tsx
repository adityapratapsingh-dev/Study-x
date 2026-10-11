import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Test, TestAttempt, Question } from '../../types';
import { useWorkspace } from '../../context/WorkspaceContext';
import { PageContainer } from '../shared/Page';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  Layers,
  Sparkles,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  BookmarkPlus,
  Zap,
  Award,
} from 'lucide-react';

interface ExamResultViewProps {
  test: Test;
  attempt: TestAttempt;
  onRetake: () => void;
  onBackToCatalog: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  test,
  attempt,
  onRetake,
  onBackToCatalog,
}) => {
  const { addMistakeLog, setActiveTab } = useWorkspace();
  const [loggedMistakeIds, setLoggedMistakeIds] = useState<Set<string>>(new Set());
  const [bulkLogSuccess, setBulkLogSuccess] = useState(false);

  const posMark = test.positiveMarks || 4;
  const negMark = test.negativeMarks || 1;

  // Compute breakdown
  let correctCount = attempt.correctCount ?? 0;
  let incorrectCount = attempt.incorrectCount ?? 0;
  let unattemptedCount = attempt.unattemptedCount ?? 0;

  if (attempt.correctCount === undefined) {
    test.questions.forEach((q) => {
      const studentAns = (attempt.answers[q.id] || '').trim();
      const correctAns = (q.correctAnswer || '').trim();
      if (!studentAns) unattemptedCount += 1;
      else if (studentAns.toLowerCase() === correctAns.toLowerCase()) correctCount += 1;
      else incorrectCount += 1;
    });
  }

  const marksGained = correctCount * posMark;
  const marksLostToNegatives = incorrectCount * negMark;
  const computedScore = marksGained - marksLostToNegatives;
  const totalMarks = test.totalMarks || test.questions.length * posMark;
  const accuracyPct = correctCount + incorrectCount > 0 ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0;

  useEffect(() => {
    if (accuracyPct >= 80) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  }, [accuracyPct]);

  const missedQuestions = test.questions.filter((q) => {
    const studentAns = (attempt.answers[q.id] || '').trim().toLowerCase();
    const correctAns = (q.correctAnswer || '').trim().toLowerCase();
    return studentAns && studentAns !== correctAns;
  });

  const handleLogSingleMistake = (q: Question) => {
    addMistakeLog({
      questionText: q.question,
      yourAnswer: attempt.answers[q.id] || 'Option chosen in mock',
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      subject: q.subject || 'Physics',
      chapter: q.chapter || 'Mock Test Review',
      examType: test.targetExam || 'JEE',
      category: 'conceptual_gap',
      personalNotes: `Logged from ${test.title} (Score: ${computedScore}/${totalMarks})`,
      isResolved: false,
    });
    setLoggedMistakeIds((prev) => new Set(prev).add(q.id));
  };

  const handleBulkLogAllMissed = () => {
    missedQuestions.forEach((q) => {
      if (!loggedMistakeIds.has(q.id)) {
        handleLogSingleMistake(q);
      }
    });
    setBulkLogSuccess(true);
    setTimeout(() => setBulkLogSuccess(false), 4000);
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <PageContainer width="narrow" className="space-y-8">
      
      {/* Toast Alert */}
      {bulkLogSuccess && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between border border-emerald-400/30">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span className="text-sm font-semibold">
              All {missedQuestions.length} missed questions saved to Mistake Notebook (Galti Diary)!
            </span>
          </div>
          <button
            onClick={() => setActiveTab('mistakes')}
            className="text-xs bg-slate-900 px-3 py-1 rounded-lg text-emerald-300 font-bold hover:bg-slate-800"
          >
            Open Diary →
          </button>
        </div>
      )}

      {/* Main Scorecard Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 shadow-xl relative overflow-hidden space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs uppercase font-bold px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Official NTA Performance Report
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">
              {test.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Attempted on {new Date(attempt.startedAt).toLocaleDateString()} • Duration: {formatDuration(attempt.durationSeconds)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRetake}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Test
            </button>
            <button
              onClick={onBackToCatalog}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-blue-600/20 transition cursor-pointer flex items-center gap-2"
            >
              Done & Return
            </button>
          </div>
        </div>

        {/* 4 Score Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Calculated Score</span>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
              <span className={computedScore >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {computedScore}
              </span>
              <span className="text-xs text-slate-500 font-sans font-normal ml-1">/ {totalMarks}</span>
            </div>
            <div className="text-[11px] text-slate-400">Target Score: {Math.round(totalMarks * 0.85)}+</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Question Accuracy</span>
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono">
              {accuracyPct}%
            </div>
            <div className="text-[11px] text-slate-400">Aim for &gt; 85% accuracy</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Correct Attempts (+{posMark})</span>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">
              {correctCount}
              <span className="text-xs text-slate-500 ml-1">/ {test.questions.length}</span>
            </div>
            <div className="text-[11px] text-emerald-300">+{marksGained} marks gained</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-rose-950/40 space-y-1">
            <span className="text-xs text-rose-300 font-medium">Negative Marks Lost (-{negMark})</span>
            <div className="text-2xl sm:text-3xl font-bold text-rose-400 font-mono">
              -{marksLostToNegatives}
            </div>
            <div className="text-[11px] text-rose-300">{incorrectCount} incorrect questions</div>
          </div>
        </div>

        {/* Missed questions bulk action banner */}
        {missedQuestions.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {missedQuestions.length} Questions Got Negative Marks
                </h4>
                <p className="text-xs text-slate-300">
                  Save all errors directly into your Mistake Notebook (Galti Diary) for weekend re-attempt.
                </p>
              </div>
            </div>

            <button
              onClick={handleBulkLogAllMissed}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <BookmarkPlus className="w-4 h-4" />
              Log All to Mistake Diary
            </button>
          </div>
        )}
      </div>

      {/* Detailed Question by Question Review */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          Step-by-Step Question & Solution Review
        </h3>

        <div className="space-y-4">
          {test.questions.map((q, idx) => {
            const studentAns = (attempt.answers[q.id] || '').trim();
            const correctAns = (q.correctAnswer || '').trim();
            const isUnattempted = !studentAns;
            const isCorrect = !isUnattempted && studentAns.toLowerCase() === correctAns.toLowerCase();
            const isLogged = loggedMistakeIds.has(q.id);

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition space-y-3 ${
                  isCorrect
                    ? 'bg-slate-900/60 border-emerald-900/40'
                    : isUnattempted
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-slate-900/90 border-rose-900/40 shadow-sm'
                }`}
              >
                {/* Question Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                      Q {idx + 1}
                    </span>
                    <span className="text-xs text-blue-400 font-semibold">
                      {q.subject || 'General'} {q.chapter ? `• ${q.chapter}` : ''}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        isCorrect
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isUnattempted
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {isCorrect ? `+${posMark} Correct` : isUnattempted ? '0 Unattempted' : `-${negMark} Incorrect`}
                    </span>
                  </div>

                  {!isCorrect && (
                    <button
                      onClick={() => handleLogSingleMistake(q)}
                      disabled={isLogged}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1 ${
                        isLogged
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                      }`}
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      {isLogged ? 'Saved to Diary' : 'Add to Mistake Diary'}
                    </button>
                  )}
                </div>

                {/* Question statement */}
                <div className="text-sm font-medium text-slate-200 leading-relaxed font-sans">
                  {q.question}
                </div>

                {/* Answer responses comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Your Response:</span>
                    <strong className={isCorrect ? 'text-emerald-400' : isUnattempted ? 'text-slate-400' : 'text-rose-400'}>
                      {studentAns || 'Left Unanswered'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block mb-0.5">Correct Answer:</span>
                    <strong className="text-emerald-400 font-mono">{correctAns}</strong>
                  </div>
                </div>

                {/* Step-by-Step Solution */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1 font-mono whitespace-pre-line leading-relaxed">
                  <div className="font-bold text-amber-400 font-sans mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Detailed Solution & Concept:
                  </div>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};
