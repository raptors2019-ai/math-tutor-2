# PRP: Lesson Progression, Full Curriculum, and Completion

**Feature:** Implement mastery-based lesson unlocking, full curriculum support (Lessons 2-3), failure-to-remediation flow, and completion screen.

**Status:** Research Complete | Ready for Implementation

**Confidence Score:** 9/10 - Comprehensive context provided, patterns identified, all dependencies mapped.

---

## Executive Summary

This feature expands Math Tutor AI from a single-lesson proof-of-concept to a complete 3-lesson curriculum with adaptive progression. Students progress through lessons only on 90% mastery, unlock sub-lesson remediation on failure, and celebrate completion with a special screen. The implementation reuses the existing Lesson 1 quiz structure (QuizContainer, API routes, scoring logic) for Lessons 2-3, adds conditional rendering for locked/unlocked lessons, and implements the full failure→remediation→re-quiz flow.

**Key Deliverables:**
1. Update Dashboard to show lesson lock states (fetch from `/api/progress`)
2. Replicate Lesson 1 UI for Lessons 2-3 (content already in DB)
3. Implement lesson-locking logic in API + client
4. Build failure remediation flow (sub-lesson → re-quiz)
5. Create completion screen (post-Lesson 3)
6. Add integration tests for full progression flow

**Timeline:** ~2-3 days of focused implementation (assuming Lesson 2-3 content already in DB/content.json—verified ✅)

---

## Context & Current State

### Existing Implementation (Lesson 1 ✅)
The app currently has a full working Lesson 1 quiz flow:
- **Session Management:** `/api/session/start` creates 10-question session, `/api/session/answer` scores each answer with AI feedback
- **Scoring:** Mastery calculated as `(correctCount / 10) * 100`, threshold = 90%
- **Error Handling:** Rule-based error tagging + AI-generated personalized tips
- **Progress Tracking:** `/api/progress` GET returns user progress; UserProgress DB model stores masteryScore, completed boolean
- **UI:** QuizContainer orchestrates full quiz flow with conditional rendering for loading/error/questions/results

### Database State (Verified ✅)
- **Lessons:** All 3 lessons created in DB (Lesson 1, 2, 3) with full content, sub-lessons, and 42 quiz items total
- **Schema:** UserProgress model has `completed` boolean; Lesson model has `order` (1, 2, 3) for sequential unlocking
- **Session/Response:** SessionResponse tracks individual answers; Session stores overall session data

### Key Files to Reference
| File | Purpose | Key Code Lines |
|------|---------|---|
| `/mathtutor/app/lesson/[id]/page.tsx` | Server component entry | Receives `lessonId` via route params |
| `/mathtutor/app/lesson/[id]/components/QuizContainer.tsx` | Quiz state management | Full quiz flow with useState, useEffect, 4 handlers |
| `/mathtutor/app/api/session/start/route.ts` | Start quiz session | Creates session, selects 10 random items |
| `/mathtutor/app/api/session/answer/route.ts` | Submit answer + feedback | Scores, tags errors, generates feedback |
| `/mathtutor/app/api/session/complete/route.ts` | Complete & update progress | **Currently unlocks next lesson only if passed** |
| `/mathtutor/app/api/progress/route.ts` | Get user progress | Returns all lessons + mastery scores |
| `/mathtutor/app/dashboard/page.tsx` | Dashboard (needs update) | **Currently hardcoded lesson states** |
| `/mathtutor/lib/content.json` | Curriculum content | All 3 lessons + items (verified ✅) |
| `/mathtutor/lib/sessionManager.ts` | In-memory session state | Map<userId, SessionState> |
| `/mathtutor/app/lesson/[id]/components/ResultsScreen.tsx` | Quiz results display | Shows sub-lesson recommendation on failure |
| `/mathtutor/lib/scoring/generateSummaryFeedback.ts` | Post-quiz AI feedback | Maps error patterns to sub-lesson IDs |

---

## Implementation Plan

### Phase 1: Dashboard & Lesson Locking (1 day)

#### 1.1 Update Dashboard to Fetch & Display Locked/Unlocked States
**File:** `/mathtutor/app/dashboard/page.tsx`

**Current State (Hardcoded):**
```typescript
const lessons = [
  { id: "lesson-1", locked: false, completed: false },
  { id: "lesson-2", locked: true, completed: false },
  { id: "lesson-3", locked: true, completed: false },
];
```

