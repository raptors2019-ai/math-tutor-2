interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="kid-heading mb-4">Lesson {id}</h1>
        <p className="text-xl text-gray-700 mb-8">Quiz content coming soon! 🚀</p>
        <a
          href="/dashboard"
          className="inline-block kid-button-primary"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
