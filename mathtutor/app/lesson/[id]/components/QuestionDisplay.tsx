/**
 * QuestionDisplay Component
 *
 * Displays the current quiz question with progress indicator.
 * Shows large, kid-friendly text and progress bar.
 */

import { QuestionDisplayProps } from "../types";

/**
 * QuestionDisplay - Show current question with progress tracking
 *
 * @param question - The math question text (e.g., "8 + 5 = ?")
 * @param currentNumber - Current question number (1-based)
 * @param totalQuestions - Total questions in session
 * @returns JSX element showing the question
 */
export function QuestionDisplay({
  question,
  currentNumber,
  totalQuestions,
}: QuestionDisplayProps) {
  // Calculate progress percentage (0-100)
  const progressPercent = ((currentNumber - 1) / totalQuestions) * 100;

  return (
    <div className="w-full space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Question {currentNumber} of {totalQuestions}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-kid-blue-500 to-kid-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
            role="progressbar"
            aria-valuenow={currentNumber}
            aria-valuemin={1}
            aria-valuemax={totalQuestions}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl bg-gradient-to-br from-kid-blue-100 to-kid-purple-100 p-8 shadow-lg">
        {/* Math Icon */}
        <div className="mb-6 text-center text-5xl">🧮</div>

        {/* Question Text */}
        <div className="text-center">
          <p className="text-4xl font-bold text-kid-blue-700 md:text-6xl">
            {question}
          </p>
        </div>

        {/* Encouragement */}
        <p className="mt-6 text-center text-lg font-semibold text-gray-800">
          What do you think the answer is?
        </p>
      </div>
    </div>
  );
}
