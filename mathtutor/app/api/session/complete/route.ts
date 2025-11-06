import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { completeSession, getResponses, getSessionStats } from "@/lib/sessionManager";
import { generateSummaryFeedback } from "@/lib/scoring/generateSummaryFeedback";

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

    // Try to get in-memory session, fall back to database
    let session = completeSession(userId);

    // If no in-memory session, fetch from database
    if (!session) {
      const dbSession = await prisma.session.findUnique({
        where: { id: sessionId },
      });

      if (!dbSession) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 }
        );
      }

      // Validate userId matches
      const sessionUser = await prisma.user.findUnique({
        where: { id: dbSession.userId },
      });

      if (!sessionUser || sessionUser.clerkId !== userId) {
        return NextResponse.json(
          { error: "Unauthorized access to session" },
          { status: 403 }
        );
      }

      // Create a session object from database
      session = {
        sessionId: dbSession.id,
        userId: dbSession.userId,
        lessonId: dbSession.lessonId,
        items: [],
        responses: [],
        startedAt: dbSession.startedAt,
      };
    }

    // CRITICAL: Get stats BEFORE any further operations
    let { correctCount, totalCount, masteryScore } = getSessionStats(userId);

    // If stats are 0/0, fetch from database
    if (totalCount === 0) {
      const responses = await prisma.sessionResponse.findMany({
        where: { sessionId: session.sessionId },
      });

      if (responses.length > 0) {
        totalCount = responses.length;
        correctCount = responses.filter(r => r.isCorrect).length;
        masteryScore = (correctCount / totalCount) * 100;
      }
    }

    if (session.sessionId !== sessionId) {
      return NextResponse.json(
        { error: "Session ID mismatch" },
        { status: 400 }
      );
    }

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

    // Generate personalized feedback for failed quizzes
    let personalizeFeedback = null;
    let recommendedSubLesson = null;
    if (!passed) {
      const result = await generateSummaryFeedback(
        session.sessionId,
        session.lessonId
      );
      personalizeFeedback = result.feedback;
      recommendedSubLesson = result.recommendedSubLesson;
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
          personalizeFeedback,
          recommendedSubLesson,
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
