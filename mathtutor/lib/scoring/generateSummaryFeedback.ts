import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

/**
 * Error Pattern Analysis for Summary Feedback
 */
export interface ErrorPattern {
  tag: string;
  count: number;
  examples: Array<{
    question: string;
    userAnswer: number;
    correctAnswer: number;
  }>;
}

/**
 * Generate personalized summary feedback based on quiz errors
 * Analyzes patterns and provides AI-generated guidance
 *
 * @param sessionId - The quiz session ID
 * @param lessonId - The lesson being attempted
 * @returns Personalized feedback string with specific guidance
 */
export async function generateSummaryFeedback(
  sessionId: string,
  lessonId: string
): Promise<string> {
  try {
    // Get all incorrect responses for this session
    const responses = await prisma.sessionResponse.findMany({
      where: {
        sessionId,
        isCorrect: false,
      },
      include: {
        item: true,
      },
    });

    if (responses.length === 0) {
      return "Great effort on this quiz! Keep practicing to master this strategy!";
    }

    // Analyze error patterns
    const errorPatterns = analyzeErrorPatterns(responses);
    const topError = errorPatterns[0];
    const incorrectCount = responses.length;
    const topQuestion = responses[0];

    // Build context for AI
    const examplesText = responses
      .slice(0, 3)
      .map(
        (r) =>
          `"${r.item.question}" - you answered ${r.answer}, correct is ${r.item.answer}`
      )
      .join("\n");

    // If no OpenAI, use fallback
    if (!process.env.OPENAI_API_KEY) {
      return getFallbackSummaryFeedback(
        incorrectCount,
        topError,
        examplesText
      );
    }

    try {
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const prompt = buildSummaryPrompt(
        incorrectCount,
        topError,
        examplesText,
        lessonId
      );

      const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0.3,
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const feedback =
        completion.choices[0]?.message?.content ||
        getFallbackSummaryFeedback(incorrectCount, topError, examplesText);

      return feedback;
    } catch (error) {
      console.warn("[generateSummaryFeedback] OpenAI failed:", error);
      return getFallbackSummaryFeedback(
        incorrectCount,
        topError,
        examplesText
      );
    }
  } catch (error) {
    console.error("[generateSummaryFeedback] Error:", error);
    return "Great effort! Keep practicing and you'll master this strategy soon! 🌟";
  }
}

/**
 * Analyze error patterns from responses
 */
function analyzeErrorPatterns(
  responses: any[]
): ErrorPattern[] {
  const patternMap = new Map<string, ErrorPattern>();

  responses.forEach((response) => {
    const tags = response.item.strategyTag || "general";

    if (!patternMap.has(tags)) {
      patternMap.set(tags, {
        tag: tags,
        count: 0,
        examples: [],
      });
    }

    const pattern = patternMap.get(tags)!;
    pattern.count++;

    if (pattern.examples.length < 3) {
      pattern.examples.push({
        question: response.item.question,
        userAnswer: response.answer,
        correctAnswer: response.item.answer,
      });
    }
  });

  // Sort by frequency
  return Array.from(patternMap.values()).sort((a, b) => b.count - a.count);
}

/**
 * Build prompt for OpenAI
 */
function buildSummaryPrompt(
  incorrectCount: number,
  topError: ErrorPattern,
  examplesText: string,
  lessonId: string
): string {
  const lessonContext =
    lessonId === "lesson-1"
      ? 'The lesson is about "Making 10" - using complements and splitting numbers to solve addition.'
      : "The lesson is about a specific math strategy for addition.";

  return `You are a kindergarten math teacher providing encouragement and guidance to a student who didn't yet master a lesson.

${lessonContext}

The student got ${incorrectCount} questions wrong, with the most common issue being related to: "${topError.tag}"

Examples of what went wrong:
${examplesText}

Write a warm, encouraging summary feedback (2-3 sentences, 50-80 words) that:
1. Acknowledges their effort positively
2. Identifies the specific pattern they struggled with (focus on the strategy/technique, not just "you got it wrong")
3. Gives ONE concrete, specific tip for improvement
4. Ends encouragingly

Use simple, kid-friendly language. No jargon.`;
}

/**
 * Fallback feedback when OpenAI is unavailable
 */
function getFallbackSummaryFeedback(
  incorrectCount: number,
  topError: ErrorPattern,
  examplesText: string
): string {
  const errorDescriptions: Record<string, string> = {
    "make-10": "understanding how to use the Make-10 strategy",
    complement: "finding complement pairs that make 10",
    splitting: "splitting numbers correctly",
    general: "solving these types of problems",
  };

  const errorDesc =
    errorDescriptions[topError.tag] ||
    errorDescriptions[topError.tag.split("_")[0]] ||
    errorDescriptions.general;

  return `Great effort on the quiz! 💪 You got ${incorrectCount} question${incorrectCount !== 1 ? "s" : ""} to think about. I noticed you're working on ${errorDesc}. Try drawing a picture or using your fingers to help you see how the numbers break apart. Keep practicing - you're making progress! 🌟`;
}

/**
 * Get error pattern summary for debugging
 */
export function getErrorPatternSummary(patterns: ErrorPattern[]): string {
  return patterns
    .map(
      (p) =>
        `${p.tag}: ${p.count} errors (${(p.examples.length > 0 ? p.examples[0].question : "")})`
    )
    .join(" | ");
}
