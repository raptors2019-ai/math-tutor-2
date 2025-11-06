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

1. **Clone the Repo**: `git clone <your-repo-url> && cd mathtutor-app`.
2. **Install Dependencies**: `npm install`.
3. **Env Variables**: Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` (from Clerk dashboard).
   - `DATABASE_URL` (from Supabase).
   - `OPENAI_API_KEY` (from OpenAI).
4. **Database Setup**:
   - Run `npx prisma generate` and `npx prisma db push`.
   - Seed data: Run `npx prisma db seed` (add a seed.ts script with the curriculum JSON).
5. **Run Locally**: `npm run dev` — app at http://localhost:3000.

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