**Changes Needed:**
1. Replace hardcoded lessons with dynamic fetch from `/api/progress`
2. Map returned progress array to lesson cards
3. Update LessonCard component to show "Locked" state when `completed === false`
4. Disable "Start" button and show lock icon for locked lessons
5. Show mastery score/progress bar for attempted lessons

**Pseudocode:**
```typescript
'use client'
import { useEffect, useState } from 'react'
import { Lesson, UserProgress } from '@/types'

export default function DashboardPage() {
  const [lessons, setLessons] = useState<(Lesson & {progress: UserProgress})[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProgress = async () => {
      const res = await fetch('/api/progress')
      if (!res.ok) {
        setError('Failed to load progress')
        return
      }
      const data = await res.json()
      setLessons(data.progress) // Array of lessons with progress
      setLoading(false)
    }
    fetchProgress()
  }, [])

  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} />

  return (
    <div className="grid gap-4">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          locked={!lesson.completed} // Lesson locked if NOT completed
          masteryScore={lesson.progress.masteryScore}
          lastAttempt={lesson.progress.lastAttempt}
        />
      ))}
    </div>
  )
}
```

**Testing:**
- Render dashboard after quiz pass → verify Lesson 2 unlocks
- Verify Lesson 3 shows locked until Lesson 2 passed
- Check mastery score displays correctly

---

#### 1.2 Update LessonCard Component
**File:** `/mathtutor/components/LessonCard.tsx`

**Changes:**
1. Add `locked` prop (boolean)
2. Show lock icon 🔒 if locked
3. Disable `<Link>` or `<button>` if locked
4. Optionally show "Unlock by scoring 90%+ on Lesson X"
5. Show mastery score badge if attempted

**Example:**
```typescript
interface LessonCardProps {
  lesson: Lesson
  locked: boolean
  masteryScore?: number
  lastAttempt?: Date
}

export function LessonCard({
  lesson,
  locked,
  masteryScore,
  lastAttempt,
}: LessonCardProps) {
  if (locked) {
    return (
      <div className="rounded-lg bg-gray-100 p-4 opacity-60">
        <span className="text-3xl">🔒</span>
        <p className="font-bold">{lesson.title}</p>
        <p className="text-sm text-gray-600">Complete Lesson {lesson.order - 1} first!</p>
      </div>
    )
  }

  return (
    <Link href={`/lesson/${lesson.id}`}>
      <div className="rounded-lg bg-white p-4 cursor-pointer hover:shadow-lg">
        <p className="font-bold">{lesson.title}</p>
        {masteryScore !== undefined && (
          <p className="text-sm">Mastery: {Math.round(masteryScore)}%</p>
        )}
        <button className="mt-2 kid-button-primary">
          {masteryScore !== undefined ? 'Practice Again' : 'Start Lesson'}
        </button>
      </div>
    </Link>
  )
}
```

---

#### 1.3 Add Server-Side Unlock Validation in `/api/session/start`
**File:** `/mathtutor/app/api/session/start/route.ts`

**Current:** No check; assumes lesson is available.

**Changes:**
```typescript
// After user authentication, add:
const userProgress = await prisma.userProgress.findUnique({
  where: { userId_lessonId: { userId, lessonId } },
})

// Check if lesson is unlocked
if (lesson.order > 1 && !userProgress?.completed) {
  // Lesson is locked; check if previous lesson was passed
  const previousLesson = await prisma.lesson.findUnique({
    where: { order: lesson.order - 1 },
  })

  const previousProgress = await prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId: previousLesson.id } },
  })

  if (!previousProgress?.completed) {
    return NextResponse.json(
      { error: 'Previous lesson not completed' },
      { status: 403 }
    )
  }
}
```

**Testing:**
- Try to start Lesson 2 without completing Lesson 1 → 403 error
- After Lesson 1 mastery, retry Lesson 2 → success

---

### Phase 2: Lesson 2-3 UI Replication (1 day)

#### 2.1 Verify Lesson 2-3 Content Routes
**Files:** `/mathtutor/app/lesson/[id]/page.tsx`, `/mathtutor/lib/content.json`

**Current State:**
- `/lesson/lesson-1`, `/lesson/lesson-2`, `/lesson/lesson-3` routes exist (via dynamic `[id]`)
- content.json has all 3 lessons with full descriptions and items

