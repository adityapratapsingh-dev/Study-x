import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { StudyTask } from '../../types';
import { PageContainer, PageHeader } from './Page';
import {
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Target,
  Flame,
  Calendar,
  Zap,
  Trash2,
  Award,
} from 'lucide-react';

export const DailyStudyPlanner: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus, logFocusSession, studyStreakDays, totalStudyMinutes } = useWorkspace();
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<'All' | 'subj-phy' | 'subj-chem' | 'subj-math' | 'subj-botany' | 'subj-zoology'>('All');
  
  // Pomodoro timer state
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedTimerSubject, setSelectedTimerSubject] = useState('Physics');

  // New task form state
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubjectId, setTaskSubjectId] = useState('subj-phy');
  const [taskChapter, setTaskChapter] = useState('');
  const [targetQuestions, setTargetQuestions] = useState<number>(30);
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('high');

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      logFocusSession(timerMinutes, taskSubjectId, `Completed ${timerMinutes}m focus on ${selectedTimerSubject}`);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsLeft, timerMinutes, taskSubjectId, selectedTimerSubject, logFocusSession]);

  const handleStartPauseTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = (mins: number) => {
    setIsTimerRunning(false);
    setTimerMinutes(mins);
    setSecondsLeft(mins * 60);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle.trim(),
      subjectId: taskSubjectId,
      chapter: taskChapter.trim() || 'General',
      targetQuestions: targetQuestions || 20,
      questionsSolved: 0,
      dueDate: new Date().toISOString().split('T')[0],
      priority: taskPriority,
      status: 'todo',
    });

    setTaskTitle('');
    setTaskChapter('');
    setIsNewTaskOpen(false);
  };

  const handleIncrementSolved = (taskId: string, current: number, target: number) => {
    const next = Math.min(current + 5, target);
    updateTask(taskId, {
      questionsSolved: next,
      status: next >= target ? 'completed' : 'in_progress',
    });
  };

  const totalQuestionsTarget = tasks.reduce((sum, t) => sum + (t.targetQuestions || 0), 0);
  const totalQuestionsSolved = tasks.reduce((sum, t) => sum + (t.questionsSolved || 0), 0);
  const completionPercentage = totalQuestionsTarget > 0 ? Math.round((totalQuestionsSolved / totalQuestionsTarget) * 100) : 0;

  const minutesDisplay = Math.floor(secondsLeft / 60);
  const secondsDisplay = secondsLeft % 60;

  return (
    <PageContainer className="space-y-8">
      
      <PageHeader
        eyebrow="Daily consistency"
        eyebrowIcon={Target}
        accent="bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
        accentGradient="from-indigo-950/70 via-slate-900 to-slate-950"
        title="Daily Aspirant Study Routine & Problem Target Tracker"
        subtitle="Maintain daily question practice consistency (target 60-100 questions/day across PCM / PCB)."
        actions={
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold">
              <Flame className="w-4 h-4" />
              {studyStreakDays} Day Streak
            </div>
            <button
              onClick={() => setIsNewTaskOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Daily Goal
            </button>
          </>
        }
      />

      {/* Grid: 2 Columns - Left Focus Timer (5 Cols) & Right Target Tracker (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Pomodoro Focus Station (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 text-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Clock className="w-4 h-4" />
                Aspirant Focus Timer
              </div>
              <span className="text-xs text-slate-400">Total: {totalStudyMinutes} mins</span>
            </div>

            {/* Timer Display */}
            <div className="py-6">
              <div className="text-6xl sm:text-7xl font-bold font-mono text-white tracking-wider">
                {String(minutesDisplay).padStart(2, '0')}:{String(secondsDisplay).padStart(2, '0')}
              </div>
              <div className="text-xs text-indigo-300 mt-2 font-medium">
                {isTimerRunning ? `Active Session: ${selectedTimerSubject}` : 'Timer Paused'}
              </div>
            </div>

            {/* Preset Buttons */}
            <div className="flex justify-center gap-2">
              {[25, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleResetTimer(mins)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    timerMinutes === mins && !isTimerRunning
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleStartPauseTimer}
                className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition cursor-pointer shadow-lg ${
                  isTimerRunning
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                {isTimerRunning ? 'Pause Session' : 'Start Focus Session'}
              </button>

              <button
                onClick={() => handleResetTimer(timerMinutes)}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Daily Routine Reference Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Standard 99+ Percentile Daily Slot Breakdown
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-950 flex items-center justify-between">
                <span>Slot 1 (Morning 8 AM - 11 AM)</span>
                <span className="font-semibold text-blue-400">Physics Problem Solving</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 flex items-center justify-between">
                <span>Slot 2 (Afternoon 2 PM - 5 PM)</span>
                <span className="font-semibold text-emerald-400">Chemistry NCERT & Organic</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 flex items-center justify-between">
                <span>Slot 3 (Evening 6 PM - 9 PM)</span>
                <span className="font-semibold text-purple-400">Math / Biology Practice</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 flex items-center justify-between">
                <span>Slot 4 (Night 9:30 PM - 10:30 PM)</span>
                <span className="font-semibold text-amber-400">Galti Diary & Formula Revision</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Practice Goals & Questions Counter (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Summary Progress Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">Daily Problem Solving Target</span>
                <div className="text-xl font-bold text-white font-mono">
                  {totalQuestionsSolved} / {totalQuestionsTarget} Questions Solved
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-emerald-400 font-mono">{completionPercentage}%</span>
              </div>
            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min(completionPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {tasks.map((task) => {
              const isDone = task.status === 'completed';
              const target = task.targetQuestions || 20;
              const solved = task.questionsSolved || 0;

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition space-y-3 ${
                    isDone
                      ? 'bg-slate-950/40 border-slate-800/80 opacity-75'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-400 transition cursor-pointer"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <h4
                          className={`text-sm font-semibold ${
                            isDone ? 'line-through text-slate-500' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          {task.chapter && <span>Chapter: {task.chapter}</span>}
                          <span
                            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              task.priority === 'high'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-500 hover:text-rose-400 transition cursor-pointer p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Question Counter Controls */}
                  <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
                    <div className="text-xs font-mono text-slate-300">
                      Progress: <strong className="text-emerald-400">{solved}</strong> / {target} Qs
                    </div>
                    <button
                      onClick={() => handleIncrementSolved(task.id, solved, target)}
                      disabled={solved >= target}
                      className="px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 disabled:opacity-40 text-indigo-300 text-xs font-semibold rounded-lg border border-indigo-500/30 transition cursor-pointer flex items-center gap-1"
                    >
                      +5 Solved
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create Daily Goal Modal */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Daily Study Target</h3>
              <button onClick={() => setIsNewTaskOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Target Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve 30 Questions from Mechanics"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Subject</label>
                  <select
                    value={taskSubjectId}
                    onChange={(e) => setTaskSubjectId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="subj-phy">Physics</option>
                    <option value="subj-chem">Chemistry</option>
                    <option value="subj-math">Mathematics</option>
                    <option value="subj-botany">Botany (Biology)</option>
                    <option value="subj-zoology">Zoology (Biology)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Target Question Count</label>
                  <input
                    type="number"
                    min={5}
                    max={200}
                    value={targetQuestions}
                    onChange={(e) => setTargetQuestions(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Chapter Name</label>
                <input
                  type="text"
                  placeholder="e.g. Electrostatics / Optics"
                  value={taskChapter}
                  onChange={(e) => setTaskChapter(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewTaskOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                >
                  Add Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
