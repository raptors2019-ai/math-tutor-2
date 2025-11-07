import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma, disconnectPrisma } from "@/lib/prisma";
import {
  getSession,
  addResponse,
  isSessionComplete,
} from "@/lib/sessionManager";
import { tagErrors } from "@/lib/scoring/tagErrors";
import { generateFeedback } from "@/lib/scoring/generateFeedback";
/**
 * POST /api/session/answer
 *
 * Submit an answer to a quiz question
 * Scores the answer, tags errors, generates feedback
 */

const answerSchema = z.object({
  sessionId: z.string().min(1),
  itemId: z.string().min(1),
  userAnswer: z.number().int().min(0).max(20),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate request
    const body = await req.json();
    const { sessionId, itemId, userAnswer } = answerSchema.parse(body);

    // Get session from memory
    const session = getSession(userId);
    if (!session) {
      return NextResponse.json(
        { error: "No active session found" },
        { status: 400 }
      );
    }

    if (session.sessionId !== sessionId) {
      return NextResponse.json(
        { error: "Session ID mismatch" },
        { status: 400 }
      );
    }

    // Find the item in the session
    const item = session.items.find((i) => i.id === itemId);
    if (!item) {
      return NextResponse.json(
        { error: "Item not found in session" },
        { status: 400 }
      );
    }

    // Score the answer
    const isCorrect = userAnswer === item.answer;

    // Tag errors if incorrect
    const tags = isCorrect
      ? []
      : tagErrors(item.question, userAnswer, item.answer);

    // Generate feedback if incorrect
    let feedback = "Correct! Well done!";
    if (!isCorrect) {
      feedback = await generateFeedback(
        item.question,
        userAnswer,
        item.answer,
        tags
      );
    }

    // Add response to session
    addResponse(userId, itemId, userAnswer, isCorrect);

    // Create SessionResponse record in database
    await prisma.sessionResponse.create({
      data: {
        sessionId: session.sessionId,
        itemId: itemId,
        answer: userAnswer,
        isCorrect: isCorrect,
        timeMs: 0, // TODO: track from client
      },
    });

    // Check if session is now complete
    const complete = isSessionComplete(userId);
    const questionsRemaining = 10 - session.responses.length - 1; // -1 for the answer we just added

    return NextResponse.json(
      {
        itemId,
        correct: isCorrect,
        correctAnswer: item.answer,
        userAnswer,
        feedback,
        tags,
        questionsRemaining,
        sessionComplete: complete,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/session/answer]:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await disconnectPrisma();
  }
}
