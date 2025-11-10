import Link from "next/link";

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  locked: boolean;
}

/**
 * LessonCard component - displays a lesson as a card with status and action.
 *
 * @param id - Unique identifier for the lesson
 * @param title - Lesson title displayed in the card
 * @param description - Brief description of what the lesson covers
 * @param completed - Whether the lesson has been completed (shows checkmark)
 * @param locked - Whether the lesson is locked for the user (disabled button)
 * @returns JSX element representing a lesson card
 */
export function LessonCard({
  id,
  title,
  description,
  completed,
  locked,
}: LessonCardProps) {
  return (
    <div
      className={`rounded-3xl p-6 shadow-lg transition-all relative overflow-hidden ${
        locked
          ? "bg-gradient-to-br from-gray-200 to-gray-300 opacity-60 cursor-not-allowed border-2 border-gray-400"
          : "bg-white hover:shadow-xl"
      }`}
    >
      {/* Locked overlay blur effect */}
      {locked && (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-400/20 to-gray-500/30 pointer-events-none"></div>
      )}

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <h3
            className={`text-xl font-bold transition-colors ${
              locked ? "text-gray-600" : "text-kid-blue-700"
            }`}
          >
            {title}
          </h3>
          <div className="relative">
            {completed && <span className="text-3xl">✅</span>}
            {locked && (
              <div className="flex items-center gap-1">
                <span className="text-4xl animate-bounce">🔒</span>
              </div>
            )}
          </div>
        </div>

        <p
          className={`mb-6 transition-colors ${
            locked ? "text-gray-600" : "text-gray-700"
          }`}
        >
          {description}
        </p>

        {!locked && (
          <Link
            href={`/lesson-info/${id}`}
            className="inline-block kid-button-primary"
          >
            Start Lesson
          </Link>
        )}
        {locked && (
          <div className="flex items-center gap-2">
            <button
              disabled
              className="inline-block rounded-2xl bg-gray-400 px-6 py-3 text-lg font-bold text-gray-700 cursor-not-allowed shadow-md"
            >
              🔒 Locked
            </button>
            <span className="text-sm font-semibold text-gray-700">
              Complete previous lesson
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
