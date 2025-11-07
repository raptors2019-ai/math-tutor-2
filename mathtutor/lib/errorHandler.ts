/**
 * Error Handler Utilities
 *
 * Provides centralized error handling and toast notifications
 * Handles common API errors with user-friendly messages
 */

import toast from "react-hot-toast";

/**
 * Handle API errors and return user-friendly message
 *
 * PATTERN: Match existing error handling in API routes
 * - Checks for specific error codes (401, 404, 500)
 * - Provides helpful messages for common failures
 * - Falls back to generic message if unknown
 *
 * @param error - The error object (can be Error, Response, or unknown)
 * @returns User-friendly error message string
 */
export function handleApiError(error: unknown): string {
  // If it's a Response object (from fetch)
  if (error instanceof Response) {
    if (error.status === 401) {
      return "You need to sign in to continue";
    }
    if (error.status === 404) {
      return "This lesson or resource was not found";
    }
    if (error.status === 429) {
      return "Too many requests - please wait a moment and try again";
    }
    if (error.status >= 500) {
      return "Server error - our team has been notified. Please try again";
    }
  }

  // If it's an Error object
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Network errors
    if (message.includes("fetch") || message.includes("network")) {
      return "Network error - please check your connection and try again";
    }

    // Timeout errors
    if (message.includes("timeout")) {
      return "Request timed out - please try again";
    }

    // JSON parse errors
    if (message.includes("json")) {
      return "Server returned invalid data - please try again";
    }

    // Return the original error message if it's helpful
    if (error.message.length > 5 && error.message.length < 200) {
      return error.message;
    }
  }

  // Fallback for unknown errors
  return "Something went wrong. Please try again.";
}

/**
 * Show error toast notification
 *
 * @param message - Error message to display
 * @param duration - Duration in milliseconds (default 4000)
 * @returns void
 */
export function showErrorToast(
  message: string,
  duration: number = 4000
): void {
  toast.error(message, {
    duration,
    position: "top-center",
  });
}

/**
 * Show success toast notification
 *
 * @param message - Success message to display
 * @param duration - Duration in milliseconds (default 3000)
 * @returns void
 */
export function showSuccessToast(
  message: string,
  duration: number = 3000
): void {
  toast.success(message, {
    duration,
    position: "top-center",
  });
}

/**
 * Show loading/promise toast
 * Useful for async operations where you want to show status
 *
 * @param promise - Promise to track
 * @param messages - Object with loading, success, and error messages
 * @returns Promise
 */
export function showPromiseToast<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
): Promise<T> {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
}

/**
 * Handle and display API error in one call
 * Combines error handling and toast notification
 *
 * @param error - The error to handle
 * @param customMessage - Optional custom message to use instead of generated one
 * @returns void
 */
export function handleAndShowError(
  error: unknown,
  customMessage?: string
): void {
  const message = customMessage || handleApiError(error);
  showErrorToast(message);
}
