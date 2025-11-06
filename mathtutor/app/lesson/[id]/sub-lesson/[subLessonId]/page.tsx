'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubLessonContent } from './components/SubLessonContent';
import { SubLessonDrills } from './components/SubLessonDrills';
import { SubLessonActions } from './components/SubLessonActions';

interface SubLesson {
  id: string;
  title: string;
  description: string;
  diagnosticPrompt: string;
}

/**
 * Sub-lesson page - shows content, drills, then offers re-quiz button.
 * Part of the remediation flow for students who score < 90% on a quiz.
 */
export default function SubLessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;
  const subLessonId = params.subLessonId as string;

  const [subLesson, setSubLesson] = useState<SubLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drillsComplete, setDrillsComplete] = useState(false);

  useEffect(() => {
    const fetchSubLesson = async () => {
      try {
        // Fetch sub-lesson details from the drills endpoint
        // (or we could create a separate endpoint if needed)
        const res = await fetch(
          `/api/lesson/${lessonId}/sub-lesson/${subLessonId}/drills`
        );

        if (!res.ok) {
          setError('Failed to load sub-lesson');
          setLoading(false);
          return;
        }

        const data = await res.json();

        // For now, we'll construct the SubLesson from the drills response
        // In a real app, we might fetch this separately
        setSubLesson({
          id: subLessonId,
          title: data.subLessonTitle,
          description: 'Let\'s review this topic together!',
          diagnosticPrompt: '',
        });

        setLoading(false);
      } catch (err) {
        console.error('[SubLessonPage] Error fetching sub-lesson:', err);
        setError('Failed to load sub-lesson');
        setLoading(false);
      }
    };

    fetchSubLesson();
  }, [lessonId, subLessonId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-kid-pink-100 to-kid-blue-100">
        <div className="text-center">
          <div className="mb-4 text-6xl animate-bounce">📚</div>
          <p className="text-2xl font-bold">Loading your lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !subLesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-kid-pink-100 to-kid-blue-100">
        <div className="text-center">
          <div className="mb-4 text-6xl">😕</div>
          <p className="text-2xl font-bold mb-4">{error || 'Sub-lesson not found'}</p>
          <button
            onClick={() => router.back()}
            className="kid-button-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kid-pink-50 to-kid-blue-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-lg font-bold text-kid-blue-600 hover:text-kid-blue-800"
        >
          ← Back
        </button>

        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-5xl">📖</h1>
          <h2 className="text-4xl font-bold text-kid-blue-700 mb-2">
            {subLesson.title}
          </h2>
          <p className="text-lg text-gray-700">
            Let's review this topic together!
          </p>
        </div>

        {/* Content Section */}
        <div className="mb-8">
          <SubLessonContent title={subLesson.title} />
        </div>

        {/* Drills Section */}
        <div className="mb-8">
          <SubLessonDrills
            lessonId={lessonId}
            subLessonId={subLessonId}
            onComplete={() => setDrillsComplete(true)}
          />
        </div>

        {/* Action Button */}
        {drillsComplete && (
          <div className="mb-8">
            <SubLessonActions
              onRetry={() => {
                // Navigate back to the lesson quiz
                router.push(`/lesson/${lessonId}`);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
