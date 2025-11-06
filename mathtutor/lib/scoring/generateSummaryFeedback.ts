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
 * Summary feedback with recommended sub-lesson
 */
export interface SummaryFeedbackResult {
  feedback: string;
  recommendedSubLesson?: {
    id: string;
    title: string;
    description: string;
  };
}

/**
 * Generate personalized summary feedback based on quiz errors
 * Analyzes patterns and provides AI-generated guidance + recommended sub-lesson
 *
 * @param sessionId - The quiz session ID
 * @param lessonId - The lesson being attempted
 * @returns Object with personalized feedback and recommended sub-lesson
 */
export async function generateSummaryFeedback(
  sessionId: string,
  lessonId: string
): Promise<SummaryFeedbackResult> {
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
      return {
        feedback: "Great effort on this quiz! Keep practicing to master this strategy!",
      };
    }

    // Analyze error patterns
    const errorPatterns = analyzeErrorPatterns(responses);
    const topError = errorPatterns[0];
    const incorrectCount = responses.length;

    // Build context for AI
    const examplesText = responses
      .slice(0, 3)
      .map(
        (r) =>
          `"${r.item.question}" - you answered ${r.answer}, correct is ${r.item.answer}`
      )
      .join("\n");

    // Get recommended sub-lesson based on top error pattern
    const recommendedSubLesson = await getRecommendedSubLesson(
      lessonId,
      topError
    );

    // If no OpenAI, use fallback
    if (!process.env.OPENAI_API_KEY) {
      const feedback = getFallbackSummaryFeedback(
        incorrectCount,
        topError,
        examplesText,
        recommendedSubLesson
      );
      return {
        feedback,
        recommendedSubLesson,
      };
    }

    try {
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const prompt = buildSummaryPrompt(
        incorrectCount,
        topError,
        examplesText,
        lessonId,
        recommendedSubLesson
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
        getFallbackSummaryFeedback(
          incorrectCount,
          topError,
          examplesText,
          recommendedSubLesson
        );

      return {
        feedback,
        recommendedSubLesson,
      };
    } catch (error) {
      console.warn("[generateSummaryFeedback] OpenAI failed:", error);
      const feedback = getFallbackSummaryFeedback(
        incorrectCount,
        topError,
        examplesText,
        recommendedSubLesson
      );
      return {
        feedback,
        recommendedSubLesson,
      };
    }
  } catch (error) {
    console.error("[generateSummaryFeedback] Error:", error);
    return {
      feedback:
        "Great effort! Keep practicing and you'll master this strategy soon! 🌟",
    };
  }
}

/**
 * Find recommended sub-lesson based on error pattern
 */
async function getRecommendedSubLesson(
  lessonId: string,
  topError: ErrorPattern
): Promise<
  { id: string; title: string; description: string } | undefined
> {
  try {
    // Map error patterns to sub-lesson topics
    // For lesson-1 (Make-10):
    //   - "make-10" or "complement" -> sub-lesson-1-1 (Complements to 10)
    //   - "splitting" -> sub-lesson-1-2 (Splitting to Apply Make-10)
    const subLessonMap: Record<string, string> = {
      "make-10": "sub-1-1",
      complement: "sub-1-1",
      "complement_miss": "sub-1-1",
      splitting: "sub-1-2",
      "make-10-splitting": "sub-1-2",
    };

    // Get the mapped sub-lesson ID
    const tagKey = Object.keys(subLessonMap).find(
      (key) =>
        topError.tag.includes(key) || key === topError.tag.split("_")[0]
    );

    if (!tagKey) {
      // Default to first sub-lesson if no mapping found
      const firstSubLesson = await prisma.subLesson.findFirst({
        where: { lessonId },
        orderBy: { order: "asc" },
      });

      if (firstSubLesson) {
        return {
          id: firstSubLesson.id,
          title: firstSubLesson.title,
          description: firstSubLesson.description,
        };
      }
      return undefined;
    }

    const subLessonId = subLessonMap[tagKey];

    // Fetch the sub-lesson from database
    const subLesson = await prisma.subLesson.findUnique({
      where: { id: subLessonId },
    });

    if (subLesson) {
      return {
        id: subLesson.id,
        title: subLesson.title,
        description: subLesson.description,
      };
    }

    return undefined;
  } catch (error) {
    console.warn("[getRecommendedSubLesson] Error:", error);
    return undefined;
  }
}

/**
 * Analyze error patterns from responses
 */
function analyzeErrorPatterns(responses: any[]): ErrorPattern[] {
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
  lessonId: string,
  recommendedSubLesson?: { id: string; title: string; description: string }
): string {
  const lessonContext =
    lessonId === "lesson-1"
      ? 'The lesson is about "Making 10" - using complements and splitting numbers to solve addition.'
      : "The lesson is about a specific math strategy for addition.";

  const subLessonHint = recommendedSubLesson
    ? `\nThey should review the topic: "${recommendedSubLesson.title}"`
    : "";

  return `You are a kindergarten math teacher providing encouragement and guidance to a student who didn't yet master a lesson.

${lessonContext}

The student got ${incorrectCount} questions wrong, with the most common issue being related to: "${topError.tag}"

Examples of what went wrong:
${examplesText}

${subLessonHint}

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
  examplesText: string,
  recommendedSubLesson?: { id: string; title: string; description: string }
): string {
  const errorDescriptions: Record<string, string> = {
    "make-10": "understanding how to use the Make-10 strategy",
    complement: "finding complement pairs that make 10",
    "complement_miss": "finding numbers that make 10",
    splitting: "splitting numbers correctly",
    general: "solving these types of problems",
  };

  const errorDesc =
    errorDescriptions[topError.tag] ||
    errorDescriptions[topError.tag.split("_")[0]] ||
    errorDescriptions.general;

  const topicHint = recommendedSubLesson
    ? ` Try reviewing "${recommendedSubLesson.title}" to strengthen this skill.`
    : "";

  return `Great effort on the quiz! 💪 You got ${incorrectCount} question${incorrectCount !== 1 ? "s" : ""} to think about. I noticed you're working on ${errorDesc}. Try drawing a picture or using your fingers to help you see how the numbers break apart.${topicHint} Keep practicing - you're making progress! 🌟`;
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
