## FEATURE:

Project Setup and Planning for Math Tutor AI

This mini-project establishes the foundational structure for the Math Tutor AI app, including a basic Next.js skeleton, environment configuration, initial page stubs, wireframe refinements, and data model documentation. It ensures a stable base for subsequent development, aligning with the app's goal of personalized addition tutoring across 3 lessons (Make-10, Doubles & Near-Doubles, Choosing Strategies). By the end, the app runs locally with basic navigation, styled components, and a documented plan for auth, DB, and features. This step emphasizes iterative planning to avoid rework, a kid-friendly UX.

Key outputs:

- Running Next.js app with Tailwind styling.
- Basic pages: Home (login prompt), Dashboard (lesson overview), Lesson stub (placeholder for quizzes).
- Documented data models in schema.prisma (for future Prisma/Supabase integration).
- Seeded content.json with 3 lessons and sub-lessons.

## EXAMPLES:

The `examples/` folder contains starter snippets and files to jumpstart setup and planning. These are minimal and can be copied into your src/ directory or used as references during development.

1. **examples/globals.css**: A basic Tailwind setup file with custom kid-friendly styles (e.g., bright colors, large fonts). Example: Defines classes like `.kid-button { @apply bg-blue-500 text-white py-4 px-6 rounded-lg text-2xl; }` for large, tappable buttons. Copy to src/app/globals.css and import in layout.tsx to see styled elements on your pages.

2. **examples/page.tsx**: A stub for the home page, including a welcome message and login button. Example: Uses Tailwind for a centered layout with "Welcome to Math Tutor!" header and a Clerk <SignInButton/>. Run it to test basic rendering and styling.

3. **examples/schema.prisma**: A starting Prisma schema with models for User, Lesson, SubLesson, Item, and Attempt. Example: Defines relationships like `model Lesson { subLessons SubLesson[] }`. Use this as a base for your schema.prisma file to visualize data structure before DB setup.

4. **examples/content.json**: Seed data for the 3 lessons, including items and sub-lessons. Example: JSON structure with Lesson 1 having 15 items and 2 sub-lessons (e.g., "Complements to 10" with diagnostic prompts). Import this in a seed script or API route to test curriculum loading.

These examples are self-contained—copy them into your project and run `npm run dev` to see them in action. They focus on quick wins for setup, like styling a button or seeding a lesson.

## DOCUMENTATION:

The following resources are key for this mini-project, focusing on setup, styling, and planning tools. Reference them for quickstarts and best practices.

- **Next.js Documentation**: Core guide for app structure, pages, and routing. Use the App Router section (https://nextjs.org/docs/app) for creating initial pages like home and dashboard. Also, env vars guide (https://nextjs.org/docs/app/building-your-application/configuring/environment-variables).

- **Tailwind CSS Quickstart**: Setup and configuration (https://tailwindcss.com/docs/installation). Reference utility classes for kid-friendly designs (e.g., responsive buttons: https://tailwindcss.com/docs/responsive-design).

- **Prisma Schema Basics**: Data modeling guide (https://www.prisma.io/docs/concepts/components/prisma-schema). For seeding, see the seeding docs (https://www.prisma.io/docs/guides/database/seed-database).

- **Git Basics**: If new to version control, GitHub guide (https://docs.github.com/en/get-started/quickstart/set-up-git) for committing after this mini-project.

- **Supabase Quickstart (Prep for Next Mini-Project)**: Database setup (https://supabase.com/docs/guides/getting-started) – review for schema.prisma compatibility.

## OTHER CONSIDERATIONS:

- **Env Var Security**: Never commit .env.local to Git (add to .gitignore). Use process.env for sensitive keys like OPENAI_API_KEY, and test loading them early (e.g., console.log in a page) to avoid runtime errors. Gotcha: AI assistants often forget to validate env vars, leading to "undefined" bugs—add a check in your layout.tsx.

- **Git Workflow**: Init a repo (`git init`) and commit at the end of this mini-project (e.g., "feat: initial setup and planning"). Branch for features (e.g., `git checkout -b setup`). Gotcha: Skipping Git early leads to lost work—commit often with messages like "add wireframes".

- **Kid-Friendly Defaults**: Use sans-serif fonts (e.g., Tailwind's font-sans) and pastel colors from the start to . Test on mobile early (Next.js is responsive, but add media queries). Gotcha: AIs might suggest complex UIs—keep it simple: one question per screen, large inputs.

- **Planning Artifacts**: Save refined wireframes as PNGs in a /docs folder and link in README. Wireframe is in project folder as "wireframe_mathtutor.png" doesn't need to be followed exactly was given roughly. Document any changes to data models here to avoid schema mismatches later. Gotcha: Over-planning stalls progress—aim for "good enough" and iterate in code.

- **Scope Creep Guard**: Stick to stubs (e.g., mock data for lessons) in this phase—don't code full logic yet. If using AI tools like Claude, prompt with "Implement only the setup steps, no advanced features."
