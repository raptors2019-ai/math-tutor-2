# Math Tutor AI

Math Tutor AI is a personalized edtech app that helps K-5 kids master addition facts through adaptive lessons, real-time feedback, and mastery-based progression. Built as a proof-of-concept for AI product management, it demonstrates one-on-one tutoring: sessions of 10 questions, 90% mastery to advance, and sub-lessons with AI-generated tips for errors. The app uses a curriculum of 3 lessons (Make-10, Doubles & Near-Doubles, Choosing Strategies), with error tagging for customization.

This project showcases full-stack development with Next.js, Clerk auth, Supabase/Prisma DB, and OpenAI for feedback.

## Features

- **User Authentication**: Secure sign-up/login via Clerk.
- **Progressive Curriculum**: 3 lessons with 15+ items each, unlocking on mastery.
- **Adaptive Sessions**: 10-question quizzes with non-repeating items, speed tracking, and tag-based scoring.
- **Personalized Feedback**: Rule-based tags (e.g., "complement_miss") trigger AI-generated tips on failures, plus sub-lessons for remediation.
- **Progress Tracking**: Dashboard shows lesson status; completion badges after all 3.
- **Kid-Friendly UI**: Simple, colorful design with celebrations (confetti on success).

## Tech Stack

- **Frontend/Backend**: Next.js (App Router) with React and Tailwind CSS.
- **Auth**: Clerk.
- **Database**: Supabase (Postgres) with Prisma ORM.
- **AI**: OpenAI API for dynamic feedback.
- **Other**: Nanoid for IDs, react-confetti for celebrations, framer-motion for animations.

## Setup Instructions

### Prerequisites
- Node.js 18+ (use nvm: `nvm install && nvm use`)
- npm or yarn

### Installation

1. **Install Dependencies**:
   ```bash
   cd math-tutor_v2/mathtutor
   npm install
   ```

2. **Configure Environment Variables**:
   Create `.env.local` with Clerk test keys (already provided):
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGVhcm5pbmctc2F3Zmx5LTExLmNsZXJrLmFjY291bnRzLmRldiQ
   CLERK_SECRET_KEY=sk_test_AImMiXKI6NJ43O7O7AJFxCclkESoss0UMCgLRpbe8R
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   App available at http://localhost:3000

4. **Test the App**:
   - Homepage: Shows welcome + Sign In/Sign Up buttons
   - Click Sign In: Redirects to Clerk sign-in modal
   - Sign in with test email: Redirected to /dashboard
   - Dashboard: Shows 3 lessons (first available, others locked)
   - Click "Start Lesson": Placeholder page with back button

### Validation

- **Type checking**: `npm run type-check` (should pass)
- **Linting**: `npm run lint` (should have no errors)
- **Testing**: `npm test` (should pass with 3 test cases)
- **Dev server**: `npm run dev` (should start cleanly)

## Running the App

- Sign up/login at /sign-up or /sign-in.
- Dashboard shows available lessons.
- Start a lesson, answer 10 questions—get feedback and summary.
- On failure (<90%), see AI tips and sub-lesson; on success, unlock next.
- Complete all 3 for a congrats screen.

## Development Plan

This app is built iteratively:

1. Setup and Planning (done: Next.js + env).
2. Auth and DB (Clerk + Supabase/Prisma).
3. Backend Logic (APIs for quizzes/scoring).
4. UI for One Lesson (interactive quiz + feedback).
5. Full Progression (Lessons 2-3 + completion).
6. Polish and Deploy (animations, tests, Vercel).

For details, see the project plan in docs/plan.md.

## Contributing

- Fork and PR improvements (e.g., more lessons, better AI prompts).
- Issues: Report bugs or suggest features (e.g., subtraction expansion).

## License

MIT License—feel free to use and adapt.

---

Built by Joshua Singarayer as an AI product management showcase. Questions? Reach out!
