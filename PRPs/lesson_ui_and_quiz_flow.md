# PRP: Interactive Lesson UI & Quiz Flow

**Name:** Interactive Lesson Quiz Interface with Real-Time Feedback
**Status:** Ready for Implementation
**Confidence Score:** 9/10

---

## Goal

Replace the placeholder "Quiz coming soon" page at `/lesson/[id]` with a fully functional, kid-friendly interactive quiz interface that:

1. Fetches 10 random questions from the backend via `/api/session/start`
2. Displays questions one-at-a-time with an input form
3. Submits answers to `/api/session/answer` and displays immediate feedback
4. Tracks progress and shows a final results screen via `/api/session/complete`
5. Seamlessly handles loading, error states, and edge cases

**End State:** Users can click "Start Lesson" → complete 10 questions → see mastery score → unlock next lesson (if passed). All backed by the 4 API endpoints already implemented.

---

## Why

- **User Impact:** Kids see an engaging, responsive quiz interface instead of a placeholder
- **Integration:** Validates all backend API logic (session management, scoring, feedback generation)
- **Testing:** Enables end-to-end testing of the entire quiz flow without manual API calls
- **MVP Completion:** Lesson 1 becomes fully playable with question progression and feedback

---

## What

**User-Visible Behavior:**
- Quiz Loading: Show skeleton or spinner while fetching session
- Question Display: Large, centered question with kid-friendly styling
- Answer Input: Numeric input (0-20 range) with large buttons
- Feedback: Immediate "correct/incorrect" + feedback text + correct answer (if wrong)
- Progress Tracking: Show "Question X of 10" + progress bar
- Results Screen: Mastery score + pass/fail + next lesson unlock info + retry/home options
- Responsive: Works on mobile, tablet, desktop with touch-friendly inputs

**Technical Requirements:**
- React Client Component with `use client` directive
- Clerk authentication integration for user context
- State management using React hooks (useState, useEffect)
- Error boundary or try-catch for API failures
- Zod validation for API responses
- TypeScript for type safety
- Tailwind CSS for kid-friendly styling (matching existing theme)
- Proper loading/error UI states

---

## Success Criteria

- ✅ Quiz page loads and calls `/api/session/start` with lesson ID
- ✅ 10 questions display sequentially with question counter
- ✅ Answer submission calls `/api/session/answer` and shows feedback
- ✅ Final question completion triggers `/api/session/complete`
- ✅ Results screen displays mastery score, pass/fail status
- ✅ Next lesson unlock info shown if score >= 90%
- ✅ All error states handled gracefully (API failures, timeouts, network errors)
- ✅ Unit tests for quiz logic (loading, submission, completion)
- ✅ No TypeScript errors or ESLint warnings
- ✅ Mobile-responsive (tested via DevTools or physical device)

---

## All Needed Context

### MUST READ - Documentation & References

#### Curriculum Content
- **File:** `mathtutor/lib/content.json`
  - Why: Contains Lesson 1 "Making 10" with 12 quiz questions and 2 sub-lessons
  - Structure: Lessons → SubLessons → Items (questions with answers)
  - Content loaded by seed script (`prisma/seed.ts`) into database
  - Critical: Questions range from easy complements (6+4=10) to medium strategy problems (7+8=15)

#### Next.js and React Patterns
- **Next.js Dynamic Pages:** https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
  - Why: Implement `/lesson/[id]` page to receive lesson ID from URL params
- **Client Components & Hooks:** https://nextjs.org/docs/getting-started/react-essentials
  - Why: Quiz requires useState, useEffect for interactive state management
- **Data Fetching (Client-Side):** https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating
  - Why: Fetch quiz data from `/api/session/start` and subsequent endpoints
- **Clerk useUser Hook:** https://clerk.com/docs/references/react/use-user
  - Why: Get userId for API authentication context

#### Existing Codebase Patterns to Follow
- **API Routes Implemented:**
  - `/api/session/start` (POST): Start session, returns `{ sessionId, questions[], totalQuestions }`
  - `/api/session/answer` (POST): Submit answer, returns `{ correct, feedback, questionsRemaining, sessionComplete }`
  - `/api/session/complete` (POST): Finalize session, returns `{ masteryScore, passed, nextLessonUnlocked }`
  - See: `mathtutor/app/api/session/*/route.ts` and `mathtutor/app/api/progress/route.ts`

