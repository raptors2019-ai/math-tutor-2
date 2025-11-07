# PRP: Polish, Testing, and Deployment for Math Tutor AI

## Goal

Finalize the Math Tutor AI app by adding three layers:

1. **Polish**: Smooth animations (Framer Motion), sound effects (Web Audio API), kid-friendly micro-interactions
2. **Testing**: Comprehensive Jest unit tests (80% logic coverage) + manual UX validation scripts
3. **Deployment**: Live app on Vercel with environment variables, Analytics enabled, production-ready error handling

Result: A polished, thoroughly tested, production-ready K-5 math tutoring app with engaging animations, audio feedback, robust error recovery, and live deployment.

## Why

- **User Engagement**: Kids respond to visual/audio feedback (bounce on correct, ding sound)
- **Reliability**: Comprehensive tests catch regressions; error toasts prevent confusion
- **Production Readiness**: Vercel deployment enables real-world usage tracking and monitoring
- **Accessibility**: Optional sound/animation disabling ensures inclusive experience
- **Quality Assurance**: Jest tests + manual flows validate all critical paths before go-live

## What

### Deliverables

1. **Animations** (`mathtutor/components/animated-feedback/`):
   - Framer Motion animated feedback component (bounce correct answer, scale incorrect)
   - AnimatePresence for list enter/exit animations
   - Confetti burst on lesson completion
   - Smooth page transitions with `motion.div`

2. **Sound Effects** (`mathtutor/lib/audio/`):
   - Audio context manager (one-time setup)
   - Play function for success/failure sounds
   - Mute toggle in settings
   - Web Audio API setup (no external audio libs)

3. **Error Handling** (enhanced in existing components):
   - Toast notifications via react-hot-toast for API errors, network issues
   - Global error boundary for crashes
   - Fallback UI for degraded states
   - User-friendly messages ("Oops! Network error—retrying...")

4. **Tests** (`mathtutor/__tests__/`):
   - Jest unit tests for scoring logic (tagErrors, generateFeedback, calculateMastery)
   - Component tests for AnswerForm, QuestionDisplay, ResultsScreen
   - API route tests for /api/session/start, /api/session/answer, /api/session/complete
   - Manual UX validation scripts (e.g., "Complete lesson → verify confetti")

5. **Deployment** (`mathtutor/` + Vercel):
   - Next.js build optimized for Vercel (no breaking changes)
   - Environment variables configured (.env.production in Vercel dashboard)
   - Vercel Analytics enabled for usage tracking
   - Preview branches for staging
   - Production error logging (Vercel Logs)

### Success Criteria

- ✅ Animations smooth (<100ms latency perceived), no layout shifts
- ✅ Sound effects mutable, accessible (WCAG compliant)
- ✅ Error toasts appear for 404/5xx/network errors, auto-dismiss
- ✅ Jest test suite: 80%+ coverage on scoring logic, >50 tests
- ✅ All critical user flows pass manual validation
- ✅ App deployed to Vercel, live at `https://<project>.vercel.app`
- ✅ Analytics tracking page views, lesson completions
- ✅ Zero build/lint errors, TypeScript strict mode passes

---

## All Needed Context

### Documentation & References

**MUST READ - Include these in your context window:**

- **Framer Motion (Motion) Docs**: https://motion.dev/docs/react-animation
  - Why: Entry/exit animations with `initial`, `animate`, `exit` props
  - Critical section: AnimatePresence for conditional renders
  - Example: Bounce animation on correct answer (scaleY from 0.8 to 1)

- **react-hot-toast Docs**: https://react-hot-toast.com/
  - Why: Toast notifications for errors
  - Key methods: `toast.error()`, `toast.success()`, `toast.loading()`
  - Critical: Position (`top-center`), auto-dismiss (3s default), Tailwind integration

- **Web Audio API MDN Guide**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API
  - Why: Play success/failure sounds without external libs
  - Critical: AudioContext, GainNode for volume, AudioBufferSourceNode for playback
  - Gotcha: Cross-origin audio requires CORS headers; use data URIs or same-origin files

