## FEATURE:

Frontend UI for One Lesson in Math Tutor AI

This mini-project develops the interactive user interface for a single lesson (starting with Lesson 1: Make-10) in the Math Tutor AI app, including fetching questions from the backend, an input form for answers, real-time feedback display, and dedicated success/failure screens. It integrates with the API endpoints from Mini-Project 3 (/api/lesson/[id]/next, /api/score, /api/summary) to handle 10-question sessions, show celebrations (e.g., confetti on correct answers/success), and provide AI-generated tips on failures (tied to error tags). The UI is designed to be kid-friendly with colorful themes, large buttons, simple language, and engaging elements like emojis and animations. This creates a testable end-to-end flow for Lesson 1, focusing on usability for K-5 users while demonstrating personalized feedback and mastery progression. Curriculum content (e.g., Lesson 1 details like sub-lessons and examples) should be referenced from src/lib/content.json or Prisma-seeded DB records, loaded dynamically via API for modularity.

Key outputs:

- Dynamic /lesson/[id] page: Fetches and displays questions, handles submissions, shows immediate feedback.
- Success screen: Celebrations (confetti, badges) and "Continue to Next" button.
- Failure screen: AI-generated tips (e.g., "Nice try! Let's work on complements—here's why...") with "Try Sub-Lesson" or "Retry" options.
- Kid-friendly styling: Pastel colors, large tappable elements, responsive for mobile/tablet.

## EXAMPLES:

The `examples/` folder contains React components and page stubs to prototype the UI quickly. These can be copied into your src/app/ directory and tested with `npm run dev` (assuming backend APIs are mocked or running).

1. **examples/lesson-page.tsx**: A stub for the main lesson page, fetching a question and rendering an input form with submit button. Example: Uses React state to display "Q: 7 + 8 = ?" with a large text input and "Submit" button; on submit, shows mock feedback like "Great!" with confetti. Integrates Tailwind for kid-friendly styles (e.g., blue buttons, emoji icons).

2. **examples/success-screen.tsx**: A component for the post-quiz success view with celebrations. Example: Displays "You're a Master!" with react-confetti animation, progress stats, and a "Unlock Next Lesson" button. Test by importing into a page to see the visual effects.

3. **examples/failure-screen.tsx**: A stub for the failure view with AI tip placeholder. Example: Shows "Nice Try!" with generated tip (mocked as "Based on your errors, practice complements: 7 needs 3 to make 10."), error highlights, and "Start Sub-Lesson" button. Includes retry logic.

4. **examples/feedback-component.tsx**: A reusable component for real-time answer feedback. Example: Takes props like { correct: true, tip: "Yay! Fast work." } and renders green/red styling with emojis. Useful for testing integration with /api/score.

These examples are self-contained—import them into a test page (e.g., /test-lesson) and run the app to interact with mock quizzes, seeing how feedback and celebrations work before full backend hookup. For curriculum integration, reference src/lib/content.json in these stubs (e.g., pull Lesson 1 sub-lesson text for failure tips).

## DOCUMENTATION:

The following resources are essential for this mini-project, focusing on React components, API integration, and kid-friendly UX. Reference them for building responsive, engaging interfaces.

- **Next.js Pages and Data Fetching**: Guide for dynamic pages like /lesson/[id] (https://nextjs.org/docs/app/building-your-application/data-fetching). Use fetch or SWR for API calls (https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating).

- **React Confetti for Celebrations**: NPM package docs (https://www.npmjs.com/package/react-confetti). Quick integration for success animations.

- **Tailwind CSS Components**: For kid-friendly styling (https://tailwindcss.com/docs/installation). Reference UI patterns like buttons and cards (https://tailwindui.com/components) for large, colorful elements.

- **Framer Motion for Animations**: Simple animations for feedback (e.g., bounce on correct) (https://www.framer.com/motion/). Quickstart (https://www.framer.com/motion/introduction/).

- **OpenAI in Feedback Flow**: While backend handles AI, reference client-side calling if needed (https://platform.openai.com/docs/quickstart?context=node), but prefer server-side for security.

- **React Hot Toast for Notifications**: For subtle UX messages like "Loading question..." (https://react-hot-toast.com/).

- **Curriculum Content Reference**: Use src/lib/content.json for Lesson 1-3 details (e.g., sub-lesson text for failure screens). For DB-seeded versions, query via Prisma in API routes.

## OTHER CONSIDERATIONS:

- **API Integration Security**: Use Clerk's useUser hook on client-side to pass auth tokens in fetch headers. Handle loading/errors gracefully (e.g., skeletons for questions). Gotcha: AI assistants often forget optimistic updates—use React state for instant feedback before API confirms.

- **Kid-Friendly UX Details**: Prioritize accessibility (e.g., ARIA labels on buttons, keyboard navigation for inputs). Test touch inputs for large buttons. Gotcha: Overloading screens with text—use icons/emojis and short sentences; AIs might suggest dense UIs, but keep one focus per screen (e.g., question only).

- **State Management**: Use React Context or Zustand for session state (e.g., current question, score). Avoid global state for now. Gotcha: Not resetting state on lesson restart—add useEffect cleanup.

- **Performance/Testing**: Mock APIs with MSW for UI dev (https://mswjs.io/). Test flows: Correct path (success with confetti), failure (AI tip + sub-lesson prompt). Gotcha: Ignoring mobile—use Chrome DevTools to simulate devices early.

- **Scope Guard**: Build only for Lesson 1—hardcode if needed, then generalize. Incorporate Lesson 1-3 info from content.json (e.g., fetch sub-lesson text for failure tips via API). If using AI tools like Claude, prompt with "Implement UI for Lesson 1 only, integrate with existing APIs, focus on kid-friendly design." Commit: "feat: add lesson UI".
