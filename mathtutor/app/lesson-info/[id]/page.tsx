import { notFound } from "next/navigation";
import curriculum from "@/lib/content.json";

interface LessonInfoPageProps {
  params: Promise<{ id: string }>;
}

/**
 * LessonInfoPage - Server component that displays lesson content before quiz
 *
 * Shows the full lesson description and sub-lessons before user takes the quiz.
 * Includes a "Take Quiz" button that navigates to the interactive quiz.
 */
export default async function LessonInfoPage({ params }: LessonInfoPageProps) {
  const { id } = await params;

  // Find the lesson in curriculum
  const lesson = curriculum.lessons.find((l) => l.id === id);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-kid-blue-50 to-white px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <a
          href="/dashboard"
          className="inline-flex items-center text-kid-blue-700 hover:text-kid-blue-900 font-semibold mb-4"
        >
          ← Back to Dashboard
        </a>

        {/* Lesson Header */}
        <div className="space-y-4">
          <h1 className="kid-heading text-4xl md:text-5xl">{lesson.title}</h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            {lesson.description}
          </p>
        </div>

        {/* Full Lesson Description */}
        {lesson.fullDescription && (
          <div className="rounded-3xl bg-white p-8 shadow-lg space-y-4">
            <h2 className="text-2xl font-bold text-kid-blue-700">
              📚 Lesson Overview
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {lesson.fullDescription}
            </p>
          </div>
        )}

        {/* Sub-Lessons */}
        {lesson.subLessons && lesson.subLessons.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-kid-blue-700">
              🎯 Topics to Learn
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {lesson.subLessons.map((subLesson) => (
                <div
                  key={subLesson.id}
                  className="rounded-2xl bg-white p-6 shadow-md border-l-4 border-kid-blue-500"
                >
                  <h3 className="text-xl font-bold text-kid-blue-700 mb-2">
                    {subLesson.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4">
                    {subLesson.description}
                  </p>
                  {"content" in subLesson && subLesson.content && (
                    <p className="text-gray-600 text-sm italic">
                      {subLesson.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Tips */}
        <div className="rounded-3xl bg-gradient-to-r from-kid-yellow-100 to-orange-100 p-8">
          <h3 className="text-2xl font-bold text-yellow-900 mb-4">
            💡 Tips for Success
          </h3>
          <ul className="space-y-3 text-yellow-900 text-lg">
            <li>✅ Take your time - there's no rush</li>
            <li>✅ Think through each problem carefully</li>
            <li>✅ You need 90% to master this lesson</li>
            <li>✅ If you don't pass, you can try again and again!</li>
            <li>✅ Ask for help if you get stuck</li>
          </ul>
        </div>

        {/* Ready for Quiz Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={`/lesson/${id}`}
            className="kid-button-primary text-2xl px-8 py-6 rounded-2xl"
          >
            Ready? Take the Quiz! 🚀
          </a>
          <p className="text-center text-gray-600 text-sm">
            (10 questions • 15-20 minutes)
          </p>
        </div>

        {/* Learning Path */}
        <div className="rounded-2xl bg-kid-blue-50 p-6 border border-kid-blue-200">
          <p className="text-sm text-gray-700 text-center">
            <strong>Remember:</strong> This is {lesson.order === 1 ? "the first" : `lesson ${lesson.order}`} in your learning journey.
            Master this strategy and unlock the next lesson! 🌟
          </p>
        </div>
      </div>
    </div>
  );
}