**Changes Needed:**
- Verify QuizContainer correctly fetches lessonId from route params
- Test fetching Lesson 2 & 3 items from DB
- Ensure sub-lesson IDs map correctly (e.g., `sub-2-1` for Lesson 2 sub-lesson 1)

**No code changes needed** if QuizContainer is generic; only validation required.

**Testing:**
```bash
# In browser:
1. Dashboard → click "Start Lesson" for Lesson 2 (if unlocked)
2. Verify 10 random items from Lesson 2 appear
3. Answer all 10, submit
4. Verify mastery score and results displayed correctly
```

---

#### 2.2 Dynamic Content Display in Quiz Components
**File:** `/mathtutor/app/lesson/[id]/components/QuizContainer.tsx` (already generic)

**Verify:**
- `sessionStart` API call includes `lessonId` ✅ (already does)
- 10 items selected are from correct lesson ✅ (already does)
- Sub-lesson recommendations map to correct lesson ✅ (generateSummaryFeedback maps by strategyTag)

**No changes** if already generic. Test with Lessons 2-3.

---

### Phase 3: Remediation Flow (Sub-Lesson → Re-Quiz) (1 day)

#### 3.1 Sub-Lesson Display Page
**New File:** `/mathtutor/app/lesson/[id]/sub-lesson/[subLessonId]/page.tsx`

**Purpose:** Show sub-lesson content, drills, then offer re-quiz

**Structure:**
```typescript
'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubLesson } from '@/types'
import SubLessonContent from './components/SubLessonContent'
import SubLessonDrills from './components/SubLessonDrills'
import SubLessonActions from './components/SubLessonActions'

export default function SubLessonPage() {
  const params = useParams()
  const { id: lessonId, subLessonId } = params as { id: string; subLessonId: string }
  const [subLesson, setSubLesson] = useState<SubLesson | null>(null)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const fetchSubLesson = async () => {
      const res = await fetch(`/api/lesson/${lessonId}/sub-lesson/${subLessonId}`)
      const data = await res.json()
      setSubLesson(data)
    }
    fetchSubLesson()
  }, [lessonId, subLessonId])

  if (!subLesson) return <LoadingState />

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">{subLesson.title}</h1>
      <p className="text-lg">{subLesson.description}</p>

      {/* Content explanation */}
      <SubLessonContent subLesson={subLesson} />

      {/* Mini-drills (3-5 questions) */}
      <SubLessonDrills lessonId={lessonId} subLessonId={subLessonId} onComplete={() => setCompleted(true)} />

      {/* If drills complete, show re-quiz button */}
      {completed && (
        <SubLessonActions lessonId={lessonId}>
          <button className="kid-button-primary">Ready to Try Again? 💪</button>
        </SubLessonActions>
      )}
    </div>
  )
}
```

**API Endpoint Needed:**
```typescript
// GET /api/lesson/[lessonId]/sub-lesson/[subLessonId]
// Returns: SubLesson data + related drills (items tagged with sub-lesson ID)
```

---

#### 3.2 Sub-Lesson Drills Component
**New File:** `/mathtutor/app/lesson/[id]/sub-lesson/[subLessonId]/components/SubLessonDrills.tsx`

**Purpose:** Show 3-5 diagnostic questions related to the sub-lesson

**Logic:**
1. Fetch 3-5 items tagged with sub-lesson strategy (e.g., all items with `strategyTag: "doubles"` for Lesson 2 Sub-Lesson 1)
2. Display like mini-quiz (simplified version of QuizContainer)
3. Show feedback immediately
4. Mark complete when all answered correctly (or after 2 attempts)