- **Jest + Next.js 16 Docs**: https://nextjs.org/docs/app/building-your-application/testing/jest
  - Why: Test setup, component/route testing patterns
  - Critical: `jest-environment-jsdom`, mocking `@clerk/nextjs`, `next/navigation`
  - Gotcha: Async Server Components not testable directly; use integration tests

- **Vercel Deployment Docs**: https://vercel.com/docs/deployments/overview
  - Why: Deploy Next.js app, set env vars, enable Analytics
  - Critical: Git push triggers deploy; env vars in dashboard (not .env)
  - Gotcha: Mismatched prod/preview envs cause bugs; test with `vercel deploy`

- **Vercel Analytics**: https://vercel.com/docs/analytics
  - Why: Track page views, completion rates, performance
  - Setup: Enable in project settings, view Web Analytics dashboard

### Codebase Patterns to Follow

**Key Files & Patterns:**

1. **Error Handling Pattern** (`mathtutor/app/api/progress/route.ts`):
   - Use Zod for input validation
   - Catch-all try/catch with `console.error`
   - Return `NextResponse.json({ error: "..." }, { status: 4xx })` for client errors
   - Return 500 for unexpected errors with `{ error: "Internal server error" }`

2. **Component Structure** (`mathtutor/app/lesson/[id]/components/FeedbackDisplay.tsx`):
   - Client component (`"use client"`) for interactivity
   - Props typed via interfaces (see `types.ts`)
   - JSDoc comments for every function
   - Tailwind classes with consistent naming (e.g., `kid-button-primary`, `bg-kid-green-500`)

3. **Test Pattern** (`mathtutor/__tests__/components/lesson/quiz.test.tsx`):
   - Mock Clerk (`useUser`, `useRouter`)
   - Mock API calls with `jest.mock("next/navigation")`
   - Use `render`, `fireEvent`, `waitFor`, `screen` from `@testing-library/react`
   - Test 3 cases per component: happy path, edge case, error case
   - Clear mocks in `beforeEach`

4. **API Route Pattern** (`mathtutor/app/api/session/start/route.ts`):
   - `async function POST(req: NextRequest)` signature
   - Auth check first: `const { userId } = await auth()`
   - Validate with Zod, return 400 if invalid
   - Use `prisma` for DB queries
   - Return `{ error, status }` on failure, `{ data, status: 200 }` on success

### Known Gotchas & Library Quirks

1. **Framer Motion (`motion` package)**:
   - Gotcha: AnimatePresence must wrap components, and children need unique `key` props
   - Gotcha: Duration units default to seconds (e.g., `transition={{ duration: 0.3 }}` = 300ms)
   - Gotcha: `exit` animations only work inside AnimatePresence
   - Pattern: Use `motion.div` instead of `div` for animated elements

2. **react-hot-toast**:
   - Gotcha: Toaster must be at app root (inside layout), not in individual components
   - Gotcha: `toast()` is async but returns immediately (fires toast in background)
   - Pattern: Call `toast.error(message)` directly; no need for state
   - Best practice: Position `top-center` for kid-friendly UX

3. **Web Audio API**:
   - Gotcha: AudioContext requires user interaction (click/keydown) before playing sound (browser autoplay policy)
   - Gotcha: Each AudioContext is expensive; create once, reuse
   - Pattern: Initialize on first user action, cache in ref or module variable
   - Critical: Data URIs for audio avoid CORS; inline small MP3s or use relative paths

4. **Jest + Next.js**:
   - Gotcha: Server Components can't be tested directly; mock async data instead
   - Gotcha: Next.js auto-mocks images, CSS, fonts; explicitly mock them if needed
   - Pattern: Use `jest.mock()` before imports for intercepting modules
   - Best practice: Test behavior, not implementation; use `screen.getBy*` not `container.querySelector`

5. **Vercel Deployment**:
   - Gotcha: `vercel deploy` (preview) is different from `vercel --prod` (production); always test preview first
   - Gotcha: Env vars must be added in Vercel dashboard; `.env.local` not deployed
   - Gotcha: Build caching can cause stale artifacts; use `vercel deploy --force` if needed
   - Pattern: Use `process.env.NEXT_PUBLIC_*` for client-side env vars (public), `process.env.*` for server-side (private)

### Codebase File Structure

