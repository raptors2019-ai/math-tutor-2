import { generateFeedback, clearFeedbackCache, getCacheSize } from "@/lib/scoring/generateFeedback";

// Mock OpenAI
jest.mock("openai", () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: "Great effort! Let's try counting on our fingers.",
              },
            },
          ],
        }),
      },
    },
  }));
});

describe("generateFeedback", () => {
  beforeEach(() => {
    clearFeedbackCache();
    // Clear the mock
    jest.clearAllMocks();
  });

  describe("Fallback Behavior", () => {
    it("should return fallback feedback for complement_miss when OpenAI unavailable", async () => {
      // Temporarily remove API key
      const originalKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const feedback = await generateFeedback("8 + 5", 12, 13, [
        "complement_miss",
      ]);

      expect(feedback).toContain("Great effort!");
      expect(feedback.length).toBeLessThan(200); // Reasonable length

      // Restore
      process.env.OPENAI_API_KEY = originalKey;
    });

    it("should return fallback for double_miss_low", async () => {
      const originalKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const feedback = await generateFeedback("5 + 5", 9, 10, ["double_miss_low"]);

      expect(feedback).toContain("Great effort!");

      process.env.OPENAI_API_KEY = originalKey;
    });

    it("should return fallback for incomplete_addition", async () => {
      const originalKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const feedback = await generateFeedback("7 + 3", 7, 10, [
        "incomplete_addition",
      ]);

      expect(feedback).toContain("BOTH");

      process.env.OPENAI_API_KEY = originalKey;
    });

    it("should return fallback for counting_error", async () => {
      const originalKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const feedback = await generateFeedback("6 + 5", 2, 11, ["counting_error"]);

      expect(feedback).toContain("Great effort!");

      process.env.OPENAI_API_KEY = originalKey;
    });

    it("should return fallback for off_by_one", async () => {
      const originalKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const feedback = await generateFeedback("7 + 3", 9, 10, ["off_by_one"]);

      expect(feedback).toContain("Almost");

      process.env.OPENAI_API_KEY = originalKey;
    });
  });

  describe("Caching", () => {
    it("should cache feedback for the same question+tags", async () => {
      const originalKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      clearFeedbackCache();
      expect(getCacheSize()).toBe(0);

      const feedback1 = await generateFeedback("8 + 5", 12, 13, [
        "complement_miss",
      ]);
      expect(getCacheSize()).toBe(1);

      const feedback2 = await generateFeedback("8 + 5", 12, 13, [
        "complement_miss",
      ]);

      // Should be identical (from cache)
      expect(feedback1).toBe(feedback2);
      // Cache should still have only 1 entry
      expect(getCacheSize()).toBe(1);

      process.env.OPENAI_API_KEY = originalKey;
    });

    it("should not cache across different question+tags", async () => {
      const originalKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      clearFeedbackCache();

      await generateFeedback("8 + 5", 12, 13, ["complement_miss"]);
      await generateFeedback("8 + 5", 12, 13, ["double_miss_low"]);
      await generateFeedback("7 + 3", 9, 10, ["off_by_one"]);

      expect(getCacheSize()).toBe(3);

      process.env.OPENAI_API_KEY = originalKey;
    });
  });

  describe("Feedback Length & Quality", () => {
    it("should return reasonable length feedback", async () => {
      const originalKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const feedback = await generateFeedback("8 + 5", 12, 13, [
        "complement_miss",
      ]);

      // Feedback should be encouraging
      expect(feedback.toLowerCase()).toContain("great");
      // Reasonable length (not empty, not huge)
      expect(feedback.length).toBeGreaterThan(10);
      expect(feedback.length).toBeLessThan(300);

      process.env.OPENAI_API_KEY = originalKey;
    });

    it("should handle multiple error tags", async () => {
      const originalKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const feedback = await generateFeedback("8 + 5", 8, 13, [
        "incomplete_addition",
        "complement_miss",
      ]);

      expect(feedback).toBeTruthy();
      expect(feedback.length > 0).toBe(true);

      process.env.OPENAI_API_KEY = originalKey;
    });

    it("should handle empty tags with fallback", async () => {
      const originalKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      const feedback = await generateFeedback("8 + 5", 13, 13, []);

      expect(feedback).toBeTruthy();
      expect(feedback.length > 0).toBe(true);

      process.env.OPENAI_API_KEY = originalKey;
    });
  });

  describe("Cache Clearing", () => {
    it("should clear the cache completely", async () => {
      const originalKey = process.env.OPENAI_API_KEY;
      delete process.env.OPENAI_API_KEY;

      await generateFeedback("8 + 5", 12, 13, ["complement_miss"]);
      expect(getCacheSize()).toBe(1);

      clearFeedbackCache();
      expect(getCacheSize()).toBe(0);

      process.env.OPENAI_API_KEY = originalKey;
    });
  });
});