- **Styling & Theme:**
  - File: `mathtutor/app/globals.css`
  - Kid-Friendly Colors: `kid-blue-*`, `kid-green-*`, `kid-purple-*`, `kid-yellow-*`
  - Classes: `.kid-button-primary`, `.kid-button-success`, `.kid-heading`
  - Pattern: Use Tailwind with these custom utilities for consistent theming

- **Clerk Integration Example:**
  - File: `mathtutor/app/api/session/start/route.ts` (line 20-22)
  - Pattern: `const { userId } = await auth()` on server, check for authorization
  - Client-side: Use `useUser()` hook from `@clerk/nextjs` for user context

- **Error Tagging & Feedback:**
  - Files: `mathtutor/lib/scoring/tagErrors.ts`, `mathtutor/lib/scoring/generateFeedback.ts`
  - Already implemented: Errors are tagged and feedback is generated by backend
  - UI Just displays the `feedback` and `tags` returned from `/api/session/answer`

- **TypeScript Patterns:**
  - File: `mathtutor/app/lesson/[id]/page.tsx` (existing structure)
  - Pattern: Use `interface PageProps { params: Promise<{ id: string }> }`

### Current Codebase Tree (Relevant Files)

```
mathtutor/
├── app/
│   ├── lesson/[id]/
│   │   └── page.tsx (← REPLACE placeholder)
│   ├── api/session/
│   │   ├── start/route.ts (endpoint to fetch)
│   │   ├── answer/route.ts (endpoint to fetch)
│   │   └── complete/route.ts (endpoint to fetch)
│   ├── globals.css (kid-friendly styles)
│   └── layout.tsx (root layout with providers)
├── components/
│   └── LessonCard.tsx (existing component pattern)
├── lib/
│   ├── sessionManager.ts (session state types)
│   ├── scoring/
│   │   ├── tagErrors.ts
│   │   └── generateFeedback.ts
│   └── prisma.ts
└── __tests__/
    ├── app/ (test files follow folder structure)
    └── lib/ (utility test files)
```

### Desired Codebase Tree (New/Modified Files)

```
mathtutor/
├── app/lesson/[id]/
│   ├── page.tsx (MODIFY: Replace placeholder with Quiz component)
│   ├── components/
│   │   ├── QuizContainer.tsx (Main quiz logic & orchestration)
│   │   ├── QuestionDisplay.tsx (Display single question)
│   │   ├── AnswerForm.tsx (Input & submit button)
│   │   ├── FeedbackDisplay.tsx (Show feedback after answer)
│   │   ├── ResultsScreen.tsx (Final score & unlock info)
│   │   ├── LoadingState.tsx (Skeleton or spinner)
│   │   └── ErrorState.tsx (Error UI with retry)
│   └── types.ts (TypeScript interfaces for quiz)
├── __tests__/
│   └── app/lesson/
│       └── [id].test.tsx (Unit tests for quiz flow)
```

**File Responsibilities:**
- `page.tsx`: Server component that renders Quiz, passes lesson ID as prop
- `QuizContainer.tsx`: Main client component, manages quiz state, API calls
- `QuestionDisplay.tsx`: Presentational component for current question
- `AnswerForm.tsx`: Input form with submit, handles answer validation
- `FeedbackDisplay.tsx`: Shows "correct/incorrect" + feedback text
- `ResultsScreen.tsx`: Final results with mastery score + next lesson button
- `LoadingState.tsx`: Skeleton or spinner during API calls
- `ErrorState.tsx`: Error message with retry button
- `types.ts`: Quiz-related TypeScript interfaces

---

## Known Gotchas of Our Codebase & Library Quirks

1. **Clerk Auth on Client:** `useUser()` hook is async in suspense, wrap with Suspense boundary or use conditional rendering
   - Pattern: See existing dashboard if using auth
   - Fix: Check `useUser()?.id` before making API calls

2. **API Response Shape:** All `/api/session/*` endpoints return `NextResponse.json()`, so always `await response.json()`
   - Gotcha: Forgetting `.json()` = JSON parsing error
   - Pattern: See `mathtutor/app/api/session/start/route.ts` for exact response shape

