# Math Tutor Codebase Analysis

## Overview
This is a Next.js 16 full-stack web application for personalized K-5 math tutoring. Built with TypeScript, Clerk authentication, Prisma ORM on PostgreSQL (Supabase), and Tailwind CSS 4.

**Project Root:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor`

---

## 1. API Route Structure

### Current Status
**NO API routes currently exist.** The project is still in early stages with placeholder components.

### Planned API Routes (to be built)
Based on the Prisma schema and feature requirements, the following API routes will be needed:

```
/app/api/
  ├── /quiz/
  │   ├── route.ts (POST - create quiz session, GET - retrieve session)
  │   └── /[sessionId]/
  │       ├── route.ts (GET - session details)
  │       └── /submit (POST - submit answers)
  ├── /lessons/
  │   ├── route.ts (GET - list lessons for user)
  │   └── /[id]/route.ts (GET - lesson details)
  ├── /progress/
  │   ├── route.ts (GET - user progress across all lessons)
  │   └── /[lessonId]/route.ts (PATCH - update mastery score)
  └── /feedback/
      └── route.ts (POST - generate AI feedback for errors)
```

### Authentication Pattern
- Uses Clerk middleware (`middleware.ts`) to protect routes
- Routes under `/dashboard(.*)` and `/lesson(.*)` require authentication
- User identity obtained via `currentUser()` from `@clerk/nextjs/server`
- All API routes should extract userId from Clerk auth

---

## 2. Prisma Client Usage

### Location
**File:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/lib/prisma.ts`

### Implementation Pattern
```typescript
// Singleton pattern with hot reload support in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

### Key Points
- Uses singleton pattern to prevent multiple PrismaClient instances in dev mode
- Enables query/error/warn logging in development for debugging
- Imported as: `import { prisma } from "@/lib/prisma"`

### Database Connection
- **Provider:** PostgreSQL via Supabase
- **Connection URL:** Stored in `DATABASE_URL` env var
- **Schema Location:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/prisma/schema.prisma`

---

## 3. Prisma Database Schema

### Models Overview

#### User
- Linked to Clerk authentication via `clerkId`
- Relations: `progress[]`, `sessions[]`
- Fields: id, clerkId (unique), email (unique), firstName?, lastName?, createdAt, updatedAt

#### Lesson
- 3 curriculum units (Make-10, Doubles & Near-Doubles, Choosing Strategies)
- Fields: id, order (unique), title, description, strategyTag, createdAt
- Relations: `subLessons[]`, `items[]`, `progress[]`

#### SubLesson
- Targeted remediation topics within a lesson
- Fields: id, lessonId (FK), title, description, order, diagnosticPrompt
- Unique constraint: `[lessonId, order]`
- Relations: lesson

#### LessonItem
- Individual questions/problems
- Fields: id, lessonId (FK), question, answer, strategyTag, order
- Unique constraint: `[lessonId, order]`
- Relations: lesson, responses[]

#### UserProgress
- Tracks mastery per lesson for each user
- Fields: id, userId (FK), lessonId (FK), masteryScore (float, default 0), completed (bool, default false), lastAttempt?, createdAt, updatedAt
- Unique constraint: `[userId, lessonId]`
- Mastery threshold: 90% to advance

#### Session
- Quiz attempt/session for a lesson
- Fields: id, userId (FK), lessonId (FK), startedAt, score?, passed (default false)
- Relations: user, responses[]

#### SessionResponse
- Single question response within a session
- Fields: id, sessionId (FK), itemId (FK), answer (int), isCorrect (bool), timeMs (int)
- Relations: session, item

### Schema File
**Location:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/prisma/schema.prisma`

---

## 4. Error Handling & Validation Patterns

### Current State
Currently **minimal**, mostly in placeholder pages. Following CLAUDE.md guidelines:

### Planned Patterns (per CLAUDE.md)
- **Validation:** Use Zod for API route request validation
- **Error Handling:** Try-catch blocks with meaningful error messages
- **API Response Format:** Standardized JSON responses with status codes

### Example Pattern to Implement
```typescript
// API Route with Zod validation
import { z } from "zod";

