/**
 * AnswerForm Component
 *
 * Input form for student answers with validation.
 * Accepts numeric input 0-20 and submits to parent component.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { AnswerFormProps } from "../types";

/**
 * AnswerForm - Input and submit for quiz answer
 *
 * CRITICAL: Validates answer is integer 0-20
 * - Handles keyboard (Enter key) and mouse submission
 * - Disables during submission
 * - Shows clear error states
 *
 * @param question - The question being answered
 * @param onSubmit - Callback with validated answer number
 * @param isSubmitting - Whether API call is in progress
 * @returns JSX element with input form
 */
export function AnswerForm({
  question,
  onSubmit,
  isSubmitting,
}: AnswerFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Auto-focus input field on mount and when question changes
   */
  useEffect(() => {
    inputRef.current?.focus();
  }, [question]);

  /**
   * Validate answer input
   * - Must be numeric
   * - Must be in range 0-20
   * - Returns error message if invalid, null if valid
   */
  const validateAnswer = (value: string): string | null => {
    if (!value.trim()) {
      return "Please enter a number";
    }

    const num = parseInt(value, 10);

    if (isNaN(num)) {
      return "Please enter a valid number";
    }

    if (num < 0 || num > 20) {
      return "Answer must be between 0 and 20";
    }

    return null;
  };

  /**
   * Handle form submission
   * PATTERN: Validate before calling parent's onSubmit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    const validationError = validateAnswer(inputValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Clear error and submit
    setError("");
    const answer = parseInt(inputValue, 10);

    try {
      await onSubmit(answer);
      // Clear input after successful submission
      setInputValue("");
    } catch (err) {
      // Error is handled by parent component
      setInputValue("");
    }
  };

  /**
   * Handle keyboard input (Enter key submits)
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSubmitting) {
      handleSubmit(e as any);
    }
  };

  /**
   * Handle input change
   * Clear error when user starts typing again
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (error) {
      setError("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4"
    >
      {/* Answer Input */}
      <div className="space-y-3">
        <label
          htmlFor="answer-input"
          className="block text-center text-lg font-semibold text-gray-700"
        >
          Your Answer:
        </label>
        <input
          ref={inputRef}
          id="answer-input"
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          placeholder="Type your answer..."
          className="w-full rounded-2xl border-4 border-kid-blue-300 bg-white px-6 py-4 text-center text-4xl font-bold text-kid-blue-700 placeholder-gray-400 focus:border-kid-blue-700 focus:outline-none focus:ring-4 focus:ring-kid-blue-200 disabled:bg-gray-100 disabled:text-gray-500 transition-all"
        />

        {/* Error Message */}
        {error && (
          <p className="text-center text-lg font-semibold text-red-600">
            ⚠️ {error}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || inputValue === ""}
        className="kid-button-primary w-full py-4 text-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
            Checking...
          </span>
        ) : (
          "Submit Answer ✓"
        )}
      </button>

      {/* Helper Text */}
      <p className="text-center text-sm text-gray-600">
        💡 Tip: You can press Enter to submit
      </p>
    </form>
  );
}
