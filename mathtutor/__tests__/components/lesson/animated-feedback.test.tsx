/**
 * FeedbackDisplay Animated Component Tests
 *
 * Tests for animated feedback with Framer Motion and sound effects
 */

import { render, screen, waitFor } from "@testing-library/react";
import { FeedbackDisplay } from "@/app/lesson/[id]/components/FeedbackDisplay";

// Mock Framer Motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock sound settings
jest.mock("@/lib/audio/useSoundSettings", () => ({
  useSoundSettings: () => ({
    enabled: true,
    setEnabled: jest.fn(),
    playSuccess: jest.fn(),
    playError: jest.fn(),
    playWarning: jest.fn(),
    playCelebration: jest.fn(),
  }),
}));

describe("FeedbackDisplay Animated Component", () => {
  const defaultProps = {
    correct: true,
    feedback: "Great job! You got it right!",
    userAnswer: 10,
    correctAnswer: 10,
    tags: [],
    onNext: jest.fn(),
    isLastQuestion: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Correct Answer Display", () => {
    it("should render celebration emoji for correct answer", () => {
      render(<FeedbackDisplay {...defaultProps} correct={true} />);
      expect(screen.getByText("🎉")).toBeInTheDocument();
    });

    it("should show 'Correct!' heading for correct answer", () => {
      render(<FeedbackDisplay {...defaultProps} correct={true} />);
      expect(screen.getByText("Correct!")).toBeInTheDocument();
    });

    it("should display feedback message for correct answer", () => {
      const feedback = "Excellent work!";
      render(
        <FeedbackDisplay {...defaultProps} correct={true} feedback={feedback} />
      );
      expect(screen.getByText(feedback)).toBeInTheDocument();
    });

    it("should not show correct answer box when correct", () => {
      render(<FeedbackDisplay {...defaultProps} correct={true} />);
      // "Answer:" text should not appear for correct answers
      expect(screen.queryByText(/^Answer:$/)).not.toBeInTheDocument();
    });
  });

  describe("Incorrect Answer Display", () => {
    it("should render encouragement emoji for incorrect answer", () => {
      render(<FeedbackDisplay {...defaultProps} correct={false} />);
      expect(screen.getByText("💪")).toBeInTheDocument();
    });

    it("should show 'Nice Try!' heading for incorrect answer", () => {
      render(<FeedbackDisplay {...defaultProps} correct={false} />);
      expect(screen.getByText("Nice Try!")).toBeInTheDocument();
    });

    it("should display feedback message for incorrect answer", () => {
      const feedback = "Remember to count both numbers!";
      render(
        <FeedbackDisplay {...defaultProps} correct={false} feedback={feedback} />
      );
      expect(screen.getByText(feedback)).toBeInTheDocument();
    });

    it("should show correct answer box when incorrect", () => {
      const correctAnswer = 15;
      render(
        <FeedbackDisplay
          {...defaultProps}
          correct={false}
          correctAnswer={correctAnswer}
        />
      );
      expect(screen.getByText(/^Answer:$/)).toBeInTheDocument();
      expect(screen.getByText(correctAnswer.toString())).toBeInTheDocument();
    });
  });

  describe("Auto-advance Timing", () => {
    it("should auto-advance after 1.5 seconds for correct answer", async () => {
      const onNext = jest.fn();
      render(<FeedbackDisplay {...defaultProps} correct={true} onNext={onNext} />);

      expect(onNext).not.toHaveBeenCalled();

      // Fast-forward 1.5 seconds
      jest.advanceTimersByTime(1500);

      await waitFor(() => {
        expect(onNext).toHaveBeenCalledTimes(1);
      });
    });

    it("should auto-advance after 2 seconds for incorrect answer", async () => {
      const onNext = jest.fn();
      render(
        <FeedbackDisplay {...defaultProps} correct={false} onNext={onNext} />
      );

      expect(onNext).not.toHaveBeenCalled();

      // Fast-forward 2 seconds
      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(onNext).toHaveBeenCalledTimes(1);
      });
    });

    it("should not auto-advance before delay", async () => {
      const onNext = jest.fn();
      render(<FeedbackDisplay {...defaultProps} correct={true} onNext={onNext} />);

      // Advance only 500ms
      jest.advanceTimersByTime(500);

      expect(onNext).not.toHaveBeenCalled();
    });
  });

  describe("Sound Integration", () => {
    it("should not throw error when sound settings are unavailable", () => {
      expect(() =>
        render(<FeedbackDisplay {...defaultProps} correct={true} />)
      ).not.toThrow();
    });

    it("should render component even with sound disabled", () => {
      render(<FeedbackDisplay {...defaultProps} correct={true} />);
      expect(screen.getByText("Correct!")).toBeInTheDocument();
    });
  });

  describe("Props Changes", () => {
    it("should render different feedback messages", () => {
      const { rerender } = render(
        <FeedbackDisplay {...defaultProps} feedback="First message" />
      );

      expect(screen.getByText("First message")).toBeInTheDocument();

      rerender(
        <FeedbackDisplay
          {...defaultProps}
          feedback="Second message"
          onNext={() => {}}
        />
      );

      expect(screen.getByText("Second message")).toBeInTheDocument();
    });

    it("should handle correct answer number changes", () => {
      const { rerender } = render(
        <FeedbackDisplay {...defaultProps} correct={false} correctAnswer={10} />
      );

      expect(screen.getByText("10")).toBeInTheDocument();

      rerender(
        <FeedbackDisplay
          {...defaultProps}
          correct={false}
          correctAnswer={20}
          onNext={() => {}}
        />
      );

      expect(screen.getByText("20")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long feedback messages", () => {
      const longFeedback = "This is a very long feedback message ".repeat(5);
      render(
        <FeedbackDisplay {...defaultProps} feedback={longFeedback} correct={true} />
      );
      expect(screen.getByText(/This is a very long feedback message/)).toBeInTheDocument();
    });

    it("should handle zero as correct answer", () => {
      render(
        <FeedbackDisplay
          {...defaultProps}
          correct={false}
          correctAnswer={0}
        />
      );
      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("should handle large correct answer values", () => {
      render(
        <FeedbackDisplay
          {...defaultProps}
          correct={false}
          correctAnswer={20}
        />
      );
      expect(screen.getByText("20")).toBeInTheDocument();
    });
  });
});