**Pseudocode:**
```typescript
export function SubLessonDrills({
  lessonId,
  subLessonId,
  onComplete,
}: SubLessonDrillsProps) {
  const [items, setItems] = useState<LessonItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState<{ itemId: string; correct: boolean }[]>([])
  const [allCorrect, setAllCorrect] = useState(false)

  useEffect(() => {
    const fetchDrills = async () => {
      // Fetch 3-5 items related to sub-lesson's strategy
      const res = await fetch(`/api/lesson/${lessonId}/sub-lesson/${subLessonId}/drills`)
      const data = await res.json()
      setItems(data.items.slice(0, 5)) // Limit to 5 drills
    }
    fetchDrills()
  }, [lessonId, subLessonId])

  const handleAnswer = async (answer: number) => {
    const item = items[currentIndex]
    const isCorrect = answer === item.answer
    const newResponses = [...responses, { itemId: item.id, correct: isCorrect }]
    setResponses(newResponses)

    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // All drills complete
      const allPass = newResponses.every((r) => r.correct)
      if (allPass) {
        setAllCorrect(true)
        onComplete()
      } else {
        // Show feedback: "Let's review this topic again"
        alert('Try again! You got X/5 correct. Let me show you the explanation again.')
        setCurrentIndex(0)
        setResponses([])
      }
    }
  }

  if (items.length === 0) return <LoadingState />

  return (
    <div className="rounded-lg bg-white p-6">
      <h2 className="mb-4 text-2xl font-bold">Practice Problems</h2>
      <QuestionDisplay question={items[currentIndex].question} />
      <AnswerForm
        onSubmit={handleAnswer}
        disabled={allCorrect}
      />
      <div className="mt-4 text-sm text-gray-600">
        Problem {currentIndex + 1} of {items.length}
      </div>
    </div>
  )
}
```

---

#### 3.3 Results Screen Update
**File:** `/mathtutor/app/lesson/[id]/components/ResultsScreen.tsx` (already has sub-lesson button)

**Verify Existing Logic:**
- ✅ Already shows `recommendedSubLesson` on failure
- ✅ Button links to sub-lesson page: `router.push(`/lesson-info/${lessonId}`)`

**Change Needed:**
- Update link to point to new sub-lesson flow: `/lesson/${lessonId}/sub-lesson/${recommendedSubLesson.id}`
- Add back-to-quiz button after sub-lesson completion (via router or session state)

**Current Code (Verified):**
```typescript
{recommendedSubLesson && (
  <button onClick={() => router.push(`/lesson-info/${lessonId}`)}>
    Review This Topic ✏️
  </button>
)}
```

**Updated:**
```typescript
{recommendedSubLesson && (
  <button onClick={() => router.push(`/lesson/${lessonId}/sub-lesson/${recommendedSubLesson.id}`)}>
    Review This Topic ✏️
  </button>
)}
```

---

#### 3.4 API: Get Sub-Lesson Drills
**New File:** `/mathtutor/app/api/lesson/[lessonId]/sub-lesson/[subLessonId]/drills/route.ts`

**Purpose:** Return 3-5 items related to sub-lesson

**Logic:**
1. Fetch SubLesson by ID
2. Get lesson's strategyTag or map sub-lesson to error tags
3. Fetch 3-5 LessonItems with matching strategyTag, randomized

**Implementation:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { lessonId: string; subLessonId: string } }
) {
  const { lessonId, subLessonId } = params

  // Fetch sub-lesson
  const subLesson = await prisma.subLesson.findUnique({
    where: { id: subLessonId },
    include: { lesson: true },
  })

  if (!subLesson) {
    return NextResponse.json({ error: 'Sub-lesson not found' }, { status: 404 })
  }

  // Map sub-lesson to strategy tag(s)
  // For Lesson 1, Sub-Lesson 1 → "make-10" or "complement"
  // For Lesson 2, Sub-Lesson 1 → "doubles"
  const strategyMap: Record<string, string[]> = {
    'sub-1-1': ['make-10', 'complement'],
    'sub-1-2': ['make-10', 'make-10-splitting'],
    'sub-2-1': ['doubles'],
    'sub-2-2': ['near_double'],
    'sub-3-1': ['choose_doubles', 'choose_make10', 'choose_either'],
  }

  const tags = strategyMap[subLessonId] || [subLesson.lesson.strategyTag]

  // Fetch items with matching tags
  const items = await prisma.lessonItem.findMany({
    where: {
      lessonId,
      strategyTag: { in: tags },
    },
    orderBy: [{ order: 'asc' }],
    take: 5,
  })

  // Randomize order
  const shuffled = items.sort(() => Math.random() - 0.5)

  return NextResponse.json({ items: shuffled })
}
```

---

### Phase 4: Completion Screen (1 day)

#### 4.1 Create Completion Page
**New File:** `/mathtutor/app/completion/page.tsx`

**Purpose:** Show celebration screen after Lesson 3 completion

**Components:**
1. Confetti animation (react-confetti, already in package.json)
2. Achievement summary
3. Badges/trophies
4. Share button
5. Restart option

**Implementation:**
```typescript
'use client'