Current structure:
```
mathtutor/
├── app/
│   ├── api/
│   │   ├── progress/route.ts
│   │   ├── session/
│   │   │   ├── answer/route.ts
│   │   │   ├── complete/route.ts
│   │   │   └── start/route.ts
│   │   └── lesson/[lessonId]/sub-lesson/[subLessonId]/drills/route.ts
│   ├── lesson/[id]/
│   │   └── components/
│   │       ├── AnswerForm.tsx
│   │       ├── ErrorState.tsx (enhance with toasts)
│   │       ├── FeedbackDisplay.tsx (add animation)
│   │       ├── LoadingState.tsx (add animation)
│   │       ├── QuestionDisplay.tsx
│   │       ├── QuizContainer.tsx (add toast error handling)
│   │       ├── ResultsScreen.tsx (add confetti animation)
│   │       └── types.ts
│   ├── layout.tsx (add Toaster)
│   └── page.tsx
├── __tests__/
│   ├── app/
│   ├── components/
│   │   └── lesson/quiz.test.tsx (expand)
│   └── lib/
│       └── scoring/ (tests exist, keep passing)
├── components/ (if needed for new animated components)
├── lib/
│   ├── scoring/
│   │   ├── generateFeedback.ts
│   │   ├── tagErrors.ts
│   │   └── calculateMastery.ts
│   ├── prisma.ts
│   └── sessionManager.ts
├── jest.config.ts (already set up)
├── jest.setup.ts (already set up)
├── package.json (add framer-motion, react-hot-toast, if not present)
└── tailwind.config.ts
```

New files to add:
```
mathtutor/
├── lib/
│   ├── audio/
│   │   ├── audioContext.ts (Web Audio API setup)
│   │   ├── sounds.ts (sound definitions & play functions)
│   │   └── useSoundSettings.ts (React hook for mute toggle)
│   └── errorHandler.ts (global error boundary & toast utilities)
├── components/
│   └── animated-feedback/ (if creating reusable animation components)
│       ├── BounceAnimation.tsx
│       ├── ConfettiAnimation.tsx
│       └── index.ts
├── __tests__/
│   ├── lib/
│   │   ├── audio/audioContext.test.ts
│   │   └── errorHandler.test.ts
│   ├── app/
│   │   ├── api/session/start.test.ts
│   │   └── api/session/answer.test.ts
│   └── ... (more tests)
└── scripts/
    └── deployment-validation.sh (manual test script)
```

---

## Implementation Blueprint

### Data Models & Types

**No new database models needed.** Extend existing types if needed:

```typescript
// mathtutor/app/lesson/[id]/types.ts - EXTEND with animation props
interface FeedbackDisplayProps {
  correct: boolean;
  feedback: string;
  correctAnswer: number;
  onNext: () => void;
  // NEW: Animation config
  animationDuration?: number; // ms, default 1500
  soundEnabled?: boolean;
}

// NEW: Audio context settings
interface SoundSettings {
  enabled: boolean;
  volume: number; // 0-1
}

interface ToastConfig {
  position: "top-center" | "top-left" | "top-right" | "bottom-center" | "bottom-left" | "bottom-right";
  duration: number; // ms
  dismiss?: boolean;
}
```

### Task Breakdown

Complete these tasks in order:

#### **Task 1: Add Framer Motion Package & Setup Toaster Provider**
**MODIFY `mathtutor/package.json`:**
- Add `"framer-motion": "^11.0.0"` (latest Motion library)
- Add `"react-hot-toast": "^2.4.0"` (error notifications)
- Run `npm install` to install both

**MODIFY `mathtutor/app/layout.tsx`:**
- Import `{ Toaster }` from `"react-hot-toast"`
- Add `<Toaster position="top-center" />` inside `<body>` element
- Ensures toast notifications available globally

**Pseudocode:**
```typescript
// app/layout.tsx
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html>
        <body>
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

**Validation:** `npm install` succeeds, no package errors

---

#### **Task 2: Create Audio Context Manager**
**CREATE `mathtutor/lib/audio/audioContext.ts`:**
- Manage single AudioContext (browser requires user interaction before first play)
- Export functions: `initAudioContext()`, `playSound(frequency, duration)`, `isSoundSupported()`
- Use Web Audio API to generate tones (success = 440Hz, error = 300Hz)
- NO external audio files needed initially

**Pseudocode:**
```typescript
// lib/audio/audioContext.ts
let audioContext: AudioContext | null = null;
let isInitialized = false;

