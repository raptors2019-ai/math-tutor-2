'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-kid-pink-100 via-kid-purple-100 to-kid-blue-100">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className="mb-4 text-7xl">📚</div>
          <p className="text-2xl font-bold text-kid-blue-700">Loading your lesson...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !subLesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-kid-pink-100 to-kid-blue-100">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center rounded-3xl bg-white p-8 shadow-lg"
        >
          <div className="mb-4 text-6xl">😕</div>
          <p className="text-2xl font-bold mb-6 text-gray-700">{error || 'Sub-lesson not found'}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="kid-button-primary px-8 py-4 text-lg"
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kid-pink-50 via-kid-purple-50 to-kid-blue-50 px-4 py-8">
      <motion.div
        className="mx-auto max-w-3xl space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-lg font-bold text-kid-blue-600 hover:text-kid-blue-800 px-4 py-2 rounded-full hover:bg-white/50 transition-colors"
          >
            ← Back
          </motion.button>
        </motion.div>

        {/* Title Section */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <motion.div
            animate={{ rotate: [0, 15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-7xl"
          >
            📖
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-kid-pink-600 to-kid-blue-700 bg-clip-text text-transparent mb-2">
            {subLesson.title}
          </h2>
          <p className="text-lg text-gray-700 font-semibold">
            Let's review this topic together! 💪
          </p>
        </motion.div>

        {/* Encouragement Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="rounded-3xl bg-gradient-to-r from-kid-purple-100 to-kid-pink-100 p-6 border-2 border-kid-purple-300 shadow-lg"
        >
          <p className="text-lg font-bold text-kid-purple-800 text-center">
            ✨ You're doing amazing! This practice will help you master the concept. ✨
          </p>
        </motion.div>

        {/* Content Section */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h3 className="text-2xl font-bold text-kid-blue-700 flex items-center gap-2">
            <span>📚</span> Review
          </h3>
          <SubLessonContent title={subLesson.title} />
        </motion.div>

        {/* Drills Section */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h3 className="text-2xl font-bold text-kid-blue-700 flex items-center gap-2">
            <span>🎯</span> Practice Problems
          </h3>
          <SubLessonDrills
            lessonId={lessonId}
            subLessonId={subLessonId}
            onComplete={() => setDrillsComplete(true)}
          />
        </motion.div>

        {/* Action Button */}
        {drillsComplete && (
          <motion.div
            variants={itemVariants}
            className="space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="rounded-3xl bg-gradient-to-r from-kid-green-100 to-kid-blue-100 p-6 text-center border-2 border-kid-green-300"
            >
              <p className="text-2xl font-bold text-kid-green-800 mb-4">
                Great Job! 🎉
              </p>
              <p className="text-gray-700 mb-6">
                You've completed the practice problems. Ready to try the quiz again?
              </p>
              <SubLessonActions
                onRetry={() => {
                  // Navigate back to the lesson quiz
                  router.push(`/lesson/${lessonId}`);
                }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Progress indicator */}
        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <p className="text-sm text-gray-600 font-semibold">
            {drillsComplete ? '✅ Ready to retake the quiz!' : '📖 Working through the lesson...'}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