3. **Session-Based State:** Session lives in server memory (sessionManager.ts) tied to userId
   - Critical: If server restarts, sessions are lost. For MVP, this is acceptable.
   - Pattern: sessionId is returned from `/api/session/start` and used for all subsequent calls

4. **Input Validation:** API expects `userAnswer` as integer 0-20 (see answerSchema in route.ts)
   - Gotcha: Strings passed to API will fail validation
   - Fix: Parse input as `parseInt(userInput, 10)` before POST

5. **Feedback Generation:** If OpenAI is unavailable, fallback feedback is returned automatically
   - No action needed, but feedback may be generic if API key missing
   - Check `.env.local` for `OPENAI_API_KEY`

6. **Kid-Friendly Styling:** Custom Tailwind classes defined in globals.css
   - Pattern: Use `.kid-button-primary`, `.kid-heading`, `bg-kid-blue-*`, etc.
   - Gotcha: Don't use raw Tailwind colors, stick to kid-* variants

7. **TypeScript Strict Mode:** Enabled in tsconfig.json
   - Pattern: Always type props and return values explicitly
   - Avoid: `any` type, non-null assertions (!)

8. **Error Handling in API Routes:** Routes use Zod for validation, throw ZodError on invalid input
   - Pattern: Catch and return `{ error, status: 400 }` on client side
   - See: `app/api/session/answer/route.ts` lines 108-121

---

## Implementation Blueprint

### Data Models & Type Safety

**Quiz-Related Types (in `app/lesson/[id]/types.ts`):**

```typescript
// Session initialization
export interface SessionStartResponse {
  sessionId: string;
  lessonId: string;
  lessonTitle: string;
  totalQuestions: number;
  questions: Question[];
}

export interface Question {
  itemId: string;
  question: string;
  order: number;
}

// Answer submission response
export interface AnswerResponse {
  itemId: string;
  correct: boolean;
  correctAnswer: number;
  userAnswer: number;
  feedback: string;
  tags: string[];
  questionsRemaining: number;
  sessionComplete: boolean;
}

// Session completion response
export interface SessionCompleteResponse {
  sessionId: string;
  correctCount: number;
  totalCount: number;
  masteryScore: number;
  passed: boolean;
  nextLessonUnlocked?: {
    id: string;
    title: string;
  };
  summary: {
    topErrors: string[];
    suggestedSubLesson?: {
      id: string;
      title: string;
      description: string;
    };
  };
}

// Quiz state
export interface QuizState {
  sessionId: string | null;
  lessonId: string;
  currentQuestionIndex: number;
  questions: Question[];
  totalQuestions: number;
  responses: Array<{
    itemId: string;
    answer: number;
    correct: boolean;
  }>;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  showFeedback: boolean;
  lastFeedback?: AnswerResponse;
  isComplete: boolean;
  results?: SessionCompleteResponse;
}
```

---

## Implementation Tasks (In Order)

### Task 1: Create Types File
**File:** `mathtutor/app/lesson/[id]/types.ts`
- Define all TypeScript interfaces above
- Export for use in components
- Include JSDoc comments for clarity

---

### Task 2: Create ErrorState Component
**File:** `mathtutor/app/lesson/[id]/components/ErrorState.tsx`

**Pseudocode:**
```typescript
interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  // PATTERN: Match LessonCard error styling
  // - Display error message in kid-friendly way
  // - Show "Try Again" button (kid-button-primary)
  // - Optional: Show back to dashboard link
  // - Use emoji for visual clarity (e.g., 😕)
}
```

---

### Task 3: Create LoadingState Component
**File:** `mathtutor/app/lesson/[id]/components/LoadingState.tsx`

**Pseudocode:**
```typescript
export function LoadingState() {
  // PATTERN: Simple skeleton or spinner
  // - Show large question placeholder
  // - Show input box placeholder
  // - Add pulsing animation via Tailwind (animate-pulse)
  // - Optionally show "Loading your quiz..." text
}
```

---

### Task 4: Create QuestionDisplay Component
**File:** `mathtutor/app/lesson/[id]/components/QuestionDisplay.tsx`

