/**
 * FeedbackDisplay Component
 *
 * Toast-like feedback notification that appears at the top while question remains visible.
 * Shows brief celebration/encouragement, then automatically advances to next question.
 * Includes Framer Motion animations and optional sound effects.
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FeedbackDisplayProps } from "../types";
import { useSoundSettings } from "@/lib/audio/useSoundSettings";

/**
 * FeedbackDisplay - Top toast notification for answer feedback
 *
 * PATTERN: Brief toast that auto-advances
 * - Shows 2 seconds for correct answers
 * - Shows 3 seconds for incorrect answers (to read correction)
 * - Auto-advances without button click
 * - Appears at top only, question stays visible
 *
 * @param correct - Whether answer was correct
 * @param feedback - Feedback message from backend
 * @param userAnswer - Student's answer
 * @param correctAnswer - Correct answer
 * @param tags - Error tags (for incorrect answers)
 * @param onNext - Callback when moving to next question
 * @param isLastQuestion - Whether this is the final question
 * @returns JSX element showing toast
 */
export function FeedbackDisplay({
  correct,
  feedback,
  correctAnswer,
  onNext,
}: FeedbackDisplayProps) {
  const [showToast, setShowToast] = useState(true);
  const { playSuccess, playError } = useSoundSettings();

  /**
   * Play sound and auto-advance after brief delay
   * Correct: 1.5 seconds (quick celebration)
   * Incorrect: 2 seconds (time to read the correct answer)
   */
  useEffect(() => {
    // Play sound on correct answer
    if (correct) {
      // Small delay to let animation start
      const soundTimer = setTimeout(() => {
        playSuccess();
      }, 100);
      return () => clearTimeout(soundTimer);
    } else {
      // Play error sound immediately
      playError();
    }
  }, [correct, playSuccess, playError]);

  /**
   * Auto-advance timer
   */
  useEffect(() => {
    const delay = correct ? 1500 : 2000;
    const timer = setTimeout(() => {
      setShowToast(false);
      onNext();
    }, delay);

    return () => clearTimeout(timer);
  }, [correct, onNext]);

  if (!showToast) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`rounded-2xl shadow-2xl p-4 max-w-md w-full pointer-events-auto ${
          correct
            ? "bg-linear-to-r from-kid-green-500 to-kid-green-600"
            : "bg-linear-to-r from-kid-yellow-500 to-orange-400"
        }`}
        initial={{ scaleY: correct ? 0.8 : 1, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
      >
        <div className="text-center">
          {/* Result Icon & Title */}
          <motion.div
            className="text-4xl mb-2"
            initial={{ scale: 0.5, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          >
            {correct ? "🎉" : "💪"}
          </motion.div>
          <h3 className="text-xl font-bold text-white mb-1">
            {correct ? "Correct!" : "Nice Try!"}
          </h3>

          {/* Brief feedback */}
          <p className="text-white text-sm font-semibold leading-relaxed">
            {feedback}
          </p>

          {/* Show correct answer if wrong */}
          {!correct && (
            <motion.div
              className="bg-white bg-opacity-95 rounded-lg p-2 mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <p className="text-xs text-gray-600 font-semibold">Answer:</p>
              <p className="text-xl font-bold text-kid-green-600">
                {correctAnswer}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
