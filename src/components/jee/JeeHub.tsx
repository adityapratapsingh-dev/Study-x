import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { JEE_SAMPLE_QUESTIONS, JEE_FULL_MOCK_TEST, JEE_PERCENTILE_MATRIX, JEE_STRATEGY_TIPS } from './jeeData';
import { INITIAL_CHAPTER_WEIGHTAGES, INITIAL_FORMULAS } from '../../data/competitiveData';
import {
  Zap,
  FlaskConical,
  Sigma,
  Play,
  Calculator,
  Flame,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  BookmarkPlus,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const JeeHub: React.FC = () => {
  const { startTest, addMistakeLog, setActiveTab, setSelectedSubjectId } = useWorkspace();
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<'All' | 'Physics' | 'Chemistry' | 'Mathematics'>('All');
  const [activeNumericalIndex, setActiveNumericalIndex] = useState(0);
  const [userNumericalAnswer, setUserNumericalAnswer] = useState('');
  const [numericalFeedback, setNumericalFeedback] = useState<{ isCorrect: boolean; showExplanation: boolean } | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<'All' | '11' | '12'>('All');
  const [addedMistakeToast, setAddedMistakeToast] = useState<string | null>(null);

  // Filter numerical questions from JEE pool
  const numericalQuestions = JEE_SAMPLE_QUESTIONS.filter((q) => q.isNumerical);
  const currentNumerical = numericalQuestions[activeNumericalIndex] || numericalQuestions[0];

  // Filter chapter weightages
  const jeeWeightages = INITIAL_CHAPTER_WEIGHTAGES.filter(
    (cw) => cw.exam === 'JEE' && (selectedSubjectFilter === 'All' || cw.subject === selectedSubjectFilter) && (selectedGrade === 'All' || cw.classGrade === selectedGrade)
  );

  // Filter formulas for JEE
  const jeeFormulas = INITIAL_FORMULAS.filter(
    (f) => (f.examTag === 'JEE' || f.examTag === 'BOTH') && (selectedSubjectFilter === 'All' || f.subject === selectedSubjectFilter)
  );

  const handleCheckNumerical = () => {
    if (!userNumericalAnswer.trim() || !currentNumerical) return;
    const isCorrect = userNumericalAnswer.trim() === currentNumerical.correctAnswer.trim();
    setNumericalFeedback({ isCorrect, showExplanation: true });
  };

  const handleNextNumerical = () => {
    setUserNumericalAnswer('');
    setNumericalFeedback(null);
    setActiveNumericalIndex((prev) => (prev + 1) % numericalQuestions.length);
  };

  const handleSaveToMistakes = (q: typeof currentNumerical) => {
    addMistakeLog({
      questionText: q.question,
      yourAnswer: userNumericalAnswer || 'Left Blank',
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      subject: q.subject || 'Physics',
      chapter: q.chapter || 'General',
      examType: 'JEE',
      category: 'calculation_silly',
      personalNotes: 'Logged from JEE Numerical practice arena.',
      isResolved: false,
    });
    setAddedMistakeToast('Saved to Mistake Notebook (Galti Diary)!');
    setTimeout(() => setAddedMistakeToast(null), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Toast Alert */}
      {addedMistakeToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-400/30 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-sm font-medium">{addedMistakeToast}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border border-blue-800/40 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              NTA JEE Main & Advanced 2025-2026 Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              JEE Rank Accelerator Hub
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Target 99.5+ Percentile with official NTA Computer Based Test (CBT) simulator, Section B integer practice, high-yield chapter weightage, and formula sheets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => startTest(JEE_FULL_MOCK_TEST.id)}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Launch NTA CBT Mock (300 Marks)
            </button>
            <button
              onClick={() => setActiveTab('mistakes')}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Mistake Notebook
            </button>
          </div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
          <Sigma className="w-64 h-64 text-blue-400" />
        </div>
      </div>

      {/* Subject Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['All', 'Physics', 'Chemistry', 'Mathematics'] as const).map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubjectFilter(subj)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
                selectedSubjectFilter === subj
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {subj === 'Physics' && <Zap className="w-3.5 h-3.5 text-blue-400" />}
              {subj === 'Chemistry' && <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />}
              {subj === 'Mathematics' && <Sigma className="w-3.5 h-3.5 text-purple-400" />}
              {subj}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Class:</span>
          {(['All', '11', '12'] as const).map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-2.5 py-1 rounded border text-xs font-medium cursor-pointer transition ${
                selectedGrade === grade
                  ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {grade === 'All' ? 'All Classes' : `Class ${grade}`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 2 Columns - Interactive Section B Integer Practice & Quick Formula Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Numerical Value Problem Arena (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Section B: Numerical Integer Practice Arena
                  </h2>
                  <p className="text-xs text-slate-400">
                    High accuracy in numericals is key to 99+ percentile in JEE Mains
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md font-mono">
                Q {activeNumericalIndex + 1} / {numericalQuestions.length}
              </span>
            </div>

            {/* Question Card */}
            {currentNumerical && (
              <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-blue-400">
                    {currentNumerical.subject} • {currentNumerical.chapter}
                  </span>
                  <span className="bg-blue-950/60 text-blue-300 px-2 py-0.5 rounded border border-blue-800/40 text-[11px]">
                    {currentNumerical.pyqYear}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                  {currentNumerical.question}
                </p>

                {/* Input box */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter integer / decimal value (e.g. 3)"
                      value={userNumericalAnswer}
                      onChange={(e) => {
                        setUserNumericalAnswer(e.target.value);
                        setNumericalFeedback(null);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleCheckNumerical()}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-500"
                    />
                  </div>
                  <button
                    onClick={handleCheckNumerical}
                    disabled={!userNumericalAnswer.trim()}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Check Answer
                  </button>
                  <button
                    onClick={handleNextNumerical}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Next
                  </button>
                </div>

                {/* Feedback & Step-by-Step Explanation */}
                {numericalFeedback && (
                  <div
                    className={`p-4 rounded-xl border space-y-3 transition-all ${
                      numericalFeedback.isCorrect
                        ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-600/40 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {numericalFeedback.isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Correct! (+4 Marks)
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-rose-400" />
                            Incorrect Answer. Correct is: {currentNumerical.correctAnswer}
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => handleSaveToMistakes(currentNumerical)}
                        className="text-xs px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                        Log Mistake
                      </button>
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1 font-mono whitespace-pre-line leading-relaxed">
                      {currentNumerical.explanation}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Tips */}
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-2">
              <h4 className="text-xs font-bold text-blue-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Topper Strategy for JEE Main 2025
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In Section B, out of 10 questions you need to attempt 5 (or 5 compulsory depending on session). Scan all 10 first and pick the ones requiring direct single-formula substitutions to save 15 minutes for Physics & Math calculations.
              </p>
            </div>
          </div>

          {/* High-Yield Chapter Weightage Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  JEE Chapter Weightage & High-Yield Blueprint
                </h3>
                <p className="text-xs text-slate-400">Based on past 5 years of JEE Main shifts (2020-2024)</p>
              </div>
            </div>

            <div className="space-y-3">
              {jeeWeightages.map((cw) => (
                <div
                  key={cw.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          cw.weightage === 'Very High'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {cw.weightage} Priority
                      </span>
                      <span className="text-sm font-semibold text-white">{cw.chapter}</span>
                    </div>
                    <span className="text-xs text-blue-400 font-mono font-semibold">
                      ~{cw.avgQuestionsPerExam} Qs / paper
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cw.importantConcepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>

                  {cw.ncertRef && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                      <BookOpen className="w-3 h-3 text-slate-500" />
                      <span>NCERT Ref: {cw.ncertRef}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: JEE Formula Cards & Percentile Predictor (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Formula Revision Deck */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">JEE High-Yield Formulas</h3>
              </div>
              <button
                onClick={() => setActiveTab('formulas')}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {jeeFormulas.slice(0, 3).map((formula) => (
                <div
                  key={formula.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-blue-900/50 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{formula.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-medium">
                      {formula.subject}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-900/40 text-blue-200 font-mono text-xs overflow-x-auto">
                    {formula.formula}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-normal">
                    <strong className="text-amber-400 font-medium">Tip:</strong> {formula.proTip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Marks vs Percentile Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">JEE Main Marks vs Percentile Benchmark</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2 font-medium">Score / 300</th>
                    <th className="pb-2 font-medium">Expected %ile</th>
                    <th className="pb-2 font-medium">Estimated Rank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {JEE_PERCENTILE_MATRIX.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="py-2.5 font-bold text-blue-300 font-mono">{row.scoreRange}</td>
                      <td className="py-2.5 text-emerald-400 font-semibold">{row.percentile}</td>
                      <td className="py-2.5 text-slate-300">{row.rankEst}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              * Based on average difficulty normalization across NTA January and April shifts.
            </p>
          </div>

          {/* Strategy Tips */}
          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/40 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-indigo-400" />
              JEE Exam Day Mindset Rules
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              {JEE_STRATEGY_TIPS.map((st, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="font-semibold text-slate-200">{st.title}:</div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{st.tip}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
