import { Suspense } from "react";
import { QuizContainer } from "./components/QuizContainer";
import { LoadingState } from "./components/LoadingState";

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

/**
 * LessonPage - Server component that wraps the interactive quiz
 *
 * PATTERN: Server component provides params to client component
 * Uses Suspense boundary for async initialization
 *
 * @param params - Route params including lesson ID
 * @returns Quiz UI with client-side interactivity
 */
export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<LoadingState message="Starting your quiz..." />}>
      <QuizContainer lessonId={id} />
    </Suspense>
  );
}
