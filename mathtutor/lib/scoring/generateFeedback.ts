import OpenAI from "openai";

/**
 * OpenAI Feedback Generator
 *
 * Generates kid-friendly feedback tips for incorrect answers using OpenAI.
 * Uses caching to reduce API costs for common error patterns.
 * Always provides a fallback template if OpenAI fails.
 */

// In-memory cache for feedback responses
// Key: `${question}:${tags.join(",")}`, Value: feedback text
const feedbackCache = new Map<string, string>();

/**
 * Generate kid-friendly feedback for an incorrect answer
 *
 * @param question - The math question (e.g., "8 + 5")
 * @param userAnswer - The student's incorrect answer
 * @param correctAnswer - The correct answer
 * @param tags - Error tags from tagErrors function
 * @returns Feedback string (< 50 words, encouraging)
 */
export async function generateFeedback(
  question: string,
  userAnswer: number,
  correctAnswer: number,
  tags: string[]
): Promise<string> {
  // Check cache first
  const cacheKey = `${question}:${tags.join(",")}`;
  if (feedbackCache.has(cacheKey)) {
    return feedbackCache.get(cacheKey)!;
  }

  // If no OpenAI key, use fallback
  if (!process.env.OPENAI_API_KEY) {
    const feedback = getFallbackFeedback(question, userAnswer, correctAnswer, tags);
    feedbackCache.set(cacheKey, feedback);
    return feedback;
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const primaryTag = tags[0] || "general_error";
    const prompt = buildPrompt(question, userAnswer, correctAnswer, primaryTag);

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.2, // Low temp for consistency
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const feedback =
      completion.choices[0]?.message?.content ||
      getFallbackFeedback(question, userAnswer, correctAnswer, tags);

    // Store in cache
    feedbackCache.set(cacheKey, feedback);
    return feedback;
  } catch (error) {
    console.warn("[generateFeedback] OpenAI failed, using fallback:", error);
    const feedback = getFallbackFeedback(question, userAnswer, correctAnswer, tags);
    feedbackCache.set(cacheKey, feedback);
    return feedback;
  }
}

/**
 * Build the prompt for OpenAI based on error tag
 *
 * @param question - The math question
 * @param userAnswer - The student's answer
 * @param correctAnswer - The correct answer
 * @param primaryTag - The main error tag
 * @returns Prompt string
 */
function buildPrompt(
  question: string,
  userAnswer: number,
  correctAnswer: number,
  primaryTag: string
): string {
  const basePrompt = `You are a kindergarten math tutor. A student solved "${question}" and got ${userAnswer} (the correct answer is ${correctAnswer}).

Error type: ${primaryTag}.

Generate ONLY a short, encouraging tip (under 50 words, kid-friendly language) to help them learn.
Start with "Great effort!" and suggest one visual strategy.
Do NOT explain the full solution - just guide them toward the strategy.`;

  // Customize prompts by error type
  switch (primaryTag) {
    case "complement_miss":
      return (
        basePrompt +
        `
Hint: The student might not have used the "Make 10" strategy. Suggest counting up to 10 first.`
      );

    case "double_miss_low":
    case "double_miss_high":
      return (
        basePrompt +
        `
Hint: The student might have miscounted their doubles. Suggest using fingers or drawing to double-check.`
      );

    case "near_double_wrong_base":
      return (
        basePrompt +
        `
Hint: The student might have used the wrong double. Suggest they start with the double, then add 1 more.`
      );

    case "incomplete_addition":
      return (
        basePrompt +
        `
Hint: The student may have only added one number. Remind them to add BOTH numbers.`
      );

    case "counting_error":
      return (
        basePrompt +
        `
Hint: The student's answer is too far off. Suggest counting on fingers or using manipulatives to recount.`
      );

    case "off_by_one":
      return (
        basePrompt +
        `
Hint: They're very close! Just off by one. Suggest recounting more slowly.`
      );

    default:
      return basePrompt;
  }
}

/**
 * Fallback feedback templates for when OpenAI is unavailable
 *
 * @param question - The math question
 * @param userAnswer - The student's answer
 * @param correctAnswer - The correct answer
 * @param tags - Error tags
 * @returns Fallback feedback string
 */
function getFallbackFeedback(
  question: string,
  userAnswer: number,
  correctAnswer: number,
  tags: string[]
): string {
  const primaryTag = tags[0] || "general_error";

  const templates: Record<string, string> = {
    complement_miss: `Great effort! Let's use the "Make 10" strategy. Break it into 10 + more.`,
    double_miss_low: `Great effort! Let's double-check by counting on our fingers.`,
    double_miss_high: `Great effort! Remember, when we double, we count by 2s. Try again!`,
    near_double_wrong_base: `Great effort! Start with the double, then add one more.`,
    incomplete_addition: `Great effort! Don't forget - we need to add BOTH numbers together.`,
    counting_error: `Great effort! Let's count more slowly using our fingers or blocks.`,
    off_by_one: `Almost there! You're just one away. Let's recount together.`,
    general_error: `Great effort! Let's try a different way to solve this problem.`,
  };

  return templates[primaryTag] || templates.general_error;
}

/**
 * Clear the feedback cache (useful for testing or when memory is a concern)
 */
export function clearFeedbackCache(): void {
  feedbackCache.clear();
}

/**
 * Get cache size for monitoring
 */
export function getCacheSize(): number {
  return feedbackCache.size;
}
