"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LessonCard } from "@/components/LessonCard";
import { MasteredStamp } from "@/components/MasteredStamp";

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
  const [lessons, setLessons] = useState<
    (LessonProgress & { locked: boolean })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progress");

        if (!res.ok) {
          const errorData = await res.text();
          console.error(
            `[Dashboard] API error ${res.status}:`,
            errorData
          );
          setError(`Failed to load progress (${res.status})`);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (!data.progress || !Array.isArray(data.progress)) {
          console.error("[Dashboard] Invalid progress data:", data);
          setError("Invalid progress data from server");
          setLoading(false);
          return;
        }

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
        console.error("[Dashboard] Error fetching progress:", err);
        setError(
          err instanceof Error
            ? `Failed to load progress: ${err.message}`
            : "Failed to load your progress"
        );
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-kid-blue-50 to-kid-purple-50">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className="mb-4 text-7xl">📚</div>
          <p className="text-2xl font-bold text-kid-blue-700">
            Loading your lessons...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-kid-blue-50 to-kid-purple-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center rounded-3xl bg-white p-8 shadow-lg"
        >
          <div className="mb-4 text-6xl">😕</div>
          <p className="text-2xl font-bold mb-6 text-gray-700">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="kid-button-primary px-8 py-4 text-xl"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Calculate overall progress
  const completedCount = lessons.filter((l) => l.completed).length;
  const totalCount = lessons.length;
  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kid-blue-50 via-kid-purple-50 to-kid-pink-50 pb-12">
      <div className="container mx-auto px-4">
        {/* Header section */}
        <div className="mb-12 text-center">
          <h1 className="kid-heading mb-4 text-5xl md:text-6xl">
            Your Learning Journey 🚀
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Master each strategy and unlock the next lesson!
          </p>

          {/* Progress bar */}
          <div className="mx-auto max-w-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-700">
                Overall Progress
              </span>
              <span className="text-sm font-bold text-kid-blue-700">
                {progressPercentage}%
              </span>
            </div>
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-kid-blue-300">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-kid-green-400 to-kid-blue-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Lessons grid */}
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.lessonId}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              {/* Lesson number badge */}
              <div className="absolute -top-4 -left-4 z-20">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-kid-purple-500 to-kid-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                >
                  {index + 1}
                </motion.div>
              </div>

              <LessonCard
                id={lesson.lessonId}
                title={lesson.lessonTitle}
                description={
                  lesson.locked
                    ? "Complete the previous lesson first!"
                    : lesson.completed
                      ? `Mastery: ${Math.round(lesson.masteryScore)}%`
                      : "Ready to start?"
                }
                completed={lesson.completed}
                locked={lesson.locked}
              />

              {/* Mastered Stamp */}
              {lesson.completed && <MasteredStamp />}

              {lesson.locked && (
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-4 right-4 text-3xl"
                >
                  🔒
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Encouragement message */}
        {completedCount === totalCount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 rounded-3xl bg-gradient-to-r from-kid-green-100 to-kid-blue-100 p-8 text-center border-2 border-kid-green-300"
          >
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Congratulations!
            </h2>
            <p className="text-lg text-gray-800 font-semibold">
              You've completed all lessons 🏆
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
