import React, { useMemo, useState, useEffect } from 'react';
import {
  JEE_SYLLABUS,
  JEE_PROFILE_META,
  JEE_ROADMAPS,
  JEE_WEEKLY_PLANS,
  JEE_STRATEGY_PILLARS,
  JEE_EXAM_DAY_RULES,
  JEE_RESOURCES,
  JEE_MILESTONES,
} from './jeeBlueprintData';
import { useWorkspace } from '../../context/WorkspaceContext';
import { AspirantProfile, SyllabusChapter, DailyBlock } from '../../types';
import { PageContainer, PageHeader } from '../shared/Page';
import { JEE_FULL_MOCK_TEST } from '../jee/jeeData';
import {
  Atom,
  Rocket,
  Flame,
  Play,
  Target,
  BookOpen,
  CalendarDays,
  Map as MapIcon,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Sparkles,
  GraduationCap,
  Layers,
  Compass,
  ListChecks,
  Trophy,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const PROFILE_ICONS: Record<AspirantProfile, React.ElementType> = {
  class11: Atom,
  class12: Rocket,
  dropper: Flame,
};

const BLOCK_COLORS: Record<DailyBlock['type'], string> = {
  theory: 'bg-blue-500/15 border-blue-500/40 text-blue-200',
  practice: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200',
  revision: 'bg-amber-500/15 border-amber-500/40 text-amber-200',
  test: 'bg-rose-500/15 border-rose-500/40 text-rose-200',
  break: 'bg-slate-500/15 border-slate-500/40 text-slate-300',
  rest: 'bg-purple-500/15 border-purple-500/40 text-purple-200',
};

const PRIORITY_LABEL: Record<number, string> = {
  1: 'Must-Do',
  2: 'Important',
  3: 'Good to Do',
  4: 'Optional',
  5: 'Low',
};

const WEIGHTAGE_STYLES: Record<string, string> = {
  'Very High': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  High: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Medium: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Low: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

type BlueprintTab = 'roadmap' | 'syllabus' | 'weekly' | 'strategy';

const STORAGE_KEY = 'rf_blueprint_progress_v1';

export const JeeBlueprint: React.FC = () => {
  const { addTask, startTest, setActiveTab } = useWorkspace();
  const [profile, setProfile] = useState<AspirantProfile>('class11');
  const [activeTab, setActiveTabLocal] = useState<BlueprintTab>('roadmap');
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  // Syllabus filters
  const [subjectFilter, setSubjectFilter] = useState<'All' | 'Physics' | 'Chemistry' | 'Mathematics'>('All');
  const [gradeFilter, setGradeFilter] = useState<'All' | '11' | '12'>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'MustDo' | 'High'>('All');
  const [search, setSearch] = useState('');

  // Milestone progress persisted to localStorage
  const [completedMilestones, setCompletedMilestones] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedMilestones));
  }, [completedMilestones]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const meta = useMemo(() => JEE_PROFILE_META.find((m) => m.id === profile)!, [profile]);
  const phases = JEE_ROADMAPS[profile];
  const weekly = JEE_WEEKLY_PLANS[profile];

  const filteredSyllabus = useMemo(() => {
    const q = search.trim().toLowerCase();
    return JEE_SYLLABUS.filter((ch) => {
      if (subjectFilter !== 'All' && ch.subject !== subjectFilter) return false;
      if (gradeFilter !== 'All' && ch.classGrade !== gradeFilter) return false;
      if (priorityFilter === 'MustDo' && ch.priority !== 1) return false;
      if (priorityFilter === 'High' && ch.priority > 2) return false;
      if (q) {
        const haystack = [ch.name, ch.unit, ch.subject, ...ch.keyConcepts].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [subjectFilter, gradeFilter, priorityFilter, search]);

  const totalHours = useMemo(
    () => JEE_SYLLABUS.reduce((sum, ch) => sum + ch.estimatedHours, 0),
    []
  );
  const filteredHours = useMemo(
    () => filteredSyllabus.reduce((sum, ch) => sum + ch.estimatedHours, 0),
    [filteredSyllabus]
  );

  const milestoneProgress = useMemo(() => {
    const total = JEE_MILESTONES.reduce((s, m) => s + m.weight, 0);
    const done = JEE_MILESTONES.filter((m) => completedMilestones.includes(m.label)).reduce(
      (s, m) => s + m.weight,
      0
    );
    return Math.round((done / total) * 100);
  }, [completedMilestones]);

  const toggleMilestone = (label: string) => {
    setCompletedMilestones((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const handleAddWeeklyToPlanner = () => {
    let added = 0;
    weekly.days.forEach((d) => {
      d.blocks
        .filter((b) => b.type !== 'rest' && b.type !== 'break')
        .slice(0, 2)
        .forEach((b) => {
          addTask({
            title: `[${d.day}] ${b.activity}`,
            subjectId: 'subj-phy',
            dueDate: new Date().toISOString().slice(0, 10),
            priority: b.type === 'test' ? 'high' : 'medium',
            status: 'todo',
          });
          added += 1;
        });
    });
    setToast(`Added ${added} focus blocks to your Daily Goals planner!`);
  };

  const handleLaunchMock = () => {
    startTest(JEE_FULL_MOCK_TEST.id);
  };

  const stats = [
    { label: 'Syllabus Chapters', value: JEE_SYLLABUS.length, icon: Layers, color: 'text-blue-400' },
    { label: 'Total Study Hours', value: `${totalHours}h`, icon: Clock, color: 'text-emerald-400' },
    { label: 'Roadmap Phases', value: phases.length, icon: MapIcon, color: 'text-purple-400' },
    { label: 'Plan Progress', value: `${milestoneProgress}%`, icon: Trophy, color: 'text-amber-400' },
  ];

  return (
    <PageContainer className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-400/30">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      <PageHeader
        eyebrow="The JEE Command Center — Class 11, Class 12 & Droppers"
        eyebrowIcon={Compass}
        accent="bg-blue-500/20 text-blue-300 border-blue-500/30"
        accentGradient="from-blue-950 via-slate-900 to-cyan-950"
        title="Your Complete JEE Blueprint"
        subtitle="Pick your profile and get a battle-tested roadmap, the full PCM syllabus mapped chapter-by-chapter, a realistic weekly timetable, and a progress tracker — all in one place."
        watermark={GraduationCap}
      />

      {/* Profile Selector */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Choose Your Profile</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {JEE_PROFILE_META.map((p) => {
            const Icon = PROFILE_ICONS[p.id];
            const isActive = p.id === profile;
            return (
              <button
                key={p.id}
                onClick={() => setProfile(p.id)}
                className={`text-left rounded-2xl border p-5 transition cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'border-blue-500/60 bg-slate-900 shadow-lg shadow-blue-600/10'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${p.gradient} flex items-center justify-center text-white shadow-md`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{p.label}</div>
                    <div className="text-[11px] text-slate-400">{p.subtitle}</div>
                  </div>
                  {isActive && <CheckCircle2 className="w-4 h-4 text-blue-400 ml-auto" />}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{p.headline}</p>
                <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {p.monthsAvailable}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {p.dailyHours}h/day
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Detail + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">{meta.label}: {meta.subtitle}</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{meta.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Your Superpowers
              </div>
              {meta.superpowers.map((s, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Traps to Avoid
              </div>
              {meta.dangers.map((s, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recommended Focus Split</div>
            <div className="flex h-3 rounded-full overflow-hidden border border-slate-800">
              <div style={{ width: `${meta.focusSplit.theory}%` }} className="bg-blue-500" title={`Theory ${meta.focusSplit.theory}%`} />
              <div style={{ width: `${meta.focusSplit.practice}%` }} className="bg-emerald-500" title={`Practice ${meta.focusSplit.practice}%`} />
              <div style={{ width: `${meta.focusSplit.revision}%` }} className="bg-amber-500" title={`Revision ${meta.focusSplit.revision}%`} />
              <div style={{ width: `${meta.focusSplit.tests}%` }} className="bg-rose-500" title={`Tests ${meta.focusSplit.tests}%`} />
            </div>
            <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Theory {meta.focusSplit.theory}%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Practice {meta.focusSplit.practice}%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Revision {meta.focusSplit.revision}%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Tests {meta.focusSplit.tests}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
                  <Icon className={`w-4 h-4 ${s.color}`} />
                  <div className="text-lg font-bold text-white">{s.value}</div>
                  <div className="text-[11px] text-slate-400">{s.label}</div>
                </div>
              );
            })}
          </div>
          <button
            onClick={handleLaunchMock}
            className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Launch Full JEE Mock (300 Marks)
          </button>
          <button
            onClick={handleAddWeeklyToPlanner}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ListChecks className="w-4 h-4 text-emerald-400" />
            Add This Week's Plan to Goals
          </button>
        </div>
      </div>

      {/* Blueprint Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {([
          { id: 'roadmap', label: 'Roadmap Timeline', icon: MapIcon },
          { id: 'syllabus', label: 'Syllabus Explorer', icon: BookOpen },
          { id: 'weekly', label: 'Weekly Timetable', icon: CalendarDays },
          { id: 'strategy', label: 'Strategy & Milestones', icon: TrendingUp },
        ] as const).map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTabLocal(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ===================== ROADMAP ===================== */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            A {phases.length}-phase plan from where you are today to exam day. Tap any phase for the full breakdown.
          </p>
          <div className="relative space-y-4">
            <div className="absolute left-5 top-2 bottom-2 w-px bg-slate-800 hidden sm:block" />
            {phases.map((phase, idx) => {
              const isOpen = expandedPhase === phase.id;
              return (
                <div key={phase.id} className="relative sm:pl-14">
                  <div className="hidden sm:flex absolute left-0 top-4 w-10 h-10 rounded-full bg-slate-900 border-2 border-blue-500/50 items-center justify-center text-sm font-bold text-blue-300">
                    {phase.phaseNumber}
                  </div>
                  <button
                    onClick={() => setExpandedPhase(isOpen ? null : phase.id)}
                    className="w-full text-left bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-white">{phase.title}</span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {phase.window}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{phase.goal}</p>
                      </div>
                      {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {phase.dailyHours}h/day</span>
                      <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {phase.weeklyQuestionsTarget} Qs/week</span>
                    </div>

                    {isOpen && (
                      <div className="mt-4 pt-4 border-t border-slate-800 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider mb-2">Focus Areas</div>
                            <div className="flex flex-wrap gap-1.5">
                              {phase.focusAreas.map((f, i) => (
                                <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">{f}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-2">Deliverables</div>
                            <div className="space-y-1">
                              {phase.deliverables.map((d, i) => (
                                <div key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                                  <span>{d}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 flex items-start gap-2">
                          <Trophy className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Milestone</div>
                            <div className="text-xs text-slate-300">{phase.milestone}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== SYLLABUS ===================== */}
      {activeTab === 'syllabus' && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search chapters, concepts, units..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              {(['All', 'Physics', 'Chemistry', 'Mathematics'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSubjectFilter(s)}
                  className={`px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition ${
                    subjectFilter === s ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
              <span className="w-px h-4 bg-slate-800 mx-1" />
              {(['All', '11', '12'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGradeFilter(g)}
                  className={`px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition ${
                    gradeFilter === g ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {g === 'All' ? 'All Class' : `Class ${g}`}
                </button>
              ))}
              <span className="w-px h-4 bg-slate-800 mx-1" />
              {([['All', 'All Priority'], ['MustDo', 'Must-Do'], ['High', 'Top Priority']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setPriorityFilter(val)}
                  className={`px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition ${
                    priorityFilter === val ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong className="text-slate-200">{filteredSyllabus.length}</strong> of {JEE_SYLLABUS.length} chapters
            </span>
            <span>≈ <strong className="text-slate-200">{filteredHours}h</strong> of study in view</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredSyllabus.map((ch) => (
              <ChapterCard
                key={ch.id}
                chapter={ch}
                isOpen={expandedChapter === ch.id}
                onToggle={() => setExpandedChapter(expandedChapter === ch.id ? null : ch.id)}
              />
            ))}
          </div>
          {filteredSyllabus.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">
              No chapters match your filters. Try clearing the search or filters.
            </div>
          )}
        </div>
      )}

      {/* ===================== WEEKLY ===================== */}
      {activeTab === 'weekly' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">{weekly.title}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{weekly.summary}</p>
            <button
              onClick={handleAddWeeklyToPlanner}
              className="mt-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
              Push key blocks to Daily Goals
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {weekly.days.map((d, i) => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(i)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedDay === i ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {d.day}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {weekly.days[selectedDay].blocks.map((b, i) => (
              <div key={i} className={`flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl border ${BLOCK_COLORS[b.type]}`}>
                <span className="text-[11px] font-mono font-semibold sm:w-44 shrink-0 opacity-90">{b.time}</span>
                <span className="text-xs sm:text-sm">{b.activity}</span>
                <span className="sm:ml-auto text-[10px] uppercase font-bold tracking-wider opacity-80">{b.type}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 pt-1">
            {Object.entries(BLOCK_COLORS).map(([type]) => (
              <span key={type} className="flex items-center gap-1.5 capitalize">
                <span className={`w-3 h-3 rounded border ${BLOCK_COLORS[type as DailyBlock['type']]}`} />
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ===================== STRATEGY ===================== */}
      {activeTab === 'strategy' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">The 5 Strategy Pillars</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {JEE_STRATEGY_PILLARS.map((p, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-white">{p.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white">Exam Day Rules</h3>
              </div>
              {JEE_EXAM_DAY_RULES.map((r, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">{i + 1}.</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Recommended Resources</h3>
              </div>
              {JEE_RESOURCES.map((r) => (
                <div key={r.subject} className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{r.subject}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {r.items.map((it, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">{it}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestone tracker */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Milestone Tracker</h3>
              </div>
              <span className="text-sm font-bold text-amber-300">{milestoneProgress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {JEE_MILESTONES.map((m) => {
                const done = completedMilestones.includes(m.label);
                return (
                  <button
                    key={m.label}
                    onClick={() => toggleMilestone(m.label)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition cursor-pointer ${
                      done ? 'bg-emerald-950/30 border-emerald-600/40' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className={`text-xs ${done ? 'text-emerald-200' : 'text-slate-300'}`}>{m.label}</span>
                    <span className="ml-auto text-[10px] font-mono text-slate-500">{m.weight}%</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

const ChapterCard: React.FC<{ chapter: SyllabusChapter; isOpen: boolean; onToggle: () => void }> = ({
  chapter,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition overflow-hidden">
      <button onClick={onToggle} className="w-full text-left p-4 cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${WEIGHTAGE_STYLES[chapter.weightage]}`}>
                {chapter.weightage}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Class {chapter.classGrade}
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {PRIORITY_LABEL[chapter.priority]}
              </span>
            </div>
            <div className="text-sm font-semibold text-white truncate">{chapter.name}</div>
            <div className="text-[11px] text-slate-400">{chapter.subject} • {chapter.unit}</div>
          </div>
          {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />}
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><Target className="w-3 h-3" /> ~{chapter.avgQuestions} Qs/paper</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {chapter.estimatedHours}h</span>
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${chapter.difficulty === 'Hard' ? 'bg-rose-500' : chapter.difficulty === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            {chapter.difficulty}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-800 pt-4">
          <div>
            <div className="text-[11px] font-bold text-blue-300 uppercase tracking-wider mb-1.5">Key Concepts</div>
            <div className="flex flex-wrap gap-1.5">
              {chapter.keyConcepts.map((c, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">{c}</span>
              ))}
            </div>
          </div>

          {chapter.prerequisites.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Prerequisites</div>
              <div className="flex flex-wrap gap-1.5">
                {chapter.prerequisites.map((c, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">{c}</span>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/40 space-y-1">
            <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">JEE Advanced Focus</div>
            <p className="text-xs text-slate-300 leading-relaxed">{chapter.jeeAdvancedFocus}</p>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1.5">
            <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3" /> Common Traps
            </div>
            {chapter.commonTraps.map((t, i) => (
              <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                <span className="text-rose-400 shrink-0">•</span>
                <span>{t}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1.5">Recommended Sources</div>
            <div className="flex flex-wrap gap-1.5">
              {chapter.recommendedSources.map((c, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/30 text-emerald-200 border border-emerald-900/40">{c}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