**Pseudocode:**
```typescript
interface QuestionDisplayProps {
  question: string;
  currentNumber: number;
  totalQuestions: number;
  masteryScore?: number;
}

export function QuestionDisplay({
  question,
  currentNumber,
  totalQuestions,
  masteryScore,
}: QuestionDisplayProps) {
  // PATTERN: Centered, large, kid-friendly
  // - Display "Question X of 10" at top
  // - Large emoji or icon (e.g., 🧮)
  // - Question text in large font (text-4xl)
  // - Use kid-blue colors for background
  // - Show progress bar (HTML <progress> or Tailwind)
  // - Match LessonCard styling for consistency
}
```

---

### Task 5: Create AnswerForm Component
**File:** `mathtutor/app/lesson/[id]/components/AnswerForm.tsx`

**Pseudocode:**
```typescript
interface AnswerFormProps {
  question: string;
  onSubmit: (answer: number) => Promise<void>;
  isSubmitting: boolean;
}

export function AnswerForm({
  question,
  onSubmit,
  isSubmitting,
}: AnswerFormProps) {
  // PATTERN: Kid-friendly form with large inputs
  // 1. Parse input as integer from textbox
  //    - CRITICAL: Validate range 0-20 before submit
  //    - Handle non-numeric input gracefully
  // 2. Disable submit button while submitting (isSubmitting)
  // 3. Show "Submit Answer" button (kid-button-primary)
  // 4. Use Tailwind for large, tappable buttons (min h-12, rounded-full)
  // 5. Handle Enter key press for submission (keyboard accessibility)
  // 6. Show loading state during submit (optional spinner)
}
```

---

### Task 6: Create FeedbackDisplay Component
**File:** `mathtutor/app/lesson/[id]/components/FeedbackDisplay.tsx`

**Pseudocode:**
```typescript
interface FeedbackDisplayProps {
  correct: boolean;
  feedback: string;
  userAnswer: number;
  correctAnswer: number;
  tags: string[];
  onNext: () => void;
  isLastQuestion: boolean;
}

export function FeedbackDisplay({
  correct,
  feedback,
  userAnswer,
  correctAnswer,
  tags,
  onNext,
  isLastQuestion,
}: FeedbackDisplayProps) {
  // PATTERN: Celebratory for correct, encouraging for incorrect
  // 1. If correct:
  //    - Show "🎉 Correct! Great Job!"
  //    - Use kid-green-500 background
  //    - Show encouraging feedback
  // 2. If incorrect:
  //    - Show "Try Again! You got [userAnswer], correct answer is [correctAnswer]"
  //    - Show AI-generated feedback
  //    - Use kid-pink-500 or yellow background
  // 3. Show "Next Question" button (or "Complete Quiz" if last)
  //    - CRITICAL: Only enable after 1-2 second delay (don't spam)
  // 4. Animate in with Framer Motion (bounce or slide)
  //    - Optional: Use CSS animation if Framer not preferred
}
```

---

### Task 7: Create ResultsScreen Component
**File:** `mathtutor/app/lesson/[id]/components/ResultsScreen.tsx`

**Pseudocode:**
```typescript
interface ResultsScreenProps {
  masteryScore: number;
  passed: boolean;
  correctCount: number;
  totalCount: number;
  nextLessonUnlocked?: {
    id: string;
    title: string;
  };
  onRetry: () => void;
  onHome: () => void;
}

export function ResultsScreen({
  masteryScore,
  passed,
  correctCount,
  totalCount,
  nextLessonUnlocked,
  onRetry,
  onHome,
}: ResultsScreenProps) {
  // PATTERN: Celebration or encouragement based on pass/fail
  // 1. If passed (masteryScore >= 90):
  //    - Show "🏆 Master! You Passed!" in big letters
  //    - Display score: "X out of Y correct!"
  //    - Show mastery percentage (90%, 100%, etc.)
  //    - Show next lesson unlock button if available
  //    - Optional: Confetti animation (react-confetti if added to package.json)
  // 2. If failed:
  //    - Show "💪 Nice Try! Keep Going!"
  //    - Display score
  //    - Show suggested sub-lesson (if available)
  //    - Show "Try Again" button
  // 3. Both cases:
  //    - Show "Back to Dashboard" button
  //    - Use kid-friendly colors and large fonts
}
```

