import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Subject,
  Note,
  Test,
  TestAttempt,
  FlashcardDeck,
  StudyTask,
  FocusSession,
  ActiveTab,
  Question,
  DifficultyLevel,
  MistakeLog,
  FormulaCard,
  ChapterWeightage,
  ExamMode,
} from '../types';
import {
  INITIAL_SUBJECTS,
  INITIAL_NOTES,
  INITIAL_TESTS,
  INITIAL_DECKS,
  INITIAL_TASKS,
  INITIAL_ATTEMPTS,
} from '../data/initialData';
import {
  INITIAL_MISTAKE_LOGS,
  INITIAL_FORMULA_CARDS,
  CHAPTER_WEIGHTAGES,
} from '../data/competitiveData';

interface WorkspaceContextType {
  // Exam Mode
  examMode: ExamMode;
  setExamMode: (mode: ExamMode) => void;

  // Navigation & filter state
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Subjects
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id'>) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Notes
  notes: Note[];
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;
  addNote: (note: Partial<Note>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  toggleFavoriteNote: (id: string) => void;

  // Tests & Quizzes
  tests: Test[];
  selectedTestId: string | null;
  setSelectedTestId: (id: string | null) => void;
  addTest: (test: Omit<Test, 'id' | 'createdAt'>) => Test;
  updateTest: (id: string, updates: Partial<Test>) => void;
  deleteTest: (id: string) => void;

  // Active Exam Simulator
  activeTest: Test | null;
  startTest: (testId: string) => void;
  finishTest: (attempt: Omit<TestAttempt, 'id' | 'completedAt'>) => TestAttempt;
  cancelActiveTest: () => void;
  testAttempts: TestAttempt[];
  latestAttempt: TestAttempt | null;
  setLatestAttempt: (attempt: TestAttempt | null) => void;

  // Flashcards
  decks: FlashcardDeck[];
  selectedDeckId: string | null;
  setSelectedDeckId: (id: string | null) => void;
  addDeck: (deck: Omit<FlashcardDeck, 'id'>) => FlashcardDeck;
  updateDeck: (id: string, updates: Partial<FlashcardDeck>) => void;
  deleteDeck: (id: string) => void;
  updateCardState: (deckId: string, cardId: string, state: 'learning' | 'review' | 'mastered') => void;

  // Tasks & Daily Planner
  tasks: StudyTask[];
  addTask: (task: Omit<StudyTask, 'id'>) => StudyTask;
  updateTask: (id: string, updates: Partial<StudyTask>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;

  // Mistake Notebook (Galti Diary)
  mistakeLogs: MistakeLog[];
  addMistakeLog: (log: Omit<MistakeLog, 'id' | 'dateAdded'>) => MistakeLog;
  toggleMistakeResolved: (id: string) => void;
  deleteMistakeLog: (id: string) => void;

  // High-Yield Reference Data
  formulas: FormulaCard[];
  chapterWeightages: ChapterWeightage[];

  // Focus & Study Stats
  focusSessions: FocusSession[];
  logFocusSession: (durationMinutes: number, subjectId?: string, notes?: string) => void;
  studyStreakDays: number;
  totalStudyMinutes: number;

  // Global Actions
  resetToSampleData: () => void;
  exportWorkspaceData: () => void;
  importWorkspaceData: (jsonData: string) => boolean;

  // Quick Action Modals
  isAiQuizModalOpen: boolean;
  setIsAiQuizModalOpen: (open: boolean) => void;
  aiQuizPresetNote: Note | null;
  setAiQuizPresetNote: (note: Note | null) => void;
  isAiFlashcardModalOpen: boolean;
  setIsAiFlashcardModalOpen: (open: boolean) => void;
  aiFlashcardPresetNote: Note | null;
  setAiFlashcardPresetNote: (note: Note | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EXAM_MODE: 'rf_exam_mode_v2',
  SUBJECTS: 'rf_subjects_v2',
  NOTES: 'rf_notes_v2',
  TESTS: 'rf_tests_v2',
  DECKS: 'rf_decks_v2',
  TASKS: 'rf_tasks_v2',
  ATTEMPTS: 'rf_attempts_v2',
  FOCUS: 'rf_focus_v2',
  STREAK: 'rf_streak_v2',
  MISTAKES: 'rf_mistakes_v2',
};

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [examMode, setExamModeState] = useState<ExamMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXAM_MODE);
      return (saved as ExamMode) || 'jee';
    } catch {
      return 'jee';
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('jee');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const setExamMode = (mode: ExamMode) => {
    setExamModeState(mode);
    localStorage.setItem(STORAGE_KEYS.EXAM_MODE, mode);
    if (activeTab === 'jee' && mode === 'neet') setActiveTab('neet');
    if (activeTab === 'neet' && mode === 'jee') setActiveTab('jee');
  };

  // Modals state
  const [isAiQuizModalOpen, setIsAiQuizModalOpen] = useState(false);
  const [aiQuizPresetNote, setAiQuizPresetNote] = useState<Note | null>(null);
  const [isAiFlashcardModalOpen, setIsAiFlashcardModalOpen] = useState(false);
  const [aiFlashcardPresetNote, setAiFlashcardPresetNote] = useState<Note | null>(null);

  // Core Data
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(() => {
    return notes.length > 0 ? notes[0].id : null;
  });

  const [tests, setTests] = useState<Test[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TESTS);
      return saved ? JSON.parse(saved) : INITIAL_TESTS;
    } catch {
      return INITIAL_TESTS;
    }
  });

  const [selectedTestId, setSelectedTestId] = useState<string | null>(() => {
    return tests.length > 0 ? tests[0].id : null;
  });

  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [latestAttempt, setLatestAttempt] = useState<TestAttempt | null>(null);

  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return saved ? JSON.parse(saved) : INITIAL_ATTEMPTS;
    } catch {
      return INITIAL_ATTEMPTS;
    }
  });

  const [decks, setDecks] = useState<FlashcardDeck[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DECKS);
      return saved ? JSON.parse(saved) : INITIAL_DECKS;
    } catch {
      return INITIAL_DECKS;
    }
  });

  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(() => {
    return decks.length > 0 ? decks[0].id : null;
  });

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [mistakeLogs, setMistakeLogs] = useState<MistakeLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MISTAKES);
      return saved ? JSON.parse(saved) : INITIAL_MISTAKE_LOGS;
    } catch {
      return INITIAL_MISTAKE_LOGS;
    }
  });

  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOCUS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [studyStreakDays, setStudyStreakDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STREAK);
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(testAttempts));
  }, [testAttempts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
  }, [decks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakeLogs));
  }, [mistakeLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOCUS, JSON.stringify(focusSessions));
  }, [focusSessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STREAK, studyStreakDays.toString());
  }, [studyStreakDays]);

  // Total Study Minutes
  const totalStudyMinutes = focusSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) + 180;

  // Subject Actions
  const addSubject = (data: Omit<Subject, 'id'>): Subject => {
    const newSubject: Subject = {
      ...data,
      id: 'sub-' + Date.now(),
    };
    setSubjects((prev) => [...prev, newSubject]);
    return newSubject;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  // Notes Actions
  const addNote = (data: Partial<Note>): Note => {
    const newNote: Note = {
      id: 'note-' + Date.now(),
      title: data.title || 'Untitled Note',
      content: data.content || '# High-Yield Key Points\n\n- Write formulas and theory here...',
      subjectId: data.subjectId || subjects[0]?.id || 'subj-phy',
      tags: data.tags || ['Study', 'Formula'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      aiSummary: data.aiSummary,
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => {
      const remaining = prev.filter((n) => n.id !== id);
      if (selectedNoteId === id) {
        setSelectedNoteId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
  };

  const toggleFavoriteNote = (id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n)));
  };

  // Tests Actions
  const addTest = (data: Omit<Test, 'id' | 'createdAt'>): Test => {
    const newTest: Test = {
      ...data,
      id: 'test-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTests((prev) => [newTest, ...prev]);
    setSelectedTestId(newTest.id);
    return newTest;
  };

  const updateTest = (id: string, updates: Partial<Test>) => {
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTest = (id: string) => {
    setTests((prev) => {
      const remaining = prev.filter((t) => t.id !== id);
      if (selectedTestId === id) {
        setSelectedTestId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
  };

  const startTest = (testId: string) => {
    const found = tests.find((t) => t.id === testId);
    if (found) {
      setActiveTest(found);
      setActiveTab('tests');
    }
  };

  const finishTest = (attemptData: Omit<TestAttempt, 'id' | 'completedAt'>): TestAttempt => {
    const newAttempt: TestAttempt = {
      ...attemptData,
      id: 'attempt-' + Date.now(),
      completedAt: new Date().toISOString(),
    };
    setTestAttempts((prev) => [newAttempt, ...prev]);
    setLatestAttempt(newAttempt);
    setActiveTest(null);
    return newAttempt;
  };

  const cancelActiveTest = () => {
    setActiveTest(null);
  };

  // Flashcards Actions
  const addDeck = (data: Omit<FlashcardDeck, 'id'>): FlashcardDeck => {
    const newDeck: FlashcardDeck = {
      ...data,
      id: 'deck-' + Date.now(),
    };
    setDecks((prev) => [newDeck, ...prev]);
    setSelectedDeckId(newDeck.id);
    return newDeck;
  };

  const updateDeck = (id: string, updates: Partial<FlashcardDeck>) => {
    setDecks((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDeck = (id: string) => {
    setDecks((prev) => {
      const remaining = prev.filter((d) => d.id !== id);
      if (selectedDeckId === id) {
        setSelectedDeckId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
  };

  const updateCardState = (deckId: string, cardId: string, state: 'learning' | 'review' | 'mastered') => {
    setDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== deckId) return deck;
        return {
          ...deck,
          cards: deck.cards.map((c) => (c.id === cardId ? { ...c, state } : c)),
          lastReviewedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Tasks Actions
  const addTask = (data: Omit<StudyTask, 'id'>): StudyTask => {
    const newTask: StudyTask = {
      ...data,
      id: 'task-' + Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<StudyTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextStatus: StudyTask['status'] =
          t.status === 'completed' ? 'todo' : t.status === 'todo' ? 'in_progress' : 'completed';
        return { ...t, status: nextStatus };
      })
    );
  };

  // Mistake Notebook Actions
  const addMistakeLog = (log: Omit<MistakeLog, 'id' | 'dateAdded'>): MistakeLog => {
    const newLog: MistakeLog = {
      ...log,
      id: 'mistake-' + Date.now() + Math.random().toString(36).slice(2, 6),
      dateAdded: new Date().toISOString(),
    };
    setMistakeLogs((prev) => [newLog, ...prev]);
    return newLog;
  };

  const toggleMistakeResolved = (id: string) => {
    setMistakeLogs((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isResolved: !m.isResolved } : m))
    );
  };

  const deleteMistakeLog = (id: string) => {
    setMistakeLogs((prev) => prev.filter((m) => m.id !== id));
  };

  // Focus Actions
  const logFocusSession = (durationMinutes: number, subjectId?: string, notes?: string) => {
    const session: FocusSession = {
      id: 'focus-' + Date.now(),
      durationMinutes,
      subjectId: subjectId || (subjects[0]?.id ?? 'subj-phy'),
      timestamp: new Date().toISOString(),
      completed: true,
      notes,
    };
    setFocusSessions((prev) => [session, ...prev]);
  };

  // Backup & Reset
  const resetToSampleData = () => {
    setSubjects(INITIAL_SUBJECTS);
    setNotes(INITIAL_NOTES);
    setSelectedNoteId(INITIAL_NOTES[0].id);
    setTests(INITIAL_TESTS);
    setSelectedTestId(INITIAL_TESTS[0].id);
    setDecks(INITIAL_DECKS);
    setSelectedDeckId(INITIAL_DECKS[0].id);
    setTasks(INITIAL_TASKS);
    setMistakeLogs(INITIAL_MISTAKE_LOGS);
    setTestAttempts(INITIAL_ATTEMPTS);
    setActiveTest(null);
    setLatestAttempt(null);
  };

  const exportWorkspaceData = () => {
    const backup = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      subjects,
      notes,
      tests,
      decks,
      tasks,
      mistakeLogs,
      testAttempts,
      focusSessions,
      studyStreakDays,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rankforge_jee_neet_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importWorkspaceData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (Array.isArray(data.notes) && Array.isArray(data.subjects)) {
        setSubjects(data.subjects);
        setNotes(data.notes);
        if (data.tests) setTests(data.tests);
        if (data.decks) setDecks(data.decks);
        if (data.tasks) setTasks(data.tasks);
        if (data.mistakeLogs) setMistakeLogs(data.mistakeLogs);
        if (data.testAttempts) setTestAttempts(data.testAttempts);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        examMode,
        setExamMode,
        activeTab,
        setActiveTab,
        selectedSubjectId,
        setSelectedSubjectId,
        searchQuery,
        setSearchQuery,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        notes,
        selectedNoteId,
        setSelectedNoteId,
        addNote,
        updateNote,
        deleteNote,
        toggleFavoriteNote,
        tests,
        selectedTestId,
        setSelectedTestId,
        addTest,
        updateTest,
        deleteTest,
        activeTest,
        startTest,
        finishTest,
        cancelActiveTest,
        testAttempts,
        latestAttempt,
        setLatestAttempt,
        decks,
        selectedDeckId,
        setSelectedDeckId,
        addDeck,
        updateDeck,
        deleteDeck,
        updateCardState,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        mistakeLogs,
        addMistakeLog,
        toggleMistakeResolved,
        deleteMistakeLog,
        formulas: INITIAL_FORMULA_CARDS,
        chapterWeightages: CHAPTER_WEIGHTAGES,
        focusSessions,
        logFocusSession,
        studyStreakDays,
        totalStudyMinutes,
        resetToSampleData,
        exportWorkspaceData,
        importWorkspaceData,
        isAiQuizModalOpen,
        setIsAiQuizModalOpen,
        aiQuizPresetNote,
        setAiQuizPresetNote,
        isAiFlashcardModalOpen,
        setIsAiFlashcardModalOpen,
        aiFlashcardPresetNote,
        setAiFlashcardPresetNote,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