import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useRouter } from 'next/navigation'

export default function CompletionPage() {
  const router = useRouter()
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-kid-pink-500 via-kid-purple-300 to-kid-blue-500 overflow-hidden px-4">
      {/* Confetti */}
      <Confetti width={windowSize.width} height={windowSize.height} />

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Trophy */}
        <div className="mb-6 text-9xl animate-bounce">🏆</div>

        {/* Title */}
        <h1 className="mb-2 text-5xl font-bold text-white drop-shadow-lg">
          You Did It! 🎉
        </h1>

        {/* Subtitle */}
        <p className="mb-8 text-2xl text-white drop-shadow-md">
          You've Mastered All 3 Lessons!
        </p>

        {/* Achievement Summary */}
        <div className="mx-auto mb-12 max-w-md rounded-3xl bg-white/90 p-6 shadow-xl">
          <h2 className="mb-4 text-2xl font-bold text-kid-blue-700">
            Your Achievements
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <p className="text-lg">Make-10 Master</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎲</span>
              <p className="text-lg">Doubles Expert</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔍</span>
              <p className="text-lg">Strategy Detective</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              navigator.share?.({
                title: 'Math Tutor AI',
                text: 'I just completed all 3 math lessons! 🎉',
                url: window.location.href,
              })
            }}
            className="kid-button-primary mx-auto block"
          >
            Share Your Success 📱
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="mx-auto block rounded-lg bg-white/80 px-6 py-3 font-bold text-kid-purple-600 hover:bg-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20">✨</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-20">⭐</div>
    </div>
  )
}
```

---

#### 4.2 Update Session Complete API to Trigger Completion
**File:** `/mathtutor/app/api/session/complete/route.ts`

**Current Logic:**
```typescript
// After mastery calculation:
if (passed && currentLesson.order === 3) {
  // All lessons complete!
  return NextResponse.json({
    ...completionData,
    allLessonsCompleted: true, // Add flag
  })
}
```

**Frontend Update (ResultsScreen.tsx):**
```typescript
if (data.allLessonsCompleted) {
  router.push('/completion')
}
```

---

### Phase 5: Integration & Testing (1 day)

#### 5.1 Full Progression Test Scenario
**Test Script:** Create a test user flow

1. **Sign up** → new user, all lessons locked except Lesson 1
2. **Attempt Lesson 1:**
   - Answer 9/10 correct → score 90%, mastery achieved
   - Verify Lesson 2 unlocks on dashboard
3. **Attempt Lesson 2:**
   - Answer 7/10 correct → score 70%, fail
   - Verify sub-lesson recommended
   - Review sub-lesson (3 drills)
   - Click "Ready to Try Again?"
   - Re-quiz with 5 new questions from Lesson 2
   - Answer 5/5 → Lesson 2 passed
   - Verify Lesson 3 unlocks
4. **Attempt Lesson 3:**
   - Answer 9/10 → pass
   - Verify completion page shown
   - Verify confetti animation plays
   - Verify back-to-dashboard button works

#### 5.2 Edge Cases
- Try to access Lesson 2 without completing Lesson 1 → 403 error
- Try to access sub-lesson without failed quiz → show "not available" message
- Refresh during quiz → verify session persists (already works)
- Multiple quiz attempts → verify only latest mastery score counts

#### 5.3 Database Consistency
- Verify UserProgress updated correctly after each quiz
- Verify SessionResponse records all 10 answers
- Verify Session.passed flag matches masteryScore >= 90

---

## Detailed Implementation Checklist

### Before Starting
- [ ] Verify all 3 lessons in DB with content + items
- [ ] Verify Lesson 2-3 content.json includes strategyTag for each item
- [ ] Verify sub-lesson IDs in content.json match database
- [ ] Back up database

### Phase 1: Dashboard & Locking
- [ ] Update `/mathtutor/app/dashboard/page.tsx` to fetch `/api/progress`
- [ ] Update LessonCard to show locked state
- [ ] Update LessonCard disabled state for locked lessons
- [ ] Add progress validation in `/api/session/start`
- [ ] Test: Try to start Lesson 2 without completing Lesson 1 → 403
- [ ] Test: Complete Lesson 1 at 90%+ → Lesson 2 unlocks

### Phase 2: Lesson 2-3 UI
- [ ] Verify QuizContainer works with Lesson 2 `[id]` params
- [ ] Test: Start Lesson 2, answer 10 questions, verify correct scoring
- [ ] Test: Start Lesson 3, same as Lesson 2
- [ ] Verify sub-lesson recommendations appear on failure

### Phase 3: Remediation Flow
- [ ] Create `/api/lesson/[lessonId]/sub-lesson/[subLessonId]/drills` endpoint
- [ ] Create `/mathtutor/app/lesson/[id]/sub-lesson/[subLessonId]/page.tsx`
- [ ] Create SubLessonContent component (display sub-lesson text)
- [ ] Create SubLessonDrills component (3-5 practice questions)
- [ ] Update ResultsScreen to link to sub-lesson page
- [ ] Test: Fail Lesson 2 → click sub-lesson → complete 3 drills → re-quiz
- [ ] Test: After sub-lesson, new 5-question quiz appears

### Phase 4: Completion Screen
- [ ] Create `/mathtutor/app/completion/page.tsx` with confetti
- [ ] Add `allLessonsCompleted` flag to `/api/session/complete`
- [ ] Update ResultsScreen to redirect to `/completion` on Lesson 3 pass
- [ ] Test: Complete Lesson 3 at 90%+ → completion page shown

### Phase 5: Testing & Polish
- [ ] Run full progression test (sign up → Lesson 1 → Lesson 2 → Lesson 3 → completion)
- [ ] Test edge cases (403 on locked lesson, refresh during quiz, etc.)
- [ ] Verify database consistency (UserProgress, SessionResponse records)
- [ ] Add error boundaries for sub-lesson fetch failures
- [ ] Lint & type-check: `npm run lint && npm run type-check`
- [ ] Run unit tests: `npm test` (update existing tests if needed)

---

## Key Code References

### Existing Patterns to Follow

**1. API Route Structure**
Reference: `/mathtutor/app/api/session/start/route.ts`
- Use Clerk auth: `auth()` to get userId
- Find/create User in DB
- Return NextResponse.json for success, 4xx for errors

**2. Session State Management**
Reference: `/mathtutor/lib/sessionManager.ts`
- In-memory Map<userId, SessionState> for active sessions
- Functions: createSession, getSession, addResponse, isSessionComplete, getSessionStats, completeSession

**3. Error Handling in API**
Reference: `/mathtutor/app/api/session/answer/route.ts` (lines 58-73)
- Check correctness: `userAnswer === item.answer`
- Generate AI feedback if incorrect
- Store in DB via prisma.sessionResponse.create()

**4. Conditional Client-Side Rendering**
Reference: `/mathtutor/app/lesson/[id]/components/QuizContainer.tsx`
- useState for quiz state (questions, responses, results)
- useEffect for session init on mount
- 4-state rendering: loading → error → quiz → results

**5. Dynamic Routing**
Reference: `/mathtutor/app/lesson/[id]/page.tsx`
- Server component receives `params: { id: string }`
- Pass to client component (QuizContainer) for routing

---

## Technology Stack & Dependencies

### Already in Project
- **Next.js 14** (App Router)
- **React 18** (hooks, Context API)
- **TypeScript** (strict mode)
- **Prisma** (ORM, migrations)
- **Tailwind CSS** (styling)
- **Clerk** (authentication)
- **OpenAI API** (feedback generation)
- **react-confetti** (animations)
- **Jest** (testing)

### No New Dependencies Needed
All required libraries are already installed.

### Optional Enhancements (Out of Scope for PRP)
- Framer Motion for page transitions
- React Query for data fetching (currently using fetch)
- Zustand for global state (currently using Context API + useState)

---

## Gotchas & Risk Mitigation

### 1. **Lesson Unlock Race Condition**
**Gotcha:** Student completes Lesson 1 quiz, but tries to start Lesson 2 before `/api/session/complete` finishes updating DB.

**Mitigation:**
- Add `optimistic UI update` in ResultsScreen: immediately show "Lesson 2 Unlocked!" before API call completes
- Verify unlock on backend via `/api/session/start` (already added in Phase 1)
- Test with slow network (DevTools throttle)

### 2. **Sub-Lesson Flow Never Ends**
**Gotcha:** Student fails drills repeatedly, no way to exit or skip.

**Mitigation:**
- Cap sub-lesson to 1 attempt of drills + 1 re-quiz attempt
- If re-quiz fails again, show "Ask a parent or teacher for help" with back button
- Limit total retries to 2 before disabling quiz access for lesson

### 3. **Sub-Lesson Content Not Found**
**Gotcha:** Sub-lesson ID doesn't match database, API returns 404.

**Mitigation:**
- Hardcode strategyTag→subLessonId mappings in `/api/lesson/.../drills` (done in Phase 3.4)
- Verify content.json sub-lesson IDs match database before deploying
- Add error boundary in SubLessonContent component

### 4. **Student Cheats by Changing URL**
**Gotcha:** Student navigates directly to `/lesson/lesson-3` without completing prior lessons.

**Mitigation:**
- **Server-side validation in `/api/session/start`** (added in Phase 1.3)
- Return 403 if lesson not unlocked
- Client also checks & shows lock state, but backend is source of truth

### 5. **Confetti Breaks on Mobile**
**Gotcha:** react-confetti may not resize properly on mobile devices.

**Mitigation:**
- Set `width` and `height` from `window.innerWidth/Height` in useEffect
- Add resize listener if needed
- Test on mobile devices before shipping

### 6. **Progress API Returns Stale Data**
**Gotcha:** Dashboard caches progress, student completes quiz but dashboard doesn't update.

**Mitigation:**
- Fetch `/api/progress` on mount (useEffect with empty deps)
- Add "Refresh" button to manually re-fetch
- Consider adding `revalidatePath('/dashboard')` in Next.js if using server components

---

## Validation Gates (Must Pass Before Merge)

### Syntax & Style
```bash
npm run lint -- --fix
npx tsc --noEmit
```
**Expected:** No errors

### Unit Tests
```bash
npm test -- --testPathPattern="(progress|quiz|session)" --verbose
```
**Expected:** All tests pass, 80%+ coverage

### Integration Test Scenario
```bash
# Manual testing required (no auto-test yet)
1. Sign up new user
2. Dashboard shows Lesson 1 available, 2-3 locked
3. Complete Lesson 1 at 90%+ mastery
4. Dashboard shows Lesson 2 available
5. Fail Lesson 2 (7/10)
6. See sub-lesson recommendation
7. Click "Review This Topic"
8. Complete 3 drills, then re-quiz
9. Pass re-quiz
10. Lesson 3 available
11. Pass Lesson 3
12. Completion page shown with confetti
13. Back button returns to dashboard
```

### Type Checking
```bash
npx tsc --noEmit
```
**Expected:** No type errors

### Database Consistency
```sql
-- Verify after test:
SELECT id, userId, lessonId, masteryScore, completed FROM "UserProgress" WHERE userId = '<test-user-id>';
-- Should show 3 rows (one per lesson)
-- After completion: all should have completed = true and masteryScore >= 90
```

---

## Documentation & References

### Next.js
- **Dynamic Routing:** https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
- **useRouter:** https://nextjs.org/docs/app/api-reference/functions/use-router
- **Middleware (for auth):** https://nextjs.org/docs/app/building-your-application/routing/middleware

### React
- **useContext:** https://react.dev/reference/react/useContext
- **useEffect:** https://react.dev/reference/react/useEffect
- **useState:** https://react.dev/reference/react/useState

### Prisma
- **CRUD Updates:** https://www.prisma.io/docs/concepts/components/prisma-client/crud#updating-records
- **Transactions:** https://www.prisma.io/docs/concepts/components/prisma-client/transactions
- **Relations:** https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries

### npm Packages
- **react-confetti:** https://www.npmjs.com/package/react-confetti
- **Next.js Image Optimization:** https://nextjs.org/docs/app/api-reference/components/image

---

## Scope & Out-of-Scope

### In Scope ✅
- Dashboard progress fetching + lock states
- Lesson 2-3 quiz flow (reuse Lesson 1 UI)
- Sub-lesson remediation with drills
- Completion screen
- Full progression testing

### Out of Scope ❌
- Advanced animations (Framer Motion)
- Student performance analytics
- Parent/teacher dashboards
- Mobile app (native iOS/Android)
- Offline support (local storage fallback)
- Accessibility audit (WCAG 2.1)
- Instructor tools to create custom lessons

---

## Success Criteria

After implementation, the app should support:

1. **Sequential Progression:** Students unlock Lesson 2 only after 90%+ mastery on Lesson 1, and Lesson 3 only after Lesson 2.
2. **Full Curriculum:** All 3 lessons (Make-10, Doubles, Choosing Strategies) with 10-question quizzes.
3. **Failure Remediation:** If a student scores <90%, they see a recommended sub-lesson with diagnostic tips, 3-5 practice questions, and a re-quiz.
4. **Completion Celebration:** After passing Lesson 3, student sees a confetti animation, achievement summary, and share button.
5. **Data Persistence:** UserProgress DB records mastery score and completed status for each lesson per user.
6. **Security:** Lessons are locked server-side; clients can't bypass via URL manipulation.

---

## Confidence Score: 9/10

**Why High Confidence:**
- ✅ Existing Lesson 1 is fully working and tested
- ✅ All 3 lessons + items already in DB + content.json
- ✅ Database schema supports everything needed (UserProgress.completed, Lesson.order)
- ✅ Error handling, scoring, and feedback generation already implemented
- ✅ Sub-lesson model and recommendation logic already exist
- ✅ API route structure and patterns well-established
- ✅ React component patterns (hooks, useState, useEffect) familiar and consistent

**Why Not 10/10:**
- Sub-lesson drill component is new (moderate complexity)
- Need to ensure completion page works on all browsers/mobile
- Potential race conditions in async operations (mitigated by server-side validation)
- Integration testing requires manual testing of full flow (no E2E framework yet)

---

## File Structure Summary

### New Files to Create
```
/mathtutor/app/
├── completion/
│   └── page.tsx                           # Completion celebration screen
├── lesson/
│   └── [id]/
│       ├── sub-lesson/
│       │   └── [subLessonId]/
│       │       ├── page.tsx               # Sub-lesson display + drills
│       │       └── components/
│       │           ├── SubLessonContent.tsx
│       │           ├── SubLessonDrills.tsx
│       │           └── SubLessonActions.tsx
│       └── components/
│           └── ResultsScreen.tsx          # Updated to link sub-lessons
└── api/
    └── lesson/
        └── [lessonId]/
            └── sub-lesson/
                └── [subLessonId]/
                    └── drills/
                        └── route.ts      # Get sub-lesson drills

