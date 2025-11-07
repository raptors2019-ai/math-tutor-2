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
      className={`rounded-lg p-6 shadow-md transition-all ${
        locked
          ? "bg-gray-100 opacity-50 cursor-not-allowed"
          : "bg-white hover:shadow-lg"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-kid-blue-700">{title}</h3>
        {completed && <span className="text-3xl">✅</span>}
        {locked && <span className="text-3xl">🔒</span>}
      </div>

      <p className="mb-6 text-gray-700">{description}</p>

      {!locked && (
        <Link
          href={`/lesson-info/${id}`}
          className="inline-block kid-button-primary"
        >
          Start Lesson
        </Link>
      )}
      {locked && (
        <button
          disabled
          className="inline-block rounded-full bg-gray-300 px-6 py-3 text-lg font-bold text-gray-600 cursor-not-allowed"
        >
          Locked
        </button>
      )}
    </div>
  );
}
