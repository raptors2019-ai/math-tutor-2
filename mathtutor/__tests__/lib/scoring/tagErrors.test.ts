import { tagErrors, getStrategyTag, getSeverity } from "@/lib/scoring/tagErrors";

describe("tagErrors", () => {
  describe("Correct Answers", () => {
    it("should return empty array for correct answer", () => {
      const tags = tagErrors("7 + 3", 10, 10);
      expect(tags).toHaveLength(0);
    });

    it("should return empty array for any correct addition", () => {
      const tags = tagErrors("8 + 5", 13, 13);
      expect(tags).toHaveLength(0);
    });
  });

  describe("Complement Miss (Make-10)", () => {
    it("should tag complement_miss for 8 + 5 = 12 (should be 13)", () => {
      const tags = tagErrors("8 + 5", 12, 13);
      expect(tags).toContain("complement_miss");
    });

    it("should tag complement_miss for 7 + 4 = 10 (should be 11)", () => {
      const tags = tagErrors("7 + 4", 10, 11);
      expect(tags).toContain("complement_miss");
    });

    it("should tag complement_miss for 9 + 3 = 11 (should be 12)", () => {
      const tags = tagErrors("9 + 3", 11, 12);
      expect(tags).toContain("complement_miss");
    });
  });

  describe("Double Errors", () => {
    it("should tag double_miss_low for 5 + 5 = 9 (should be 10)", () => {
      const tags = tagErrors("5 + 5", 9, 10);
      expect(tags).toContain("double_miss_low");
    });

    it("should tag double_miss_high for 6 + 6 = 13 (should be 12)", () => {
      const tags = tagErrors("6 + 6", 13, 12);
      expect(tags).toContain("double_miss_high");
    });

    it("should tag double_major_error for 7 + 7 = 10 (should be 14)", () => {
      const tags = tagErrors("7 + 7", 10, 14);
      expect(tags).toContain("double_major_error");
    });
  });

  describe("Near-Double Errors", () => {
    it("should tag near_double_wrong_base for 6 + 7 = 12 (used 6+6)", () => {
      const tags = tagErrors("6 + 7", 12, 13);
      expect(tags).toContain("near_double_wrong_base");
    });

    it("should tag near_double_off for 6 + 7 = 12.5 analogue (off by small amount)", () => {
      const tags = tagErrors("5 + 6", 10, 11);
      expect(tags.length > 0).toBe(true);
    });

    it("should tag near_double errors for 7 + 8 problems", () => {
      const tags = tagErrors("7 + 8", 14, 15);
      expect(tags.length > 0).toBe(true);
    });
  });

  describe("Incomplete Addition", () => {
    it("should tag incomplete_addition when student just writes first number", () => {
      const tags = tagErrors("7 + 3", 7, 10);
      expect(tags).toContain("incomplete_addition");
    });

    it("should tag incomplete_addition when student just writes second number", () => {
      const tags = tagErrors("8 + 4", 4, 12);
      expect(tags).toContain("incomplete_addition");
    });

    it("should tag incomplete_addition for 9 + 2 = 9", () => {
      const tags = tagErrors("9 + 2", 9, 11);
      expect(tags).toContain("incomplete_addition");
    });
  });

  describe("Counting Errors", () => {
    it("should tag counting_error for answers off by more than 2", () => {
      const tags = tagErrors("7 + 3", 6, 10);
      expect(tags).toContain("counting_error");
    });

    it("should tag counting_error for 5 + 4 = 1", () => {
      const tags = tagErrors("5 + 4", 1, 9);
      expect(tags).toContain("counting_error");
    });

    it("should tag counting_error for wildly wrong answers", () => {
      const tags = tagErrors("8 + 5", 3, 13);
      expect(tags).toContain("counting_error");
    });
  });

  describe("Off by One", () => {
    it("should tag off_by_one for 7 + 3 = 9 (should be 10)", () => {
      const tags = tagErrors("7 + 3", 9, 10);
      expect(tags).toContain("off_by_one");
    });

    it("should tag off_by_one for 6 + 5 = 12 (should be 11)", () => {
      const tags = tagErrors("6 + 5", 12, 11);
      expect(tags).toContain("off_by_one");
    });
  });

  describe("Multiple Tags", () => {
    it("can have multiple error tags", () => {
      const tags = tagErrors("8 + 5", 8, 13);
      expect(tags.length).toBeGreaterThan(0);
      expect(tags).toContain("incomplete_addition");
    });
  });
});

describe("getStrategyTag", () => {
  it("should identify doubles strategy", () => {
    expect(getStrategyTag("5 + 5")).toBe("doubles");
    expect(getStrategyTag("7 + 7")).toBe("doubles");
  });

  it("should identify near-doubles strategy", () => {
    expect(getStrategyTag("5 + 6")).toBe("near-double");
    expect(getStrategyTag("7 + 8")).toBe("near-double");
  });

  it("should identify make-10 strategy", () => {
    expect(getStrategyTag("7 + 3")).toBe("make-10");
    expect(getStrategyTag("8 + 2")).toBe("make-10");
  });

  it("should identify complement strategy", () => {
    expect(getStrategyTag("8 + 1")).toBe("complement");
    expect(getStrategyTag("9 + 2")).toBe("complement");
  });

  it("should identify basic addition", () => {
    expect(getStrategyTag("4 + 2")).toBe("basic-addition");
    expect(getStrategyTag("3 + 1")).toBe("basic-addition");
  });
});

describe("getSeverity", () => {
  it("should return minor for off-by-one errors", () => {
    const tags = ["off_by_one"];
    expect(getSeverity(tags)).toBe("minor");
  });

  it("should return moderate for double misses", () => {
    const tags = ["double_miss_low"];
    expect(getSeverity(tags)).toBe("moderate");
  });

  it("should return critical for incomplete addition", () => {
    const tags = ["incomplete_addition"];
    expect(getSeverity(tags)).toBe("critical");
  });

  it("should return critical when any critical tag is present", () => {
    const tags = ["off_by_one", "incomplete_addition"];
    expect(getSeverity(tags)).toBe("critical");
  });

  it("should return minor for empty tags (correct answer)", () => {
    const tags: string[] = [];
    expect(getSeverity(tags)).toBe("minor");
  });
});
