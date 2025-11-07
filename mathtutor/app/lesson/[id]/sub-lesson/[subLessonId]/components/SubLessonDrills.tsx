'use client';

import { useEffect, useState } from 'react';
import { QuestionDisplay } from '../../../components/QuestionDisplay';
import { AnswerForm } from '../../../components/AnswerForm';

interface DrillItem {
  id: string;
  question: string;
  answer: number;
  order: number;
}

interface SubLessonDrillsProps {
  lessonId: string;
  subLessonId: string;
  onComplete: () => void;
}

/**
 * SubLessonDrills component - show 3-5 practice questions for remediation.
 * Students must answer all correctly to complete the drills.
 */
export function SubLessonDrills({
  lessonId,
  subLessonId,
  onComplete,
}: SubLessonDrillsProps) {
  const [items, setItems] = useState<DrillItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<
    { itemId: string; correct: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allCorrect, setAllCorrect] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Fetch drills on mount
  useEffect(() => {
    const fetchDrills = async () => {
      try {
        const res = await fetch(
          `/api/lesson/${lessonId}/sub-lesson/${subLessonId}/drills`
        );

        if (!res.ok) {
          setError('Failed to load practice problems');
          setLoading(false);
          return;
        }

        const data = await res.json();
        setItems(data.items);
        setLoading(false);
      } catch (err) {
        console.error('[SubLessonDrills] Error fetching drills:', err);
        setError('Failed to load practice problems');
        setLoading(false);
      }
    };

    fetchDrills();
  }, [lessonId, subLessonId]);

  const handleAnswer = async (answer: number) => {
    if (loading || items.length === 0) return;

    const item = items[currentIndex];
    const isCorrect = answer === item.answer;
    const newResponses = [...responses, { itemId: item.id, correct: isCorrect }];
    setResponses(newResponses);

    if (isCorrect) {
      setFeedback('✅ Great job!');
      setTimeout(() => {
        if (currentIndex < items.length - 1) {
          // More questions
          setCurrentIndex(currentIndex + 1);
          setFeedback(null);
        } else {
          // All drills complete and correct
          setAllCorrect(true);
          setFeedback(null);
          onComplete();
        }
      }, 800);
    } else {
      // Incorrect - show feedback and continue
      setFeedback(`Not quite! The answer is ${item.answer}. Try the next one!`);
      setTimeout(() => {
        if (currentIndex < items.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setFeedback(null);
        } else {
          // All answered, but not all correct
          const correctCount = newResponses.filter((r) => r.correct).length;
          if (correctCount === items.length) {
            setAllCorrect(true);
            onComplete();
          } else {
            // Show summary and offer retry
            setFeedback(
              `You got ${correctCount}/${items.length} correct. Let's try again!`
            );
            setTimeout(() => {
              setCurrentIndex(0);
              setResponses([]);
              setFeedback(null);
            }, 2000);
          }
        }
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-md text-center">
        <div className="mb-4 text-4xl animate-bounce">🎯</div>
        <p className="text-lg font-bold text-gray-700">Loading practice problems...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 border-2 border-red-200 p-6 shadow-md text-center">
        <p className="text-lg font-bold text-red-700 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="kid-button-primary"
        >
          Reload
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-md text-center">
        <p className="text-lg font-bold text-gray-700">No practice problems found</p>
      </div>
    );
  }

  if (allCorrect) {
    return (
      <div className="rounded-2xl bg-green-50 border-2 border-green-200 p-6 shadow-md text-center">
        <div className="mb-4 text-6xl animate-bounce">🎉</div>
        <p className="text-2xl font-bold text-green-700">Perfect! You're ready!</p>
        <p className="mt-2 text-gray-700">All practice problems completed correctly.</p>
      </div>
    );
  }

  const item = items[currentIndex];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h3 className="mb-6 text-2xl font-bold text-kid-blue-700">
        Practice Problems
      </h3>

      {/* Progress indicator */}
      <div className="mb-6 text-center text-gray-600">
        <p className="font-bold">
          Problem {currentIndex + 1} of {items.length}
        </p>
        <div className="mt-2 flex justify-center gap-2">
          {items.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 w-2 rounded-full ${
                idx < currentIndex
                  ? 'bg-green-500'
                  : idx === currentIndex
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <QuestionDisplay
        question={item.question}
        currentNumber={currentIndex + 1}
        totalQuestions={items.length}
      />

      {/* Feedback */}
      {feedback && (
        <div className={`my-4 rounded-lg p-3 text-center font-bold ${
          feedback.includes('✅')
            ? 'bg-green-100 text-green-700'
            : feedback.includes('Got')
              ? 'bg-blue-100 text-blue-700'
              : 'bg-yellow-100 text-yellow-700'
        }`}>
          {feedback}
        </div>
      )}

      {/* Answer input */}
      <AnswerForm
        question={item.question}
        onSubmit={handleAnswer}
        isSubmitting={feedback !== null}
      />
    </div>
  );
}
