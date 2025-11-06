# Math Tutor Architecture & Data Flow

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React/Next.js)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Pages:                                               │   │
│  │ - Home (public)        - Dashboard (protected)       │   │
│  │ - Sign-in/Sign-up      - Lesson Quiz (protected)     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Components:                                          │   │
│  │ - Header (user info)    - LessonCard (status)        │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTP Requests
                   │ (to be built)
                   v
┌──────────────────────────────────────────────────────────────┐
│              Backend API Routes (Next.js)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ POST   /api/quiz              - Create session       │   │
│  │ GET    /api/quiz/[sessionId]  - Get session details  │   │
│  │ POST   /api/quiz/[id]/submit  - Submit answers       │   │
│  │ GET    /api/lessons           - List lessons         │   │
│  │ GET    /api/progress          - Get user progress    │   │
│  │ PATCH  /api/progress/[lessonId] - Update mastery     │   │
│  │ POST   /api/feedback          - Generate AI tips     │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────────────┘
                   │ Prisma ORM
                   │ (queries/mutations)
                   v
┌──────────────────────────────────────────────────────────────┐
│              Database (PostgreSQL/Supabase)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Tables:                                              │   │
│  │ - User (Clerk-linked)      - Session                 │   │
│  │ - Lesson                   - SessionResponse         │   │
│  │ - LessonItem               - UserProgress            │   │
│  │ - SubLesson                                          │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘

Authentication Layer:
┌──────────────────────────────────────────────────────────────┐
│  Clerk (Auth Provider)                                       │
│  ├─ Middleware: Protects /dashboard, /lesson routes         │
│  ├─ UI: SignInButton, SignUpButton, UserButton              │
│  └─ Utilities: currentUser(), auth() for server code        │
└──────────────────────────────────────────────────────────────┘
```

---

## Key Data Models & Relationships

### User
```
User (Clerk-linked)
├─ id: string (CUID)
├─ clerkId: string (unique, from Clerk)
├─ email: string (unique)
├─ firstName, lastName
├─ createdAt, updatedAt
└─ relations:
   ├─ progress[] -> UserProgress (one-to-many)
   └─ sessions[] -> Session (one-to-many)
```

### Lesson
```
Lesson
├─ id: string (CUID)
├─ order: number (unique, 1-3)
├─ title: string (e.g., "Make-10 Strategy")
├─ description: string
├─ strategyTag: string (e.g., "make-10")
├─ createdAt
└─ relations:
   ├─ items[] -> LessonItem (one-to-many)
   ├─ subLessons[] -> SubLesson (one-to-many)
   └─ progress[] -> UserProgress (one-to-many)
```

### Session (Quiz Attempt)
```
Session
├─ id: string (CUID)
├─ userId: string (FK -> User)
├─ lessonId: string (FK -> Lesson)
├─ startedAt: DateTime
├─ score: float (nullable)
├─ passed: boolean
└─ relations:
   ├─ user -> User
   └─ responses[] -> SessionResponse (one-to-many)
