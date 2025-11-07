import { notFound } from "next/navigation";
import { LessonInfoClient } from "./components/LessonInfoClient";
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

  return <LessonInfoClient lesson={lesson} id={id} />;
}
