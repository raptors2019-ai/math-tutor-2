import { LessonItem } from "@prisma/client";

/**
 * Session Manager - In-Memory Quiz Session State
 *
 * Manages active quiz sessions for users.
 * Stores session state in memory with userId as key.
 * Session data is persisted to Prisma database for durability.
 *
 * Thread-safe for Node.js single-threaded model.
 */

export interface SessionState {
  sessionId: string;
  userId: string;
  lessonId: string;
  items: LessonItem[]; // 10 selected items
  responses: SessionResponse[]; // Answers submitted so far
  startedAt: Date;
  completedAt?: Date;
}

export interface SessionResponse {
  itemId: string;
  userAnswer: number;
  correct: boolean;
  isCorrect?: boolean;
}

// In-memory session storage: userId -> SessionState
const sessionMap = new Map<string, SessionState>();

/**
 * Create a new session
 *
 * @param sessionId - Unique session ID
 * @param userId - User's Clerk ID
 * @param lessonId - Lesson being attempted
 * @param items - 10 random LessonItems for this session
 * @returns SessionState
 */
export function createSession(
  sessionId: string,
  userId: string,
  lessonId: string,
  items: LessonItem[]
): SessionState {
  const session: SessionState = {
    sessionId,
    userId,
    lessonId,
    items,
    responses: [],
    startedAt: new Date(),
  };

  sessionMap.set(userId, session);
  return session;
}

/**
 * Get user's active session
 *
 * @param userId - User's Clerk ID
 * @returns SessionState or null if no active session
 */
export function getSession(userId: string): SessionState | null {
  return sessionMap.get(userId) || null;
}

/**
 * Add a response to the session
 *
 * @param userId - User's Clerk ID
 * @param itemId - Item being answered
 * @param userAnswer - Student's answer
 * @param correct - Whether the answer is correct
 * @returns true if response was added, false if session not found
 */
export function addResponse(
  userId: string,
  itemId: string,
  userAnswer: number,
  correct: boolean
): boolean {
  const session = sessionMap.get(userId);
  if (!session) return false;

  session.responses.push({
    itemId,
    userAnswer,
    correct,
    isCorrect: correct,
  });

  return true;
}

/**
 * Check if session is complete (10 responses received)
 *
 * @param userId - User's Clerk ID
 * @returns true if session has 10 responses
 */
export function isSessionComplete(userId: string): boolean {
  const session = sessionMap.get(userId);
  if (!session) return false;

  return session.responses.length >= 10;
}

/**
 * Get session statistics
 *
 * @param userId - User's Clerk ID
 * @returns Object with correct_count, total_count, mastery_score
 */
export function getSessionStats(userId: string): {
  correctCount: number;
  totalCount: number;
  masteryScore: number;
} {
  const session = sessionMap.get(userId);
  if (!session) {
    return { correctCount: 0, totalCount: 0, masteryScore: 0 };
  }

  const correctCount = session.responses.filter((r) => r.correct).length;
  const totalCount = session.responses.length;
  const masteryScore = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

  return {
    correctCount,
    totalCount,
    masteryScore,
  };
}

/**
 * Get responses for a session (for summarization)
 *
 * @param userId - User's Clerk ID
 * @returns Array of SessionResponse objects
 */
export function getResponses(userId: string): SessionResponse[] {
  const session = sessionMap.get(userId);
  return session?.responses || [];
}

/**
 * Complete and clear a session
 *
 * @param userId - User's Clerk ID
 * @returns SessionState (with completion timestamp) or null if not found
 */
export function completeSession(userId: string): SessionState | null {
  const session = sessionMap.get(userId);
  if (!session) return null;

  session.completedAt = new Date();
  const completedSession = { ...session };

  // Remove from active sessions
  sessionMap.delete(userId);

  return completedSession;
}

/**
 * Clear/cancel a session (for logout or timeout)
 *
 * @param userId - User's Clerk ID
 * @returns true if session was cleared, false if no session existed
 */
export function clearSession(userId: string): boolean {
  return sessionMap.delete(userId);
}

/**
 * Get all active sessions (for admin/debugging)
 *
 * @returns Array of active SessionStates
 */
export function getAllSessions(): SessionState[] {
  return Array.from(sessionMap.values());
}

/**
 * Get count of active sessions
 *
 * @returns Number of active sessions
 */
export function getActiveSessionCount(): number {
  return sessionMap.size;
}

/**
 * Clear all sessions (for testing or on server restart)
 */
export function clearAllSessions(): void {
  sessionMap.clear();
}
