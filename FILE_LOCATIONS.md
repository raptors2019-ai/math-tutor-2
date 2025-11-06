# Math Tutor - Complete File Location Reference

## Documentation Files (Project Root)

```
/Users/josh/code/claude-code/math-tutor_v2/
├── DOCUMENTATION_INDEX.md          - Navigation guide for all docs
├── CODEBASE_ANALYSIS.md            - 14 detailed sections on code patterns
├── QUICK_REFERENCE.md              - Quick lookup guide for tasks
├── ARCHITECTURE.md                 - System design and data flows
├── FILE_LOCATIONS.md               - This file
├── README.md                        - Project overview
├── CLAUDE.md                        - AI assistant guidelines
├── INITIAL.md                       - Feature template
└── mathtutor/                       - Main application directory
```

---

## Application Source Code

### App Router Pages & Layouts

```
/Users/josh/code/claude-code/math-tutor_v2/mathtutor/app/

├── page.tsx                         - Home page (public)
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/app/page.tsx
│       Shows: Welcome message, Sign In/Sign Up buttons
│       Auth: Public (no protection)

├── layout.tsx                       - Root layout (with Clerk provider)
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/app/layout.tsx
│       Contains: ClerkProvider, html, metadata

├── globals.css                      - Global styles (Tailwind 4)
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/app/globals.css
│       Contains: @import "tailwindcss", custom colors, CSS variables

├── dashboard/
│   ├── layout.tsx                   - Dashboard layout (header + navigation)
│   │   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/app/dashboard/layout.tsx
│   │       Shows: Header with user name, UserButton
│   │
│   └── page.tsx                     - Dashboard page (lessons list)
│       └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/app/dashboard/page.tsx
│           Shows: 3 lesson cards (mock data)
│           Auth: Protected (requires sign-in)

├── lesson/
│   └── [id]/
│       └── page.tsx                 - Lesson quiz page (placeholder)
│           └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/app/lesson/[id]/page.tsx
│               Shows: "Quiz content coming soon"
│               Auth: Protected (requires sign-in)

├── sign-in/
│   └── [[...sign-in]]/
│       └── page.tsx                 - Clerk sign-in page
│           └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/app/sign-in/[[...sign-in]]/page.tsx

└── sign-up/
    └── [[...sign-up]]/
        └── page.tsx                 - Clerk sign-up page
            └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/app/sign-up/[[...sign-up]]/page.tsx
```

### Components

```
/Users/josh/code/claude-code/math-tutor_v2/mathtutor/components/

├── Header.tsx                       - Header component (user info + sign-out)
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/components/Header.tsx
│       Shows: Title, user first name, UserButton
│       Usage: Can be used in layouts

└── LessonCard.tsx                   - Lesson card component
    └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/components/LessonCard.tsx
        Shows: Lesson title, description, lock/complete status
        Props: id, title, description, completed, locked
        Usage: Displayed on dashboard
```

### Libraries & Utilities

```
/Users/josh/code/claude-code/math-tutor_v2/mathtutor/lib/

├── prisma.ts                        - Prisma client singleton
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/lib/prisma.ts
│       Pattern: Singleton with dev logging
│       Usage: import { prisma } from "@/lib/prisma"

└── content.json                     - Curriculum data (3 lessons, 45+ problems)
    └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/lib/content.json
        Contains: Lessons, SubLessons, LessonItems with strategy tags
        Usage: Seed script reads from here
```

### Database (Prisma)

```
/Users/josh/code/claude-code/math-tutor_v2/mathtutor/prisma/

├── schema.prisma                    - Database schema (7 models)
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/prisma/schema.prisma
│       Models: User, Lesson, SubLesson, LessonItem, UserProgress, Session, SessionResponse

├── seed.ts                          - Database seeding script
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/prisma/seed.ts
│       Run: npm run prisma:seed
│       Does: Clears and reseeds database with curriculum

└── migrations/
    ├── 20251106145923_init/
    │   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/prisma/migrations/20251106145923_init/
    │       Status: Initial migration
    │
    └── migration_lock.toml          - Migration lock file
        └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/prisma/migration_lock.toml
```

### Middleware & Authentication

```
/Users/josh/code/claude-code/math-tutor_v2/mathtutor/

└── middleware.ts                    - Clerk auth middleware
    └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/middleware.ts
        Protects: /dashboard(.*), /lesson(.*)
        Action: Redirects to sign-in if not authenticated
```

### Testing

```
/Users/josh/code/claude-code/math-tutor_v2/mathtutor/__tests__/

├── app/
│   └── page.test.tsx                - Home page tests
│       └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/__tests__/app/page.test.tsx
│           Tests: 3 cases for HomePage (welcome, buttons, messaging)
│           Mocks: Clerk authentication

├── jest.config.ts                   - Jest configuration
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/jest.config.ts
│       Runner: next/jest
│       Environment: jsdom
│       Setup: jest.setup.ts

└── jest.setup.ts                    - Jest setup file
    └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/jest.setup.ts
        Imports: @testing-library/jest-dom
```