const SessionSchema = z.object({
  lessonId: z.string().min(1),
  userId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = SessionSchema.parse(body);
    // Process...
    return Response.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## 5. Authentication & Authorization Patterns

### Clerk Integration

#### Setup
- **Keys:** Located in `.env.local`
- **Publishable Key:** `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- **Secret Key:** `CLERK_SECRET_KEY`

#### Route Configuration
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

#### Middleware Implementation
**File:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/middleware.ts`

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/lesson(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();  // Redirects to sign-in if not authenticated
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

#### Getting User Info
```typescript
// Server components/routes only
import { currentUser } from "@clerk/nextjs/server";

const user = await currentUser();
// user.id (Clerk ID), user.firstName, user.lastName, user.primaryEmailAddress.emailAddress
```

#### UI Components
- `<SignInButton>` - Sign in modal trigger
- `<SignUpButton>` - Sign up modal trigger
- `<UserButton>` - User profile dropdown with sign-out

### Authorization Pattern
For API routes, extract Clerk userId and verify ownership:
```typescript
const user = await auth();
if (!user) {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
// Use user.userId for database queries
```

---

## 6. Environment Setup

### Configuration Files

#### .env.local
**Location:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/.env.local`

Contains Clerk test keys and database URL:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Test key (public)
- `CLERK_SECRET_KEY` - Test key (secret)
- `DATABASE_URL` - PostgreSQL connection string (Supabase)
- Clerk route configuration (SIGN_IN_URL, SIGN_UP_URL, etc.)

#### .env
**Location:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/.env`

Contains:
- `DATABASE_URL` - Same as .env.local (for build-time use)

### Dependencies
See `package.json` for full list:
- **Runtime:** Next.js 16, React 19, @clerk/nextjs, @prisma/client, tailwindcss
- **Dev:** Jest, Testing Library, TypeScript, ESLint, Prettier (via Tailwind)

### Notes
- Tailwind CSS 4 with PostCSS integration
- No OpenAI key configured yet (needed for AI feedback feature)

---

## 7. Existing Test Patterns & Setup

### Jest Configuration
**File:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/jest.config.ts`

```typescript
const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default createJestConfig(config);
```

### Setup File
**File:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/jest.setup.ts`

```typescript
import "@testing-library/jest-dom";
```

### Existing Tests

**Location:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/__tests__/app/page.test.tsx`

```typescript
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

// Mock Clerk
jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(() => Promise.resolve(null)),
}));

jest.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sign-in-button">{children}</div>
  ),
  SignUpButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sign-up-button">{children}</div>
  ),
}));