---

### Task 8: Create QuizContainer (Main Component)
**File:** `mathtutor/app/lesson/[id]/components/QuizContainer.tsx`

**Pseudocode:**
```typescript
interface QuizContainerProps {
  lessonId: string;
}

export function QuizContainer({ lessonId }: QuizContainerProps) {
  "use client"; // CRITICAL: Client component

  // PATTERN: State management using useState + useEffect
  const [state, setState] = useState<QuizState>({ /* initial */ });
  const { user } = useUser(); // PATTERN: Clerk auth
  const router = useRouter(); // For navigation

  useEffect(() => {
    // CRITICAL: Only run once on mount
    // 1. Check user is authenticated (user?.id exists)
    // 2. Call POST /api/session/start with lessonId
    // 3. On success: Update state with questions and sessionId
    // 4. On error: Show error state
    // 5. Cleanup: Abort fetch on unmount
  }, []);

  const handleAnswerSubmit = async (answer: number) => {
    // CRITICAL: Validate answer is 0-20
    // 1. Set isSubmitting = true
    // 2. Call POST /api/session/answer with sessionId, itemId, answer
    // 3. On success:
    //    - Save response (correct, feedback, tags)
    //    - Show feedback display
    //    - If sessionComplete, call handleSessionComplete()
    //    - Otherwise, advance to next question after delay
    // 4. On error: Show error state with retry option
    // 5. Set isSubmitting = false
  };

  const handleSessionComplete = async () => {
    // 1. Call POST /api/session/complete with sessionId
    // 2. On success: Store results, show ResultsScreen
    // 3. On error: Show error state
  };

  const handleRetry = () => {
    // Reset all state and restart from beginning
    // Call handleSessionStart() (same as useEffect)
  };

  // PATTERN: Conditional rendering for quiz states
  if (state.isLoading) return <LoadingState />;
  if (state.error) return <ErrorState error={state.error} onRetry={...} />;
  if (state.isComplete && state.results) {
    return <ResultsScreen {...state.results} onRetry={handleRetry} onHome={...} />;
  }
  if (state.showFeedback) {
    return (
      <FeedbackDisplay
        {...state.lastFeedback}
        onNext={handleNextQuestion}
        isLastQuestion={state.currentQuestionIndex === state.totalQuestions - 1}
      />
    );
  }

  const currentQuestion = state.questions[state.currentQuestionIndex];
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-kid-blue-50 to-white">
      <QuestionDisplay
        question={currentQuestion?.question}
        currentNumber={state.currentQuestionIndex + 1}
        totalQuestions={state.totalQuestions}
      />
      <AnswerForm
        question={currentQuestion?.question}
        onSubmit={handleAnswerSubmit}
        isSubmitting={state.isSubmitting}
      />
    </div>
  );
}
```

---

### Task 9: Update page.tsx to Use QuizContainer
**File:** `mathtutor/app/lesson/[id]/page.tsx`

**Pseudocode:**
```typescript
interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;

  // PATTERN: Server component wraps client component
  // - Can use Suspense for async boundaries
  // - Pass lesson ID to QuizContainer

  return (
    <Suspense fallback={<LoadingState />}>
      <QuizContainer lessonId={id} />
    </Suspense>
  );
}
```

---

### Task 10: Create Unit Tests
**File:** `mathtutor/__tests__/app/lesson/[id].test.tsx`

**Pseudocode:**
```typescript
describe('Quiz Flow', () => {
  // PATTERN: Mock API calls using jest.mock

  test('loads session on mount', async () => {
    // Mock POST /api/session/start
    // Render QuizContainer with lessonId
    // Assert loading state appears, then questions render
  });

  test('submits answer and shows feedback', async () => {
    // Mock /api/session/answer
    // Fill answer input and submit
    // Assert feedback displays (correct/incorrect)
  });

  test('completes session after 10 questions', async () => {
    // Mock /api/session/start with 10 questions
    // Mock /api/session/answer for all 10 answers
    // Mock /api/session/complete
    // Submit 10 answers
    // Assert results screen appears
  });

  test('handles API error gracefully', async () => {
    // Mock /api/session/start to return 500
    // Render QuizContainer
    // Assert error state shows
    // Click retry
    // Assert retry calls API again
  });

  test('validates answer input range (0-20)', () => {
    // Try to submit invalid answers (-1, 21, "abc")
    // Assert error or ignored submission
  });

  test('shows progress bar and question counter', async () => {
    // Mock session with questions
    // Assert "Question X of Y" appears
    // Verify progress bar updates
  });
});
```

