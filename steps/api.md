## FEATURE:

Backend Logic for Lessons and Scoring in Math Tutor AI

This mini-project implements the core server-side logic for the Math Tutor AI app, focusing on API endpoints to handle quiz sessions, scoring, summaries, and user progress. It creates dynamic routes for fetching questions (/api/lesson/[id]/next), submitting answers with feedback (/api/score), generating end-of-session summaries (/api/summary), and managing user progress (e.g., GET /api/progress to fetch completed lessons, POST /api/progress to update mastery). The logic includes rule-based error tagging (e.g., "complement_miss"), OpenAI-powered personalized feedback, session management (exactly 10 non-repeating questions per session), mastery checks (90% accuracy to pass), and sub-lesson triggering based on top error tags from attempts. This builds on the auth/DB foundation, using Prisma to query/store attempts and progress, ensuring adaptive tutoring for the 3-lesson curriculum (Make-10, Doubles & Near-Doubles, Choosing Strategies).

Key outputs:

- Functional API routes tested via Postman (e.g., start session, score answers, get summary, fetch/update progress).
- Scoring engine with tags and OpenAI integration for natural-language tips (e.g., "Try splitting like this: 7+ (3+5) = 15").
- Session logic: 10 questions, non-repeating items, 90% mastery gate.
- Sub-lesson handler: On failure, analyze tags and suggest/queue a matching sub-lesson.
- Progress endpoints: Secure APIs to read/write user data like completed lessons.

## EXAMPLES:

The `examples/` folder contains isolated scripts and stubs to test backend logic without the full app. These are runnable (e.g., via `node example.js` or Postman collections) and focus on key components like scoring and session flow.

1. **examples/score-handler.js**: A standalone Node script simulating the /api/score endpoint. Example: Takes mock input (prompt, userAnswer, strategy) and outputs { correct, tags, feedback } using rule-based tagging and a fake OpenAI call. Run it to test error scenarios, like tagging "near_doubles_confusion" for 7+8 answered as 14.

2. **examples/session-simulator.ts**: A TypeScript script that mocks a full 10-question session, pulling from content.json, scoring answers, and computing mastery/summary. Example: Simulates user inputs (some wrong), logs tags, and outputs a summary JSON with top errors and suggested sub-lesson. Useful for validating logic before API integration.

3. **examples/tag-rules.js**: A simple module exporting tagging functions (e.g., tagErrors(prompt, answer, userAnswer)). Example: Console script that runs test cases and prints tags/feedback. Helps debug rule-based scoring independently of OpenAI.

4. **examples/openai-feedback.ts**: A script integrating OpenAI to generate personalized tips from tags. Example: Prompt like "Generate kid-friendly tip for complement_miss with example 7+3" and logs the response. Requires your OPENAI_API_KEY; tests AI personalization in isolation.

5. **examples/progress-api.ts**: A stub for /api/progress endpoints, using mock Prisma to fetch/update user progress. Example: GET returns { completed: ["L1"] }; POST updates mastery. Test with Postman to simulate progress tracking.

These examples are self-contained—run them with `tsx` or Node to validate backend pieces before wiring into Next.js APIs.

## DOCUMENTATION:

The following resources are critical for this mini-project, emphasizing API development, AI integration, and data querying. Focus on security and error handling in guides.

- **Next.js API Routes Guide**: For creating dynamic endpoints like /api/lesson/[id]/next and /api/progress (https://nextjs.org/docs/api-routes/dynamic-routes). Reference auth protection with Clerk (https://clerk.com/docs/references/nextjs/use-user).

- **OpenAI Node.js SDK**: Quickstart for completions (https://platform.openai.com/docs/quickstart?context=node). Use GPT-3.5-turbo or 4o-mini for feedback generation (https://platform.openai.com/docs/guides/text-generation).

- **Prisma Querying and Mutations**: Guides for CRUD on models like Attempt and User progress (https://www.prisma.io/docs/concepts/components/prisma-client/crud). Aggregation for summaries (https://www.prisma.io/docs/concepts/components/prisma-client/aggregation-grouping-summarizing).

- **Postman for API Testing**: Collections for testing routes (https://learning.postman.com/docs/getting-started/sending-the-first-request/). Create a collection for session flow (next → score x10 → summary → progress update).

- **Error Tagging Best Practices**: While custom, reference math education resources like Khan Academy's error patterns (https://www.khanacademy.org/math/cc-1st-grade-math) for realistic tags.

## OTHER CONSIDERATIONS:

- **API Security**: Protect routes with Clerk middleware (e.g., require userId) to prevent unauthorized access. Validate inputs (e.g., Zod for body schemas) to avoid crashes from bad data. Gotcha: AI assistants often skip validation, leading to runtime errors—add try/catch in /score for OpenAI calls.

- **OpenAI Integration**: Use low-temperature (0.2) for consistent feedback; cache common responses to cut costs. Limit to 1 API call per failure. Gotcha: Over-relying on AI for scoring—keep tags rule-based; AIs might suggest full LLM dependency, but hybrid (rules + AI) is more reliable/cheap.

- **Session State**: Use in-memory for MVP (e.g., userId-keyed Map), but persist key data (attempts/progress) to Prisma for reloads. Handle mid-session logouts by saving progress. Gotcha: Forgetting to clear session on completion—add reset logic to avoid stale data.

- **Kid-Friendly Feedback**: Ensure AI prompts emphasize encouragement (e.g., "Great effort! Let's try..."). Test for age-appropriate language. Gotcha: AI-generated text can be too wordy—limit to 50 words and edit prompts accordingly.

- **Scope Guard**: Implement only for Lesson 1 first—test the full flow, then expand. If using AI tools like Claude, prompt with "Focus on backend APIs and logic only; no UI or advanced features." Commit: "feat: add lesson backend logic".
