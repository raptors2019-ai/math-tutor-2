## FEATURE:

Progression, Full Curriculum, and Completion in Math Tutor AI

This mini-project expands the app to support all 3 lessons (Make-10, Doubles & Near-Doubles, Choosing Strategies) by replicating the Lesson 1 UI structure for Lessons 2-3, implementing mastery-based unlocking, handling the full failure-to-remediation flow (failure → sub-lesson with AI tips → re-quiz), and adding a completion screen after Lesson 3. It uses Prisma to update user progress in the DB (e.g., mark lessons completed on 90% mastery) and conditional rendering for locked lessons. This completes the end-to-end user journey: sign up, progress through lessons with adaptive sub-lessons, and celebrate full curriculum completion, demonstrating the app's personalized tutoring loop.

Key outputs:

- UI for Lessons 2-3: Copied from Lesson 1 with adjusted content (fetched from DB/content.json).
- Unlocking logic: Check mastery via API/DB, enable next lesson on success.
- Full failure flow: On <90%, trigger sub-lesson (with drills/AI tips), then re-quiz until pass.
- Completion screen: After Lesson 3, show celebrations (e.g., badges, confetti) and "You've Finished!" message.

## EXAMPLES:

The `examples/` folder contains components and scripts to prototype progression and completion flows. These can be integrated into your app and tested with `npm run dev`, assuming prior mini-projects are complete.

1. **examples/progression-handler.tsx**: A React component that checks and updates lesson progress, rendering locked/unlocked states. Example: Fetches user progress from /api/progress and conditionally shows "Lesson 2: Locked" or an "Start" button. Useful for testing unlocking without full DB setup.

2. **examples/sub-lesson-flow.ts**: A script simulating the failure → sub-lesson → re-quiz loop. Example: Mocks a failed quiz, selects a sub-lesson based on tags, runs 3-5 diagnostic items, then triggers a mini re-quiz. Run with `tsx` to validate logic before UI integration.

3. **examples/completion-screen.tsx**: A stub component for the post-Lesson 3 view with celebrations. Example: Displays "Congrats! You've Mastered All Lessons!" with confetti, a summary of achievements, and a "Share Your Badge" button. Test by importing to see animations.

4. **examples/mastery-update.ts**: A Prisma script to mock updating progress in the DB. Example: On simulated mastery, sets `completedLessons` JSON to include "L1" and checks unlocking for L2. Helps debug DB interactions.

These examples are self-contained—run or import them to test isolated parts of the progression flow, ensuring smooth integration with existing Lesson 1 UI and APIs.

## DOCUMENTATION:

The following resources are key for this mini-project, focusing on state management, conditional UI, and DB updates. Reference them for scaling the single-lesson UI to full progression.

- **Next.js Dynamic Routing and Conditional Rendering**: For replicating /lesson/[id] across lessons (https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes). State guide for progress (https://react.dev/reference/react/useContext).

- **Prisma Updates and Transactions**: For marking lessons complete (https://www.prisma.io/docs/concepts/components/prisma-client/crud#updating-records). JSON fields for arrays like completedLessons (https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields).

- **React Confetti and Framer Motion**: For completion celebrations (https://www.npmjs.com/package/react-confetti) and animations (https://www.framer.com/motion/).

- **Clerk User Metadata**: If extending progress with Clerk (https://clerk.com/docs/references/nextjs/use-user), for syncing DB updates.

## OTHER CONSIDERATIONS:

- **Progress Consistency**: Use optimistic UI updates (e.g., show "Unlocked!" immediately, then confirm with Prisma). Handle race conditions with transactions. Gotcha: AI assistants often ignore offline scenarios—add local storage fallback for progress if DB fails.

- **Sub-Lesson Flow Details**: Ensure re-quiz after sub-lesson uses a shorter session (e.g., 5 questions) to avoid frustration. Pull content from DB dynamically. Gotcha: Infinite loops on repeated failures—cap retries at 2 and suggest "Ask a parent!".

- **Conditional Rendering Security**: Lock lessons client-side but verify on server (via /api/progress). Gotcha: Not validating unlocks server-side allows cheating—add checks in API routes.

- **Kid-Friendly Progression**: Use fun unlocks (e.g., animation when advancing) and motivational messages. Test full flow with mock failures. Gotcha: AIs might make UIs too similar—customize each lesson's theme (e.g., colors for Make-10 vs. Doubles).

- **Scope Guard**: Copy Lesson 1 code for 2-3, then add progression—test one full cycle before completion screen. If using AI tools like Claude, prompt with "Expand to Lessons 2-3 and progression only; reuse existing UI patterns." Commit: "feat: add full curriculum progression".