export function initAudioContext(): void {
  // Create on first call (after user interaction)
  if (!audioContext && typeof window !== 'undefined') {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    isInitialized = true;
  }
}

export function playSound(frequency: number, duration: number): void {
  // CRITICAL: Check audioContext exists before playing
  if (!audioContext) initAudioContext();

  try {
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.frequency.value = frequency;
    osc.connect(gain);
    gain.connect(audioContext.destination);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.start(now);
    osc.stop(now + duration);
  } catch (error) {
    console.warn('Audio playback failed:', error);
  }
}

export function isSoundSupported(): boolean {
  return typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window);
}
```

**Validation:** No console errors on import; `isSoundSupported()` returns boolean

---

#### **Task 3: Create Sound Utilities & React Hook**
**CREATE `mathtutor/lib/audio/sounds.ts`:**
- Export `playSuccessSound()` → 440Hz, 200ms (pleasant beep)
- Export `playErrorSound()` → 300Hz, 150ms (lower tone)
- Export `playWarningSound()` → 350Hz, 100ms (brief warning)
- Each checks if sounds enabled before playing

**CREATE `mathtutor/lib/audio/useSoundSettings.ts`:**
- React hook: `useSoundSettings()` → `{ enabled, setEnabled, playSuccess, playError }`
- Store preference in localStorage (`math-tutor:sounds`)
- Default to enabled

**Pseudocode:**
```typescript
// lib/audio/sounds.ts
import { playSound, initAudioContext } from './audioContext';

export function playSuccessSound(): void {
  initAudioContext();
  playSound(440, 0.2); // A4 note, 200ms
}

export function playErrorSound(): void {
  initAudioContext();
  playSound(300, 0.15); // Lower freq, 150ms
}

// lib/audio/useSoundSettings.ts
export function useSoundSettings() {
  const [enabled, setEnabledState] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('math-tutor:sounds') !== 'false';
  });

  const setEnabled = (value: boolean) => {
    setEnabledState(value);
    localStorage.setItem('math-tutor:sounds', String(value));
  };

  return { enabled, setEnabled, playSuccess: enabled ? playSuccessSound : () => {} };
}
```

**Validation:** `npm run type-check` passes; no import errors

---

#### **Task 4: Enhance FeedbackDisplay with Framer Motion Animation**
**MODIFY `mathtutor/app/lesson/[id]/components/FeedbackDisplay.tsx`:**
- Import `motion` from `"framer-motion"`
- Wrap toast div with `motion.div` (not regular div)
- Add bounce animation on correct (scaleY: 0.8 → 1)
- Fade in/out on show/hide
- Call `playSuccessSound()` on mount if correct

**Pseudocode:**
```typescript
// app/lesson/[id]/components/FeedbackDisplay.tsx
"use client";

import { motion } from 'framer-motion';
import { useSoundSettings } from '@/lib/audio/useSoundSettings';

