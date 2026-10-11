import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { MistakeLog, MistakeCategory } from '../../types';
import { PageContainer, PageHeader } from './Page';
import {
  BookOpen,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  RotateCcw,
  Trash2,
  Check,
  Search,
  Tag,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export const MistakeNotebook: React.FC = () => {
  const { mistakeLogs, addMistakeLog, toggleMistakeResolved, deleteMistakeLog } = useWorkspace();
  const [selectedExamFilter, setSelectedExamFilter] = useState<'All' | 'JEE' | 'NEET'>('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'All' | MistakeCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New mistake state
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newYourAnswer, setNewYourAnswer] = useState('');
  const [newCorrectAnswer, setNewCorrectAnswer] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newSubject, setNewSubject] = useState('Physics');
  const [newChapter, setNewChapter] = useState('');
  const [newExamType, setNewExamType] = useState<'JEE' | 'NEET'>('JEE');
  const [newCategory, setNewCategory] = useState<MistakeCategory>('calculation_silly');
  const [newNotes, setNewNotes] = useState('');

  const categoryLabels: Record<MistakeCategory, { label: string; color: string; desc: string }> = {
    calculation_silly: {
      label: 'Silly / Calculation Slip',
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      desc: 'Wrong arithmetic, sign error, or unit conversion',
    },
    conceptual_gap: {
      label: 'Conceptual Gap',
      color: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      desc: 'Fundamental theory or law was not understood',
    },
    misread_question: {
      label: 'Misread Question',
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      desc: 'Missed "INCORRECT", "NOT TRUE", or conditions',
    },
    formula_forgotten: {
      label: 'Formula / Fact Forgot',
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      desc: 'Could not recall exact formula or NCERT exception',
    },
    time_pressure: {
      label: 'Time Pressure Guess',
      color: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
      desc: 'Rushed decision in the final minutes',
    },
  };

  const filteredMistakes = mistakeLogs.filter((m) => {
    const matchesExam = selectedExamFilter === 'All' || m.examType === selectedExamFilter;
    const matchesCategory = selectedCategoryFilter === 'All' || m.category === selectedCategoryFilter;
    const matchesSearch =
      searchQuery === '' ||
      m.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesExam && matchesCategory && matchesSearch;
  });

  const handleCreateMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !newCorrectAnswer.trim()) return;

    addMistakeLog({
      questionText: newQuestionText.trim(),
      yourAnswer: newYourAnswer.trim() || 'Not specified',
      correctAnswer: newCorrectAnswer.trim(),
      explanation: newExplanation.trim() || 'Review the core concept in NCERT/Standard module.',
      subject: newSubject,
      chapter: newChapter.trim() || 'General',
      examType: newExamType,
      category: newCategory,
      personalNotes: newNotes.trim() || 'Must revise before next mock test.',
      isResolved: false,
    });

    // Reset form
    setNewQuestionText('');
    setNewYourAnswer('');
    setNewCorrectAnswer('');
    setNewExplanation('');
    setNewChapter('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const resolvedCount = mistakeLogs.filter((m) => m.isResolved).length;
  const pendingCount = mistakeLogs.length - resolvedCount;

  return (
    <PageContainer className="space-y-6">
      
      <PageHeader
        eyebrow="High Impact"
        eyebrowIcon={BookOpen}
        accent="bg-amber-500/20 text-amber-300 border-amber-500/30"
        accentGradient="from-amber-950/70 via-slate-900 to-slate-950"
        title="Mistake Notebook (Galti Diary)"
        subtitle="The #1 secret of All India Rankers: Review and eliminate every single mistake made in mock exams."
        actions={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-amber-600/20 flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Mistake
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Total Logged Mistakes</div>
            <div className="text-2xl font-bold text-white font-mono mt-1">{mistakeLogs.length}</div>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-slate-300">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Needs Active Revision</div>
            <div className="text-2xl font-bold text-rose-400 font-mono mt-1">{pendingCount}</div>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Concept Mastered / Resolved</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{resolvedCount}</div>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['All', 'JEE', 'NEET'] as const).map((ex) => (
            <button
              key={ex}
              onClick={() => setSelectedExamFilter(ex)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                selectedExamFilter === ex
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {ex}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-700 mx-1" />

          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value as any)}
            className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
          >
            <option value="All">All Error Types</option>
            <option value="calculation_silly">Silly / Calculation Slip</option>
            <option value="conceptual_gap">Conceptual Gap</option>
            <option value="misread_question">Misread Question</option>
            <option value="formula_forgotten">Formula Forgotten</option>
            <option value="time_pressure">Time Pressure</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search questions or chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Mistake Entries List */}
      <div className="space-y-4">
        {filteredMistakes.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">No mistakes logged matching filters</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Whenever you take a mock test or solve questions, log tricky questions here to prevent repeated negative marks.
            </p>
          </div>
        ) : (
          filteredMistakes.map((mistake) => {
            const catInfo = categoryLabels[mistake.category] || categoryLabels.calculation_silly;
            return (
              <div
                key={mistake.id}
                className={`p-5 rounded-2xl border transition space-y-4 ${
                  mistake.isResolved
                    ? 'bg-slate-950/40 border-slate-800/80 opacity-75'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-sm'
                }`}
              >
                {/* Card Top Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-300">
                      {mistake.examType} • {mistake.subject}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Chapter: {mistake.chapter}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${catInfo.color}`}>
                      {catInfo.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleMistakeResolved(mistake.id)}
                      className={`text-xs px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                        mistake.isResolved
                          ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      {mistake.isResolved ? 'Resolved' : 'Mark Resolved'}
                    </button>
                    <button
                      onClick={() => deleteMistakeLog(mistake.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                      title="Delete mistake"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question text */}
                <div className="text-sm font-medium text-slate-200 leading-relaxed font-sans">
                  {mistake.questionText}
                </div>

                {/* Answers side-by-side comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/30 space-y-1">
                    <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                      Your Attempt / Blunder:
                    </span>
                    <p className="text-xs text-rose-200 font-mono">{mistake.yourAnswer}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      Correct Answer:
                    </span>
                    <p className="text-xs text-emerald-200 font-mono">{mistake.correctAnswer}</p>
                  </div>
                </div>

                {/* Explanation & Learning Takeaway */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Key Concept & Solution Notes:
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-mono">
                    {mistake.explanation}
                  </p>
                  {mistake.personalNotes && (
                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-900 flex items-center gap-1.5">
                      <strong className="text-slate-300">My Takeaway:</strong> {mistake.personalNotes}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add New Mistake Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                Log a Question to Mistake Notebook
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMistake} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Exam Type</label>
                  <select
                    value={newExamType}
                    onChange={(e) => setNewExamType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="JEE">JEE (Main/Adv)</option>
                    <option value="NEET">NEET (UG)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Botany (Biology)">Botany (Biology)</option>
                    <option value="Zoology (Biology)">Zoology (Biology)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Chapter Name</label>
                <input
                  type="text"
                  placeholder="e.g. Current Electricity / Molecular Basis of Inheritance"
                  value={newChapter}
                  onChange={(e) => setNewChapter(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Error Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="calculation_silly">Silly / Calculation Slip</option>
                  <option value="conceptual_gap">Conceptual Gap</option>
                  <option value="misread_question">Misread Question (Missed NOT/INCORRECT)</option>
                  <option value="formula_forgotten">Formula / NCERT Fact Forgotten</option>
                  <option value="time_pressure">Time Pressure Guess</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Question Text *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Paste or write the question that went wrong..."
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">What you answered</label>
                  <input
                    type="text"
                    placeholder="e.g. Option B / 400 J"
                    value={newYourAnswer}
                    onChange={(e) => setNewYourAnswer(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Correct Answer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Option A / 0 J"
                    value={newCorrectAnswer}
                    onChange={(e) => setNewCorrectAnswer(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Correct Solution / NCERT Line</label>
                <textarea
                  rows={2}
                  placeholder="Explanation, formula step, or NCERT page reference..."
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Personal Learning Takeaway</label>
                <input
                  type="text"
                  placeholder="e.g. Always convert temperature into Kelvin first!"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl shadow-md"
                >
                  Save to Galti Diary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
