/**
 * Quiz Flow Unit Tests
 *
 * Tests for quiz initialization, answer submission, and completion flows.
 * Uses jest mocking for API calls.
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AnswerForm } from "../../../app/lesson/[id]/components/AnswerForm";

// Mock Clerk
jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: {
      id: "test-user-123",
    },
  }),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("AnswerForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test 1: Input validation - empty input
   */
  test("disables submit button when input is empty", () => {
    const mockSubmit = jest.fn();

    render(
      <AnswerForm
        question="6 + 4 = ?"
        onSubmit={mockSubmit}
        isSubmitting={false}
      />
    );

    const submitButton = screen.getByText(/Submit Answer/);
    // Button should be disabled when input is empty
    expect(submitButton).toBeDisabled();

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  /**
   * Test 2: Button disabled when no valid input
   * HTML number inputs don't accept non-numeric, so this tests empty state
   */
  test("disables button when input is not filled", () => {
    const mockSubmit = jest.fn();

    render(
      <AnswerForm
        question="6 + 4 = ?"
        onSubmit={mockSubmit}
        isSubmitting={false}
      />
    );

    const submitButton = screen.getByRole("button") as HTMLButtonElement;
    // Button should be disabled when empty
    expect(submitButton).toBeDisabled();

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  /**
   * Test 3: Input validation - out of range (> 20)
   */
  test("rejects answers greater than 20", () => {
    const mockSubmit = jest.fn();

    render(
      <AnswerForm
        question="6 + 4 = ?"
        onSubmit={mockSubmit}
        isSubmitting={false}
      />
    );

    const input = screen.getByPlaceholderText(/Type your answer/);
    fireEvent.change(input, { target: { value: "25" } });

    const submitButton = screen.getByText(/Submit Answer/);
    fireEvent.click(submitButton);

    expect(screen.getByText(/between 0 and 20/)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  /**
   * Test 4: Input validation - out of range (< 0)
   */
  test("rejects negative answers", () => {
    const mockSubmit = jest.fn();

    render(
      <AnswerForm
        question="6 + 4 = ?"
        onSubmit={mockSubmit}
        isSubmitting={false}
      />
    );

    const input = screen.getByPlaceholderText(/Type your answer/);
    fireEvent.change(input, { target: { value: "-5" } });

    const submitButton = screen.getByText(/Submit Answer/);
    fireEvent.click(submitButton);

    expect(screen.getByText(/between 0 and 20/)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  /**
   * Test 5: Valid answer submission
   */
  test("submits valid answer (0-20)", async () => {
    const mockSubmit = jest.fn(() => Promise.resolve());

    render(
      <AnswerForm
        question="6 + 4 = ?"
        onSubmit={mockSubmit}
        isSubmitting={false}
      />
    );

    const input = screen.getByPlaceholderText(/Type your answer/);
    fireEvent.change(input, { target: { value: "10" } });

    const submitButton = screen.getByText(/Submit Answer/);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(10);
    });
  });

  /**
   * Test 6: Enter key submits form
   */
  test("submits answer when Enter key is pressed", async () => {
    const mockSubmit = jest.fn(() => Promise.resolve());

    render(
      <AnswerForm
        question="6 + 4 = ?"
        onSubmit={mockSubmit}
        isSubmitting={false}
      />
    );

    const input = screen.getByPlaceholderText(/Type your answer/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "10" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(10);
    });
  });

  /**
   * Test 7: Button disabled while submitting or empty
   */
  test("disables button while submitting or input is empty", () => {
    const mockSubmit = jest.fn();

    const { rerender } = render(
      <AnswerForm
        question="6 + 4 = ?"
        onSubmit={mockSubmit}
        isSubmitting={false}
      />
    );

    // Button should be disabled when input is empty
    let submitButton = screen.getByRole("button") as HTMLButtonElement;
    expect(submitButton).toBeDisabled();

    // Fill input
    const input = screen.getByPlaceholderText(/Type your answer/);
    fireEvent.change(input, { target: { value: "10" } });

    // Button should now be enabled
    submitButton = screen.getByRole("button") as HTMLButtonElement;
    expect(submitButton).not.toBeDisabled();

    // Rerender with isSubmitting = true
    rerender(
      <AnswerForm
        question="6 + 4 = ?"
        onSubmit={mockSubmit}
        isSubmitting={true}
      />
    );

    submitButton = screen.getByRole("button") as HTMLButtonElement;
    expect(submitButton).toBeDisabled();
  });

  /**
   * Test 8: Error clears when user types new input
   */
  test("clears error message when user types new input", () => {
    const mockSubmit = jest.fn();

    render(
      <AnswerForm
        question="6 + 4 = ?"
        onSubmit={mockSubmit}
        isSubmitting={false}
      />
    );

    // Cause an error by typing invalid number then submitting
    const input = screen.getByPlaceholderText(/Type your answer/);
    fireEvent.change(input, { target: { value: "25" } });

    const submitButton = screen.getByText(/Submit Answer/);
    fireEvent.click(submitButton);

    // Error should appear
    expect(screen.getByText(/between 0 and 20/)).toBeInTheDocument();

    // Clear and type valid number
    fireEvent.change(input, { target: { value: "10" } });

    // Error should be gone
    expect(screen.queryByText(/between 0 and 20/)).not.toBeInTheDocument();
  });

  /**
   * Test 9: Valid edge cases (0 and 20)
   */
  test("accepts edge case answers (0 and 20)", async () => {
    const mockSubmit = jest.fn(() => Promise.resolve());

    const { rerender } = render(
      <AnswerForm
        question="Test"
        onSubmit={mockSubmit}
        isSubmitting={false}
      />
    );

    // Test with 0
    let input = screen.getByPlaceholderText(/Type your answer/);
    fireEvent.change(input, { target: { value: "0" } });
    let submitButton = screen.getByText(/Submit Answer/);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(0);
    });

    // Rerender for test with 20
    jest.clearAllMocks();
    mockSubmit.mockClear();

    rerender(
      <AnswerForm
        question="Test"
        onSubmit={mockSubmit}
        isSubmitting={false}
      />
    );

    input = screen.getByPlaceholderText(/Type your answer/);
    fireEvent.change(input, { target: { value: "20" } });
    submitButton = screen.getByText(/Submit Answer/);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(20);
    });
  });
});
