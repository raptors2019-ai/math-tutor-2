import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { tagErrors } from "@/lib/scoring/tagErrors";

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
    //   - "make-10" or "complement" -> sub-1-1 (Complements to 10)
    //   - "splitting" -> sub-1-2 (Splitting to Apply Make-10)
    // For lesson-2 (Doubles and Near-Doubles):
    //   - "double_*" -> sub-2-1 (Doubles)
    //   - "near_double_*" -> sub-2-2 (Near-Doubles)
    // For lesson-3 (Choosing Strategies):
    //   - any -> sub-3-1 (Strategy Selection)
    const subLessonMap: Record<string, string> = {
      // Lesson 1 (Make-10)
      "make-10": "sub-1-1",
      complement: "sub-1-1",
      "complement_miss": "sub-1-1",
      splitting: "sub-1-2",
      "make-10-splitting": "sub-1-2",
      // Lesson 2 (Doubles)
      "double_miss_low": "sub-2-1",
      "double_miss_high": "sub-2-1",
      "double_major_error": "sub-2-1",
      doubles: "sub-2-1",
      // Lesson 2 (Near-Doubles)
      "near_double_wrong_base": "sub-2-2",
      "near_double_wrong_double": "sub-2-2",
      "near_double_off": "sub-2-2",
      "near-double": "sub-2-2",
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
 * Recalculates error tags from the actual answers to get specific error patterns
 */
function analyzeErrorPatterns(responses: any[]): ErrorPattern[] {
  const patternMap = new Map<string, ErrorPattern>();

  responses.forEach((response) => {
    // Recalculate error tags for this response
    const errorTags = tagErrors(
      response.item.question,
      response.answer,
      response.item.answer
    );

    // Use the primary error tag, or fall back to strategy tag if no specific error
    const primaryTag =
      errorTags.length > 0
        ? errorTags[0] // Use first/most specific error tag
        : response.item.strategyTag || "general";

    if (!patternMap.has(primaryTag)) {
      patternMap.set(primaryTag, {
        tag: primaryTag,
        count: 0,
        examples: [],
      });
    }

    const pattern = patternMap.get(primaryTag)!;
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
      : lessonId === "lesson-2"
        ? 'The lesson is about "Doubles and Near-Doubles" - recognizing patterns like 6+6 and 6+7 to solve addition quickly.'
        : lessonId === "lesson-3"
          ? 'The lesson is about "Choosing Strategies" - deciding whether to use Make-10, Doubles, or Near-Doubles to solve addition.'
          : "The lesson is about a specific math strategy for addition.";

  const subLessonHint = recommendedSubLesson
    ? `\nThey should review the topic: "${recommendedSubLesson.title}"`
    : "";

  // Build error description with specific context
  const errorContext = getErrorTagDescription(topError.tag);

  return `You are a kindergarten math teacher providing encouragement and guidance to a student who didn't yet master a lesson.

${lessonContext}

The student got ${incorrectCount} questions wrong, with the most common issue being: ${errorContext}

Examples of what went wrong:
${examplesText}

${subLessonHint}

Write a warm, encouraging summary feedback (2-3 sentences, 50-80 words) that:
1. Acknowledges their effort positively
2. Identifies the SPECIFIC mistake they made (e.g., "it looks like you got double minus 1" not just "you got it wrong")
3. Gives ONE concrete, specific tip that directly addresses their mistake
4. Ends encouragingly

Use simple, kid-friendly language. No jargon.`;
}

/**
 * Get specific description of an error tag for AI prompt context
 */
function getErrorTagDescription(tag: string): string {
  const descriptions: Record<string, string> = {
    // Doubles errors
    "double_miss_low":
      'The student got the double answer minus 1. For example, on 6+6, they answered 11 instead of 12. They may have forgotten to count one.',
    "double_miss_high":
      'The student got the double answer plus 1. For example, on 6+6, they answered 13 instead of 12. They added one too many.',
    "double_major_error":
      "The student's answer is way off from the correct double. They may be confused about what doubling means.",

    // Near-double errors
    "near_double_wrong_base":
      "The student used the smaller number doubled instead of adding 1 to it. For example, on 6+7, they used 6+6 instead of adding 1 more.",
    "near_double_wrong_double":
      "The student used the larger number doubled instead of the smaller. For example, on 6+7, they got the answer for 7+7 instead.",
    "near_double_off":
      "The student tried the near-double strategy but was off by 1 in the final answer.",

    // Make-10 errors
    "complement_miss":
      "The student got the answer minus 1 or forgot the remainder after making 10. For example, on 8+5, they answered 12 instead of 13.",

    // Basic errors
    "incomplete_addition":
      "The student only wrote down one of the numbers instead of adding them both together.",
    "counting_error":
      "The student's answer is more than 2 away from the correct answer. They may have miscounted or confused the numbers.",
    "off_by_one":
      "The student's answer is exactly 1 away from the correct answer.",
    "commutative_confusion":
      "The student may be confused about whether the order of numbers matters in addition.",

    // Default
    general: "a specific aspect of addition strategies",
  };

  return (
    descriptions[tag] ||
    descriptions[tag.split("_")[0]] ||
    descriptions.general
  );
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
  // Tag-specific feedback tips
  const feedbackTips: Record<string, string> = {
    // Doubles specific feedback
    "double_miss_low":
      "When you double a number like 6+6, count all the fingers or dots carefully to make sure you count each group correctly!",
    "double_miss_high":
      "Remember: doubling means exactly twice the number. 6+6 is 12, not 13! Try using two equal groups and counting together.",
    "double_major_error":
      "Let's practice what doubling really means. 6+6 means two groups of 6. Try making two equal piles with counters or your fingers.",

    // Near-doubles feedback
    "near_double_wrong_base":
      "For 6+7, start with the double you know (6+6=12), then add 1 more! Near-doubles are always one more than a double.",
    "near_double_wrong_double":
      "Be careful to use the smaller number doubled! For 6+7, use 6+6, then add 1. Not 7+7!",
    "near_double_off":
      "You're using the right strategy! Just double-check your counting. Near-doubles = a double plus 1.",

    // Make-10 feedback
    "complement_miss":
      "When you make 10, don't forget the leftover numbers! Like 8+5: first make 10 (8+2), then add the 3 left over. That's 13!",

    // Basic errors
    "incomplete_addition":
      "Make sure you're adding BOTH numbers together. Don't forget one of them!",
    "counting_error":
      "Let's count more carefully together. Use your fingers, counters, or draw dots to help you see each number.",
    "off_by_one":
      "You're very close! Check your counting one more time. Maybe count on your fingers to double-check.",
    "commutative_confusion":
      "Remember: 5+3 and 3+5 both equal 8. The order doesn't matter in addition!",

    // Default
    general: "Review the strategy and try using counters, fingers, or drawing dots to help you visualize the problem.",
  };

  const tip =
    feedbackTips[topError.tag] ||
    feedbackTips[topError.tag.split("_")[0]] ||
    feedbackTips.general;

  const topicHint = recommendedSubLesson
    ? ` I recommend reviewing "${recommendedSubLesson.title}" to practice this more.`
    : "";

  return `Great effort on the quiz! 💪 You got ${incorrectCount} question${incorrectCount !== 1 ? "s" : ""} to work on. I noticed a pattern in your answers: ${getErrorTagDescription(topError.tag).toLowerCase()}

Here's my tip to help: ${tip}${topicHint} Keep practicing - you're making progress! 🌟`;
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
