/**
 * SubLessonActions component - shows action buttons after sub-lesson completion.
 */
interface SubLessonActionsProps {
  onRetry: () => void;
}

export function SubLessonActions({ onRetry }: SubLessonActionsProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-kid-purple-200 to-kid-pink-200 p-8 shadow-lg text-center">
      <div className="mb-4 text-5xl">💪</div>
      <h3 className="mb-3 text-2xl font-bold text-kid-purple-700">
        You&apos;re Ready to Try Again!
      </h3>
      <p className="mb-6 text-lg text-gray-700">
        Great job reviewing! Now let&apos;s see how much you&apos;ve learned.
      </p>
      <button
        onClick={onRetry}
        className="kid-button-primary text-lg px-8 py-4"
      >
        Take the Quiz Again 🚀
      </button>
    </div>
  );
}
