"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface LockedLessonPageProps {
  lessonNumber: number;
  requiredLessonNumber: number;
}

/**
 * LockedLessonPage - Shows when a lesson is not yet unlocked
 *
 * Displays a cool gated access screen with:
 * - Blurred background
 * - Animated lock icon
 * - Clear messaging about requirements
 * - Button to return to previous lesson
 */
export function LockedLessonPage({
  lessonNumber,
  requiredLessonNumber,
}: LockedLessonPageProps) {
  const router = useRouter();

  const handleReturn = () => {
    router.push(`/lesson-info/lesson-${requiredLessonNumber}`);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-kid-blue-50 to-kid-purple-100 backdrop-blur-sm"></div>

      {/* Animated Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            initial={{ opacity: 0.1, scale: 0 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.8,
            }}
            className="absolute w-32 h-32 bg-kid-purple-300 rounded-full blur-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          ></motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* Animated Lock Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.2,
          }}
          className="mb-8 flex justify-center"
        >
          <div className="text-8xl">🔒</div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="kid-heading text-4xl md:text-5xl mb-4 text-gray-800"
        >
          Lesson {lessonNumber} is Locked!
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed"
        >
          You need to complete <strong>Lesson {requiredLessonNumber}</strong> first before you can unlock this lesson!
        </motion.p>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="rounded-3xl bg-white/80 backdrop-blur-md p-8 mb-8 shadow-2xl border-2 border-kid-blue-200"
        >
          <p className="text-lg text-gray-700 mb-4">
            📚 Master Lesson {requiredLessonNumber} to unlock the next challenge!
          </p>
          <p className="text-md text-gray-600">
            You're on the right path - keep practicing and you'll get here soon! 🌟
          </p>
        </motion.div>

        {/* Return Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReturn}
          className="kid-button-primary py-4 px-8 text-xl font-bold rounded-2xl inline-block"
        >
          ← Return to Lesson {requiredLessonNumber} 📖
        </motion.button>
      </div>
    </div>
  );
}