/mathtutor/app/
├── dashboard/
│   └── page.tsx                          # Updated to fetch progress
└── components/
    └── LessonCard.tsx                    # Updated to show locked state
```

### Files to Update
```
/mathtutor/
├── app/
│   ├── dashboard/page.tsx               # Fetch progress, show locks
│   ├── lesson/[id]/
│   │   ├── components/
│   │   │   └── ResultsScreen.tsx        # Link to sub-lesson page
│   │   └── page.tsx                     # No changes (already generic)
│   └── api/
│       └── session/start/route.ts       # Add unlock validation
├── components/
│   └── LessonCard.tsx                   # Add locked state UI
└── lib/
    └── content.json                     # Verify sub-lesson IDs (no changes)
```

---

## Next Steps

1. **Create GitHub Issue:** Label as `feature/progression`, link to this PRP
2. **Create Feature Branch:** `feat/lesson-progression-completion`
3. **Assign Tasks:** Break into 5 phases, estimate 2-3 days
4. **Code Review:** After each phase, verify tests pass
5. **Deploy to Staging:** Test with real users before production
6. **Monitor:** Track completion rate, time-to-mastery, failure rates

---

## Questions & Clarifications

Before starting, confirm:

1. ✅ Are all 3 lessons + items already in content.json? (YES, verified)
2. ✅ Is the existing Lesson 1 quiz fully working? (YES, verified)
3. ✅ Should sub-lessons use fresh item selection or same items as quiz? (Fresh selection, different 3-5 items)
4. ✅ What happens if student fails Lesson 2 twice? (Cap at 2 retries, show "Ask parent" message)
5. ✅ Should completion page be shared on social media? (Yes, optional share button via Web Share API)

**All clarified. Ready to implement!**

---

**Generated:** 2025-11-06
**Status:** Ready for Implementation
**Next Action:** Create GitHub issue & start Phase 1
