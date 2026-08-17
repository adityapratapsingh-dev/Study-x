import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Test, TestAttempt, Question } from '../../types';
import { useWorkspace } from '../../context/WorkspaceContext';
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
  const { subjects, addDeck, setActiveTab } = useWorkspace();
  const subject = subjects.find((s) => s.id === test.subjectId);

  useEffect(() => {
    if (attempt.percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  }, [attempt.percentage]);

  const getLetterGrade = (pct: number) => {
    if (pct >= 95) return { grade: 'A+', text: 'Mastery Level!', color: 'text-emerald-400' };
    if (pct >= 85) return { grade: 'A', text: 'Excellent Work!', color: 'text-emerald-400' };
    if (pct >= 75) return { grade: 'B', text: 'Good Understanding', color: 'text-blue-400' };
    if (pct >= 65) return { grade: 'C', text: 'Passing - Needs Review', color: 'text-amber-400' };
    if (pct >= 50) return { grade: 'D', text: 'Needs Improvement', color: 'text-orange-400' };
    return { grade: 'F', text: 'Requires Focused Study', color: 'text-rose-400' };
  };

  const gradeInfo = getLetterGrade(attempt.percentage);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const missedQuestions: Question[] = test.questions.filter((q) => {
    const studentAns = (attempt.answers[q.id] || '').trim().toLowerCase();
    const correctAns = (q.correctAnswer || '').trim().toLowerCase();
    if (q.type === 'short') {
      return !studentAns || !correctAns.includes(studentAns);
    }
    return studentAns !== correctAns;
  });

  const handleMakeFlashcardsFromMissed = () => {
    if (missedQuestions.length === 0) return;
    addDeck({
      title: `${test.title} - Missed Questions Deck`,
      subjectId: test.subjectId,
      noteIdRef: test.noteIdRef,
      cards: missedQuestions.map((q) => ({
        id: 'c-missed-' + Math.random().toString(36).slice(2, 7),
        front: q.question,
        back: `Correct Answer: ${q.correctAnswer}\n\nExplanation: ${q.explanation}`,
        category: q.topicTag || 'Review',
        state: 'learning',
      })),
    });
    setActiveTab('flashcards');
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-slate-950 text-slate-100 overflow-y-auto max-w-4xl mx-auto w-full space-y-8">
      
      {/* Diagnostic Score Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Left stats overview */}
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5" />
              <span>Exam Complete</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {test.title}
            </h1>
            
            <p className="text-sm text-slate-400">
              Subject: <span className="font-semibold text-slate-200">{subject?.name || 'General'}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Time Spent: {formatDuration(attempt.durationSeconds)}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{attempt.score} / {attempt.totalQuestions} Correct</span>
              </div>
            </div>
          </div>

          {/* Right grade ring */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner w-44 h-44 shrink-0">
            <span className={`text-5xl font-black ${gradeInfo.color}`}>
              {attempt.percentage}%
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
              Grade {gradeInfo.grade}
            </span>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 text-center">
              {gradeInfo.text}
            </span>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-800/80 relative z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={onRetake}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Test</span>
            </button>

            {missedQuestions.length > 0 && (
              <button
                onClick={handleMakeFlashcardsFromMissed}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-lg transition cursor-pointer"
                title="Create active recall deck for missed concepts"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Turn {missedQuestions.length} Missed into Flashcards</span>
              </button>
            )}
          </div>

          <button
            onClick={onBackToCatalog}
            className="text-xs text-slate-400 hover:text-slate-200 transition font-medium"
          >
            ← Back to Tests Catalog
          </button>
        </div>
      </div>

      {/* Question-by-Question Review Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Detailed Question Review ({test.questions.length})
          </h2>
          <span className="text-xs text-slate-400">
            Green = Correct, Red = Incorrect / Partial
          </span>
        </div>

        <div className="space-y-4">
          {test.questions.map((q, idx) => {
            const studentAns = attempt.answers[q.id] || '(No answer provided)';
            const isCorrect =
              q.type === 'short'
                ? studentAns !== '(No answer provided)' &&
                  q.correctAnswer.toLowerCase().includes(studentAns.toLowerCase())
                : studentAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition ${
                  isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                {/* Question Top Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {q.type.toUpperCase()} Question
                    </span>
                    {q.topicTag && (
                      <span className="text-[11px] px-2 py-0.5 bg-slate-800 rounded text-slate-400">
                        #{q.topicTag}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    {isCorrect ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Correct (+1)
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> Incorrect (0)
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Statement */}
                <p className="text-sm sm:text-base font-semibold text-white mb-4 leading-relaxed">
                  {q.question}
                </p>

                {/* Answers Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-semibold block">Your Answer:</span>
                    <span
                      className={`font-medium ${
                        isCorrect ? 'text-emerald-300 font-semibold' : 'text-rose-300'
                      }`}
                    >
                      {studentAns}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-semibold block">Correct Answer:</span>
                    <span className="text-emerald-400 font-bold">{q.correctAnswer}</span>
                  </div>
                </div>

                {/* Detailed Explanation */}
                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
                  <span className="font-bold text-indigo-300 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" /> Concept Explanation:
                  </span>
                  <p>{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