---

## Integration Points

### Database (Prisma)
- **No migrations needed:** Existing schema covers all quiz data
- **Usage:** Session, SessionResponse, UserProgress already created/updated by API routes
- **Note:** Quiz UI reads from API responses, doesn't write directly to DB
- **Curriculum Data:** Run `npm run prisma:seed` to populate database from `lib/content.json`
  - Lesson 1 "Making 10" is now in content.json with 12 questions and 2 sub-lessons
  - Seeding script is located at `prisma/seed.ts`
  - **IMPORTANT:** Seed MUST be run before testing quiz (populates database with lessons/questions)

### API Routes
- `/api/session/start`: Called on mount to load questions
- `/api/session/answer`: Called on every answer submission
- `/api/session/complete`: Called after 10th question
- **Error Handling:** All routes return JSON with `{ error, status }` on failure

### Environment Variables
- **Required:** `OPENAI_API_KEY` (for feedback generation, optional with fallback)
- **Existing in .env.local:** Database URL, Clerk keys already set up

### Clerk Authentication
- **Hook Used:** `useUser()` from `@clerk/nextjs`
- **Usage:** Get user ID for API context (already handled by API routes)
- **Gotcha:** useUser() may require Suspense boundary in Next.js 16

---

## Validation Loop

### Level 1: Syntax & Style (Required Before Proceeding)

```bash
# Run linting and type checking
npm run lint -- --fix
npx tsc --noEmit

# Expected: No errors
# If errors: Read message, fix code, re-run
```

### Level 2: Unit Tests (Test Each Task)

```bash
# Run tests
npm test -- --verbose

# Expected: All tests pass
# Test cases:
#   - Session loads correctly
#   - Answer submission works
#   - Feedback displays
#   - Session completion works
#   - Error handling works
#   - Input validation works
```

### Level 3: Integration Test (Manual Test)

```bash
# PREREQUISITE: Seed database with Lesson 1 content
npm run prisma:seed
# Expected output: "✅ Curriculum seeded successfully!" with summary

# Start dev server
npm run dev

# Test flow:
# 1. Navigate to http://localhost:3000/dashboard
# 2. Click "Start Lesson" on Lesson 1 (Make-10 Strategy)
# 3. Wait for questions to load (should see "Question 1 of 10" with real math question: "What is 6 + 4 = ?")
# 4. Enter an answer (e.g., "5") and click Submit
# 5. Verify feedback appears (correct/incorrect + feedback text)
# 6. Click "Next Question"
# 7. Repeat for all 10 questions
# 8. After 10th question, see results screen
# 9. Verify masteryScore displays (X/10 correct)
# 10. If passed (>= 90%), see "Next Lesson Unlocked" button
# 11. Click "Back to Dashboard" and verify lesson shows completed

# Success Indicators:
#   ✅ No console errors
#   ✅ All 10 questions load
#   ✅ Feedback appears correctly
#   ✅ Results screen shows accurate score
#   ✅ Responsive on mobile (use Chrome DevTools)
```

### Level 4: Error Handling Validation

```bash
# Test error scenarios:
# 1. Kill backend server, try to start quiz → See error state with retry
# 2. Submit invalid answer (< 0 or > 20) → Should validate on client
# 3. Slow network: Watch loading states appear/disappear
# 4. Session timeout (wait 5+ min) → Handle gracefully or prompt to restart
```

---

## Final Validation Checklist

- ✅ All tests pass: `npm test`
- ✅ No linting errors: `npm run lint`
- ✅ No type errors: `npx tsc --noEmit`
- ✅ Dev server runs: `npm run dev`
- ✅ Manual integration test successful:
  - Questions load
  - Answers submit correctly
  - Feedback displays
  - Results appear after 10 questions
  - Responsive on mobile
