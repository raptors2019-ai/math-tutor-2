'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

/**
 * Completion page - celebration screen after completing all 3 lessons.
 * Shows confetti, achievement badges, and share options.
 */
export default function CompletionPage() {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Handle resize
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Math Tutor AI',
          text: 'I just completed all 3 math lessons! 🎉',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(
        `I just completed all 3 math lessons! ${window.location.href}`
      );
      alert('Copied to clipboard!');
    }
  };

  // Confetti particles
  const confettiParticles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    emoji: ['🎉', '🎊', '✨', '⭐', '🌟', '🏆'][i % 6],
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
    xOffset: (Math.random() - 0.5) * 500,
    rotation: Math.random() * 360,
  }));

  const badges = [
    {
      emoji: '🎯',
      title: 'Make-10 Master',
      description: "You've learned the making 10 strategy!",
      gradient: 'from-yellow-100 to-orange-100',
      textColor: 'text-yellow-900',
    },
    {
      emoji: '🎲',
      title: 'Doubles Expert',
      description: "You've mastered doubles and near-doubles!",
      gradient: 'from-pink-100 to-purple-100',
      textColor: 'text-pink-900',
    },
    {
      emoji: '🔍',
      title: 'Strategy Detective',
      description: 'You can choose the right strategy every time!',
      gradient: 'from-blue-100 to-cyan-100',
      textColor: 'text-blue-900',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-kid-pink-400 via-kid-purple-300 to-kid-blue-500 px-4 py-8">
      {/* Animated Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confettiParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ y: -100, opacity: 1, rotate: 0, x: 0 }}
            animate={{
              y: windowSize.height + 100,
              opacity: 0,
              rotate: particle.rotation,
              x: particle.xOffset,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: 'easeIn',
            }}
            className="absolute text-5xl will-change-transform"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-50px',
            }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </div>

      {/* Background decorative elements */}
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-10 text-8xl opacity-20 pointer-events-none"
      >
        ✨
      </motion.div>
      <motion.div
        animate={{ y: [0, -30, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-20 right-10 text-8xl opacity-20 pointer-events-none"
      >
        ⭐
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Trophy */}
        <motion.div
          variants={itemVariants}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
          transition={{
            scale: { duration: 1, repeat: Infinity },
            rotate: { duration: 2, repeat: Infinity },
          }}
          className="text-9xl drop-shadow-2xl"
        >
          🏆
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants}>
          <motion.h1
            className="mb-4 text-7xl md:text-8xl font-black text-white drop-shadow-2xl"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            You Did It!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-4xl text-white drop-shadow-lg font-bold"
          >
            🎉 🎊 🎉
          </motion.p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="max-w-2xl text-3xl font-bold text-white drop-shadow-md"
        >
          You've Mastered All 3 Lessons!
        </motion.p>

        {/* Achievement Cards */}
        <motion.div
          variants={itemVariants}
          className="mx-auto max-w-2xl rounded-3xl bg-white/95 backdrop-blur p-10 shadow-2xl border-4 border-white/50 space-y-6"
        >
          <h2 className="text-center text-4xl font-black bg-gradient-to-r from-kid-blue-600 to-kid-purple-600 bg-clip-text text-transparent mb-8">
            Your Achievements 🌟
          </h2>

          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {badges.map((badge, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.05, translateY: -5 }}
                className={`flex items-center gap-6 rounded-2xl bg-gradient-to-r ${badge.gradient} p-6 border-2 border-white shadow-lg`}
              >
                <motion.span
                  animate={{ rotate: [0, 20, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                  className="text-6xl flex-shrink-0"
                >
                  {badge.emoji}
                </motion.span>
                <div className="text-left flex-1">
                  <p className={`text-2xl font-bold ${badge.textColor}`}>
                    {badge.title}
                  </p>
                  <p className={`text-sm font-semibold ${badge.textColor} opacity-80`}>
                    {badge.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={itemVariants}
          className="rounded-3xl bg-white/80 backdrop-blur p-8 shadow-xl max-w-2xl"
        >
          <p className="text-2xl font-bold text-kid-blue-700 mb-6">
            Final Stats
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Lessons', value: '3', emoji: '📚' },
              { label: 'Mastery', value: '100%', emoji: '⭐' },
              { label: 'Skills', value: '9', emoji: '🎯' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1 }}
                className="rounded-xl bg-gradient-to-br from-kid-blue-100 to-kid-purple-100 p-4 text-center"
              >
                <div className="text-3xl mb-2">{stat.emoji}</div>
                <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
                <p className="text-2xl font-bold text-kid-blue-700">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 sm:flex-row justify-center w-full"
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="rounded-full bg-white px-10 py-5 text-2xl font-bold text-kid-purple-600 shadow-lg hover:shadow-2xl transition-all"
          >
            Share Your Success 📱
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/dashboard')}
            className="rounded-full bg-white/80 px-10 py-5 text-2xl font-bold text-kid-purple-600 border-4 border-white shadow-lg hover:shadow-2xl hover:bg-white transition-all"
          >
            Back to Dashboard
          </motion.button>
        </motion.div>

        {/* Encouragement Message */}
        <motion.div
          variants={itemVariants}
          className="max-w-2xl text-center text-white drop-shadow-lg"
        >
          <p className="text-2xl font-bold mb-2">
            🌟 You're now a Math Master! 🌟
          </p>
          <p className="text-lg font-semibold opacity-90">
            You've shown incredible determination and skill. Keep practicing and you'll be unstoppable!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
