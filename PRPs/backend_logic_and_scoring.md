# Backend Logic for Lessons and Scoring in Math Tutor AI

**PRP Status:** Ready for Implementation
**Difficulty Level:** Medium
**Estimated Duration:** 4-6 hours
**Confidence Score:** 9/10

---

## FEATURE SUMMARY

This PRP implements the core server-side logic for the Math Tutor AI app, creating functional API endpoints for quiz sessions, answer scoring with personalized feedback, and user progress tracking. The system uses a hybrid approach: **rule-based error tagging** for reliability and cost-efficiency, combined with **OpenAI integration** for natural-language kid-friendly feedback tips.

**Key Outcomes:**
- 6 functional API routes with proper auth, validation, and error handling
- Session management: exactly 10 non-repeating questions per session
- Mastery scoring: 90% accuracy gate for lesson advancement
- Adaptive feedback: AI-generated personalized tips + sub-lesson suggestions
- Progress persistence: Secure endpoints for reading/updating user mastery data
- Full test coverage with unit tests + example flows

---

## IMPLEMENTATION STRATEGY

### Architecture Overview

```
Quiz Flow:
┌─ POST /api/session/start ──→ Create Session (10 random items)
│                              ↓
├─ POST /api/session/answer ──→ Score response (rule-based tags + OpenAI)
│  (repeat 10x)                ↓
└─ POST /api/session/complete → Calculate mastery, unlock next lesson, suggest sub-lesson

Progress Management:
┌─ GET /api/progress ──→ Fetch user progress (lessons, mastery scores)
└─ POST /api/progress  → Update user progress after session

Error Tagging System (Rule-Based, No AI Cost):
Input: question, userAnswer, correctAnswer
Process: Match patterns (complement_miss, doubles_confusion, etc.)
Output: { correct, tags[], masteryImpact }
Examples:
  - 7+3=8 → complement_miss (didn't make 10)
  - 6+7=13 → near_double_confusion (expected 12)
  - 5+5=11 → double_miss (should be 10)

OpenAI Integration (Only on Errors):
Input: error tags + question
Process: GPT-3.5-turbo (low-temp 0.2 for consistency)
Output: Kid-friendly tip (<50 words)
Cache: Store common prompts to reduce API calls
```

### Data Flow with Prisma

```typescript
Session Creation:
User → create Session → fetch 10 random LessonItems (non-repeating)
         ↓
       Store in memory (userId-keyed Map) + Session record

Answer Submission:
User answer → tag error (rule-based) → create SessionResponse
              ↓
            If error: call OpenAI for feedback
            Store response in SessionResponse

Session Complete:
Calculate: correct_count / 10 * 100 = masteryScore
If masteryScore >= 90:
  - Set UserProgress.completed = true
  - Create notification for next lesson
  - Analyze top error tags → suggest SubLesson
Else:
  - Save top error tags
  - Queue suggested SubLesson
```

---

## CODEBASE CONTEXT

### Current State
- **API Routes:** None exist yet (0 files in `/app/api`)
- **Prisma Models:** All 7 models created ✅
  - User, Lesson, SubLesson, LessonItem, UserProgress, Session, SessionResponse
  - Database: Supabase PostgreSQL (connected, seeded with 3 lessons + 15 items)
- **Auth:** Clerk fully integrated ✅
- **Validation:** Zod ready to use (in dependencies)

### Patterns to Follow (from CODEBASE_ANALYSIS.md)

**File Structure for New Routes:**
```
/app/api/[resource]/route.ts
Example: /app/api/session/route.ts
         /app/api/progress/route.ts
```

**Auth Pattern (from QUICK_REFERENCE.md):**
```typescript
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**Validation Pattern (Zod, from existing templates):**
```typescript
import { z } from "zod";

const requestSchema = z.object({
  lessonId: z.string().uuid(),
  answer: z.number().int().min(0).max(20),
});

