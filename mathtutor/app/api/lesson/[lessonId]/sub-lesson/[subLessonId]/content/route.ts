import { NextRequest, NextResponse } from "next/server";
import { prisma, disconnectPrisma } from "@/lib/prisma";

/**
 * GET /api/lesson/[lessonId]/sub-lesson/[subLessonId]/content
 *
 * Get sub-lesson content details for display.
 */
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ lessonId: string; subLessonId: string }>;
  }
) {
  try {
    const { lessonId, subLessonId } = await params;

    // Verify sub-lesson exists
    const subLesson = await prisma.subLesson.findUnique({
      where: { id: subLessonId },
      include: { lesson: true },
    });

    if (!subLesson) {
      return NextResponse.json(
        { error: "Sub-lesson not found" },
        { status: 404 }
      );
    }

    // Verify it belongs to the requested lesson
    if (subLesson.lessonId !== lessonId) {
      return NextResponse.json(
        { error: "Sub-lesson does not belong to this lesson" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        id: subLesson.id,
        title: subLesson.title,
        description: subLesson.description,
        diagnosticPrompt: subLesson.diagnosticPrompt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/lesson/.../content]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await disconnectPrisma();
  }
}
