export type ExamMode = 'jee' | 'neet';

export type QuestionType = 'mcq' | 'numerical' | 'assertion_reason' | 'tf' | 'short';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type NtaQuestionStatus = 
  | 'not_visited' 
  | 'not_answered' 
  | 'answered' 
  | 'marked_for_review' 
  | 'answered_and_marked';

export type MistakeCategory = 
  | 'calculation_silly' 
  | 'conceptual_gap' 
  | 'misread_question' 
  | 'formula_forgotten' 
  | 'time_pressure';

export interface Subject {
  id: string;
  name: string;
  code: string;
  exam: 'JEE' | 'NEET' | 'BOTH';
  color: string; // Tailwind color class or hex
  description: string;
  iconName: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // for mcq
  correctAnswer: string;
  explanation: string;
  hint?: string;
  difficulty?: DifficultyLevel;
  topicTag?: string;
  subject?: string;
  chapter?: string;
  pyqYear?: string; // e.g. 'JEE Main 2024 (Jan Shift 1)' or 'NEET 2023'
  isNumerical?: boolean;
  numericalRange?: [number, number];
  assertion?: string;
  reason?: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  examType?: 'JEE_MAIN' | 'JEE_ADVANCED' | 'NEET_UG' | 'CHAPTER_WISE';
  targetExam?: 'JEE' | 'NEET';
  estimatedMinutes: number;
  totalMarks?: number;
  positiveMarks?: number;
  negativeMarks?: number;
  difficulty: DifficultyLevel;
  questions: Question[];
  createdAt: string;
  noteIdRef?: string;
  tags: string[];
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  subjectId: string;
  examType?: 'JEE_MAIN' | 'JEE_ADVANCED' | 'NEET_UG' | 'CHAPTER_WISE';
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  answers: Record<string, string>; // questionId -> studentAnswer
  statuses?: Record<string, NtaQuestionStatus>;
  score: number;
  totalMarks?: number;
  totalQuestions: number;
  correctCount?: number;
  incorrectCount?: number;
  unattemptedCount?: number;
  percentage: number;
  subjectScores?: Record<string, { correct: number; incorrect: number; score: number }>;
  flaggedQuestions?: string[];
}

export interface MistakeLog {
  id: string;
  questionId?: string;
  questionText: string;
  options?: string[];
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
  subject: string;
  chapter: string;
  examType: 'JEE' | 'NEET' | 'BOTH';
  category: MistakeCategory;
  personalNotes: string;
  dateAdded: string;
  isResolved: boolean;
}

export interface FormulaCard {
  id: string;
  title: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology';
  chapter: string;
  examTag: 'JEE' | 'NEET' | 'BOTH';
  formula: string;
  variables: string;
  proTip: string;
  tags: string[];
}

export interface ChapterWeightage {
  id: string;
  chapter: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Botany' | 'Zoology';
  exam: 'JEE' | 'NEET';
  classGrade: '11' | '12';
  weightage: 'Very High' | 'High' | 'Medium' | 'Low';
  avgQuestionsPerExam: number;
  importantConcepts: string[];
  ncertRef?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
  subject?: string;
  interval?: number; // days
  repetition?: number;
  easeFactor?: number;
  dueDate?: string;
  state?: 'new' | 'learning' | 'review' | 'mastered';
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subjectId: string;
  examTag?: 'JEE' | 'NEET' | 'BOTH';
  cards: Flashcard[];
  noteIdRef?: string;
  lastReviewedAt?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  chapter?: string;
  examTag?: 'JEE' | 'NEET' | 'BOTH';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  aiSummary?: string;
  testIdRef?: string;
}

export interface StudyTask {
  id: string;
  title: string;
  subjectId: string;
  chapter?: string;
  targetQuestions?: number;
  questionsSolved?: number;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  noteIdRef?: string;
}

export interface FocusSession {
  id: string;
  durationMinutes: number;
  subjectId: string;
  timestamp: string;
  completed: boolean;
  notes?: string;
}

export type ActiveTab = 
  | 'jee' 
  | 'neet' 
  | 'tests' 
  | 'mistakes' 
  | 'formulas' 
  | 'notes' 
  | 'flashcards' 
  | 'planner' 
  | 'tutor' 
  | 'analytics';