export function FeedbackDisplay({ correct, feedback, ... }: FeedbackDisplayProps) {
  const { enabled: soundEnabled, playSuccess } = useSoundSettings();

  useEffect(() => {
    if (correct && soundEnabled) {
      // Small delay to let animation start
      const timer = setTimeout(() => playSuccess(), 100);
      return () => clearTimeout(timer);
    }
  }, [correct, soundEnabled, playSuccess]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`rounded-2xl shadow-2xl p-4 max-w-md w-full ${correct ? 'bg-kid-green-500' : 'bg-kid-yellow-500'}`}
        initial={{ scaleY: correct ? 0.8 : 1 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
      >
        {/* Existing JSX */}
      </motion.div>
    </motion.div>
  );
}
```

**Validation:** Animation visible in dev server at `localhost:3000`; no build errors

---

#### **Task 5: Enhance ResultsScreen with Confetti Animation**
**MODIFY `mathtutor/app/lesson/[id]/components/ResultsScreen.tsx`:**
- Import `motion`, `AnimatePresence` from `"framer-motion"`
- If `passed === true`, render confetti animation (scale, rotate, fade)
- Show celebration emoji bouncing
- Play success sound
- Keep existing logic, just add animation wrapper

**Pseudocode:**
```typescript
// Render confetti particles on pass
{passed && (
  <motion.div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: -100, opacity: 1, rotate: 0 }}
        animate={{ y: 200, opacity: 0, rotate: 360 }}
        transition={{ duration: 2, delay: i * 0.1 }}
        className="absolute text-4xl"
        style={{ left: `${Math.random() * 100}%` }}
      >
        🎉
      </motion.div>
    ))}
  </motion.div>
)}
```

**Validation:** Confetti appears when passing quiz; no layout shift

---

#### **Task 6: Add Global Error Handler & Toast Utilities**
**CREATE `mathtutor/lib/errorHandler.ts`:**
- Export `handleApiError(error: unknown): string` → user-friendly message
- Export `showErrorToast(message: string)` → calls `toast.error()`
- Export `showSuccessToast(message: string)` → calls `toast.success()`
- Handle common errors: 401, 404, 500, network timeouts

**Pseudocode:**
```typescript
// lib/errorHandler.ts
import toast from 'react-hot-toast';

export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    // Network error
    if (error.message.includes('fetch')) {
      return 'Network error—please check your connection';
    }
    // Default
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}

export function showErrorToast(message: string): void {
  toast.error(message, { duration: 4000 });
}

export function showSuccessToast(message: string): void {
  toast.success(message, { duration: 3000 });
}
```

**Validation:** Type check passes; no unused imports

---

#### **Task 7: Enhance QuizContainer with Toast Error Handling**
**MODIFY `mathtutor/app/lesson/[id]/components/QuizContainer.tsx`:**
- Import `{ showErrorToast }` from `"@/lib/errorHandler"`
- In `initializeSession()` catch block, call `showErrorToast(errData.error || "Failed to load session")`
- In `handleSubmitAnswer()` catch block, call `showErrorToast("Failed to submit answer—retrying...")`
- In `completeSession()` catch block, call `showErrorToast("Failed to complete quiz")`

**Pseudocode:**
```typescript
// In QuizContainer
try {
  const response = await fetch("/api/session/start", { ... });
  if (!response.ok) {
    const errData = await response.json();
    showErrorToast(errData.error || "Failed to load session");
    throw new Error(errData.error);
  }
} catch (error) {
  showErrorToast(handleApiError(error));
  setState(prev => ({ ...prev, error: handleApiError(error) }));
}
```

**Validation:** Error toast appears on API failure; can submit retry without page reload

---

#### **Task 8: Add Framer Motion AnimatePresence to Dynamic Lists**
**MODIFY `mathtutor/app/lesson/[id]/components/QuestionDisplay.tsx` (if list of questions):**
- Wrap questions with `AnimatePresence` + `motion.div` for smooth transitions
- Each question has unique `key` prop
- Use `exit={{ opacity: 0, x: 100 }}` for smooth removal

**Validation:** Question transitions smooth (no jarring jumps)

---

#### **Task 9: Create Jest Tests for Audio Utilities**
**CREATE `mathtutor/__tests__/lib/audio/audioContext.test.ts`:**
- Test `isSoundSupported()` returns boolean
- Test `playSound()` doesn't throw errors
- Mock AudioContext if needed
- At least 3 test cases

**CREATE `mathtutor/__tests__/lib/audio/useSoundSettings.test.tsx`:**
- Test hook returns enabled/setEnabled
- Test localStorage persistence
- Test playSuccess/playError functions
- At least 4 test cases

**Pseudocode:**
```typescript
// __tests__/lib/audio/audioContext.test.ts
import { isSoundSupported, playSound } from '@/lib/audio/audioContext';