describe("HomePage", () => {
  it("displays welcome message when user is not signed in", async () => {
    render(await HomePage());
    expect(screen.getByText(/Welcome to Math Tutor/i)).toBeInTheDocument();
  });

  it("displays sign in and sign up buttons", async () => {
    render(await HomePage());
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  it("displays kid-friendly messaging", async () => {
    render(await HomePage());
    expect(
      screen.getByText(/Learn addition facts the fun way/i)
    ).toBeInTheDocument();
  });
});
```

### Test Pattern
- Uses React Testing Library for component tests
- Mocks external dependencies (Clerk)
- Tests accessibility and user-facing text
- Follow CLAUDE.md: Create tests with 1 expected case, 1 edge case, 1 failure case

### Running Tests
```bash
npm test                  # Run all tests
npm run test:watch       # Watch mode
```

---

## 8. Type Definitions & Interfaces

### Component Props

#### LessonCardProps
**File:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/components/LessonCard.tsx`

```typescript
interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  locked: boolean;
}
```

### Page Component Props

#### LessonPageProps
**File:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/app/lesson/[id]/page.tsx`

```typescript
interface LessonPageProps {
  params: Promise<{ id: string }>;
}
```

### Prisma-Generated Types
Located in `node_modules/.prisma/client/index.d.ts` after `prisma generate`:
- `User`
- `Lesson`
- `SubLesson`
- `LessonItem`
- `UserProgress`
- `Session`
- `SessionResponse`

Import as: `import type { User, Session } from "@prisma/client"`

### Content Data Type
**File:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/lib/content.json`

Structure:
```typescript
{
  lessons: Array<{
    id: string;
    order: number;
    title: string;
    description: string;
    strategyTag: string;
    subLessons: Array<{
      id: string;
      title: string;
      description: string;
      order: number;
      diagnosticPrompt: string;
    }>;
    items: Array<{
      id: string;
      question: string;
      answer: number;
      strategyTag: string;
      order: number;
    }>;
  }>;
}
```

---

## 9. File Structure & Naming Conventions

### Directory Layout

```
mathtutor/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout with Clerk provider
│   ├── globals.css               # Global styles (Tailwind)
│   ├── dashboard/
│   │   ├── layout.tsx            # Dashboard layout (header, navigation)
│   │   └── page.tsx              # Dashboard page (lessons list)
│   ├── lesson/[id]/
│   │   └── page.tsx              # Lesson detail/quiz page (placeholder)
│   ├── sign-in/[[...sign-in]]/
│   │   └── page.tsx              # Clerk sign-in page
│   └── sign-up/[[...sign-up]]/
│       └── page.tsx              # Clerk sign-up page
├── components/                   # Reusable React components
│   ├── Header.tsx                # Header with user info
│   └── LessonCard.tsx            # Lesson card component
├── lib/                          # Utilities and helpers
│   ├── prisma.ts                 # Prisma client singleton
│   └── content.json              # Curriculum data
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma             # Prisma schema
│   ├── seed.ts                   # Database seed script
│   └── migrations/               # Migration files
├── __tests__/                    # Test files (mirror app structure)
│   └── app/
│       └── page.test.tsx
├── middleware.ts                 # Clerk authentication middleware
├── jest.config.ts                # Jest configuration
├── jest.setup.ts                 # Jest setup file
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration
└── public/                       # Static assets
```

### Naming Conventions

#### Files
- **React Components:** PascalCase (e.g., `Header.tsx`, `LessonCard.tsx`)
- **API Routes:** lowercase with hyphens if multi-word (e.g., `route.ts`)
- **Utilities:** camelCase with `.ts` extension (e.g., `prisma.ts`)
- **Pages:** `page.tsx` or `layout.tsx` per Next.js convention
- **Tests:** Mirror source path with `.test.tsx` suffix (e.g., `__tests__/app/page.test.tsx`)

#### Directories
- **Features/Pages:** lowercase with hyphens (e.g., `/dashboard`, `/lesson`)
- **Dynamic Routes:** Square brackets (e.g., `/lesson/[id]`)
- **Catch-all:** Double square brackets (e.g., `/sign-in/[[...sign-in]]`)

### Component Organization
Per CLAUDE.md, components should follow this structure:
```
components/ComponentName/
├── index.tsx        # Main component definition
├── utils.ts         # Helper functions
└── styles.ts        # Tailwind-specific styles (if complex)
```

Currently using flat structure in `components/` (can be refactored as complexity grows).

---

## 10. Styling & Tailwind CSS Configuration

### Tailwind CSS 4 Setup

**PostCSS Config:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/postcss.config.mjs`
```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**Global Styles:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/app/globals.css`
- Uses `@import "tailwindcss"`
- Defines custom color palette for kid-friendly UI
- CSS variables for theme colors

### Custom Color Palette
```css
--kid-blue-50: #eff6ff;
--kid-blue-500: #3b82f6;
--kid-blue-700: #1d4ed8;

--kid-green-500: #10b981;
--kid-green-600: #059669;

--kid-purple-50: #f3f0ff;
--kid-purple-500: #a855f7;
--kid-purple-600: #9333ea;

--kid-yellow-500: #eab308;
--kid-pink-500: #ec4899;

--success-color: #10b981;
--error-color: #ef4444;
```

### Custom Classes
- `kid-heading` - Used in pages
- `kid-button-primary` - Used for main action buttons

### Font Setup
- Uses Geist and Geist_Mono from Google Fonts
- CSS variables: `--font-geist-sans`, `--font-geist-mono`

---

## 11. Key Development Scripts

### Available Commands
**File:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/package.json`

```bash
npm run dev                 # Start development server (http://localhost:3000)
npm run build              # Build for production
npm start                  # Start production server
npm run lint               # Run ESLint
npm run type-check         # TypeScript type checking (no emit)
npm test                   # Run Jest tests
npm run test:watch        # Jest in watch mode
npm run prisma:generate   # Generate Prisma client
npm run prisma:seed       # Seed database with curriculum data
```

---

## 12. Linting & Code Quality

### ESLint Configuration
**File:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/eslint.config.mjs`

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
export default eslintConfig;
```

### Code Style
- Uses ESLint with Next.js and TypeScript presets
- Follows ESLint best practices and Core Web Vitals rules
- Prettier integration via Tailwind CSS 4

---

## 13. Data Seeding & Content

### Seed Script
**Location:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/prisma/seed.ts`

- Reads curriculum from `/lib/content.json`
- Creates Lessons → SubLessons → LessonItems
- Clears existing data before seeding
- Logs detailed output

**Run:** `npm run prisma:seed`

### Content Data
**Location:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/lib/content.json`

Defines 3 lessons:
1. **Make-10 Strategy** (15+ items with strategy tags)
2. **Doubles & Near-Doubles** (15+ items)
3. **Choosing Strategies** (15+ items)

Each lesson has:
- Sub-lessons for targeted remediation
- Questions with answers and strategy tags
- Diagnostic prompts for AI feedback routing

---

## 14. Database Migrations

**Location:** `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/prisma/migrations/`

### Existing Migrations
- `20251106145923_init` - Initial schema with User, Lesson, Session, etc.

**To run migrations:**
```bash
npx prisma migrate dev      # Create and run migrations
npx prisma migrate deploy   # Run migrations in production
```

---

## Summary: Key Patterns & Locations

| Aspect | Location | Pattern |
|--------|----------|---------|
| **Prisma Client** | `lib/prisma.ts` | Singleton with dev logging |
| **DB Schema** | `prisma/schema.prisma` | 7 models, cascade deletes, unique constraints |
| **Auth** | `middleware.ts` | Clerk middleware protecting /dashboard, /lesson |
| **User ID** | Route handlers | Use `currentUser()` from `@clerk/nextjs/server` |
| **Tests** | `__tests__/app/page.test.tsx` | Jest + React Testing Library, mock Clerk |
| **Styles** | `app/globals.css` | Tailwind 4, custom kid-friendly colors |
| **Types** | `@prisma/client`, component interfaces | Generated + manual interfaces |
| **Content** | `lib/content.json` | 3 lessons, 15+ items each, strategy tags |
| **API Routes** | Not yet created | Will use POST/GET/PATCH with Zod validation |
| **Config** | `.env.local` | Clerk keys, DATABASE_URL |

---

## Next Steps for Development

1. **Create API routes** in `/app/api/` for quiz sessions, progress tracking
2. **Implement Zod schemas** for request validation
3. **Add error handling** with try-catch and meaningful responses
4. **Expand test coverage** following CLAUDE.md (expected, edge case, failure)
5. **Integrate OpenAI API** for AI feedback feature
6. **Connect UI to backend** - currently dashboard has mock data
7. **Implement session scoring** logic (90% mastery threshold)

