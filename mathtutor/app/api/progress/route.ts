import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { connectWithRetry } from "@/lib/prisma";

/**
 * GET /api/progress
 *
 * Fetch user's lesson progress and completion status
 */

export async function GET() {
  try {
    await connectWithRetry();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all lessons
    const lessons = await prisma.lesson.findMany({
      orderBy: { order: "asc" },
    });

    // Get user progress for all lessons
    const progressRecords = await prisma.userProgress.findMany({
      where: { userId: user.id },
    });

    const progressMap = new Map(progressRecords.map((p) => [p.lessonId, p]));

    // Build progress response
    const progress = lessons.map((lesson) => {
      const userProgress = progressMap.get(lesson.id);

      return {
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        completed: userProgress?.completed ?? false,
        masteryScore: userProgress?.masteryScore ?? 0,
        lastAttempt: userProgress?.lastAttempt ?? null,
        currentSubLesson: null, // TODO: implement sub-lesson tracking
      };
    });

    // Calculate overall progress
    const completedCount = progress.filter((p) => p.completed).length;
    const overallProgress = (completedCount / lessons.length) * 100;

    return NextResponse.json(
      {
        userId,
        progress,
        overallProgress: parseFloat(overallProgress.toFixed(1)),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/progress]:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(() => {}); // Add this for cleanup
  }
}

/**
 * POST /api/progress
 *
 * Update user progress (admin/debug endpoint)
 */

import { z } from "zod";

const updateProgressSchema = z.object({
  lessonId: z.string().min(1),
  masteryScore: z.number().min(0).max(100),
  completed: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await connectWithRetry();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate request
    const body = await req.json();
    const { lessonId, masteryScore, completed } =
      updateProgressSchema.parse(body);

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Update or create progress
    const updated = await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        masteryScore,
        completed: completed !== undefined ? completed : undefined,
        lastAttempt: new Date(),
      },
      create: {
        userId: user.id,
        lessonId,
        masteryScore,
        completed: completed ?? false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        progress: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/progress]:", error);

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
  } finally {
    await prisma.$disconnect().catch(() => {}); // Add this for cleanup
  }
}