describe('audioContext', () => {
  test('isSoundSupported returns boolean', () => {
    const result = isSoundSupported();
    expect(typeof result).toBe('boolean');
  });

  test('playSound does not throw error', () => {
    // Mock AudioContext if needed
    expect(() => playSound(440, 0.1)).not.toThrow();
  });
});
```

**Validation:** `npm test -- lib/audio` passes all tests

---

#### **Task 10: Expand Jest Tests for Scoring Logic**
**MODIFY `mathtutor/__tests__/lib/scoring/tagErrors.test.ts`:**
- Add 5+ new test cases for edge cases (e.g., multiple errors, boundary values)
- Ensure 90%+ coverage of `tagErrors()` function
- Test each error tag individually

**MODIFY `mathtutor/__tests__/lib/scoring/generateFeedback.test.ts`:**
- Ensure existing tests pass
- Add 2 more test cases for caching + tone feedback
- Cover happy path, fallback, cache behaviors

**Validation:** `npm test -- lib/scoring` passes; coverage ≥ 80%

---

#### **Task 11: Add Component Tests for Animated Feedback**
**CREATE `mathtutor/__tests__/components/lesson/animated-feedback.test.tsx`:**
- Test FeedbackDisplay renders with animation props
- Test that correct answer triggers animation
- Test that sound plays when soundEnabled = true
- Use `render` + `within` from testing library

**Pseudocode:**
```typescript
// __tests__/components/lesson/animated-feedback.test.tsx
import { render, screen } from '@testing-library/react';
import { FeedbackDisplay } from '@/app/lesson/[id]/components/FeedbackDisplay';

jest.mock('@/lib/audio/useSoundSettings', () => ({
  useSoundSettings: () => ({
    enabled: true,
    playSuccess: jest.fn(),
    playError: jest.fn(),
  }),
}));

describe('FeedbackDisplay Animation', () => {
  test('renders with bounce animation on correct', () => {
    render(
      <FeedbackDisplay
        correct={true}
        feedback="Great job!"
        correctAnswer={10}
        onNext={() => {}}
      />
    );
    expect(screen.getByText('Correct!')).toBeInTheDocument();
  });
});
```

**Validation:** `npm test -- animated-feedback` passes

---

#### **Task 12: Add API Route Tests**
**CREATE `mathtutor/__tests__/app/api/session/start.test.ts`:**
- Test POST /api/session/start with valid lessonId
- Test error cases: missing auth, invalid lessonId, lesson not found
- Mock Clerk auth + Prisma
- At least 4 test cases

**CREATE `mathtutor/__tests__/app/api/session/answer.test.ts`:**
- Test POST /api/session/answer with valid answer
- Test validation (answer 0-20)
- Test feedback generation
- At least 4 test cases

**Pseudocode:**
```typescript
// __tests__/app/api/session/start.test.ts
import { POST } from '@/app/api/session/start/route';
import { NextRequest } from 'next/server';

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn().mockResolvedValue({ userId: 'test-user-123' }),
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    lesson: { findUnique: jest.fn() },
  },
}));

describe('POST /api/session/start', () => {
  test('returns session with questions', async () => {
    const req = new NextRequest('http://localhost:3000/api/session/start', {
      method: 'POST',
      body: JSON.stringify({ lessonId: 'lesson-1' }),
    });

    const response = await POST(req);
    const data = await response.json();
    expect(data).toHaveProperty('sessionId');
    expect(data).toHaveProperty('questions');
  });
});
```

**Validation:** `npm test -- api/session` passes all tests

---

#### **Task 13: Create Manual UX Validation Script**
**CREATE `mathtutor/scripts/deployment-validation.sh`:**
- Bash script that tests key user flows
- Flow 1: Navigate to lesson, load quiz, submit answer, see feedback animation + sound
- Flow 2: Complete quiz, see results with confetti
- Flow 3: Error recovery (simulate network error, click retry)
- Check for console errors, unhandled exceptions

**Pseudocode:**
```bash
#!/bin/bash
# scripts/deployment-validation.sh

echo "🧪 Starting Manual UX Validation..."

echo "1. Checking build..."
npm run build || exit 1

echo "2. Starting dev server..."
npm run dev &
DEV_PID=$!
sleep 5

echo "3. Testing endpoint health..."
curl http://localhost:3000/api/progress || exit 1

echo "4. Checking for console errors..."
# Manual: Navigate to http://localhost:3000/lesson/1, complete quiz
echo "⚠️  MANUAL STEP: Open http://localhost:3000 in browser, complete a lesson, verify:"
echo "   - Animation on correct answer ✅"
echo "   - Sound plays on correct (if enabled) ✅"
echo "   - Confetti on completion ✅"
echo "   - Error toasts for API failures ✅"