### Configuration Files

```
/Users/josh/code/claude-code/math-tutor_v2/mathtutor/

├── tsconfig.json                    - TypeScript configuration
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/tsconfig.json
│       Paths: "@/*": ["./*"]

├── next.config.ts                   - Next.js configuration
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/next.config.ts
│       Turbopack: Configured

├── jest.config.ts                   - Jest configuration
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/jest.config.ts

├── postcss.config.mjs               - PostCSS configuration
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/postcss.config.mjs
│       Plugin: @tailwindcss/postcss

├── eslint.config.mjs                - ESLint configuration
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/eslint.config.mjs
│       Extends: next/core-web-vitals, next/typescript

├── package.json                     - npm dependencies and scripts
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/package.json
│       Scripts: dev, build, test, lint, type-check, prisma commands

├── package-lock.json                - npm lock file
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/package-lock.json

├── .env                             - Environment variables (build time)
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/.env
│       Contains: DATABASE_URL

├── .env.local                       - Environment variables (local dev)
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/.env.local
│       Contains: Clerk keys, DATABASE_URL, route configs

└── .gitignore                       - Git ignore rules
    └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/.gitignore
```

### Build & Generated Files

```
/Users/josh/code/claude-code/math-tutor_v2/mathtutor/

├── .next/                           - Next.js build output
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/.next/

├── tsconfig.tsbuildinfo             - TypeScript build cache
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/tsconfig.tsbuildinfo

├── next-env.d.ts                    - Next.js type definitions
│   └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/next-env.d.ts

└── node_modules/                    - npm dependencies
    └── Location: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/node_modules/
```

### Public Assets

```
/Users/josh/code/claude-code/math-tutor_v2/mathtutor/public/

├── file.svg                         - File icon
├── globe.svg                        - Globe icon
├── next.svg                         - Next.js logo
├── vercel.svg                       - Vercel logo
└── favicon.ico                      - Favicon

All located at: /Users/josh/code/claude-code/math-tutor_v2/mathtutor/public/
```

---

## Environment Variables

### .env.local File
**Location:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/.env.local`

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGVhcm5pbmctc2F3Zmx5LTExLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_AImMiXKI6NJ43O7O7AJFxCclkESoss0UMCgLRpbe8R
DATABASE_URL=postgresql://postgres:S@26ryU8_v7!E5E@db.mvpeeqctvbpspiowqbsw.supabase.co:5432/postgres
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

---

## Key Model Locations

### Database Models
**Location:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/prisma/schema.prisma`

- User (Clerk-linked users)
- Lesson (3 curriculum units)
- SubLesson (remediation topics)
- LessonItem (individual questions, 45+ total)
- UserProgress (mastery tracking per lesson)
- Session (quiz attempts)
- SessionResponse (individual answers)

### Type Imports
```typescript
// Generated Prisma types
import type { User, Lesson, Session } from "@prisma/client"

// Component props interfaces
import type { LessonCardProps } from "@/components/LessonCard"
```

Location: `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/node_modules/.prisma/client/index.d.ts`

---

## API Routes to Create

**Directory:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/app/api/`

(These don't exist yet, but here's where to create them)

```
app/api/
├── quiz/
│   ├── route.ts                     - POST: Create session, GET: Get session
│   └── [sessionId]/
│       ├── route.ts                 - GET: Session details
│       └── submit/
│           └── route.ts             - POST: Submit answers
├── lessons/
│   ├── route.ts                     - GET: List lessons for user
│   └── [id]/
│       └── route.ts                 - GET: Lesson details
├── progress/
│   ├── route.ts                     - GET: User's progress
│   └── [lessonId]/
│       └── route.ts                 - PATCH: Update mastery score
└── feedback/
    └── route.ts                     - POST: Generate AI feedback
```

---

## Development Commands Location

**File:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/package.json`

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "type-check": "tsc --noEmit",
  "test": "jest",
  "test:watch": "jest --watch",
  "prisma:generate": "prisma generate",
  "prisma:seed": "tsx prisma/seed.ts"
}
```

---

## Quick Path Summary

| Purpose | File |
|---------|------|
| **Prisma Client** | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/lib/prisma.ts` |
| **DB Schema** | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/prisma/schema.prisma` |
| **Auth Middleware** | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/middleware.ts` |
| **Styles** | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/app/globals.css` |
| **Curriculum** | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/lib/content.json` |
| **Seed Script** | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/prisma/seed.ts` |
| **Tests** | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/__tests__/` |
| **Config** | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/*.config.*` |
| **Environment** | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/.env.local` |

---

## Project Root

**Base Path:** `/Users/josh/code/claude-code/math-tutor_v2/`

All documentation files and the `mathtutor/` directory are located here.

---

**Generated:** November 6, 2024  
**Purpose:** Quick reference for all file locations in the project  
**Usage:** Use this when you need absolute paths for any file

