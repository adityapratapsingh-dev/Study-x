import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { ambientAudio } from '../../lib/ambientAudio';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  AlertCircle,
  Sparkles,
  Trash2,
  Flame,
  CloudRain,
  Radio,
  Wind,
} from 'lucide-react';

export const FocusHub: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    subjects,
    logFocusSession,
    studyStreakDays,
    totalStudyMinutes,
  } = useWorkspace();

  // Pomodoro Timer state
  const [timerMode, setTimerMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const durationMap = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };
  const [timeLeft, setTimeLeft] = useState(durationMap.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'white' | 'lofi'>('none');
  const [selectedTimerSubject, setSelectedTimerSubject] = useState<string>(subjects[0]?.id || 'cs-algo');

  // Task creation form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState(subjects[0]?.id || 'cs-algo');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Cheat Sheet Quick Scratchpad
  const [cheatNotes, setCheatNotes] = useState(() => {
    return (
      localStorage.getItem('sw_cheat_notes') ||
      `# High-Yield Formula Cheat Sheet\n\n- Big-O: O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n)\n- Dijkstra: O((V+E) log V) with Min-Heap\n- SN2: Rate = k[Sub][Nuc], Backside attack (Inversion)\n- SN1: Rate = k[Sub], Carbocation (Racemization)\n- Eigenvalues: det(A - λI) = 0`
    );
  });

  useEffect(() => {
    localStorage.setItem('sw_cheat_notes', cheatNotes);
  }, [cheatNotes]);

  // Pomodoro Interval
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          if (timerMode === 'focus') {
            logFocusSession(25, selectedTimerSubject);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timerMode, selectedTimerSubject]);

  const handleModeChange = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setTimerMode(mode);
    setTimeLeft(durationMap[mode]);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durationMap[timerMode]);
  };

  const handleToggleAmbient = (sound: 'none' | 'rain' | 'white' | 'lofi') => {
    if (sound === 'none' || sound === ambientSound) {
      ambientAudio.stop();
      setAmbientSound('none');
    } else {
      ambientAudio.play(sound, 0.25);
      setAmbientSound(sound);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalTimeForMode = durationMap[timerMode];
  const progressPercent = Math.round(((totalTimeForMode - timeLeft) / totalTimeForMode) * 100);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle.trim(),
      subjectId: newTaskSubject,
      dueDate: newTaskDueDate || new Date().toISOString().slice(0, 10),
      priority: newTaskPriority,
      status: 'todo',
    });

    setNewTaskTitle('');
  };

  const getDaysUntilDue = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: `${Math.abs(diff)}d overdue`, color: 'text-rose-400' };
    if (diff === 0) return { text: 'Due today', color: 'text-amber-400 font-bold' };
    if (diff === 1) return { text: 'Due tomorrow', color: 'text-amber-300' };
    return { text: `In ${diff} days`, color: 'text-slate-400' };
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-slate-950 text-slate-100 overflow-y-auto max-w-7xl mx-auto w-full space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Focus & Productivity Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Deep focus intervals with Pomodoro timer, ambient noise synthesis, and assignment deadlines.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>{studyStreakDays} Day Streak</span>
          </div>
          <span className="w-px h-4 bg-slate-800" />
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Clock className="w-4 h-4" />
            <span>{totalStudyMinutes} Mins Focused</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Pomodoro Timer & Ambient Sound */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Pomodoro Card */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col items-center text-center space-y-6">
            
            {/* Mode Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => handleModeChange('focus')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  timerMode === 'focus' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Focus (25m)
              </button>
              <button
                onClick={() => handleModeChange('shortBreak')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  timerMode === 'shortBreak' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Short Break (5m)
              </button>
              <button
                onClick={() => handleModeChange('longBreak')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  timerMode === 'longBreak' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Long Break (15m)
              </button>
            </div>

            {/* Circular Timer Display */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* Outer track */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r="98"
                  className="text-slate-800"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="112"
                  cy="112"
                  r="98"
                  className={timerMode === 'focus' ? 'text-emerald-500' : 'text-indigo-500'}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 98}
                  strokeDashoffset={2 * Math.PI * 98 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tighter">
                  {formatTimer(timeLeft)}
                </span>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  {timerMode === 'focus' ? 'Study Interval' : 'Break Time'}
                </span>
              </div>
            </div>

            {/* Subject Selector for Focus Session */}
            <div className="w-full text-xs">
              <label className="block text-slate-400 mb-1 font-semibold">Active Study Subject:</label>
              <select
                value={selectedTimerSubject}
                onChange={(e) => setSelectedTimerSubject(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs font-semibold focus:outline-none"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code}: {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-8 py-3 rounded-2xl font-bold text-sm shadow-lg transition transform active:scale-95 flex items-center gap-2 cursor-pointer ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" /> Start Focus
                  </>
                )}
              </button>

              <button
                onClick={handleResetTimer}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 transition"
                title="Reset Interval"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Ambient Sound Generator Card */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                <Volume2 className="w-4 h-4 text-indigo-400" />
                <span>Ambient Study Soundscape</span>
              </div>
              {ambientSound !== 'none' && (
                <span className="text-[11px] text-emerald-400 font-semibold animate-pulse">
                  ● Playing
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => handleToggleAmbient('rain')}
                className={`p-2.5 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  ambientSound === 'rain'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>Rainfall</span>
              </button>

              <button
                onClick={() => handleToggleAmbient('white')}
                className={`p-2.5 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  ambientSound === 'white'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>White Noise</span>
              </button>

              <button
                onClick={() => handleToggleAmbient('lofi')}
                className={`p-2.5 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  ambientSound === 'lofi'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Theta Drone</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Assignment Deadlines & Scratchpad */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Assignment & Exam Deadlines */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Assignments & Exam Deadlines ({tasks.filter((t) => t.status !== 'completed').length} Pending)
                </h2>
                <p className="text-xs text-slate-400">Keep track of problem sets, lab reports, and exam dates.</p>
              </div>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleCreateTask} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <input
                type="text"
                placeholder="New assignment or exam task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="sm:col-span-6 px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />

              <select
                value={newTaskSubject}
                onChange={(e) => setNewTaskSubject(e.target.value)}
                className="sm:col-span-3 px-2 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="sm:col-span-2 px-2 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
              />

              <button
                type="submit"
                className="sm:col-span-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer"
                title="Add Task"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Tasks List */}
            <div className="space-y-2 max-h-72 overflow-y-auto divide-y divide-slate-800/40">
              {tasks.map((task) => {
                const sub = subjects.find((s) => s.id === task.subjectId);
                const dueInfo = getDaysUntilDue(task.dueDate);
                const isDone = task.status === 'completed';

                return (
                  <div
                    key={task.id}
                    className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="text-slate-500 hover:text-emerald-400 transition"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>

                      <span
                        className={`text-xs font-medium line-clamp-1 ${
                          isDone ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${sub?.color || '#3B82F6'}20`,
                          color: sub?.color || '#3B82F6',
                        }}
                      >
                        {sub?.code || 'General'}
                      </span>

                      <span className={`text-[11px] ${dueInfo.color}`}>
                        {dueInfo.text}
                      </span>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Formula & Cheat Sheet Scratchpad */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Pinned Formula & Cheat Sheet Scratchpad
              </h3>
              <span className="text-xs text-slate-500">Auto-saved</span>
            </div>

            <textarea
              value={cheatNotes}
              onChange={(e) => setCheatNotes(e.target.value)}
              placeholder="Paste important formulas, exam mnemonics, or conversion factors here for rapid reference..."
              className="w-full h-36 p-3 text-xs font-mono bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 resize-none focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
