/**
 * Quiz-Related TypeScript Interfaces
 *
 * Defines all types for the lesson quiz flow, including API responses,
 * component props, and internal state management.
 */

/**
 * Single question in a quiz session
 */
export interface Question {
  itemId: string;
  question: string;
  order: number;
}

/**
 * API response from POST /api/session/start
 * Initializes a new quiz session
 */
export interface SessionStartResponse {
  sessionId: string;
  lessonId: string;
  lessonTitle: string;
  totalQuestions: number;
  questions: Question[];
}

/**
 * API response from POST /api/session/answer
 * Returned after submitting an answer
 */
export interface AnswerResponse {
  itemId: string;
  correct: boolean;
  correctAnswer: number;
  userAnswer: number;
  feedback: string;
  tags: string[];
  questionsRemaining: number;
  sessionComplete: boolean;
}

/**
 * Next lesson unlock info (if user passed)
 */
export interface NextLessonInfo {
  id: string;
  title: string;
}

/**
 * Sub-lesson suggestion for remediation
 */
export interface SubLessonSuggestion {
  id: string;
  title: string;
  description: string;
}

/**
 * API response from POST /api/session/complete
 * Final results of the session
 */
export interface SessionCompleteResponse {
  sessionId: string;
  correctCount: number;
  totalCount: number;
  masteryScore: number;
  passed: boolean;
  allLessonsCompleted?: boolean;
  nextLessonUnlocked?: NextLessonInfo;
  summary: {
    topErrors: string[];
    personalizeFeedback?: string;
    recommendedSubLesson?: {
      id: string;
      title: string;
      description: string;
    };
  };
}

/**
 * Tracked response for a single question
 */
export interface TrackedResponse {
  itemId: string;
  answer: number;
  correct: boolean;
}

/**
 * Complete quiz state
 */
export interface QuizState {
  // Session info
  sessionId: string | null;
  lessonId: string;
  lessonTitle?: string;

  // Question progression
  currentQuestionIndex: number;
  questions: Question[];
  totalQuestions: number;

  // User responses
  responses: TrackedResponse[];

  // UI states
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Feedback display
  showFeedback: boolean;
  lastFeedback?: AnswerResponse;

  // Session completion
  isComplete: boolean;
  results?: SessionCompleteResponse;
}

/**
 * Props for ErrorState component
 */
export interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

/**
 * Props for LoadingState component
 */
export interface LoadingStateProps {
  message?: string;
}

/**
 * Props for QuestionDisplay component
 */
export interface QuestionDisplayProps {
  question: string;
  currentNumber: number;
  totalQuestions: number;
}

/**
 * Props for AnswerForm component
 */
export interface AnswerFormProps {
  question: string;
  onSubmit: (answer: number) => Promise<void>;
  isSubmitting: boolean;
}

/**
 * Props for FeedbackDisplay component
 */
export interface FeedbackDisplayProps {
  correct: boolean;
  feedback: string;
  userAnswer: number;
  correctAnswer: number;
  tags: string[];
  onNext: () => void;
  isLastQuestion: boolean;
}

/**
 * Props for ResultsScreen component
 */
export interface ResultsScreenProps {
  masteryScore: number;
  passed: boolean;
  correctCount: number;
  totalCount: number;
  lessonId: string;
  allLessonsCompleted?: boolean;
  personalizeFeedback?: string;
  recommendedSubLesson?: {
    id: string;
    title: string;
    description: string;
  };
  nextLessonUnlocked?: NextLessonInfo;
  onRetry: () => void;
  onHome: () => void;
}

/**
 * Props for QuizContainer component
 */
export interface QuizContainerProps {
  lessonId: string;
}
