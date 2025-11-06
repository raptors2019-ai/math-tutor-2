/**
 * LoadingState Component
 *
 * Displays a skeleton/loading indicator while quiz is initializing.
 * Shows pulsing placeholder elements for question and input.
 */

import { LoadingStateProps } from "../types";

/**
 * LoadingState - Display loading skeleton while fetching quiz
 *
 * @param message - Optional loading message
 * @returns JSX element showing loading state
 */
export function LoadingState({ message = "Loading your quiz..." }: LoadingStateProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-kid-blue-50 to-white px-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Loading Title */}
        <div className="text-center">
          <h1 className="kid-heading mb-4">📚 Getting your quiz ready...</h1>
          <p className="text-xl font-bold text-kid-blue-700">{message}</p>
        </div>

        {/* Question Skeleton */}
        <div className="space-y-4">
          {/* Progress Bar Skeleton */}
          <div className="h-2 w-full rounded-full bg-gray-200 animate-pulse" />

          {/* Question Counter Skeleton */}
          <div className="text-center">
            <div className="mx-auto h-6 w-32 rounded bg-gray-300 animate-pulse" />
          </div>

          {/* Question Text Skeleton */}
          <div className="rounded-2xl bg-kid-blue-50 p-8 space-y-4">
            <div className="h-16 w-full rounded bg-gray-300 animate-pulse" />
            <div className="h-12 w-3/4 rounded bg-gray-300 animate-pulse mx-auto" />
          </div>

          {/* Input Box Skeleton */}
          <div className="space-y-4 pt-8">
            <div className="h-20 w-full rounded-2xl bg-gray-200 animate-pulse" />
            <div className="h-16 w-full rounded-full bg-kid-blue-500 animate-pulse" />
          </div>
        </div>

        {/* Spinner Animation */}
        <div className="mt-12 flex justify-center">
          <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-kid-blue-500 animate-spin" />
        </div>
      </div>
    </div>
  );
}
