# Math Tutor - Quick Reference Guide

## Project Structure At A Glance

```
/Users/josh/code/claude-code/math-tutor_v2/mathtutor
├── app/                 # Next.js pages & layouts
│   ├── (public)        # Home page, sign-in, sign-up
│   └── dashboard/      # Protected: user dashboard
├── components/         # Reusable components (Header, LessonCard)
├── lib/               # Utilities (prisma.ts, content.json)
├── prisma/            # Database schema & migrations
├── __tests__/         # Jest tests
└── [config files]     # Jest, TypeScript, Tailwind, ESLint, Next.js
```

---

## 1. Database & ORM

**Prisma Client Location:** `lib/prisma.ts`

```typescript
import { prisma } from "@/lib/prisma";

// Example usage
const user = await prisma.user.findUnique({
  where: { clerkId: userId },
  include: { progress: true }
});
```

**Key Models:**
- `User` - Clerk-linked users
- `Lesson` - 3 curriculum units
- `LessonItem` - Individual questions
- `Session` - Quiz attempts
- `SessionResponse` - Individual answers
- `UserProgress` - Mastery tracking (90% = advance)
- `SubLesson` - Remediation topics

---

## 2. Authentication (Clerk)

**Protect Routes:** Routes under `/dashboard(.*)` and `/lesson(.*)` are protected by middleware.

**Get Current User in Server Code:**
```typescript
import { currentUser } from "@clerk/nextjs/server";

const user = await currentUser();
if (!user) return; // Not authenticated
const clerkId = user.id;
```

**Environment Variables:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

---

## 3. API Routes (TODO - Not Yet Created)

**Where to Create:** `/app/api/[resource]/route.ts`

**Template with Validation (Zod):**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const RequestSchema = z.object({
  lessonId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const data = RequestSchema.parse(body);

    // Database logic here
    const result = await prisma.session.create({
      data: {
        userId,
        lessonId: data.lessonId,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## 4. Styling with Tailwind CSS 4

**Custom Color Palette (in `app/globals.css`):**
- `kid-blue-50`, `kid-blue-500`, `kid-blue-700`
- `kid-green-500`, `kid-green-600`
- `kid-purple-50`, `kid-purple-500`, `kid-purple-600`
- `kid-yellow-500`, `kid-pink-500`
- `success-color`, `error-color`

**Usage:**
```tsx
<div className="bg-kid-blue-50 text-kid-blue-700">
  <button className="kid-button-primary">Click me</button>
</div>
```

**Global Styles:** `app/globals.css`
**PostCSS:** `postcss.config.mjs`

---

## 5. Testing with Jest

**Test Location:** `__tests__/` (mirrors `app/` structure)

**Example Test:**
```typescript
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(() => Promise.resolve(null)),
}));

describe("HomePage", () => {
  it("displays welcome message", async () => {
    render(await HomePage());
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });
});
```

**Run Tests:**
```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
```

**Pattern to Follow (per CLAUDE.md):**
- 1 test for expected behavior
- 1 test for edge case
- 1 test for failure case

---

## 6. Component Structure

**Location:** `components/`

**Naming & Organization:**
- Files: PascalCase (e.g., `Header.tsx`)
- As complexity grows, refactor to:
  ```
  components/ComponentName/
  ├── index.tsx      # Main component
  ├── utils.ts       # Helpers
  └── styles.ts      # Tailwind (if complex)
  ```

**Current Components:**
- `Header.tsx` - Shows app title + user name + sign-out
- `LessonCard.tsx` - Displays lesson card with lock/complete status

---

## 7. Useful Commands

```bash
# Development
npm run dev                 # Start dev server at localhost:3000
npm run build              # Build for production
npm start                  # Run production server

# Code Quality
npm run lint               # ESLint check
npm run type-check         # TypeScript check

# Database
npm run prisma:generate   # Generate Prisma client
npm run prisma:seed       # Seed database with curriculum

# Testing
npm test                  # Run tests
npm run test:watch       # Watch mode
```

---

## 8. Key Files at a Glance

| File | Purpose |
|------|---------|
| `lib/prisma.ts` | Prisma client singleton |
| `middleware.ts` | Clerk auth protection |
| `prisma/schema.prisma` | Database schema (7 models) |
| `prisma/seed.ts` | Curriculum seeding script |
| `lib/content.json` | 3 lessons, 45+ problems |
| `app/globals.css` | Tailwind + custom colors |
| `jest.config.ts` | Jest configuration |
| `.env.local` | Clerk keys + DB URL |
| `package.json` | Dependencies + scripts |

---

## 9. Common Tasks

### Add a New API Route
1. Create `app/api/resource/route.ts`
2. Use `auth()` from `@clerk/nextjs/server` for userId
3. Add Zod validation for request body
4. Use `prisma` from `lib/prisma.ts` for DB access
5. Return `NextResponse.json()` with proper status codes

### Add a New Component
1. Create `components/MyComponent.tsx`
2. Define TypeScript interface for props
3. Add JSDoc comment per CLAUDE.md
4. Use Tailwind classes with kid-* colors

### Add a Test
1. Create `__tests__/app/my-page.test.tsx`
2. Mock external dependencies (Clerk)
3. Test expected behavior, edge case, failure case
4. Run `npm test` to verify

### Seed Database
```bash
npm run prisma:seed
```

---

## 10. Important Notes

### Current Limitations
- NO API routes yet (all to be built)
- Dashboard shows mock data (not connected to DB)
- Lesson pages are placeholders
- No OpenAI integration yet

### Next Priority Items
1. Create `/app/api/quiz/route.ts` - Session management
2. Create `/app/api/progress/route.ts` - Mastery tracking
3. Connect dashboard to real Lesson data from DB
4. Implement quiz UI with 10 questions per session
5. Add scoring logic (90% mastery threshold)
6. Integrate OpenAI for AI feedback

### Development Flow
1. Create API route with validation
2. Add tests (expected, edge, failure)
3. Connect UI component to API
4. Verify with `npm test` and `npm run type-check`
5. Test manually with `npm run dev`

---

## File Locations Summary

```
Prisma Client:        /Users/josh/code/claude-code/math-tutor_v2/mathtutor/lib/prisma.ts
Auth Middleware:      /Users/josh/code/claude-code/math-tutor_v2/mathtutor/middleware.ts
DB Schema:            /Users/josh/code/claude-code/math-tutor_v2/mathtutor/prisma/schema.prisma
Curriculum Data:      /Users/josh/code/claude-code/math-tutor_v2/mathtutor/lib/content.json
Tests:                /Users/josh/code/claude-code/math-tutor_v2/mathtutor/__tests__/
Styles:               /Users/josh/code/claude-code/math-tutor_v2/mathtutor/app/globals.css
Config:               /Users/josh/code/claude-code/math-tutor_v2/mathtutor/[various]
```

