import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/lesson/[lessonId]/sub-lesson/[subLessonId]/drills
 *
 * Get 3-5 diagnostic drill questions related to a sub-lesson.
 * Used during remediation flow (after quiz failure).
 */

// Map sub-lesson IDs to strategy tags for fetching related items
const subLessonStrategyMap: Record<string, string[]> = {
  'sub-1-1': ['make-10', 'complement'],
  'sub-1-2': ['make-10', 'make-10-splitting'],
  'sub-2-1': ['doubles'],
  'sub-2-2': ['near_double'],
  'sub-3-1': ['choose_doubles', 'choose_make10', 'choose_either'],
};

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
        { error: 'Sub-lesson not found' },
        { status: 404 }
      );
    }

    // Verify it belongs to the requested lesson
    if (subLesson.lessonId !== lessonId) {
      return NextResponse.json(
        { error: 'Sub-lesson does not belong to this lesson' },
        { status: 400 }
      );
    }

    // Get strategy tags for this sub-lesson
    const strategyTags =
      subLessonStrategyMap[subLessonId] ||
      [subLesson.lesson.strategyTag];

    // Fetch 3-5 items from this lesson with matching strategy tags
    const items = await prisma.lessonItem.findMany({
      where: {
        lessonId,
        strategyTag: { in: strategyTags },
      },
      orderBy: { order: 'asc' },
      take: 5,
    });

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'No drill items found for this sub-lesson' },
        { status: 404 }
      );
    }

    // Randomize order for variety
    const shuffled = items.sort(() => Math.random() - 0.5);

    return NextResponse.json(
      {
        subLessonId,
        subLessonTitle: subLesson.title,
        items: shuffled,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[GET /api/lesson/.../drills]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