```

### SessionResponse (Single Answer)
```
SessionResponse
├─ id: string (CUID)
├─ sessionId: string (FK -> Session)
├─ itemId: string (FK -> LessonItem)
├─ answer: number (user's answer)
├─ isCorrect: boolean
├─ timeMs: number (response time)
└─ relations:
   ├─ session -> Session
   └─ item -> LessonItem
```

### UserProgress (Mastery Tracking)
```
UserProgress
├─ id: string (CUID)
├─ userId: string (FK -> User)
├─ lessonId: string (FK -> Lesson) 
├─ masteryScore: float (0-100)
├─ completed: boolean (masteryScore >= 90)
├─ lastAttempt: DateTime (nullable)
├─ createdAt, updatedAt
└─ unique constraint: [userId, lessonId]
   (one UserProgress per user-lesson combo)
```

### LessonItem (Question)
```
LessonItem
├─ id: string (CUID)
├─ lessonId: string (FK -> Lesson)
├─ question: string (e.g., "8 + 5 = ?")
├─ answer: number (correct answer)
├─ strategyTag: string (e.g., "complement_miss" for AI routing)
├─ order: number (position in lesson)
└─ unique constraint: [lessonId, order]
```

### SubLesson (Remediation Topic)
```
SubLesson
├─ id: string (CUID)
├─ lessonId: string (FK -> Lesson)
├─ title: string
├─ description: string
├─ order: number
├─ diagnosticPrompt: string (for AI feedback)
└─ unique constraint: [lessonId, order]
```

---

## Data Flow: Quiz Session Example

```
1. User Starts Quiz
   ┌─────────────────────────────────────────┐
   │ Dashboard → "Start Lesson 1" button     │
   │ POST /api/quiz { lessonId: "1" }        │
   └─────────────────────────────────────────┘
                      │
                      v
   ┌─────────────────────────────────────────┐
   │ API: POST /api/quiz/route.ts            │
   │ - Get userId from Clerk                 │
   │ - Create Session record                 │
   │ - Select 10 random LessonItems          │
   │ - Return session with questions         │
   └─────────────────────────────────────────┘
                      │
                      v
   ┌─────────────────────────────────────────┐
   │ Database Insert:                        │
   │ INSERT INTO Session (userId, lessonId)  │
   │ INSERT into cache: [question list]      │
   └─────────────────────────────────────────┘
                      │
                      v
   ┌─────────────────────────────────────────┐
   │ UI: Quiz page shows 10 questions        │
   │ User answers each question              │
   └─────────────────────────────────────────┘

2. User Submits Answers
   ┌─────────────────────────────────────────┐
   │ Quiz UI → "Submit" button               │
   │ POST /api/quiz/[sessionId]/submit       │
   │ { answers: [1, 4, 2, ...] }             │
   └─────────────────────────────────────────┘
                      │
                      v
   ┌─────────────────────────────────────────┐
   │ API: POST /api/quiz/[id]/submit         │
   │ - Get sessionId and answers             │
   │ - Compare with correct answers          │
   │ - Calculate score (correct/10)          │
   │ - Create SessionResponse records        │
   │ - Update UserProgress.masteryScore      │
   │ - Determine if passed (>= 90%)          │
   │ - Return results + feedback prompts     │
   └─────────────────────────────────────────┘
                      │
                      v
   ┌─────────────────────────────────────────┐
   │ Database Updates:                       │
   │ INSERT into SessionResponse × 10        │
   │ UPDATE UserProgress SET masteryScore    │
   │ UPDATE Session SET score, passed        │
   │ SELECT SubLesson (if failed)            │
   └─────────────────────────────────────────┘
                      │
                      v
   ┌─────────────────────────────────────────┐
   │ Results Page:                           │
   │ - Show score (e.g., 8/10 = 80%)         │
   │ - If passed: "Unlock next lesson"       │
   │ - If failed: "Review & retry" + tips    │
   └─────────────────────────────────────────┘
```

---

## Authentication Flow

```
1. Unauthenticated User
   ┌───────────────────┐
   │ Visit homepage    │
   │ (GET /)           │
   └─────────┬─────────┘
             │
             v
   ┌──────────────────────────────┐
   │ Homepage shows:              │
   │ - Title & description        │
   │ - Sign In button             │
   │ - Sign Up button             │
   └──────────────────────────────┘

2. Click Sign In → Clerk Modal
   ┌──────────────────────────────┐
   │ Clerk Auth Modal:            │
   │ - Email/password OR          │
   │ - Social login               │
   │ (Test: any email works)      │
   └─────────┬────────────────────┘
             │ (authenticated)
             v
   ┌──────────────────────────────┐
   │ Middleware checks:           │
   │ - Route protection active?   │
   │ - User has Clerk token?      │
   │ - Route is /dashboard?       │
   └─────────┬────────────────────┘
             │ YES to all
             v
   ┌──────────────────────────────┐
   │ Dashboard loads:             │
   │ - Header: "Welcome, [Name]"  │
   │ - Fetch /api/lessons         │
   │ - Show lesson cards          │
   │ (1st unlocked, 2-3 locked)   │
   └──────────────────────────────┘

3. User Info Available
   ┌──────────────────────────────┐
   │ Server code:                 │
   │ const user = await           │
   │   currentUser()              │
   │ user.id (Clerk ID)           │
   │ user.firstName               │
   │ user.primaryEmailAddress     │
   └──────────────────────────────┘

   ┌──────────────────────────────┐
   │ API routes:                  │
   │ const { userId } =           │
   │   await auth()               │
   │ // userId = user's Clerk ID  │
   └──────────────────────────────┘
```

---

## Mastery & Progression Logic

```
Mastery Threshold: 90% (9 out of 10 correct)

┌────────────────────────────────────────┐
│ Session Results                        │
├────────────────────────────────────────┤
│ Score: 8/10 = 80%  →  FAILED           │
│        ├─ UserProgress.masteryScore    │
│        │  accumulates toward 90%       │
│        └─ Show remediation options     │
│           (SubLesson tips)             │
│                                        │
│ Score: 9/10 = 90%  →  PASSED           │
│        ├─ UserProgress.completed=true  │
│        ├─ Unlock next lesson           │
│        └─ Show celebration             │
│                                        │
│ Score: 10/10 = 100% → PASSED (perfect) │
│        └─ Same as 9/10 (all >= 90%)    │
└────────────────────────────────────────┘

Lesson Progression:
┌─────────────────────────────────────┐
│ Lesson 1 (Make-10)                  │
│ [UNLOCKED] Take quiz → 90% → DONE   │
│ locked=false, completed=true        │
└──────────────┬──────────────────────┘
               │
               v
┌─────────────────────────────────────┐
│ Lesson 2 (Doubles & Near-Doubles)   │
│ [NOW UNLOCKED] Take quiz            │
│ locked=false (was true)             │
└──────────────┬──────────────────────┘
               │
               v
┌─────────────────────────────────────┐
│ Lesson 3 (Choosing Strategies)      │
│ [LOCKED] Must complete Lesson 2     │
│ locked=true                         │
└─────────────────────────────────────┘
```

---

## Curriculum Structure (content.json)

```
3 Lessons (in order of progression)
│
├─ Lesson 1: Make-10 Strategy (order: 1)
│  ├─ SubLessons
│  │  └─ "Introduction to Make-10" (diagnosticPrompt for AI)
│  └─ Items (15+ problems)
│     ├─ "8 + 5 = ?" (strategyTag: "complement_miss")
│     ├─ "9 + 6 = ?" (strategyTag: "complement_miss")
│     └─ ... (tagged for AI feedback routing)
│
├─ Lesson 2: Doubles & Near-Doubles (order: 2)
│  ├─ SubLessons
│  │  └─ "Learning Doubles" (diagnosticPrompt for AI)
│  └─ Items (15+ problems)
│     ├─ "5 + 5 = ?" (strategyTag: "double_error")
│     └─ ... (tagged for AI feedback routing)
│
└─ Lesson 3: Choosing Strategies (order: 3)
   ├─ SubLessons
   │  └─ "Strategy Selection" (diagnosticPrompt for AI)
   └─ Items (15+ problems)
      ├─ "7 + 8 = ?" (strategyTag: "strategy_selection")
      └─ ... (tagged for AI feedback routing)

Strategy Tags:
├─ "complement_miss"  → AI tip: focus on complement to 10
├─ "double_error"     → AI tip: practice doubles
├─ "strategy_selection" → AI tip: choose best strategy
└─ "basic_addition"   → AI tip: basic addition review
```

---

## File Dependencies Map

```
app/page.tsx (Home)
├─ @clerk/nextjs (SignInButton, SignUpButton)
├─ @clerk/nextjs/server (currentUser)
└─ No database access

app/dashboard/page.tsx (Dashboard)
├─ currentUser() from Clerk
├─ (to be connected) GET /api/lessons
├─ components/LessonCard
└─ app/dashboard/layout.tsx

app/lesson/[id]/page.tsx (Quiz - placeholder)
├─ (to be connected) GET /api/quiz/[sessionId]
├─ (to be connected) POST /api/quiz/[sessionId]/submit
└─ Quiz UI components (to be built)

app/api/quiz/route.ts (to be built)
├─ lib/prisma (Database access)
├─ @clerk/nextjs/server (currentUser for userId)
├─ z (Zod for validation)
├─ lib/content.json (Lesson data reference)
└─ Database: User, Lesson, Session, SessionResponse, UserProgress

components/LessonCard.tsx
└─ No external dependencies (pure component)

lib/prisma.ts
├─ @prisma/client (PrismaClient)
└─ process.env (NODE_ENV, DATABASE_URL)

middleware.ts
├─ @clerk/nextjs/server (clerkMiddleware, createRouteMatcher)
└─ Protects /dashboard and /lesson routes

prisma/seed.ts
├─ @prisma/client (PrismaClient)
└─ lib/content.json (curriculum data)
```

---

## API Request/Response Patterns (to implement)

### POST /api/quiz - Start Quiz Session
```
Request:
{
  "lessonId": "lesson-1"
}

Response (201):
{
  "sessionId": "sess_abc123",
  "lessonId": "lesson-1",
  "questions": [
    { "itemId": "item-1-3", "question": "7 + 4 = ?" },
    { "itemId": "item-1-7", "question": "6 + 9 = ?" },
    ... (10 total, non-repeating)
  ],
  "startedAt": "2024-11-06T10:30:00Z"
}
```

### POST /api/quiz/[sessionId]/submit - Submit Answers
```
Request:
{
  "answers": [11, 15, 12, 13, 14, 10, 16, 12, 14, 13]
}

Response (200):
{
  "sessionId": "sess_abc123",
  "score": 0.8,
  "passed": false,
  "passed_threshold": 0.9,
  "results": [
    { "itemId": "item-1-3", "correct": true, "userAnswer": 11 },
    { "itemId": "item-1-7", "correct": false, "userAnswer": 15, "correctAnswer": 14 },
    ... (10 total)
  ],
  "masteryScore": 0.73,
  "nextAction": {
    "type": "remediate",
    "subLessonId": "sub-1-1",
    "diagnosticPrompt": "Student struggles with complement_miss..."
  }
}

Response (400):
{
  "error": "Validation failed",
  "details": [...]
}
```

### GET /api/progress - Get User's Progress
```
Response (200):
{
  "totalLessons": 3,
  "lessons": [
    {
      "lessonId": "lesson-1",
      "title": "Make-10 Strategy",
      "masteryScore": 0.92,
      "completed": true,
      "locked": false
    },
    {
      "lessonId": "lesson-2",
      "title": "Doubles & Near-Doubles",
      "masteryScore": 0.0,
      "completed": false,
      "locked": false
    },
    {
      "lessonId": "lesson-3",
      "title": "Choosing Strategies",
      "masteryScore": 0.0,
      "completed": false,
      "locked": true
    }
  ]
}
```

---

## Deployment Checklist

- [ ] All 7 API routes created and tested
- [ ] Quiz UI component built and interactive
- [ ] Dashboard connected to real lesson data
- [ ] OpenAI API key added to environment
- [ ] Tests written (expected, edge, failure cases)
- [ ] Type checking passes: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Tests pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] Deployed to Vercel with environment variables

