/**
 * ResultsScreen Component
 *
 * Displays final quiz results including:
 * - Mastery score (X/10 correct)
 * - Pass/Fail status
 * - Next lesson unlock button (if passed)
 * - Personalized feedback with guidance (if failed)
 * - Navigation options (retry, home)
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResultsScreenProps } from "../types";

/**
 * ResultsScreen - Show quiz completion and results
 *
 * PATTERN: Celebratory for pass, encouraging for retry
 * - Shows score prominently
 * - Explains mastery threshold (90%)
 * - Offers next steps based on performance
 * - Shows AI-generated personalized feedback for failed quizzes
 * - Large, tappable buttons for navigation
 * - Redirects to completion page if all lessons completed
 *
 * @param masteryScore - Score out of 100 (e.g., 80.0)
 * @param passed - Whether score >= 90% (MASTERY_THRESHOLD)
 * @param correctCount - Number of correct answers
 * @param totalCount - Total questions answered
 * @param lessonId - ID of the lesson being attempted
 * @param allLessonsCompleted - Whether all 3 lessons are completed
 * @param personalizeFeedback - AI-generated feedback based on errors
 * @param nextLessonUnlocked - Info about next lesson (if passed)
 * @param onRetry - Callback to restart quiz
 * @param onHome - Callback to return to dashboard
 * @returns JSX element showing results
 */
export function ResultsScreen({
  masteryScore,
  passed,
  correctCount,
  totalCount,
  lessonId,
  allLessonsCompleted,
  personalizeFeedback,
  recommendedSubLesson,
  nextLessonUnlocked,
  onRetry,
  onHome,
}: ResultsScreenProps) {
  const router = useRouter();

  // Redirect to completion page if all lessons completed
  useEffect(() => {
    if (allLessonsCompleted && passed) {
      const timer = setTimeout(() => {
        router.push("/completion");
      }, 2000); // Show results for 2 seconds before redirecting
      return () => clearTimeout(timer);
    }
  }, [allLessonsCompleted, passed, router]);

  const handleBackToLesson = () => {
    router.push(`/lesson-info/${lessonId}`);
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center px-4 py-8 ${
        passed
          ? "bg-gradient-to-br from-kid-green-100 via-kid-blue-50 to-kid-purple-100"
          : "bg-gradient-to-br from-kid-yellow-100 via-kid-blue-50 to-kid-pink-100"
      }`}
    >
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="text-7xl mb-4">
            {passed ? "🏆" : "💪"}
          </div>
          <h1 className="kid-heading mb-2">
            {passed ? "You're a Master!" : "Keep Going!"}
          </h1>
          <p className="text-xl text-gray-700">
            {passed
              ? "You've mastered this strategy!"
              : "You're making great progress!"}
          </p>
        </div>

        {/* Score Card */}
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-lg font-semibold mb-2">Score</p>
            <p className="text-6xl font-bold text-kid-blue-700">
              {correctCount}/{totalCount}
            </p>
            <p className="text-3xl font-bold text-kid-purple-600 mt-2">
              {masteryScore.toFixed(1)}%
            </p>
          </div>

          {/* Mastery Explanation */}
          <div className="bg-kid-blue-50 rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-700">
              {passed ? (
                <>
                  ✨ You scored <strong>90% or higher</strong> — that's mastery! You understand
                  this strategy really well.
                </>
              ) : (
                <>
                  📚 You need <strong>90% to master</strong> this strategy. Keep
                  practicing and you'll get there!
                </>
              )}
            </p>
          </div>
        </div>

        {/* Personalized Feedback (for failed quizzes) */}
        {!passed && personalizeFeedback && (
          <div className="rounded-3xl bg-gradient-to-r from-kid-yellow-100 to-orange-100 p-6 shadow-lg border-l-4 border-kid-yellow-500">
            <h2 className="text-xl font-bold text-yellow-900 mb-3">
              📖 What to Work On
            </h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              {personalizeFeedback}
            </p>

            {/* Recommended Sub-Lesson */}
            {recommendedSubLesson && (
              <div className="bg-white rounded-2xl p-4 border-2 border-yellow-200">
                <p className="text-sm text-gray-600 font-semibold mb-2">
                  📚 Recommended Topic to Review:
                </p>
                <p className="text-lg font-bold text-kid-blue-700 mb-2">
                  {recommendedSubLesson.title}
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  {recommendedSubLesson.description}
                </p>
                <button
                  onClick={() =>
                    router.push(
                      `/lesson/${lessonId}/sub-lesson/${recommendedSubLesson.id}`
                    )
                  }
                  className="w-full rounded-lg bg-yellow-500 hover:bg-yellow-600 px-4 py-2 text-white font-bold transition-colors text-sm"
                >
                  Review This Topic ✏️
                </button>
              </div>
            )}
          </div>
        )}

        {/* Next Steps */}
        <div className="space-y-4">
          {passed && nextLessonUnlocked ? (
            // Passed: Show next lesson unlock
            <div className="rounded-3xl bg-gradient-to-r from-kid-green-500 to-kid-blue-500 p-8 shadow-lg">
              <div className="text-center">
                <p className="text-white text-lg font-semibold mb-3">
                  🎓 Next Lesson Unlocked!
                </p>
                <p className="text-white text-2xl font-bold mb-4">
                  {nextLessonUnlocked.title}
                </p>
                <a
                  href={`/lesson/${nextLessonUnlocked.id}`}
                  className="inline-block kid-button-success"
                >
                  Start Next Lesson →
                </a>
              </div>
            </div>
          ) : null}

          {/* Action Buttons */}
          {!passed || !nextLessonUnlocked ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Retry Button - only show if failed */}
              <button
                onClick={onRetry}
                className="kid-button-primary py-4 text-lg font-bold rounded-2xl"
              >
                {passed ? "Practice Again" : "Try Again"} 🔄
              </button>

              {/* Back to Lesson or Home Button */}
              {!passed ? (
                <button
                  onClick={handleBackToLesson}
                  className="rounded-2xl bg-blue-500 hover:bg-blue-600 px-6 py-4 text-lg font-bold text-white transition-colors"
                >
                  Back to Lesson 📖
                </button>
              ) : (
                <button
                  onClick={onHome}
                  className="rounded-2xl bg-gray-500 hover:bg-gray-600 px-6 py-4 text-lg font-bold text-white transition-colors"
                >
                  Back to Dashboard 🏠
                </button>
              )}
            </div>
          ) : null}
        </div>

        {/* Encouragement */}
        <div className="text-center">
          <p className="text-lg text-gray-700 font-semibold">
            {passed
              ? "Keep up the amazing work! 🌟"
              : "Every attempt makes you smarter! 🧠"}
          </p>
        </div>
      </div>
    </div>
  );
}
