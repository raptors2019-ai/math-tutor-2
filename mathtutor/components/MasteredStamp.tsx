"use client";

import { motion } from "framer-motion";

/**
 * MasteredStamp - Animated stamp that appears on completed lessons
 *
 * Features:
 * - Rotating stamp with golden glow
 * - Pulsing animation for emphasis
 * - Premium look with shadow effects
 */
export function MasteredStamp() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 12,
        delay: 0.3,
      }}
      className="absolute top-0 right-0 z-30"
    >
      {/* Outer glow effect */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 20px rgba(255, 215, 0, 0.4)",
            "0 0 40px rgba(255, 215, 0, 0.6)",
            "0 0 20px rgba(255, 215, 0, 0.4)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-28 h-28 rounded-full flex items-center justify-center"
      >
        {/* Stamp background */}
        <motion.div
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-24 h-24 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-600"
          style={{
            transform: "rotate(-15deg)",
          }}
        >
          {/* Inner shine */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent pointer-events-none"></div>

          {/* Text stamp */}
          <div className="text-center font-black select-none">
            <div className="text-yellow-700 text-xs tracking-widest">
              ⭐ MASTERED ⭐
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
