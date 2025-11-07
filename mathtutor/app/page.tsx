'use client';

import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/user");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch {
        // User not logged in
      } finally {
        setIsLoaded(true);
      }
    };

    loadUser();
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-kid-blue-50 via-kid-purple-50 to-kid-pink-50">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-6xl"
        >
          🎓
        </motion.div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-kid-blue-50 via-kid-purple-50 to-kid-pink-50 px-4">
        {/* Decorative animated elements */}
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 left-10 text-7xl opacity-20"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-32 right-10 text-7xl opacity-20"
        >
          🌟
        </motion.div>

        <div className="flex min-h-screen flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl"
          >
            {/* Welcome Message */}
            <motion.div className="mb-4 text-7xl">👋</motion.div>
            <h1 className="mb-2 text-5xl md:text-6xl font-black text-gradient bg-gradient-to-r from-kid-blue-700 to-kid-purple-700 bg-clip-text text-transparent">
              Welcome back!
            </h1>
            <p className="mb-2 text-2xl font-bold text-kid-blue-700">
              {user.firstName}
            </p>
            <p className="mb-8 text-xl text-gray-700">
              Ready for your next challenge? 🚀
            </p>

            {/* Motivational box */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mb-12 rounded-3xl bg-gradient-to-r from-kid-green-100 to-kid-blue-100 p-6 border-2 border-kid-green-300"
            >
              <p className="text-lg font-bold text-kid-green-800">
                Keep up that amazing learning streak! 🎯
              </p>
            </motion.div>

            {/* Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                href="/dashboard"
                className="block rounded-full bg-gradient-to-r from-kid-blue-500 to-kid-purple-500 px-12 py-5 text-2xl font-bold text-white shadow-lg hover:shadow-xl transition-shadow"
              >
                Go to Dashboard 📚
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-kid-blue-50 via-kid-purple-50 to-kid-pink-50 px-4">
      {/* Animated background elements */}
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-32 left-20 text-8xl opacity-10"
      >
        📚
      </motion.div>
      <motion.div
        animate={{ y: [0, -30, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-20 right-20 text-8xl opacity-10"
      >
        🎯
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/2 right-10 text-7xl opacity-5"
      >
        ✨
      </motion.div>

      <div className="flex min-h-screen flex-col items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl"
        >
          {/* Main emoji and title */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-6 text-9xl"
          >
            🎓
          </motion.div>

          <h1 className="mb-4 text-6xl md:text-7xl font-black bg-gradient-to-r from-kid-blue-700 via-kid-purple-600 to-kid-pink-600 bg-clip-text text-transparent">
            Math Master Academy
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-3 text-2xl font-bold text-kid-blue-700"
          >
            🚀 Learn addition facts the fun way!
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-10 text-lg text-gray-700"
          >
            Master 3 amazing strategies and become an addition expert
          </motion.p>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mb-12 grid grid-cols-3 gap-4 md:gap-6 max-w-lg mx-auto"
          >
            {[
              { icon: "🎯", text: "10 Questions" },
              { icon: "🏆", text: "Master Level" },
              { icon: "⚡", text: "Quick Sessions" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, y: -5 }}
                className="rounded-2xl bg-white p-4 shadow-md border-2 border-kid-purple-200"
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <p className="text-sm font-bold text-gray-700">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Auth buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center items-center"
          >
            <SignUpButton fallbackRedirectUrl="/dashboard" mode="modal">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-kid-purple-500 to-kid-pink-500 px-10 py-4 text-2xl font-bold text-white shadow-lg hover:shadow-xl transition-shadow"
              >
                Get Started Now 🚀
              </motion.button>
            </SignUpButton>

            <SignInButton fallbackRedirectUrl="/dashboard" mode="modal">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto rounded-full bg-white px-10 py-4 text-2xl font-bold text-kid-blue-600 border-3 border-kid-blue-500 shadow-lg hover:shadow-xl transition-shadow hover:bg-kid-blue-50"
              >
                Sign In 📖
              </motion.button>
            </SignInButton>
          </motion.div>

          {/* Bottom tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-12 text-sm text-gray-600 font-semibold"
          >
            ✨ Join thousands of kids learning faster! ✨
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