kill $DEV_PID
echo "✅ Validation complete!"
```

**Validation:** Script runs without errors; manual flows pass

---

#### **Task 14: Configure Vercel Deployment**
**SETUP:**
- Install Vercel CLI: `npm i -g vercel`
- Link project: `vercel link` (or use GitHub integration)
- Configure environment variables in Vercel dashboard:
  - `OPENAI_API_KEY` (from .env.local)
  - `DATABASE_URL` (from .env.local)
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (from .env.local)
  - `CLERK_SECRET_KEY` (from .env.local)

**MODIFY `mathtutor/.env.production`** (if creating):
- Do NOT commit; this is for local testing
- Copy from `.env.local` for reference

**VERIFY:**
- `npm run build` succeeds
- `npm run type-check` passes
- `npm run lint` passes
- Run `vercel deploy` to create preview deployment
- Run `vercel --prod` to deploy to production

**Pseudocode:**
```bash
# Deployment validation
npm run lint
npm run type-check
npm run test
npm run build

# Preview deployment (test)
vercel deploy

# Production deployment (after verifying preview)
vercel --prod
```

**Validation:** App live at `https://<project>.vercel.app`; no build errors

---

#### **Task 15: Enable Vercel Analytics**
**SETUP:**
- Go to Vercel project dashboard → Analytics
- Enable "Web Analytics"
- View dashboard to see page views, completions, performance metrics

**VERIFY:**
- Analytics dashboard shows page views from deployment
- Can see lesson completion rates

**Validation:** Analytics dashboard active; page views tracked

---

#### **Task 16: Final Validation & Error Recovery**
**RUN VALIDATION SUITE:**

```bash
# Syntax/Style
npm run lint -- --fix
npx tsc --noEmit

# Unit Tests
npm test -- --verbose --coverage

# Build
npm run build

# Manual checks (use deployment-validation.sh)
bash scripts/deployment-validation.sh

# Verify production deployment
open https://<project>.vercel.app
# Manual: Load a lesson, submit answer, check:
# - Animations smooth ✅
# - Sounds play (if enabled) ✅
# - Toasts appear for errors ✅
# - No console errors ✅
```

**Validation Gates:**
- ✅ Lint: 0 errors
- ✅ Types: 0 errors
- ✅ Tests: >50 tests passing, 80%+ coverage on scoring logic
- ✅ Build: Succeeds, no warnings
- ✅ Production: Live and responsive

---

## Integration Points

### DATABASE
- No schema changes needed; all features use existing models
- Existing: `User`, `Lesson`, `Session`, `Response`

### CONFIG
- Add to `.env.production` (Vercel dashboard):
  ```
  OPENAI_API_KEY=sk-...
  DATABASE_URL=postgresql://...
  CLERK_SECRET_KEY=sk_...
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
  ```
- Add to `mathtutor/next.config.ts` if needed for Vercel optimizations (currently minimal)

### ROUTES
- No new routes; enhance existing:
  - `/api/session/start` → add error toast handling
  - `/api/session/answer` → add error toast handling
  - `/api/session/complete` → add error toast handling
- Client components: FeedbackDisplay, ResultsScreen, QuizContainer

### VERCEL DEPLOYMENT
- Git-based: Push to main branch → automatic deploy
- Environment variables: Set in Vercel dashboard
- Analytics: Enable in project settings
- Preview branches: Auto-generated on PR

---

## Validation Loop

### Level 1: Syntax & Style (FIRST)

```bash
npm run lint -- --fix
npx tsc --noEmit
```

Expected: No errors.
If errors: Read the error, fix the issue, re-run.

### Level 2: Unit Tests

```bash
npm test -- --verbose
```

Expected: >50 tests passing.
Specific tests to prioritize:
- `__tests__/lib/scoring/*.test.ts` (80%+ coverage)
- `__tests__/lib/audio/*.test.ts` (audio utilities)
- `__tests__/components/lesson/animated-feedback.test.tsx` (animations)
- `__tests__/app/api/session/*.test.ts` (API routes)