- ✅ Error states handled (no unhandled promise rejections in console)
- ✅ Logs are informative (API calls logged, no verbose debug spam)
- ✅ Documentation updated (README if needed, JSDoc on all components)

---

## Anti-Patterns to Avoid

- ❌ Don't create new API endpoints; use `/api/session/*` routes already implemented
- ❌ Don't hardcode lesson IDs; use the `[id]` param passed to component
- ❌ Don't skip error handling; all API calls can fail
- ❌ Don't use `any` types; define proper TypeScript interfaces
- ❌ Don't directly manipulate DOM; use React state and Tailwind
- ❌ Don't forget cleanup in useEffect; use abort controller for fetch
- ❌ Don't style inconsistently; use existing `.kid-*` classes from globals.css
- ❌ Don't forget Suspense boundaries for async components in Next.js
- ❌ Don't test only happy path; include edge cases (invalid input, API errors)
- ❌ Don't skip type validation; use Zod or TypeScript to validate API responses

---

## References & Resources

### Next.js Official Docs (with specific sections)
- Dynamic Routes: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
  - Section: "Catch-all Routes" and "Optional Catch-all Routes"
- Client Components: https://nextjs.org/docs/getting-started/react-essentials#client-components
  - Critical: "use client" directive at top of file
- Data Fetching: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating
  - Section: "Client-side Fetching" (using fetch in useEffect)
- Suspense: https://nextjs.org/docs/getting-started/react-essentials#suspense-for-server-components
  - Critical for server components wrapping async operations

### React Official Docs
- useState Hook: https://react.dev/reference/react/useState
- useEffect Hook: https://react.dev/reference/react/useEffect
- useRouter (Next.js): https://nextjs.org/docs/app/api-reference/hooks/use-router

### Clerk Auth
- useUser Hook: https://clerk.com/docs/references/react/use-user
- Authentication States: https://clerk.com/docs/references/react/use-auth

### Tailwind CSS
- Tailwind Docs: https://tailwindcss.com/docs
  - Colors: https://tailwindcss.com/docs/customizing-colors
  - Responsive Design: https://tailwindcss.com/docs/responsive-design
  - Animation: https://tailwindcss.com/docs/animation

### Existing Codebase Files (Key References)
- API Routes: `mathtutor/app/api/session/start/route.ts` (lines 1-50)
- Feedback Generation: `mathtutor/lib/scoring/generateFeedback.ts` (understand response shape)
- Styling Example: `mathtutor/components/LessonCard.tsx` (use as pattern for components)
- Session Manager Types: `mathtutor/lib/sessionManager.ts` (SessionState interface)

---

## Implementation Order Summary

1. **Create types.ts** - Define all TypeScript interfaces
2. **Create ErrorState** - Simple error UI
3. **Create LoadingState** - Spinner/skeleton
4. **Create QuestionDisplay** - Display current question
5. **Create AnswerForm** - Input and submit
6. **Create FeedbackDisplay** - Show feedback after answer
7. **Create ResultsScreen** - Final results
8. **Create QuizContainer** - Main logic and orchestration
9. **Update page.tsx** - Wire everything together
10. **Create tests** - Unit tests for all components
11. **Manual testing** - End-to-end flow validation
12. **Error scenario testing** - Edge cases and failures

---

## Success Definition

When complete, a user should be able to:

1. Navigate to `/lesson/1`
2. See "Question 1 of 10" with a math question
3. Enter an answer and click "Submit"
4. See immediate feedback (correct/incorrect + explanation)
5. Click "Next Question" and repeat 9 more times
6. After 10th answer, see results screen with:
   - Mastery score (e.g., "8/10 = 80%")
   - Pass/Fail status
   - Next lesson unlock button (if score >= 90%)
7. Click "Try Again" to restart the quiz, or "Back to Dashboard"
8. All responsive on mobile, no console errors

This completes the MVP for Lesson 1 playability.

---

**Confidence Score: 9/10**

Why not 10/10?
- Session lifecycle (restart, timeout) could edge case if implementation deviates from spec
- Clerk auth edge cases (pending, loading states) may need extra Suspense boundaries
- Minor: Could add animations (confetti, transitions) later for polish, not MVP-blocking