const data = requestSchema.parse(await req.json());
```

**Error Handling Pattern:**
```typescript
try {
  // Logic
} catch (error) {
  console.error("[Route Name]:", error);
  if (error instanceof z.ZodError) {
    return NextResponse.json({ errors: error.errors }, { status: 400 });
  }
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
```

**Prisma Query Pattern (from lib/prisma.ts):**
```typescript
import { prisma } from "@/lib/prisma";

const lesson = await prisma.lesson.findUnique({
  where: { id: lessonId },
  include: { items: true, subLessons: true }
});
```

---

## PACKAGE IMPLEMENTATIONS

### Next.js 16 Route Handlers
- **File:** `route.ts` in any `/app/api/**` folder
- **Methods:** `export async function GET/POST/PUT/DELETE(request: NextRequest)`
- **Returns:** `NextResponse.json()` or `Response`
- **Auth:** Use `auth()` from `@clerk/nextjs/server`
- **Reference:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers

### OpenAI Node.js SDK
- **Package:** `openai` (latest 4.x)
- **Installation:** Already needed, add to dependencies if missing
- **Pattern:**
  ```typescript
  import OpenAI from "openai";
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.2,
    max_tokens: 100,
    messages: [{ role: "user", content: prompt }],
  });
  return completion.choices[0].message.content;
  ```
- **Models:** Use `gpt-3.5-turbo` or `gpt-4o-mini` (lower cost for kid feedback)
- **Temperature:** 0.2 (low, consistent responses)
- **Reference:** https://platform.openai.com/docs/api-reference/chat/create

### Zod Validation
- **Already installed:** `zod@^3`
- **Pattern:** Define schema, call `.parse()` or `.safeParse()`
- **In routes:** Wrap in try/catch, return 400 on ZodError
- **Reference:** https://zod.dev

### Prisma Client
- **Singleton:** `/lib/prisma.ts` (already created)
- **Import:** `import { prisma } from "@/lib/prisma"`
- **Query patterns:**
  - `findUnique()` with `where`
  - `findMany()` with `where`, `include`
  - `create()` with nested data
  - `update()` with data
  - `aggregate()` for stats
- **Reference:** https://www.prisma.io/docs/concepts/components/prisma-client/crud

---

## API ENDPOINTS SPECIFICATION

### 1. POST /api/session/start
**Purpose:** Start a new quiz session with 10 non-repeating questions

**Request:**
```json
{
  "lessonId": "lesson-1"
}
```

**Response (201 Created):**
```json
{
  "sessionId": "session-abc123",
  "lessonId": "lesson-1",
  "lessonTitle": "Make-10 Strategy",
  "totalQuestions": 10,
  "questions": [
    {
      "itemId": "item-1-1",
      "question": "8 + 5 = ?",
      "order": 1
    },
    // ... 9 more
  ]
}
```

**State Management:**
- Store session in memory: `sessionMap.set(userId, { sessionId, items[], responses[] })`
- Create Prisma Session record
- Fetch 10 random LessonItems (use `findMany` with `skip: random()`)

**Error Handling:**
- 400: Missing/invalid lessonId
- 401: Not authenticated
- 404: Lesson not found
- 409: User already has active session (optional, depends on UX)

---

### 2. POST /api/session/answer
**Purpose:** Submit an answer, score it, and optionally generate feedback

**Request:**
```json
{
  "sessionId": "session-abc123",
  "itemId": "item-1-1",
  "userAnswer": 12
}
```

**Response (200 OK):**
```json
{
  "itemId": "item-1-1",
  "correct": true,
  "correctAnswer": 13,
  "userAnswer": 12,
  "feedback": "Great try! 8 is close to 10. Let's make 10 first: 8 + 2 = 10. Then add the 3 more: 10 + 3 = 13.",
  "tags": ["complement_miss"],
  "questionsRemaining": 7
}
```

**Logic:**
1. Validate session exists and is active
2. Compare userAnswer to item.answer → mark correct/incorrect
3. If incorrect:
   a. Tag error using rule-based system (see below)
   b. Call OpenAI to generate kid-friendly tip
   c. Store tags in session for summary
4. Create SessionResponse record
5. Check if 10 answers submitted → auto-complete if yes

**Error Tagging Rules (Rule-Based, No AI):**
```typescript
function tagError(question: string, userAnswer: number, correctAnswer: number): string[] {
  const tags: string[] = [];

  // Complement to 10 miss
  if (correctAnswer >= 10 && userAnswer === (correctAnswer - 10)) {
    tags.push("complement_miss");
  }

  // Double answer off by 1
  if (correctAnswer % 2 === 0 && userAnswer === correctAnswer - 1) {
    tags.push("near_double_off");
  }

  // Counted up wrong
  if (Math.abs(userAnswer - correctAnswer) > 3) {
    tags.push("counting_error");
  }

  // Forgot to add both numbers
  if (userAnswer === parseInt(question.split("+")[0])) {
    tags.push("incomplete_addition");
  }

  return tags;
}
```

**OpenAI Feedback Prompt Template:**
```
"Generate a short, encouraging tip (under 50 words) for a K-1 student who answered {question} = {userAnswer} instead of {correctAnswer}.
Error pattern: {tags[0]}.
Start with 'Great effort!' and suggest a visual strategy like counting on fingers or making 10."
```

---

### 3. POST /api/session/complete
**Purpose:** Finalize session, calculate mastery, and suggest sub-lesson if needed

**Request:**
```json
{
  "sessionId": "session-abc123"
}
```

**Response (200 OK):**
```json
{
  "sessionId": "session-abc123",
  "correctCount": 9,
  "totalCount": 10,
  "masteryScore": 90.0,
  "passed": true,
  "summary": {
    "topErrors": ["complement_miss", "near_double_off"],
    "suggestedSubLesson": {
      "id": "sub-1-1",
      "title": "Introduction to Make-10",
      "description": "Learn how to break numbers into 10 + more"
    }
  },
  "nextLessonUnlocked": {
    "id": "lesson-2",
    "title": "Doubles & Near-Doubles"
  }
}
```

**Logic:**
1. Fetch all SessionResponses for this session
2. Calculate: `masteryScore = (correct_count / 10) * 100`
3. Update UserProgress:
   - `masteryScore = calculated value`
   - `completed = (masteryScore >= 90)`
   - `lastAttempt = now()`
4. If completed:
   - Analyze top error tags
   - Find matching SubLesson (by strategyTag)
   - Check next lesson → if all prior passed, mark unlocked
5. Clear session from memory map
6. Return summary with optional sub-lesson + next lesson info

**Mastery Thresholds:**
- 90-100%: PASS, advance to next lesson
- 70-89%: PARTIAL, suggest sub-lesson remediation
- <70%: FAIL, retry current lesson

---

### 4. GET /api/progress
**Purpose:** Fetch user's lesson progress and completed status

**Response (200 OK):**
```json
{
  "userId": "user-clerk-123",
  "progress": [
    {
      "lessonId": "lesson-1",
      "lessonTitle": "Make-10 Strategy",
      "completed": true,
      "masteryScore": 92.5,
      "lastAttempt": "2025-11-06T15:30:00Z",
      "currentSubLesson": null
    },
    {
      "lessonId": "lesson-2",
      "lessonTitle": "Doubles & Near-Doubles",
      "completed": false,
      "masteryScore": 0,
      "lastAttempt": null,
      "currentSubLesson": {
        "id": "sub-2-1",
        "title": "Doubles Facts"
      }
    }
  ],
  "overallProgress": 33
}
```

**Logic:**
1. Get userId from Clerk auth
2. Query all UserProgress records for this user (with lesson includes)
3. Calculate overallProgress = (completed_count / total_lessons) * 100
4. Return formatted progress array

---

### 5. POST /api/progress/update
**Purpose:** Manually update user progress (admin/debug only, can be restricted)

**Request:**
```json
{
  "lessonId": "lesson-1",
  "masteryScore": 85.0,
  "completed": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "progress": { ... }
}
```

---

## IMPLEMENTATION TASKS (IN ORDER)

### Phase 1: Core Session API (2-3 hours)

1. **Create Utility: Error Tagging Engine**
   - File: `/lib/scoring/tagErrors.ts`
   - Function: `tagError(question: string, userAnswer: number, correctAnswer: number): string[]`
   - Tests: Add to `__tests__/lib/scoring/tagErrors.test.ts`
   - Validation: Test 5 error patterns (complement_miss, doubles, counting, incomplete, off-by-one)

2. **Create Utility: OpenAI Feedback Generator**
   - File: `/lib/scoring/generateFeedback.ts`
   - Function: `generateFeedback(question: string, userAnswer: number, correctAnswer: number, tags: string[]): Promise<string>`
   - Handle errors gracefully (fallback to rule-based template if OpenAI fails)
   - Cache responses: `Map<string, string>` with question+tags as key
   - Tests: Mock OpenAI, test fallback behavior

3. **Create Route: POST /api/session/start**
   - File: `/app/api/session/start/route.ts`
   - Validation: Zod schema for lessonId
   - Logic: Create session, fetch 10 random items, store in memory map
   - Tests: Mock Prisma, test random selection + no duplicates

4. **Create Route: POST /api/session/answer**
   - File: `/app/api/session/answer/route.ts`
   - Validation: sessionId, itemId, userAnswer
   - Logic: Score answer, tag error, generate feedback, store response
   - Tests: Test correct + incorrect paths, OpenAI mocking

5. **Create Route: POST /api/session/complete**
   - File: `/app/api/session/complete/route.ts`
   - Logic: Calculate mastery, update progress, suggest sub-lesson, check unlock
   - Tests: Test mastery thresholds (90%, 70%, <70%)

---

### Phase 2: Progress & Utility APIs (1-2 hours)

6. **Create Route: GET /api/progress**
   - File: `/app/api/progress/route.ts`
   - Logic: Fetch user progress with lesson info
   - Tests: Test for multiple lessons

7. **Create Route: POST /api/progress/update** (optional)
   - File: `/app/api/progress/update/route.ts`
   - For admin/debugging

8. **Create Session Manager Class**
   - File: `/lib/sessionManager.ts`
   - Methods: `createSession()`, `getSession()`, `completeSession()`, `clearSession()`
   - Use: Map-based in-memory store with userId as key
   - Thread-safe: Add optional locking for concurrent sessions

---

### Phase 3: Testing & Documentation (1 hour)

9. **Unit Tests for All Utilities**
   - Test tagging engine with 10+ error patterns
   - Test feedback generation with mocked OpenAI
   - Test mastery calculations

10. **Integration Tests for API Routes**
    - Test full session flow: start → 10 answers → complete
    - Test auth errors (401)
    - Test validation errors (400)

11. **Create API Documentation**
    - File: `/docs/API.md`
    - Include cURL examples for each endpoint
    - Document error codes and responses

---

## EXAMPLE TEST CASES

### Tagging Engine Test
```typescript
describe("tagError", () => {
  it("should tag complement_miss for 7+3=8", () => {
    const tags = tagError("7 + 3", 8, 10);
    expect(tags).toContain("complement_miss");
  });

  it("should tag near_double_off for 6+6=11 (expected 12)", () => {
    const tags = tagError("6 + 6", 11, 12);
    expect(tags).toContain("near_double_off");
  });

  it("should return empty array for correct answer", () => {
    const tags = tagError("7 + 3", 10, 10);
    expect(tags).toHaveLength(0);
  });
});
```

### Session Flow Integration Test
```typescript
describe("Session Flow", () => {
  it("should complete a full session: start → 10 answers → summary", async () => {
    const start = await fetch("/api/session/start", {
      method: "POST",
      body: JSON.stringify({ lessonId: "lesson-1" }),
    });
    const { sessionId } = await start.json();

    // Submit 9 correct + 1 incorrect
    for (let i = 0; i < 9; i++) {
      await fetch("/api/session/answer", {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          itemId: `item-${i}`,
          userAnswer: 12, // Assume correct
        }),
      });
    }

    // Submit incorrect answer
    await fetch("/api/session/answer", {
      method: "POST",
      body: JSON.stringify({
        sessionId,
        itemId: "item-9",
        userAnswer: 11, // Wrong
      }),
    });

    const complete = await fetch("/api/session/complete", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    });
    const result = await complete.json();

    expect(result.masteryScore).toBe(90);
    expect(result.passed).toBe(true);
  });
});
```

---

## ERROR HANDLING & EDGE CASES

### Session Validation
- ✅ Active session exists for userId
- ✅ Session has not timed out (optional: 30min limit)
- ✅ Exactly 10 answers submitted before complete()
- ✅ No duplicate item submissions

### Data Validation (Zod Schemas)
```typescript
const StartSessionSchema = z.object({
  lessonId: z.string().uuid("Invalid lesson ID"),
});

const AnswerSchema = z.object({
  sessionId: z.string().uuid(),
  itemId: z.string().uuid(),
  userAnswer: z.number().int().min(0).max(20, "Answer out of range"),
});
```

### OpenAI Fallback
```typescript
async function generateFeedback(...) {
  try {
    return await openai.chat.completions.create(...);
  } catch (error) {
    console.warn("OpenAI failed, using template:", error);
    return `Great effort! Let's practice this together.`;
  }
}
```

### Concurrency Issues
- Use `sessionMap` with `Map<string, SessionState>` (thread-safe in Node.js single-threaded model)
- For distributed systems, move session storage to Redis (future enhancement)

---

## SECURITY CONSIDERATIONS

1. **Authentication:** All routes check `userId` from Clerk auth()
2. **Input Validation:** All inputs validated with Zod
3. **SQL Injection:** Prisma parameterized queries prevent injection
4. **Rate Limiting:** Consider adding rate-limit middleware (optional for MVP)
5. **OpenAI API Key:** Should be in .env.local, never in code

**Middleware to Add (Optional):**
```typescript
// lib/middleware.ts
export function withAuth(handler) {
  return async (req, res, context) => {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return handler(req, res, { ...context, userId });
  };
}
```

---

## ENVIRONMENT VARIABLES NEEDED

```env
# Add to .env.local
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_TEMPERATURE=0.2
```

---

## VALIDATION GATES

### Syntax & Linting
```bash
npm run lint -- --fix && npm run type-check
```

### Unit Tests (All utilities + routes)
```bash
npm test -- --coverage --verbose
# Expected: >90% coverage for scoring engine and API routes
# Min: 3 tests per function
```

### Integration Tests
```bash
npm test -- api.integration.test.ts
# Test full session flow start → complete
```

### Manual Testing (Postman Collection)
```
POST /api/session/start → { sessionId, questions }
POST /api/session/answer (x10) → { correct, feedback, tags }
POST /api/session/complete → { masteryScore, passed, subLesson }
GET /api/progress → { userId, progress[] }
```

### API Response Validation
```bash
# Verify all responses match schema (run after each endpoint creation)
npm run validate-openapi
```

---

## SCOPE & LIMITATIONS

✅ **In Scope:**
- Session management (10 questions, non-repeating)
- Rule-based error tagging (hybrid with OpenAI)
- Mastery scoring (90% gate)
- Progress tracking
- User auth + validation

❌ **Out of Scope (Next Phase):**
- UI for quiz (backend only)
- Sub-lesson content delivery
- Performance optimization
- Analytics/dashboards
- Multi-session concurrency (MVP: 1 active per user)

---

## GOTCHAS & COMMON MISTAKES

1. **Forgetting to clear session from memory map** ❌
   - Fix: Call `sessionMap.delete(userId)` in complete()

2. **Over-relying on OpenAI for all feedback** ❌
   - Fix: Use rule-based tagging for decisions, OpenAI only for tips

3. **Not validating Zod errors properly** ❌
   - Fix: Catch ZodError separately, return 400 with error details

4. **Fetching same item twice in one session** ❌
   - Fix: Use `findMany({ skip: randomOffset, take: 10 })` carefully OR fetch all, shuffle, slice

5. **Not handling OpenAI timeout/rate limits** ❌
   - Fix: Always wrap in try/catch, provide fallback template

6. **Storing sensitive data in SessionResponse** ❌
   - Fix: Only store itemId, userAnswer, isCorrect, timeMs (not tags or feedback)

7. **Not clearing session if user closes browser mid-quiz** ⚠️
   - Fix: Add optional session timeout (30min) and clear on expire

---

## FILES TO CREATE/MODIFY

### New Files
```
/lib/scoring/
  ├── tagErrors.ts
  ├── tagErrors.test.ts
  ├── generateFeedback.ts
  └── generateFeedback.test.ts

/lib/sessionManager.ts

/app/api/session/
  ├── start/route.ts
  └── answer/route.ts

/app/api/session/complete/route.ts

/app/api/progress/
  ├── route.ts
  └── update/route.ts

/docs/API.md
```

### Modified Files
```
/package.json (add openai if missing)
/.env.local (add OPENAI_API_KEY)
/lib/content.json (ensure all question/answer pairs present)
```

---

## REFERENCES & DOCUMENTATION

- **Next.js API Routes:** https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Clerk Auth in Routes:** https://clerk.com/docs/references/nextjs/auth (use `auth()` not `useUser()`)
- **OpenAI Chat Completions:** https://platform.openai.com/docs/api-reference/chat/create
- **Prisma CRUD:** https://www.prisma.io/docs/concepts/components/prisma-client/crud
- **Zod Validation:** https://zod.dev
- **Math Error Patterns:** https://www.khanacademy.org/math/cc-1st-grade-math (for realistic tags)

---

## IMPLEMENTATION CHECKLIST

**Phase 1: Core Session (Start)**
- [ ] Create `/lib/scoring/tagErrors.ts` with 5+ error patterns
- [ ] Create `/lib/scoring/generateFeedback.ts` with OpenAI integration
- [ ] Create `/app/api/session/start/route.ts`
- [ ] Create `/app/api/session/answer/route.ts`
- [ ] Create `/app/api/session/complete/route.ts`
- [ ] Add unit tests for all utilities
- [ ] Test full session flow manually

**Phase 2: Progress APIs**
- [ ] Create `/app/api/progress/route.ts` (GET)
- [ ] Create `/app/api/progress/update/route.ts` (POST)
- [ ] Add progress integration tests

**Phase 3: Polish**
- [ ] All tests passing (npm test)
- [ ] Type-check passing (npm run type-check)
- [ ] Lint passing (npm run lint)
- [ ] Postman collection created with 5 test cases
- [ ] API documentation (/docs/API.md) complete

---

## SUCCESS CRITERIA

✅ **All endpoints functional:**
- Start session → returns 10 questions
- Answer question → returns correct/incorrect + feedback
- Complete session → returns mastery score + unlock info
- Get progress → returns user progress

✅ **Error handling working:**
- 401 unauthorized (no auth)
- 400 validation errors (bad input)
- 404 lesson not found
- 500 graceful OpenAI failure

✅ **Tests passing:**
- 100% coverage of tagging engine
- Full session flow test
- Progress API test

✅ **Mastery logic correct:**
- 90% = PASS
- <90% = suggest sub-lesson
- Correct unlock sequence (lesson 2 only after lesson 1)

---

## CONFIDENCE & NOTES

**Confidence Score: 9/10**

**Why High:**
- All prerequisites met (auth ✅, database ✅, schema ✅)
- Clear API contracts defined in this PRP
- Test examples provided
- Patterns match existing codebase conventions

**Risk Areas:**
- OpenAI API rate limits (mitigated by caching)
- Session race conditions (mitigated by Node.js single-thread model)
- Edge case: user submits 11th answer after session complete (needs validation)

**Recommendations:**
1. Start with tagging engine tests (most critical logic)
2. Test OpenAI fallback early (offline testing)
3. Implement session manager before routes
4. Use Postman to validate each endpoint before integration test

---

## GIT COMMIT STRATEGY

After each phase:

```bash
# Phase 1
git commit -m "feat: implement session management and quiz scoring API

- Add rule-based error tagging engine (tagErrors.ts)
- Add OpenAI feedback generation with caching
- Implement POST /api/session/start endpoint
- Implement POST /api/session/answer with tagging + feedback
- Implement POST /api/session/complete with mastery logic
- Add comprehensive unit tests for scoring engine
- All tests passing, lint clean, type-safe"

# Phase 2
git commit -m "feat: add progress tracking and user endpoints

- Implement GET /api/progress endpoint
- Implement POST /api/progress/update endpoint
- Add progress integration tests
- Update API documentation"

# Phase 3
git commit -m "test: complete API validation and documentation

- Add full session flow integration test
- Create Postman collection with example requests
- Document API with cURL examples
- Achieve >90% test coverage"
```

---

**PRP Complete & Ready for Implementation** 🚀
