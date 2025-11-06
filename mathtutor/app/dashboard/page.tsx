'use client';

import { useEffect, useState } from 'react';
import { LessonCard } from '@/components/LessonCard';

interface LessonProgress {
  lessonId: string;
  lessonTitle: string;
  completed: boolean;
  masteryScore: number;
  lastAttempt: string | null;
}

/**
 * Dashboard page - displays all lessons with progress and lock states.
 * Fetches user progress from /api/progress and determines which lessons are unlocked.
 */
export default function DashboardPage() {
  const [lessons, setLessons] = useState<(LessonProgress & { locked: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch('/api/progress');
        if (!res.ok) {
          setError('Failed to load progress');
          setLoading(false);
          return;
        }

        const data = await res.json();
        const progress: LessonProgress[] = data.progress;

        // Determine locked states:
        // - Lesson 1 is always available
        // - Lesson 2 is available only if Lesson 1 is completed
        // - Lesson 3 is available only if Lesson 2 is completed
        const lessonsWithLocks = progress.map((lesson, index) => ({
          ...lesson,
          locked: index > 0 && !progress[index - 1].completed,
        }));

        setLessons(lessonsWithLocks);
        setLoading(false);
      } catch (err) {
        console.error('[Dashboard] Error fetching progress:', err);
        setError('Failed to load your progress');
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">📚</div>
          <p className="text-2xl font-bold">Loading your lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">😕</div>
          <p className="text-2xl font-bold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="kid-button-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="kid-heading mb-8">Your Lessons</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.lessonId}
            id={lesson.lessonId}
            title={lesson.lessonTitle}
            description={
              lesson.locked
                ? 'Complete the previous lesson first!'
                : lesson.completed
                  ? `Mastery: ${Math.round(lesson.masteryScore)}%`
                  : 'Ready to start?'
            }
            completed={lesson.completed}
            locked={lesson.locked}
          />
        ))}
      </div>
    </div>
  );
}