If failing: Read error, understand root cause, fix code, re-run (never mock to pass).

### Level 3: Integration Test (Dev Server)

```bash
npm run dev
# Open http://localhost:3000 in browser
# Manually test:
# 1. Navigate to lesson → load quiz
# 2. Submit answer → see feedback animation + sound (if enabled)
# 3. Complete quiz → see confetti + results
# 4. Trigger error → see toast notification
# 5. Click retry → session resumes without page reload
```

Expected: All flows smooth, no console errors.
If error: Check browser DevTools → Network + Console → fix root cause.

### Level 4: Production Build & Deployment

```bash
npm run build
# Should succeed with 0 errors, <2 warnings

npm test -- --coverage
# Expected: 80%+ coverage on scoring logic

# Preview deployment
vercel deploy
# Test at preview URL

# Production deployment
vercel --prod
# Verify at https://<project>.vercel.app
```

---

## Final Validation Checklist

- ✅ All tests pass: `npm test -- --verbose` (>50 tests)
- ✅ No linting errors: `npm run lint`
- ✅ No type errors: `npx tsc --noEmit`
- ✅ Build succeeds: `npm run build`
- ✅ Manual UX validation:
  - ✅ Animation smooth on correct answer
  - ✅ Confetti on completion
  - ✅ Sound effects play (if enabled)
  - ✅ Error toasts appear for API failures
  - ✅ Retry works without page reload
- ✅ Deployment:
  - ✅ Preview deployment live
  - ✅ Production deployment live at `https://<project>.vercel.app`
  - ✅ Environment variables configured
  - ✅ Analytics enabled and tracking
- ✅ Error cases:
  - ✅ Network error → toast + retry
  - ✅ 404 (lesson not found) → error page + back button
  - ✅ 500 (server error) → toast + retry
  - ✅ Unauthenticated → redirect to sign in
- ✅ Accessibility:
  - ✅ Sound toggle in settings/localStorage
  - ✅ Animations <1s duration (no flashing)
  - ✅ Color contrast WCAG AA
- ✅ Documentation updated (README if needed)

---

## Anti-Patterns to Avoid

- ❌ Don't create new CSS classes; use existing Tailwind (kid-button-primary, etc.)
- ❌ Don't add heavy animations (>1s duration) that distract from learning
- ❌ Don't hardcode audio files; use Web Audio API for simple tones
- ❌ Don't skip error handling in API routes; always return structured errors
- ❌ Don't test implementation details (jest.fn().toHaveBeenCalledWith); test behavior
- ❌ Don't deploy without testing preview first; always `vercel deploy` before `vercel --prod`
- ❌ Don't commit `.env` files or credentials; use Vercel dashboard for secrets
- ❌ Don't add new features; polish & test existing ones only

---

## Quality Score

**Confidence Level: 8/10**

Why high:
- ✅ Existing test patterns well-documented + followed
- ✅ Codebase uses consistent error handling (try/catch, Zod validation)
- ✅ Component structure clear + modular
- ✅ Framer Motion + react-hot-toast widely adopted, well-documented
- ✅ Jest setup already configured + working

Why not 10/10:
- ⚠️ Audio context initialization timing (browser autoplay policy) requires careful testing
- ⚠️ Vercel deployment requires credentials (assumes correct env vars set)
- ⚠️ Manual UX validation is subjective (animation smoothness, sound quality)
- ⚠️ Test coverage goals (80% logic, >50 tests) ambitious but achievable

**Estimated effort:** 12-16 hours of development + 2-3 hours manual testing

---

## Key Takeaways for AI Agent

1. **Start with packages**: Add `framer-motion` + `react-hot-toast` first
2. **Audio comes second**: Web Audio API is complex; test early, use simple tones
3. **Animate existing components**: Don't create new components; wrap existing ones with `motion.div`
4. **Tests are validation**: Write Jest tests, then run dev server to verify UX
5. **Deploy last**: Once all tests pass + manual validation done, deploy to Vercel
6. **Error handling is key**: Every API call should have a try/catch + toast notification
7. **Follow patterns**: Mirror existing code (FeedbackDisplay, ErrorState, API routes)
8. **Check TypeScript**: `npx tsc --noEmit` frequently; don't ignore type errors
