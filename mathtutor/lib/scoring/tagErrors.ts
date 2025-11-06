/**
 * Error Tagging Engine - Rule-Based System
 *
 * Analyzes student answers to addition problems and assigns error tags
 * based on common misconceptions in K-1 math education.
 *
 * Tags are used for:
 * 1. Routing to OpenAI for feedback generation
 * 2. Tracking error patterns for remediation
 * 3. Determining which sub-lessons to suggest
 *
 * @param question - The question string (e.g., "7 + 3")
 * @param userAnswer - The student's answer
 * @param correctAnswer - The correct answer
 * @returns Array of error tags
 */

export function tagErrors(
  question: string,
  userAnswer: number,
  correctAnswer: number
): string[] {
  const tags: string[] = [];

  // If correct, return empty array (no errors)
  if (userAnswer === correctAnswer) {
    return tags;
  }

  // Extract numbers from question
  const numbers = question.match(/\d+/g);
  if (!numbers || numbers.length < 2) {
    return ["parse_error"];
  }

  const num1 = parseInt(numbers[0]);
  const num2 = parseInt(numbers[1]);
  const sum = num1 + num2;

  // Error Pattern 1: Complement Miss (Make-10 Strategy)
  // Student didn't use the make-10 strategy correctly
  // E.g., 8 + 5 = 12 (instead of 13) - they got 8+5-1
  // Also: 7 + 4 = 10 (instead of 11) - they made 10 but forgot remainder
  if (sum >= 10) {
    // Case 1: They got the answer - 1 (classic complement miss)
    if (userAnswer === sum - 1) {
      tags.push("complement_miss");
    }
    // Case 2: They got 10 exactly when sum should be > 10
    // (they made 10 but forgot to add the remainder)
    else if (userAnswer === 10 && sum > 10) {
      tags.push("complement_miss");
    }
  }

  // Error Pattern 2: Double Miss (Doubles Strategy)
  // For doubles like 5+5, 6+6, student got double-1 or double+1
  if (num1 === num2) {
    if (userAnswer === sum - 1) {
      tags.push("double_miss_low");
    } else if (userAnswer === sum + 1) {
      tags.push("double_miss_high");
    } else if (Math.abs(userAnswer - sum) > 2) {
      tags.push("double_major_error");
    }
  }

  // Error Pattern 3: Near-Double Confusion
  // For near-doubles like 5+6, 7+8, student used wrong double
  // E.g., 6 + 7 = 12 (used 6+6) instead of 13
  if (Math.abs(num1 - num2) === 1) {
    const smallerNum = Math.min(num1, num2);
    const doubleOfSmaller = smallerNum * 2;
    const doubleOfLarger = (smallerNum + 1) * 2;

    if (userAnswer === doubleOfSmaller) {
      tags.push("near_double_wrong_base");
    } else if (userAnswer === doubleOfLarger) {
      tags.push("near_double_wrong_double");
    } else if (userAnswer === doubleOfSmaller + 1) {
      tags.push("near_double_off");
    }
  }

  // Error Pattern 4: Incomplete Addition (forgot to add one number)
  // E.g., 7 + 3 = 7 (just wrote first number)
  if (userAnswer === num1 || userAnswer === num2) {
    tags.push("incomplete_addition");
  }

  // Error Pattern 5: Counting Error (off by more than 1-2)
  const difference = Math.abs(userAnswer - sum);
  if (difference > 2 && !tags.includes("double_major_error")) {
    tags.push("counting_error");
  }

  // Error Pattern 6: Off by One
  // E.g., 7 + 3 = 9 (instead of 10)
  if (difference === 1) {
    tags.push("off_by_one");
  }

  // Error Pattern 7: Commutative Confusion (for sums that use commutative property)
  // Less common but: thinking 8 + 2 = 2 + 8 has a different result
  if (userAnswer === num1 || userAnswer === num2) {
    tags.push("commutative_confusion");
  }

  return tags;
}

/**
 * Get strategy tag from question to help determine lesson affinity
 * @param question - The question string
 * @returns Strategy tag (make-10, doubles, near-doubles, etc.)
 */
export function getStrategyTag(question: string): string {
  const numbers = question.match(/\d+/g);
  if (!numbers || numbers.length < 2) return "unknown";

  const num1 = parseInt(numbers[0]);
  const num2 = parseInt(numbers[1]);

  // Doubles (5+5, 6+6, etc.)
  if (num1 === num2) {
    return "doubles";
  }

  // Near-doubles (5+6, 7+8, etc.)
  if (Math.abs(num1 - num2) === 1) {
    return "near-double";
  }

  // Make-10 (numbers that make 10: 7+3, 8+2, etc.)
  if (num1 + num2 === 10) {
    return "make-10";
  }

  // Complement to 10 (one number is 7-9, other is 1-3)
  if (
    (num1 >= 7 && num1 <= 9 && num2 >= 1 && num2 <= 3) ||
    (num2 >= 7 && num2 <= 9 && num1 >= 1 && num1 <= 3)
  ) {
    return "complement";
  }

  return "basic-addition";
}

/**
 * Determine if an error is critical (suggests fundamental gap)
 * vs. careless (off by one, counting slip)
 *
 * @param tags - Array of error tags
 * @returns Severity level: "critical" | "moderate" | "minor"
 */
export function getSeverity(
  tags: string[]
): "critical" | "moderate" | "minor" {
  if (tags.length === 0) return "minor";

  const criticalTags = [
    "incomplete_addition",
    "counting_error",
    "double_major_error",
  ];
  const moderateTags = [
    "complement_miss",
    "double_miss_low",
    "double_miss_high",
    "near_double_wrong_base",
  ];

  const hasCritical = tags.some((tag) => criticalTags.includes(tag));
  const hasModerate = tags.some((tag) => moderateTags.includes(tag));

  if (hasCritical) return "critical";
  if (hasModerate) return "moderate";
  return "minor";
}
