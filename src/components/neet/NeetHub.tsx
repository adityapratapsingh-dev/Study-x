import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { PageContainer, PageHeader } from '../shared/Page';
import {
  NEET_SAMPLE_QUESTIONS,
  NEET_FULL_MOCK_TEST,
  NEET_TARGET_COLLEGE_CUTOFFS,
  NEET_NCERT_LINES_DRILL,
} from './neetData';
import { INITIAL_CHAPTER_WEIGHTAGES } from '../../data/competitiveData';
import {
  Sprout,
  Activity,
  Zap,
  FlaskConical,
  Play,
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
  HeartPulse,
} from 'lucide-react';

export const NeetHub: React.FC = () => {
  const { startTest, addMistakeLog, setActiveTab } = useWorkspace();
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<'All' | 'Botany' | 'Zoology' | 'Physics' | 'Chemistry'>('All');
  const [drillIndex, setDrillIndex] = useState(0);
  const [showDrillAnswer, setShowDrillAnswer] = useState(false);
  const [addedMistakeToast, setAddedMistakeToast] = useState<string | null>(null);

  const currentDrill = NEET_NCERT_LINES_DRILL[drillIndex] || NEET_NCERT_LINES_DRILL[0];

  // Filter chapter weightages for NEET
  const neetWeightages = INITIAL_CHAPTER_WEIGHTAGES.filter(
    (cw) => cw.exam === 'NEET' && (selectedSubjectFilter === 'All' || cw.subject === selectedSubjectFilter)
  );

  const handleNextDrill = () => {
    setShowDrillAnswer(false);
    setDrillIndex((prev) => (prev + 1) % NEET_NCERT_LINES_DRILL.length);
  };

  const handleSaveDrillToMistakes = () => {
    addMistakeLog({
      questionText: currentDrill.highYieldQuestion,
      yourAnswer: 'NCERT Rapid Drill Practice',
      correctAnswer: currentDrill.answer,
      explanation: currentDrill.ncertFact,
      subject: 'Botany (Biology)',
      chapter: currentDrill.chapter,
      examType: 'NEET',
      category: 'conceptual_gap',
      personalNotes: 'Logged from NCERT Line-by-Line speed drill.',
      isResolved: false,
    });
    setAddedMistakeToast('Saved to Mistake Notebook (Galti Diary)!');
    setTimeout(() => setAddedMistakeToast(null), 3000);
  };

  return (
    <PageContainer className="space-y-8">
      {/* Toast Notification */}
      {addedMistakeToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-400/30 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-sm font-medium">{addedMistakeToast}</span>
        </div>
      )}

      <PageHeader
        eyebrow="NTA NEET UG 2025-2026 Medical Prep Portal"
        eyebrowIcon={HeartPulse}
        accent="bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
        accentGradient="from-emerald-950 via-slate-900 to-cyan-950"
        title="NEET MBBS 720 Mastery Hub"
        subtitle="Target 360/360 in Biology with NCERT line-by-line question drills, authentic 720-marks full syllabus mock exams, and chapter-wise weightage trackers."
        watermark={Sprout}
        actions={
          <>
            <button
              onClick={() => startTest(NEET_FULL_MOCK_TEST.id)}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Launch NTA CBT Mock (720 Marks)
            </button>
            <button
              onClick={() => setActiveTab('mistakes')}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 flex items-center gap-2 transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Mistake Notebook
            </button>
          </>
        }
      />

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-4">
        {(['All', 'Botany', 'Zoology', 'Physics', 'Chemistry'] as const).map((subj) => (
          <button
            key={subj}
            onClick={() => setSelectedSubjectFilter(subj)}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
              selectedSubjectFilter === subj
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {subj === 'Botany' && <Sprout className="w-3.5 h-3.5 text-emerald-400" />}
            {subj === 'Zoology' && <Activity className="w-3.5 h-3.5 text-orange-400" />}
            {subj === 'Physics' && <Zap className="w-3.5 h-3.5 text-blue-400" />}
            {subj === 'Chemistry' && <FlaskConical className="w-3.5 h-3.5 text-teal-400" />}
            {subj}
          </button>
        ))}
      </div>

      {/* Grid: 2 Columns - NCERT Line-by-Line Blitz & Target College Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: NCERT Line-by-Line Speed Trainer (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    NCERT Line-by-Line Biology 360 Blitz
                  </h2>
                  <p className="text-xs text-slate-400">
                    95%+ of NEET Biology questions are framed directly from NCERT lines
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md font-mono">
                Drill {drillIndex + 1} / {NEET_NCERT_LINES_DRILL.length}
              </span>
            </div>

            {/* Drill Card */}
            {currentDrill && (
              <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-emerald-400">
                    NCERT Chapter: {currentDrill.chapter}
                  </span>
                  <span className="bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40 text-[11px]">
                    NCERT Direct Fact
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                    Question:
                  </span>
                  <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                    {currentDrill.highYieldQuestion}
                  </p>
                </div>

                {/* Show Answer Toggle */}
                {showDrillAnswer ? (
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-700/40 text-emerald-200 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        NCERT Line Reference & Answer:
                      </span>
                      <button
                        onClick={handleSaveDrillToMistakes}
                        className="text-xs px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                        Save to Mistake Log
                      </button>
                    </div>
                    <div className="text-sm font-bold text-white">{currentDrill.answer}</div>
                    <p className="text-xs text-slate-300 italic pt-1">{currentDrill.ncertFact}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDrillAnswer(true)}
                    className="w-full py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs sm:text-sm transition cursor-pointer"
                  >
                    Reveal NCERT Answer & Line Reference
                  </button>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextDrill}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Next NCERT Line
                  </button>
                </div>
              </div>
            )}

            {/* NEET 3-Step Success Protocol */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
              <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                NEET 680+ Marks Strategy
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Finish all 90 Biology questions in under 45-50 minutes with 98% accuracy. This leaves 70 minutes for Physics calculations and 50 minutes for Chemistry, securing your dream GMC/AIIMS seat.
              </p>
            </div>
          </div>

          {/* High-Yield Chapter Weightage Matrix for NEET */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  NEET Chapter Weightage & Question Yield
                </h3>
                <p className="text-xs text-slate-400">Based on past 5 years of NEET UG trends</p>
              </div>
            </div>

            <div className="space-y-3">
              {neetWeightages.map((cw) => (
                <div
                  key={cw.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {cw.weightage} Yield
                      </span>
                      <span className="text-sm font-semibold text-white">{cw.chapter}</span>
                    </div>
                    <span className="text-xs text-emerald-400 font-mono font-semibold">
                      ~{cw.avgQuestionsPerExam} Qs / exam
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
                      <span>NCERT Unit: {cw.ncertRef}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Target Medical College Cutoffs (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Target Medical Colleges Cutoff Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Target Medical College Cutoffs (720 Marks)</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2 font-medium">College</th>
                    <th className="pb-2 font-medium">Safe Marks</th>
                    <th className="pb-2 font-medium">AIR Rank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {NEET_TARGET_COLLEGE_CUTOFFS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition">
                      <td className="py-2.5 font-bold text-white">{row.college}</td>
                      <td className="py-2.5 text-emerald-400 font-mono font-semibold">{row.targetScore}</td>
                      <td className="py-2.5 text-slate-300">{row.safeRank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              * General category expected cutoffs under All India 15% Quota (AIQ).
            </p>
          </div>

          {/* Biology Subject Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              Biology 360 Marks Structure
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Botany (Section A + B)</div>
                  <div className="text-slate-400 text-[11px]">45 Questions to attempt</div>
                </div>
                <div className="font-mono font-bold text-emerald-400 text-sm">180 Marks</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Zoology (Section A + B)</div>
                  <div className="text-slate-400 text-[11px]">45 Questions to attempt</div>
                </div>
                <div className="font-mono font-bold text-orange-400 text-sm">180 Marks</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Physics + Chemistry</div>
                  <div className="text-slate-400 text-[11px]">45 Qs Physics + 45 Qs Chem</div>
                </div>
                <div className="font-mono font-bold text-blue-400 text-sm">360 Marks</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageContainer>
  );
};
