export type QuestionType = 'mcq' | 'tf' | 'short';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface Subject {
  id: string;
  name: string;
  code: string;
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
}

export interface Test {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  estimatedMinutes: number;
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
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  answers: Record<string, string>; // questionId -> studentAnswer
  score: number;
  totalQuestions: number;
  percentage: number;
  flaggedQuestions?: string[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
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
  cards: Flashcard[];
  noteIdRef?: string;
  lastReviewedAt?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId: string;
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

export type ActiveTab = 'notes' | 'tests' | 'flashcards' | 'focus' | 'tutor' | 'analytics';
