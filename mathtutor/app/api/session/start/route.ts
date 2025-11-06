import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/sessionManager";
import { randomUUID } from "crypto";

/**
 * POST /api/session/start
 *
 * Start a new quiz session with 10 random non-repeating questions
 */

const startSessionSchema = z.object({
  lessonId: z.string().min(1, "Lesson ID required"),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const { lessonId } = startSessionSchema.parse(body);

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: `${userId}@clerk.local`,
        },
      });
    }

    // Fetch the lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { items: true },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check if lesson is unlocked (sequential unlocking based on previous lesson completion)
    if (lesson.order > 1) {
      // Find previous lesson
      const previousLesson = await prisma.lesson.findFirst({
        where: { order: lesson.order - 1 },
      });

      if (!previousLesson) {
        return NextResponse.json(
          { error: "Previous lesson not found" },
          { status: 400 }
        );
      }

      // Check if previous lesson is completed
      const previousProgress = await prisma.userProgress.findUnique({
        where: { userId_lessonId: { userId: user.id, lessonId: previousLesson.id } },
      });

      if (!previousProgress || !previousProgress.completed) {
        return NextResponse.json(
          { error: `Complete lesson ${previousLesson.order} first!` },
          { status: 403 }
        );
      }
    }

    if (lesson.items.length < 10) {
      return NextResponse.json(
        { error: "Lesson does not have enough items for a session" },
        { status: 400 }
      );
    }

    // Randomly select 10 non-repeating items
    const shuffled = [...lesson.items].sort(() => Math.random() - 0.5);
    const selectedItems = shuffled.slice(0, 10);

    // Create session ID
    const sessionId = randomUUID();

    // Create session in database
    const dbSession = await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        lessonId: lessonId,
      },
    });

    // Store in memory
    createSession(sessionId, userId, lessonId, selectedItems);

    // Return session with questions
    return NextResponse.json(
      {
        sessionId: dbSession.id,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        totalQuestions: 10,
        questions: selectedItems.map((item, index) => ({
          itemId: item.id,
          question: item.question,
          order: index + 1,
        })),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/session/start]:", error);

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
