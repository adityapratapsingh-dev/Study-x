import React, { useState, useEffect, useRef } from 'react';
import { Test, Question, TestAttempt } from '../../types';
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
} from 'lucide-react';

interface ActiveExamViewProps {
  test: Test;
  onFinish: (attempt: Omit<TestAttempt, 'id' | 'completedAt'>) => void;
  onCancel: () => void;
}

export const ActiveExamView: React.FC<ActiveExamViewProps> = ({ test, onFinish, onCancel }) => {
  const { subjects } = useWorkspace();
  const subject = subjects.find((s) => s.id === test.subjectId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [revealedHints, setRevealedHints] = useState<Set<string>>(new Set());
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchpadText, setScratchpadText] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Timer logic
  const totalSeconds = (test.estimatedMinutes || 10) * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion: Question | undefined = test.questions[currentIndex];

  const handleSelectAnswer = (ans: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: ans,
    }));
  };

  const toggleFlag = (qId: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const toggleHint = (qId: string) => {
    setRevealedHints((prev) => {
      const next = new Set(prev);
      next.add(qId);
      return next;
    });
  };

  const calculateScore = () => {
    let score = 0;
    test.questions.forEach((q) => {
      const studentAns = (answers[q.id] || '').trim().toLowerCase();
      const correctAns = (q.correctAnswer || '').trim().toLowerCase();
      if (studentAns === correctAns) {
        score += 1;
      } else if (q.type === 'short') {
        // Tolerant matching for short answer keywords
        if (studentAns && correctAns.includes(studentAns)) {
          score += 1;
        }
      }
    });
    return score;
  };

  const handleSubmitExam = () => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    const score = calculateScore();
    const totalQuestions = test.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    onFinish({
      testId: test.id,
      testTitle: test.title,
      subjectId: test.subjectId,
      startedAt: new Date(startTimeRef.current).toISOString(),
      durationSeconds: elapsedSeconds,
      answers,
      score,
      totalQuestions,
      percentage,
      flaggedQuestions: Array.from(flagged),
    });
  };

  const handleAutoSubmit = () => {
    handleSubmitExam();
  };

  const answeredCount = Object.keys(answers).filter((k) => answers[k]?.trim()).length;
  const progressPercent = Math.round((answeredCount / test.questions.length) * 100);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 min-h-[calc(100vh-112px)] overflow-hidden">
      
      {/* Exam Header */}
      <header className="px-6 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        
        {/* Title & Subject info */}
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-lg"
            style={{
              backgroundColor: `${subject?.color || '#3B82F6'}20`,
              color: subject?.color || '#3B82F6',
            }}
          >
            {subject?.code || 'Exam'}
          </span>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight line-clamp-1">
              {test.title}
            </h1>
            <p className="text-xs text-slate-400">
              Question {currentIndex + 1} of {test.questions.length} • {answeredCount} Answered
            </p>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-3">
          {/* Countdown Clock */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm transition ${
              remainingSeconds < 120
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            <Timer className="w-4 h-4 text-indigo-400" />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-700 transition"
            title={isPaused ? 'Resume Exam' : 'Pause Exam'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Scratchpad Toggle */}
          <button
            onClick={() => setShowScratchpad(!showScratchpad)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              showScratchpad
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            📝 Scratchpad
          </button>

          {/* Submit Button */}
          <button
            id="btn-submit-exam"
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Exam</span>
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1">
        <div
          className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Exam Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Question Sheet */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col justify-between max-w-4xl mx-auto w-full">
          {currentQuestion ? (
            <div className="space-y-6">
              
              {/* Question Header & Flag */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    Question {currentIndex + 1}
                  </span>
                  <span className="text-xs text-slate-400">
                    Type: <span className="text-slate-200 font-medium">{currentQuestion.type.toUpperCase()}</span>
                  </span>
                  {currentQuestion.topicTag && (
                    <span className="text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-400">
                      #{currentQuestion.topicTag}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {currentQuestion.hint && (
                    <button
                      onClick={() => toggleHint(currentQuestion.id)}
                      className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{revealedHints.has(currentQuestion.id) ? 'Hint Active' : 'Show Hint'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => toggleFlag(currentQuestion.id)}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition ${
                      flagged.has(currentQuestion.id)
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{flagged.has(currentQuestion.id) ? 'Flagged' : 'Flag for Review'}</span>
                  </button>
                </div>
              </div>

              {/* Hint Box (If revealed) */}
              {revealedHints.has(currentQuestion.id) && currentQuestion.hint && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs leading-relaxed flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Hint: </span>
                    {currentQuestion.hint}
                  </div>
                </div>
              )}

              {/* Question Statement */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
                <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Answer Options according to type */}
              <div className="space-y-3 pt-2">
                
                {/* MCQ Mode */}
                {currentQuestion.type === 'mcq' && currentQuestion.options && (
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.options.map((opt, idx) => {
                      const isSelected = answers[currentQuestion.id] === opt;
                      const letter = String.fromCharCode(65 + idx); // A, B, C, D
                      return (
                        <button
                          key={idx}
                          id={`option-${currentQuestion.id}-${idx}`}
                          onClick={() => handleSelectAnswer(opt)}
                          className={`w-full p-4 rounded-xl text-left border flex items-center gap-3 transition cursor-pointer group ${
                            isSelected
                              ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition shrink-0 ${
                              isSelected
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                            }`}
                          >
                            {letter}
                          </div>
                          <span className="text-sm font-medium leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* True / False Mode */}
                {currentQuestion.type === 'tf' && (
                  <div className="grid grid-cols-2 gap-4">
                    {['True', 'False'].map((choice) => {
                      const isSelected = answers[currentQuestion.id] === choice;
                      return (
                        <button
                          key={choice}
                          onClick={() => handleSelectAnswer(choice)}
                          className={`p-5 rounded-xl border text-center font-bold text-base transition cursor-pointer ${
                            isSelected
                              ? choice === 'True'
                                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                                : 'bg-rose-600/30 border-rose-500 text-rose-300'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Short Answer Mode */}
                {currentQuestion.type === 'short' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Type your exact response or key formula here..."
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleSelectAnswer(e.target.value)}
                      className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm font-medium"
                    />
                    <p className="text-xs text-slate-400">
                      Tip: Keep responses concise (e.g. key term, exact complexity like O(V+E), or numeric value).
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-800/80 mt-6">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-slate-500">
              {currentIndex + 1} / {test.questions.length}
            </span>

            {currentIndex < test.questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(test.questions.length - 1, prev + 1))}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsSubmitModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Finish & Grade</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Question Navigator Grid & Scratchpad */}
        <aside className="w-72 border-l border-slate-800 bg-slate-900/60 hidden lg:flex flex-col p-4 space-y-4 shrink-0 overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Question Navigator
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {test.questions.map((q, idx) => {
                const isCurrent = currentIndex === idx;
                const isAnswered = !!answers[q.id]?.trim();
                const isFlagged = flagged.has(q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg text-xs font-bold flex items-center justify-center relative transition cursor-pointer ${
                      isCurrent
                        ? 'ring-2 ring-indigo-500 text-white bg-indigo-600'
                        : isAnswered
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-slate-700 rounded-full" />
              <span>Unanswered ({test.questions.length - answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
              <span>Flagged for Review ({flagged.size})</span>
            </div>
          </div>

          {/* Student Exam Scratchpad */}
          {showScratchpad && (
            <div className="pt-3 border-t border-slate-800 flex-1 flex flex-col min-h-[160px]">
              <h4 className="text-xs font-bold text-slate-400 mb-2">Scratchpad / Formulas</h4>
              <textarea
                value={scratchpadText}
                onChange={(e) => setScratchpadText(e.target.value)}
                placeholder="Jot down rough math, formula reminders, or scratch calculations here..."
                className="flex-1 w-full p-2.5 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-slate-200 resize-none focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Cancel Exam Button */}
          <div className="pt-4 border-t border-slate-800 mt-auto">
            <button
              onClick={onCancel}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              Exit Practice Exam
            </button>
          </div>
        </aside>
      </div>

      {/* Submit Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Ready to Submit Exam?</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              You have answered <span className="font-bold text-white">{answeredCount}</span> of{' '}
              <span className="font-bold text-white">{test.questions.length}</span> questions.
              {flagged.size > 0 && (
                <span className="block mt-1 text-amber-400">
                  ⚠️ You still have {flagged.size} question(s) flagged for review.
                </span>
              )}
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
              >
                Back to Questions
              </button>
              <button
                onClick={() => {
                  setIsSubmitModalOpen(false);
                  handleSubmitExam();
                }}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md transition"
              >
                Submit & View Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
