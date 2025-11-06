/**
 * ErrorState Component
 *
 * Displays when an error occurs during the quiz (e.g., API failure, network error).
 * Provides user-friendly error message and retry button.
 */

import { ErrorStateProps } from "../types";

/**
 * ErrorState - Display error message with retry action
 *
 * @param error - Error message to display
 * @param onRetry - Callback when retry button is clicked
 * @returns JSX element showing error state
 */
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-kid-pink-500 to-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        {/* Error Icon */}
        <div className="mb-6 text-center">
          <span className="text-6xl">😕</span>
        </div>

        {/* Error Title */}
        <h2 className="mb-4 text-center text-3xl font-bold text-kid-blue-700">
          Oops! Something went wrong
        </h2>

        {/* Error Message */}
        <p className="mb-8 text-center text-lg text-gray-700">
          {error || "We had trouble loading your quiz. Please try again!"}
        </p>

        {/* Retry Button */}
        <button
          onClick={onRetry}
          className="kid-button-primary w-full"
        >
          Try Again
        </button>

        {/* Back to Dashboard Link */}
        <a
          href="/dashboard"
          className="mt-4 block text-center text-lg text-kid-blue-500 hover:text-kid-blue-700 transition-colors"
        >
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
}
