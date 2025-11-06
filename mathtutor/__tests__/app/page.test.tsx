import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

// Mock Clerk
jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(() => Promise.resolve(null)),
}));

jest.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sign-in-button">{children}</div>
  ),
  SignUpButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sign-up-button">{children}</div>
  ),
}));

describe("HomePage", () => {
  it("displays welcome message when user is not signed in", async () => {
    render(await HomePage());
    expect(screen.getByText(/Welcome to Math Tutor/i)).toBeInTheDocument();
  });

  it("displays sign in and sign up buttons", async () => {
    render(await HomePage());
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  it("displays kid-friendly messaging", async () => {
    render(await HomePage());
    expect(
      screen.getByText(/Learn addition facts the fun way/i)
    ).toBeInTheDocument();
  });
});
