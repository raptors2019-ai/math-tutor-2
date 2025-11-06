import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function HomePage() {
  const user = await currentUser();

  if (user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-kid-blue-50 to-kid-purple-50 px-4">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-kid-blue-700">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="mb-8 text-xl text-gray-600">Ready to master math?</p>
          <Link
            href="/dashboard"
            className="inline-block rounded-full bg-kid-blue-500 px-8 py-4 text-2xl font-bold text-white hover:bg-kid-blue-600 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-kid-blue-50 to-kid-purple-50 px-4">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-bold text-kid-blue-700">
          Welcome to Math Tutor! 🎓
        </h1>
        <p className="mb-4 text-xl text-gray-700">
          Learn addition facts the fun way
        </p>
        <p className="mb-8 text-lg text-gray-600">
          Sign in to get started, or create a new account
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <SignInButton fallbackRedirectUrl="/dashboard" mode="modal">
            <button className="w-full sm:w-auto rounded-full bg-kid-green-500 px-8 py-4 text-2xl font-bold text-white hover:bg-kid-green-600 transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton fallbackRedirectUrl="/dashboard" mode="modal">
            <button className="w-full sm:w-auto rounded-full bg-kid-purple-500 px-8 py-4 text-2xl font-bold text-white hover:bg-kid-purple-600 transition-colors">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}
