import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { FormulaCard } from '../../types';
import { PageContainer, PageHeader } from './Page';
import {
  Zap,
  FlaskConical,
  Sigma,
  Sprout,
  Search,
  BookOpen,
  Sparkles,
  Copy,
  Check,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';

export const FormulaSheetViewer: React.FC = () => {
  const { formulas } = useWorkspace();
  const [selectedSubject, setSelectedSubject] = useState<'All' | 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology'>('All');
  const [selectedExam, setSelectedExam] = useState<'All' | 'JEE' | 'NEET'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testRecallMode, setTestRecallMode] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const filteredFormulas = formulas.filter((f) => {
    const matchesSubject = selectedSubject === 'All' || f.subject === selectedSubject;
    const matchesExam = selectedExam === 'All' || f.examTag === selectedExam || f.examTag === 'BOTH';
    const matchesSearch =
      searchQuery === '' ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesExam && matchesSearch;
  });

  const handleCopy = (formula: string, id: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        eyebrow="Instant Revision"
        eyebrowIcon={Zap}
        accent="bg-blue-500/20 text-blue-300 border-blue-500/30"
        accentGradient="from-blue-950/70 via-slate-900 to-slate-950"
        title="Formula & High-Yield Concept Deck"
        subtitle="Master critical formulas for Physics, Chemistry, Math, and high-yield NCERT Biology rules."
        actions={
          <button
            onClick={() => {
              setTestRecallMode(!testRecallMode);
              setRevealedIds({});
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
              testRecallMode
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {testRecallMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {testRecallMode ? 'Active Recall Mode (ON)' : 'Enable Active Recall Mode'}
          </button>
        }
      />

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
        
        {/* Subject Filter */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'] as const).map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${
                selectedSubject === subj
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {subj === 'Physics' && <Zap className="w-3.5 h-3.5 text-blue-400" />}
              {subj === 'Chemistry' && <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />}
              {subj === 'Mathematics' && <Sigma className="w-3.5 h-3.5 text-purple-400" />}
              {subj === 'Biology' && <Sprout className="w-3.5 h-3.5 text-teal-400" />}
              {subj}
            </button>
          ))}
        </div>

        {/* Search & Exam Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            {(['All', 'JEE', 'NEET'] as const).map((ex) => (
              <button
                key={ex}
                onClick={() => setSelectedExam(ex)}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
                  selectedExam === ex ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {ex}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredFormulas.map((card) => {
          const isRevealed = revealedIds[card.id] || !testRecallMode;

          return (
            <div
              key={card.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition space-y-4 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                      {card.subject} • {card.chapter}
                    </span>
                    <h3 className="text-base font-bold text-white">{card.title}</h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                      {card.examTag}
                    </span>
                    <button
                      onClick={() => handleCopy(card.formula, card.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                      title="Copy formula text"
                    >
                      {copiedId === card.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Formula Display Area */}
                {isRevealed ? (
                  <div className="p-4 rounded-xl bg-slate-950 border border-blue-950/80 text-blue-100 font-mono text-sm overflow-x-auto leading-relaxed shadow-inner">
                    {card.formula}
                  </div>
                ) : (
                  <div
                    onClick={() => toggleReveal(card.id)}
                    className="p-4 rounded-xl bg-slate-950/60 border border-dashed border-amber-500/40 text-amber-300/80 text-center text-xs font-semibold cursor-pointer hover:bg-slate-950 transition flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-amber-400" />
                    Formula hidden for recall test. Click to reveal.
                  </div>
                )}

                {/* Variables Explanation */}
                <div className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 space-y-1">
                  <span className="font-semibold text-slate-400">Key Variables & Constants:</span>
                  <p className="text-[11px] font-mono text-slate-300 leading-normal">{card.variables}</p>
                </div>
              </div>

              {/* Pro Tip & Tags */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="text-xs text-slate-300 flex items-start gap-1.5">
                  <strong className="text-amber-400 font-semibold shrink-0">Ranker Tip:</strong>
                  <span className="text-[11px] text-slate-300 leading-relaxed">{card.proTip}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {card.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800/60 text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
};
