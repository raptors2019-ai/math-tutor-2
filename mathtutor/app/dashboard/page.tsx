export default async function DashboardPage() {
  // Mock lessons for now
  const lessons = [
    {
      id: "1",
      title: "Make-10 Strategy",
      description: "Learn to make 10 to solve addition",
      order: 1,
      completed: false,
      locked: false,
    },
    {
      id: "2",
      title: "Doubles & Near-Doubles",
      description: "Double the number and variations",
      order: 2,
      completed: false,
      locked: true,
    },
    {
      id: "3",
      title: "Choosing Strategies",
      description: "Pick the best strategy for each problem",
      order: 3,
      completed: false,
      locked: true,
    },
  ];

  return (
    <div>
      <h2 className="kid-heading mb-8">Your Lessons</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className={`rounded-lg p-6 shadow-md transition-opacity ${
              lesson.locked
                ? "bg-gray-100 opacity-50 cursor-not-allowed"
                : "bg-white hover:shadow-lg"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-kid-blue-700">
                {lesson.title}
              </h3>
              {lesson.completed && <span className="text-2xl">✅</span>}
              {lesson.locked && <span className="text-2xl">🔒</span>}
            </div>

            <p className="mb-6 text-gray-700">{lesson.description}</p>

            {!lesson.locked && (
              <a
                href={`/lesson/${lesson.id}`}
                className="inline-block kid-button-primary"
              >
                Start Lesson
              </a>
            )}
            {lesson.locked && (
              <button
                disabled
                className="inline-block rounded-full bg-gray-300 px-6 py-3 text-lg font-bold text-gray-600 cursor-not-allowed"
              >
                Locked
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
