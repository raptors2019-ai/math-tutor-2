/**
 * QuizContainer Component
 *
 * Main quiz orchestration component.
 * Manages all state, API calls, and routing between quiz screens.
 *
 * CRITICAL: This is a client component that:
 * 1. Loads session on mount via /api/session/start
 * 2. Submits answers via /api/session/answer
 * 3. Completes session via /api/session/complete
 * 4. Routes between: Loading → Question → Feedback → Results
 */

"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { QuizContainerProps, QuizState, SessionStartResponse, AnswerResponse, SessionCompleteResponse } from "../types";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { QuestionDisplay } from "./QuestionDisplay";
import { AnswerForm } from "./AnswerForm";
import { FeedbackDisplay } from "./FeedbackDisplay";
import { ResultsScreen } from "./ResultsScreen";

/**
 * Initial quiz state
 */
const initialState: QuizState = {
  sessionId: null,
  lessonId: "",
  currentQuestionIndex: 0,
  questions: [],
  totalQuestions: 0,
  responses: [],
  isLoading: true,
  isSubmitting: false,
  error: null,
  showFeedback: false,
  isComplete: false,
};

/**
 * QuizContainer - Main quiz component
 *
 * Flow:
 * 1. Mount → Load session from API
 * 2. Display questions → User enters answer
 * 3. Submit → Show feedback
 * 4. After 10 questions → Complete session
 * 5. Show results
 *
 * @param lessonId - ID of lesson being attempted
 * @returns JSX element or null (managed by state)
 */
export function QuizContainer({ lessonId }: QuizContainerProps) {
  const [state, setState] = useState<QuizState>({
    ...initialState,
    lessonId,
  });

  const { user } = useUser();
  const router = useRouter();

  /**
   * Initialize session on mount
   * CRITICAL: Only runs once (empty dependency array)
   * PATTERN: Fetch quiz data from /api/session/start
   */
  useEffect(() => {
    if (!user?.id) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "User not authenticated. Please sign in.",
      }));
      return;
    }

    const initializeSession = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await fetch("/api/session/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to start session");
        }

        const data: SessionStartResponse = await response.json();

        setState((prev) => ({
          ...prev,
          sessionId: data.sessionId,
          questions: data.questions,
          totalQuestions: data.totalQuestions,
          isLoading: false,
        }));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load quiz";

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        console.error("[QuizContainer] Session init error:", err);
      }
    };

    initializeSession();
  }, [user?.id, lessonId]);

  /**
   * Handle answer submission
   * CRITICAL: Validates answer, calls /api/session/answer
   * PATTERN: Shows feedback then advances to next question or completes
   *
   * @param answer - User's numeric answer (0-20)
   */
  const handleAnswerSubmit = async (answer: number) => {
    if (!state.sessionId || !user?.id) return;

    const currentQuestion = state.questions[state.currentQuestionIndex];
    if (!currentQuestion) return;

    try {
      setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

      const response = await fetch("/api/session/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: state.sessionId,
          itemId: currentQuestion.itemId,
          userAnswer: answer,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to submit answer");
      }

      const data: AnswerResponse = await response.json();

      // Track response
      setState((prev) => ({
        ...prev,
        responses: [
          ...prev.responses,
          {
            itemId: currentQuestion.itemId,
            answer,
            correct: data.correct,
          },
        ],
        lastFeedback: data,
        showFeedback: true,
        isSubmitting: false,
      }));

      // Check if quiz is complete
      if (data.sessionComplete) {
        // Complete session after user sees feedback
        // This will be triggered by handleNextQuestion when isLastQuestion
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit answer";

      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: errorMessage,
        showFeedback: false,
      }));

      console.error("[QuizContainer] Answer submit error:", err);
    }
  };

  /**
   * Handle moving to next question
   * CRITICAL: Advances index or completes session if last question
   * PATTERN: Hides feedback and shows next question or results
   */
  const handleNextQuestion = async () => {
    const isLastQuestion =
      state.currentQuestionIndex === state.totalQuestions - 1;

    if (isLastQuestion) {
      // Complete the session
      await handleSessionComplete();
    } else {
      // Move to next question
      setState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showFeedback: false,
        lastFeedback: undefined,
      }));
    }
  };

  /**
   * Complete the session
   * CRITICAL: Calls /api/session/complete and shows results
   * PATTERN: Calculate final mastery score and show results screen
   */
  const handleSessionComplete = async () => {
    if (!state.sessionId || !user?.id) return;

    try {
      setState((prev) => ({ ...prev, isSubmitting: true }));

      const response = await fetch("/api/session/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: state.sessionId }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to complete session");
      }

      const data: SessionCompleteResponse = await response.json();

      setState((prev) => ({
        ...prev,
        isComplete: true,
        results: data,
        isSubmitting: false,
        showFeedback: false,
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to complete session";

      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: errorMessage,
      }));

      console.error("[QuizContainer] Session complete error:", err);
    }
  };

  /**
   * Retry the quiz - restart from beginning
   */
  const handleRetry = () => {
    setState({
      ...initialState,
      lessonId,
      isLoading: true,
    });
  };

  /**
   * Return to dashboard
   */
  const handleHome = () => {
    router.push("/dashboard");
  };

  /**
   * Conditional rendering based on state
   * PATTERN: Show appropriate screen for current state
   */

  // Loading state
  if (state.isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (state.error && !state.isComplete) {
    return (
      <ErrorState
        error={state.error}
        onRetry={handleRetry}
      />
    );
  }

  // Results screen
  if (state.isComplete && state.results) {
    return (
      <ResultsScreen
        masteryScore={state.results.masteryScore}
        passed={state.results.passed}
        correctCount={state.results.correctCount}
        totalCount={state.results.totalCount}
        lessonId={lessonId}
        personalizeFeedback={state.results.summary.personalizeFeedback}
        nextLessonUnlocked={state.results.nextLessonUnlocked}
        onRetry={handleRetry}
        onHome={handleHome}
      />
    );
  }

  // Question screen (with optional feedback toast overlay)
  if (state.questions.length > 0) {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    const isLastQuestion =
      state.currentQuestionIndex === state.totalQuestions - 1;

    return (
      <>
        {/* Feedback Toast (if showing) */}
        {state.showFeedback && state.lastFeedback && (
          <FeedbackDisplay
            correct={state.lastFeedback.correct}
            feedback={state.lastFeedback.feedback}
            userAnswer={state.lastFeedback.userAnswer}
            correctAnswer={state.lastFeedback.correctAnswer}
            tags={state.lastFeedback.tags}
            onNext={handleNextQuestion}
            isLastQuestion={isLastQuestion}
          />
        )}

        {/* Question Screen */}
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-kid-blue-50 to-white px-4 py-8">
          <div className="w-full max-w-2xl space-y-8">
            {/* Question Display */}
            <QuestionDisplay
              question={currentQuestion.question}
              currentNumber={state.currentQuestionIndex + 1}
              totalQuestions={state.totalQuestions}
            />

            {/* Answer Form */}
            <AnswerForm
              question={currentQuestion.question}
              onSubmit={handleAnswerSubmit}
              isSubmitting={state.isSubmitting}
            />
          </div>
        </div>
      </>
    );
  }

  // Fallback (should not reach here)
  return (
    <ErrorState
      error="Something went wrong. Unable to load quiz."
      onRetry={handleRetry}
    />
  );
}
