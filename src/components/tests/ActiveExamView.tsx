import React, { useState, useEffect, useRef } from 'react';
import { Test, Question, TestAttempt, NtaQuestionStatus } from '../../types';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  Timer,
  Flag,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Eye,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  BookmarkPlus,
  CheckCircle2,
} from 'lucide-react';

interface ActiveExamViewProps {
  test: Test;
  onFinish: (attempt: Omit<TestAttempt, 'id' | 'completedAt'>) => void;
  onCancel: () => void;
}

export const ActiveExamView: React.FC<ActiveExamViewProps> = ({ test, onFinish, onCancel }) => {
  const { subjects, addMistakeLog } = useWorkspace();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, NtaQuestionStatus>>({});
  const [activeSubjectTab, setActiveSubjectTab] = useState<string>('All');
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchpadText, setScratchpadText] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  // Timer
  const totalSeconds = (test.estimatedMinutes || 60) * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const startTimeRef = useRef<number>(Date.now());

  // Derive unique subjects present in test questions
  const testSubjects = Array.from(new Set(test.questions.map((q) => q.subject || 'Main Section')));

  // Initialize question statuses
  useEffect(() => {
    const initialStatuses: Record<string, NtaQuestionStatus> = {};
    test.questions.forEach((q, idx) => {
      initialStatuses[q.id] = idx === 0 ? 'not_answered' : 'not_visited';
    });
    setQuestionStatuses(initialStatuses);
  }, [test]);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion: Question | undefined = test.questions[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: opt,
    }));
  };

  const handleSaveAndNext = () => {
    if (!currentQuestion) return;
    const isAnswered = Boolean(answers[currentQuestion.id]?.trim());

    setQuestionStatuses((prev) => ({
      ...prev,
      [currentQuestion.id]: isAnswered ? 'answered' : 'not_answered',
    }));

    if (currentIndex < test.questions.length - 1) {
      const nextQ = test.questions[currentIndex + 1];
      if (nextQ && questionStatuses[nextQ.id] === 'not_visited') {
        setQuestionStatuses((prev) => ({ ...prev, [nextQ.id]: 'not_answered' }));
      }
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleMarkForReviewAndNext = () => {
    if (!currentQuestion) return;
    const isAnswered = Boolean(answers[currentQuestion.id]?.trim());

    setQuestionStatuses((prev) => ({
      ...prev,
      [currentQuestion.id]: isAnswered ? 'answered_and_marked' : 'marked_for_review',
    }));

    if (currentIndex < test.questions.length - 1) {
      const nextQ = test.questions[currentIndex + 1];
      if (nextQ && questionStatuses[nextQ.id] === 'not_visited') {
        setQuestionStatuses((prev) => ({ ...prev, [nextQ.id]: 'not_answered' }));
      }
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleClearResponse = () => {
    if (!currentQuestion) return;
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
    setQuestionStatuses((prev) => ({
      ...prev,
      [currentQuestion.id]: 'not_answered',
    }));
  };

  const handleJumpToQuestion = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= test.questions.length) return;
    const targetQ = test.questions[targetIndex];

    setQuestionStatuses((prev) => {
      const next = { ...prev };
      // update current
      if (currentQuestion && !next[currentQuestion.id]) {
        next[currentQuestion.id] = answers[currentQuestion.id] ? 'answered' : 'not_answered';
      }
      // update target if not visited
      if (targetQ && next[targetQ.id] === 'not_visited') {
        next[targetQ.id] = 'not_answered';
      }
      return next;
    });

    setCurrentIndex(targetIndex);
  };

  const calculateScorecard = () => {
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const posMark = test.positiveMarks || 4;
    const negMark = test.negativeMarks || 1;

    test.questions.forEach((q) => {
      const studentAns = (answers[q.id] || '').trim();
      const correctAns = (q.correctAnswer || '').trim();

      if (!studentAns) {
        unattemptedCount += 1;
      } else if (studentAns.toLowerCase() === correctAns.toLowerCase()) {
        correctCount += 1;
        score += posMark;
      } else {
        incorrectCount += 1;
        score -= negMark;
      }
    });

    const totalPossibleMarks = test.questions.length * posMark;
    const percentage = totalPossibleMarks > 0 ? Math.max(0, Math.round((score / totalPossibleMarks) * 100)) : 0;

    return {
      score,
      totalPossibleMarks,
      correctCount,
      incorrectCount,
      unattemptedCount,
      percentage,
    };
  };

  const handleSubmitExam = () => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const { score, totalPossibleMarks, correctCount, incorrectCount, unattemptedCount, percentage } = calculateScorecard();

    onFinish({
      testId: test.id,
      testTitle: test.title,
      subjectId: test.subjectId,
      examType: test.examType,
      startedAt: new Date(startTimeRef.current).toISOString(),
      durationSeconds: elapsedSeconds,
      answers,
      statuses: questionStatuses,
      score,
      totalMarks: totalPossibleMarks,
      totalQuestions: test.questions.length,
      correctCount,
      incorrectCount,
      unattemptedCount,
      percentage,
    });
  };

  // Status counts for NTA Legend
  const answeredCount = Object.values(questionStatuses).filter((s) => s === 'answered' || s === 'answered_and_marked').length;
  const notAnsweredCount = Object.values(questionStatuses).filter((s) => s === 'not_answered').length;
  const markedForReviewCount = Object.values(questionStatuses).filter((s) => s === 'marked_for_review').length;
  const answeredAndMarkedCount = Object.values(questionStatuses).filter((s) => s === 'answered_and_marked').length;
  const notVisitedCount = Object.values(questionStatuses).filter((s) => s === 'not_visited').length;

  const filteredQuestions = test.questions.map((q, idx) => ({ q, originalIndex: idx })).filter(
    ({ q }) => activeSubjectTab === 'All' || q.subject === activeSubjectTab
  );

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 min-h-[calc(100vh-64px)] overflow-hidden font-sans">
      
      {/* Top CBT NTA Exam Bar */}
      <header className="px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 shadow-md">
        
        {/* Exam Title & Subject tag */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-600/20 text-blue-300 border border-blue-500/30">
            NTA CBT
          </span>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight line-clamp-1">
              {test.title}
            </h1>
            <p className="text-xs text-slate-400">
              Marking Scheme: <strong className="text-emerald-400">+{test.positiveMarks || 4}</strong> for Correct,{' '}
              <strong className="text-rose-400">-{test.negativeMarks || 1}</strong> for Incorrect,{' '}
              <strong className="text-slate-400">0</strong> for Unattempted
            </p>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm sm:text-base shadow-sm ${
              remainingSeconds < 300
                ? 'bg-rose-950/60 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-100'
            }`}
          >
            <Timer className="w-4 h-4 text-indigo-400" />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          <button
            onClick={() => setShowScratchpad(!showScratchpad)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer hidden sm:block ${
              showScratchpad
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            📝 Rough Sheet
          </button>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </header>

      {/* Subject Tabs Bar (Physics / Chemistry / Math / Biology) */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-2 flex items-center justify-between gap-4 overflow-x-auto shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Sections:</span>
          <button
            onClick={() => setActiveSubjectTab('All')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
              activeSubjectTab === 'All'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Sections ({test.questions.length})
          </button>
          {testSubjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setActiveSubjectTab(subj)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                activeSubjectTab === subj
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {subj} ({test.questions.filter((q) => (q.subject || 'Main Section') === subj).length})
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 hidden md:block">
          Candidate Mode: <strong className="text-slate-200">Online CBT Exam</strong>
        </div>
      </div>

      {/* Main Body: 2 Columns - Question Sheet (Left 8 Cols) & NTA Question Palette (Right 4 Cols) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Question Pane & Navigation Footer */}
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-y-auto border-r border-slate-800">
          {currentQuestion ? (
            <div className="space-y-6 max-w-3xl mx-auto w-full">
              
              {/* Question Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold">
                    Question {currentIndex + 1} of {test.questions.length}
                  </span>
                  <span className="text-xs font-semibold text-blue-400">
                    {currentQuestion.subject || 'General'} {currentQuestion.chapter ? `• ${currentQuestion.chapter}` : ''}
                  </span>
                  {currentQuestion.pyqYear && (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {currentQuestion.pyqYear}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-emerald-400 font-bold">+{test.positiveMarks || 4}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-rose-400 font-bold">-{test.negativeMarks || 1}</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed font-sans select-none">
                {currentQuestion.question}
              </div>

              {/* Question Type: Numerical or MCQ */}
              {currentQuestion.isNumerical || currentQuestion.type === 'numerical' ? (
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    Section B: Numerical Value Answer
                  </label>
                  <input
                    type="text"
                    placeholder="Enter integer / decimal value"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleSelectOption(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-base focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600"
                  />
                  <p className="text-[11px] text-slate-400">
                    Round off your answer as specified in the question text. Only enter numbers.
                  </p>
                </div>
              ) : (
                /* MCQs Options */
                <div className="space-y-3 pt-2">
                  {currentQuestion.options?.map((opt, oIdx) => {
                    const isSelected = answers[currentQuestion.id] === opt;
                    const optionLetter = String.fromCharCode(65 + oIdx);

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full p-4 rounded-xl text-left text-sm transition cursor-pointer flex items-start gap-3 border ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10'
                            : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {optionLetter}
                        </span>
                        <span className="font-sans text-sm sm:text-base leading-relaxed pt-0.5">
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Scratchpad if toggled */}
              {showScratchpad && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 uppercase">Rough Calculation Scratchpad</span>
                    <button onClick={() => setScratchpadText('')} className="text-xs text-slate-400 hover:text-white">Clear</button>
                  </div>
                  <textarea
                    rows={4}
                    value={scratchpadText}
                    onChange={(e) => setScratchpadText(e.target.value)}
                    placeholder="Write temporary step calculations, formula notes..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">Question not found</div>
          )}

          {/* Action Buttons Footer (NTA CBT Pattern) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-800 mt-6 max-w-3xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveAndNext}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer"
              >
                Save & Next
              </button>
              <button
                onClick={handleMarkForReviewAndNext}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-purple-600/20 transition cursor-pointer"
              >
                Mark for Review & Next
              </button>
              <button
                onClick={handleClearResponse}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium rounded-xl border border-slate-700 transition cursor-pointer"
              >
                Clear Response
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => handleJumpToQuestion(currentIndex - 1)}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs sm:text-sm font-medium rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                disabled={currentIndex === test.questions.length - 1}
                onClick={() => handleJumpToQuestion(currentIndex + 1)}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs sm:text-sm font-medium rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Official NTA Question Palette (4 Cols on desktop) */}
        <div className="w-full lg:w-80 bg-slate-900/90 p-4 sm:p-5 overflow-y-auto space-y-5 shrink-0">
          
          {/* Candidate Profile Box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-xs font-semibold text-white">Candidate: Student Aspirant</div>
            <div className="text-[11px] text-slate-400">Exam: {test.title}</div>
          </div>

          {/* Official NTA Status Legend */}
          <div className="space-y-2 text-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Question Status Legend</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {answeredCount}
                </span>
                <span className="text-slate-300">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-rose-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {notAnsweredCount}
                </span>
                <span className="text-slate-300">Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-700 text-slate-300 font-bold flex items-center justify-center text-[10px]">
                  {notVisitedCount}
                </span>
                <span className="text-slate-300">Not Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {markedForReviewCount}
                </span>
                <span className="text-slate-300">Marked Review</span>
              </div>
            </div>
          </div>

          {/* Question Grid Buttons */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Choose a Question:</span>
              <span className="text-blue-400 font-mono font-semibold">{test.questions.length} Total</span>
            </div>

            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1">
              {test.questions.map((q, idx) => {
                const status = questionStatuses[q.id] || 'not_visited';
                const isCurrent = idx === currentIndex;

                let statusBg = 'bg-slate-800 text-slate-400 hover:bg-slate-700'; // not visited
                if (status === 'answered') statusBg = 'bg-emerald-600 text-white font-bold shadow-sm';
                else if (status === 'not_answered') statusBg = 'bg-rose-600 text-white font-bold shadow-sm';
                else if (status === 'marked_for_review') statusBg = 'bg-purple-600 text-white font-bold shadow-sm';
                else if (status === 'answered_and_marked') statusBg = 'bg-purple-600 ring-2 ring-emerald-400 text-white font-bold';

                return (
                  <button
                    key={q.id}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`h-9 rounded-lg text-xs transition cursor-pointer flex items-center justify-center font-mono ${statusBg} ${
                      isCurrent ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900 scale-105' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cancel Test Confirmation Trigger */}
          <div className="pt-2">
            <button
              onClick={() => setIsCancelConfirmOpen(true)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-xs font-medium rounded-xl border border-slate-700 transition cursor-pointer"
            >
              Exit / Abandon Test
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Submit Examination?</h3>
                <p className="text-xs text-slate-400">Confirm test completion and generate official scorecard</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
              <div>
                <span className="text-slate-400">Answered:</span>{' '}
                <strong className="text-emerald-400">{answeredCount}</strong>
              </div>
              <div>
                <span className="text-slate-400">Unanswered:</span>{' '}
                <strong className="text-rose-400">{notAnsweredCount}</strong>
              </div>
              <div>
                <span className="text-slate-400">Marked Review:</span>{' '}
                <strong className="text-purple-400">{markedForReviewCount + answeredAndMarkedCount}</strong>
              </div>
              <div>
                <span className="text-slate-400">Not Visited:</span>{' '}
                <strong className="text-slate-400">{notVisitedCount}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Back to Test
              </button>
              <button
                onClick={() => {
                  setIsSubmitModalOpen(false);
                  handleSubmitExam();
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                Confirm & View Result
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Test Confirmation Modal */}
      {isCancelConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Abandon Exam Session?
            </h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to exit? Your answers for this active session will not be saved.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsCancelConfirmOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Stay in Exam
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
