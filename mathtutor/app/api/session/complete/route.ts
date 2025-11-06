import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { completeSession, getResponses, getSessionStats } from "@/lib/sessionManager";

/**
 * POST /api/session/complete
 *
 * Finalize a quiz session:
 * - Calculate mastery score
 * - Update user progress
 * - Suggest sub-lessons if needed
 * - Check for next lesson unlock
 */

const completeSchema = z.object({
  sessionId: z.string().min(1),
});

const MASTERY_THRESHOLD = 90;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate request
    const body = await req.json();
    const { sessionId } = completeSchema.parse(body);

    // Complete session in memory
    const session = completeSession(userId);
    if (!session) {
      return NextResponse.json(
        { error: "No active session found" },
        { status: 400 }
      );
    }

    if (session.sessionId !== sessionId) {
      return NextResponse.json(
        { error: "Session ID mismatch" },
        { status: 400 }
      );
    }

    // Get session stats
    const { correctCount, totalCount, masteryScore } = getSessionStats(userId);

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const passed = masteryScore >= MASTERY_THRESHOLD;

    // Update user progress
    await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: session.lessonId,
        },
      },
      update: {
        masteryScore,
        completed: passed,
        lastAttempt: new Date(),
      },
      create: {
        userId: user.id,
        lessonId: session.lessonId,
        masteryScore,
        completed: passed,
      },
    });

    // Update session in database with score
    await prisma.session.update({
      where: { id: session.sessionId },
      data: {
        score: masteryScore / 100,
        passed,
      },
    });

    // Analyze top error tags for sub-lesson suggestion
    // TODO: Implement error tag analysis for better sub-lesson suggestions
    getResponses(userId);

    // Find next lesson
    let nextLessonUnlocked = null;
    if (passed) {
      const currentLesson = await prisma.lesson.findUnique({
        where: { id: session.lessonId },
      });

      if (currentLesson) {
        // Find lesson with order = current order + 1
        const nextLesson = await prisma.lesson.findFirst({
          where: { order: currentLesson.order + 1 },
        });

        if (nextLesson) {
          nextLessonUnlocked = {
            id: nextLesson.id,
            title: nextLesson.title,
          };
        }
      }
    }

    // Find recommended sub-lesson
    let suggestedSubLesson = null;
    if (!passed) {
      // Find sub-lessons for this lesson (for remediation)
      const subLessons = await prisma.subLesson.findMany({
        where: { lessonId: session.lessonId },
        take: 1, // Just suggest the first one for MVP
      });

      if (subLessons.length > 0) {
        suggestedSubLesson = {
          id: subLessons[0].id,
          title: subLessons[0].title,
          description: subLessons[0].description,
        };
      }
    }

    return NextResponse.json(
      {
        sessionId: session.sessionId,
        correctCount,
        totalCount,
        masteryScore: parseFloat(masteryScore.toFixed(1)),
        passed,
        summary: {
          topErrors: [], // TODO: implement error tag analysis
          suggestedSubLesson,
        },
        nextLessonUnlocked,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/session/complete]:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
