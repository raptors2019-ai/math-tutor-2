import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { QuizContainer } from "./components/QuizContainer";
import { LoadingState } from "./components/LoadingState";
import { LockedLessonPage } from "./components/LockedLessonPage";

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Check if user has access to the lesson based on sequential unlocking
 * Lesson 1: Always accessible
 * Lesson 2: Requires Lesson 1 completion
 * Lesson 3: Requires Lesson 1 & 2 completion
 */
async function checkLessonAccess(
  lessonId: string,
  userId: string
): Promise<{ hasAccess: boolean; requiredLessonNumber?: number }> {
  try {
    // Lesson 1 is always accessible
    if (lessonId === "lesson-1") {
      return { hasAccess: true };
    }

    // Get lesson order
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { order: true },
    });

    if (!lesson) {
      return { hasAccess: false, requiredLessonNumber: 1 };
    }

    // For lesson 2, check if lesson 1 is completed
    if (lesson.order === 2) {
      const lesson1Progress = await prisma.userProgress.findUnique({
        where: {
          userId_lessonId: { userId, lessonId: "lesson-1" },
        },
      });

      if (lesson1Progress?.completed) {
        return { hasAccess: true };
      }
      return { hasAccess: false, requiredLessonNumber: 1 };
    }

    // For lesson 3, check if lesson 1 and 2 are completed
    if (lesson.order === 3) {
      const lesson1Progress = await prisma.userProgress.findUnique({
        where: {
          userId_lessonId: { userId, lessonId: "lesson-1" },
        },
      });

      if (!lesson1Progress?.completed) {
        return { hasAccess: false, requiredLessonNumber: 1 };
      }

      const lesson2Progress = await prisma.userProgress.findUnique({
        where: {
          userId_lessonId: { userId, lessonId: "lesson-2" },
        },
      });

      if (lesson2Progress?.completed) {
        return { hasAccess: true };
      }
      return { hasAccess: false, requiredLessonNumber: 2 };
    }

    return { hasAccess: false, requiredLessonNumber: 1 };
  } catch (error) {
    console.error("[checkLessonAccess] Error:", error);
    return { hasAccess: false, requiredLessonNumber: 1 };
  }
}

/**
 * LessonPage - Server component that wraps the interactive quiz
 *
 * PATTERN: Server component provides params to client component
 * Checks lesson access before showing content
 * Uses Suspense boundary for async initialization
 *
 * @param params - Route params including lesson ID
 * @returns Quiz UI with client-side interactivity or locked page
 */
export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const { userId } = await auth();

  // If not authenticated, show loading state
  if (!userId) {
    return (
      <Suspense fallback={<LoadingState message="Starting your quiz..." />}>
        <QuizContainer lessonId={id} />
      </Suspense>
    );
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return (
      <Suspense fallback={<LoadingState message="Starting your quiz..." />}>
        <QuizContainer lessonId={id} />
      </Suspense>
    );
  }

  // Check if user has access to this lesson
  const { hasAccess, requiredLessonNumber } = await checkLessonAccess(
    id,
    user.id
  );

  if (!hasAccess) {
    // Extract lesson number from lessonId (e.g., "lesson-2" -> 2)
    const lessonNumber = parseInt(id.split("-")[1]) || 1;
    return (
      <LockedLessonPage
        lessonNumber={lessonNumber}
        requiredLessonNumber={requiredLessonNumber || 1}
      />
    );
  }

  return (
    <Suspense fallback={<LoadingState message="Starting your quiz..." />}>
      <QuizContainer lessonId={id} />
    </Suspense>
  );
}
