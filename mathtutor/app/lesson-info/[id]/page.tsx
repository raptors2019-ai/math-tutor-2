'use client';

import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import curriculum from "@/lib/content.json";
import Link from "next/link";

interface LessonInfoPageProps {
  params: Promise<{ id: string }>;
}

/**
 * LessonInfoPage - Server component that displays lesson content before quiz
 *
 * Shows the full lesson description and sub-lessons before user takes the quiz.
 * Includes a "Take Quiz" button that navigates to the interactive quiz.
 */
export default function LessonInfoPage({ params }: LessonInfoPageProps) {
  const [id, setId] = useState<string | null>(null);
  const [lesson, setLesson] = useState<any>(null);

  useEffect(() => {
    const loadParams = async () => {
      const p = await params;
      setId(p.id);
      const foundLesson = curriculum.lessons.find((l) => l.id === p.id);
      if (!foundLesson) {
        notFound();
      }
      setLesson(foundLesson);
    };
    loadParams();
  }, [params]);

  if (!lesson || !id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-kid-blue-50 to-kid-purple-50">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-6xl"
        >
          📚
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
    <div className="min-h-screen bg-gradient-to-br from-kid-blue-50 via-kid-purple-50 to-kid-pink-50 px-4 py-8">
      <motion.div
        className="max-w-4xl mx-auto space-y-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants}>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-kid-blue-700 hover:text-kid-blue-900 font-bold text-lg px-4 py-2 rounded-full hover:bg-white/50 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </motion.div>

        {/* Lesson Header */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-7xl"
            >
              📖
            </motion.div>
            <div>
              <p className="text-sm font-bold text-kid-purple-600 uppercase tracking-wide">
                Lesson {lesson.order} of 3
              </p>
              <h1 className="kid-heading text-5xl md:text-6xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-kid-blue-700 to-kid-purple-700">
                {lesson.title}
              </h1>
            </div>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
            {lesson.description}
          </p>
        </motion.div>

        {/* Full Lesson Description */}
        {lesson.fullDescription && (
          <motion.div
            variants={itemVariants}
            className="rounded-3xl bg-white/80 backdrop-blur p-8 shadow-lg border-2 border-kid-blue-200 space-y-4"
          >
            <h2 className="text-3xl font-bold text-kid-blue-700 flex items-center gap-3">
              <span>📚</span> What You'll Learn
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {lesson.fullDescription}
            </p>
          </motion.div>
        )}

        {/* Sub-Lessons */}
        {lesson.subLessons && lesson.subLessons.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-3xl font-bold text-kid-blue-700 flex items-center gap-3">
              <span>🎯</span> Topics to Master
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {lesson.subLessons.map((subLesson: any, idx: number) => (
                <motion.div
                  key={subLesson.id}
                  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  className="rounded-2xl bg-white p-6 shadow-md border-l-4 border-kid-purple-500 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{["🔢", "➕", "⭐"][idx % 3]}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-kid-blue-700 mb-2">
                        {subLesson.title}
                      </h3>
                      <p className="text-gray-700 text-sm">
                        {subLesson.description}
                      </p>
                      {"content" in subLesson && subLesson.content && (
                        <p className="text-gray-600 text-sm italic mt-3 pl-3 border-l-2 border-kid-blue-300">
                          {subLesson.content}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Learning Tips */}
        <motion.div
          variants={itemVariants}
          className="rounded-3xl bg-gradient-to-r from-kid-yellow-100 to-orange-100 p-8 border-2 border-yellow-300 shadow-lg space-y-4"
        >
          <h3 className="text-3xl font-bold text-yellow-900 flex items-center gap-3">
            <span>💡</span> Tips for Success
          </h3>
          <ul className="space-y-3 text-yellow-900 text-lg">
            {[
              "Take your time - there's no rush",
              "Think through each problem carefully",
              "You need 90% to master this lesson",
              "If you don't pass, you can try again and again!",
              "Ask for help if you get stuck",
            ].map((tip, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 font-semibold"
              >
                <span className="text-2xl">✅</span> {tip}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Ready for Quiz Section */}
        <motion.div variants={itemVariants} className="space-y-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-3xl bg-gradient-to-r from-kid-blue-500 to-kid-purple-500 p-8 shadow-lg text-center"
          >
            <p className="text-white text-lg font-semibold mb-2">
              Ready to test your knowledge?
            </p>
            <Link
              href={`/lesson/${id}`}
              className="inline-block kid-button-success bg-white text-kid-blue-600 hover:bg-gray-100 text-2xl px-10 py-5 rounded-2xl font-bold shadow-lg transition-all"
            >
              Take the Quiz! 🚀
            </Link>
            <p className="text-white text-sm mt-4 font-semibold">
              ⏱️ 10 questions • 15-20 minutes
            </p>
          </motion.div>

          {/* Learning Path Info */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl bg-kid-blue-50 p-6 border-2 border-kid-blue-200 text-center"
          >
            <p className="text-gray-700 text-center font-semibold">
              <span className="text-2xl mr-2">🌟</span>
              This is <strong>{lesson.order === 1 ? "the first" : `lesson ${lesson.order}`}</strong> in your learning journey.
            </p>
            <p className="text-gray-600 mt-2">
              Master this strategy and unlock the next lesson!
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
