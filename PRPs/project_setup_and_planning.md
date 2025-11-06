# PRP: Project Setup and Planning for Math Tutor AI

**Status:** Ready for Implementation
**Target:** Establish foundational structure with Next.js skeleton, environment configuration, pages, and documented data models
**Scope:** Setup only - NO feature implementation beyond stubs

---

## Goal

Establish a stable, well-configured Next.js application foundation with:
1. **Running Next.js 16 app** with Tailwind CSS 4 styling and kid-friendly design
2. **Core pages:** Home (login prompt), Dashboard (lesson overview), Lesson stub (placeholder)
3. **Configured authentication** with Clerk (environment variables and middleware)
4. **Documented data models** in Prisma schema for future database integration
5. **Seeded content structure** (JSON) for 3 lessons: Make-10, Doubles & Near-Doubles, Choosing Strategies
6. **Git repository** with clean commit history

---

## Why

- **MVP Readiness:** Avoid rework by establishing patterns early (navigation, styling, auth structure)
- **Team Clarity:** Document schema before implementation prevents database migrations later
- **Faster Feature Development:** Stub pages and routing allow parallel feature work
- **Kid-Friendly Foundation:** Set design patterns early (colors, fonts, button sizes) for consistency
- **Reduced Technical Debt:** Clean setup prevents accumulating hacks

---

## What

**User-Visible Behavior:**
- Navigate to `http://localhost:3000` → See homepage with "Welcome to Math Tutor" and login button
- Click "Sign In" → Redirected to Clerk sign-in page
- After sign-in → Redirected to `/dashboard` showing lesson overview with 3 lessons (locked/available)
- Click "Start Lesson" → Placeholder page showing "Quiz content coming soon"
- Click user menu → See profile or sign-out option

**Technical Requirements:**
- Next.js 16.0.1 App Router (async params/searchParams)
- Tailwind CSS 4 with custom kid-friendly color palette and fonts
- Clerk authentication with protected routes
- Prisma schema (not connected to DB yet) with models for User, Lesson, SubLesson, Item, Attempt
- content.json with curriculum structure (3 lessons, sub-lessons, items)
- Environment variables configured (.env.local)
- Responsive design for mobile-first kid interactions
- TypeScript strict mode enabled
- ESLint rules passing

---

## Success Criteria

- [ ] `npm run dev` starts cleanly at `http://localhost:3000`
- [ ] Homepage renders with kid-friendly styling (pastel colors, large fonts)
- [ ] Sign-in/Sign-up pages functional with Clerk (redirect URLs working)
- [ ] Dashboard page displays after sign-in
- [ ] Lesson stub page renders with placeholder text
- [ ] `npx tsc --noEmit` passes (no TypeScript errors)
- [ ] `npm run lint` passes (ESLint clean)
- [ ] Prisma schema models documented and validated
- [ ] `.env.local` configured with Clerk keys (test keys acceptable)
- [ ] Git repository initialized with clean commit history
- [ ] README.md updated with setup instructions
- [ ] No console warnings about missing dependencies or configuration

---

## All Needed Context

### Documentation & References (MUST READ)

#### Core Framework
- **Next.js 16 Documentation:** https://nextjs.org/docs
  - **App Router Guide:** https://nextjs.org/docs/app (routing, layout structure)
  - **Environment Variables:** https://nextjs.org/docs/pages/guides/environment-variables
  - **Metadata API:** https://nextjs.org/docs/app/api-reference/functions/metadata
  - **CRITICAL:** In Next.js 16, `params` and `searchParams` are **async** - must be awaited:
    ```typescript
    const params = await params
    const id = params.id
    ```

#### Styling & UI
- **Tailwind CSS 4:** https://tailwindcss.com/docs
  - **Installation (PostCSS):** https://tailwindcss.com/docs/guides/nextjs
  - **Theme Configuration:** https://tailwindcss.com/docs/theme
  - **v4 Key Change:** Use `@theme` directive in CSS for customization (not `tailwind.config.js`)
  - **Responsive Design:** https://tailwindcss.com/docs/responsive-design
  - **Color Customization Example:**
    ```css
    @theme {
      --color-kid-blue: #60A5FA;
      --color-kid-green: #34D399;
    }
    ```

#### Authentication
- **Clerk Next.js Quickstart:** https://clerk.com/docs/quickstarts/nextjs
  - **Environment Setup:** https://clerk.com/docs/guides/development/clerk-environment-variables
  - **Sign-In/Sign-Up Components:** https://clerk.com/docs/nextjs/components/authentication
  - **Middleware Protection:** Auth routes pattern for v16
  - **Test Keys Format:** `pk_test_...` (publishable) and `sk_test_...` (secret)

#### Database & ORM
- **Prisma + Next.js:** https://www.prisma.io/docs/guides/nextjs
  - **Schema Basics:** https://www.prisma.io/docs/orm/prisma-schema
  - **Seeding Guide:** https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
  - **Prisma Client Singleton Pattern:** For Next.js to avoid connection exhaustion

#### TypeScript
- **Next.js TypeScript Config:** https://nextjs.org/docs/app/api-reference/config/typescript
  - **Strict Mode Enabled:** Already set to true in your `tsconfig.json`
  - **Async Page Props Pattern:**
    ```typescript
    interface PageProps {
      params: Promise<{ id: string }>
    }
    export default async function Page({ params }: PageProps) {
      const { id } = await params
    }
    ```

---

### Current Codebase State

**Existing Project Structure:**
```
math-tutor_v2/
├── mathtutor/                          # Next.js App Directory
│   ├── app/
│   │   ├── layout.tsx                  # Root layout (already has Geist fonts)
│   │   ├── page.tsx                    # Home page (needs replacement)
│   │   ├── globals.css                 # Tailwind v4 setup (good foundation)
│   │   └── favicon.ico
│   ├── package.json                    # React 19.2, Next 16, Tailwind 4
│   ├── tsconfig.json                   # Strict mode enabled ✓
│   ├── postcss.config.mjs              # Already configured for Tailwind
│   └── public/                         # Static assets
├── .env                                # Has Clerk keys and DATABASE_URL
├── CLAUDE.md                           # Project conventions (critical to follow)
├── README.md                           # High-level project description
├── wireframe_mathtutor.png             # Design reference
└── steps/
    └── setup.md                        # This feature file
```

**Key Files to Reference for Patterns:**
- `mathtutor/app/layout.tsx:1-35` - Root layout structure (mirror for dashboard)
- `mathtutor/app/globals.css:1-27` - Tailwind v4 setup with theme variables
- `mathtutor/tsconfig.json` - TypeScript strict mode config (keep intact)
- `CLAUDE.md` - Code organization, testing, and style rules

**Existing Dependencies:**
```json
{
  "react": "19.2.0",           // React 19 with canary features
  "react-dom": "19.2.0",
  "next": "16.0.1",            // Latest with async params
  "@tailwindcss/postcss": "^4", // Tailwind v4 with Rust engine
  "tailwindcss": "^4",
  "typescript": "^5",          // TypeScript 5 strict
  "eslint": "^9",
  "eslint-config-next": "16.0.1"
}
```

**Missing but Required:**
- `@clerk/nextjs` - For authentication
- `@prisma/client` - For database (not integrated yet, schema only)
- `prisma` - CLI for migrations/seed

---

### Desired Codebase Tree After Setup

```
math-tutor_v2/
├── mathtutor/
│   ├── app/
│   │   ├── layout.tsx                   # Root layout with ClerkProvider
│   │   ├── page.tsx                     # Homepage (kid-friendly login prompt)
│   │   ├── globals.css                  # Tailwind + custom kid colors/fonts
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx             # Clerk sign-in page
│   │   ├── sign-up/
│   │   │   └── [[...sign-up]]/
│   │   │       └── page.tsx             # Clerk sign-up page
│   │   ├── dashboard/
│   │   │   ├── layout.tsx               # Dashboard layout (header with user menu)
│   │   │   └── page.tsx                 # Shows 3 lessons with progress
│   │   ├── lesson/
│   │   │   └── [id]/
│   │   │       └── page.tsx             # Lesson quiz stub (placeholder)
│   │   ├── api/                         # API routes (created for future use)
│   │   │   └── health/
│   │   │       └── route.ts             # Health check endpoint
│   │   └── favicon.ico
│   ├── lib/
│   │   ├── prisma.ts                    # Prisma client singleton
│   │   └── content.json                 # Curriculum seed data (3 lessons)
│   ├── components/                      # Future: Reusable UI components
│   │   ├── Header.tsx
│   │   ├── LessonCard.tsx
│   │   └── ProgressBar.tsx
│   ├── __tests__/                       # Jest unit tests
│   │   └── app/
│   │       └── page.test.tsx            # Homepage tests
│   ├── prisma/
│   │   ├── schema.prisma                # Database models (documented, not active)
│   │   └── seed.ts                      # Seed script template
│   ├── middleware.ts                    # Clerk auth middleware (or proxy.ts in v16)
│   ├── package.json                     # Updated with Clerk + Prisma deps
│   ├── tsconfig.json                    # Existing (no changes needed)
│   ├── postcss.config.mjs               # Existing (no changes needed)
│   ├── next.config.ts                   # Existing (no changes needed)
│   ├── eslint.config.mjs                # Existing (no changes needed)
│   ├── .gitignore                       # Add: .env.local, node_modules
│   └── public/
│       └── [assets: svg, icons for kid UI]
├── .env.local                           # Clerk test keys (local only, .gitignore'd)
├── .gitignore                           # Include node_modules, .env.local, .next
├── CLAUDE.md                            # Existing conventions (follow exactly)
├── README.md                            # Update with setup instructions
├── TASK.md                              # Track implementation tasks (create if missing)
└── .git/                                # Git repository initialized
```

**Files to CREATE (not modify existing):**
1. `mathtutor/app/sign-in/[[...sign-in]]/page.tsx`
2. `mathtutor/app/sign-up/[[...sign-up]]/page.tsx`
3. `mathtutor/app/dashboard/layout.tsx`
4. `mathtutor/app/dashboard/page.tsx`
5. `mathtutor/app/lesson/[id]/page.tsx`
6. `mathtutor/lib/prisma.ts`
7. `mathtutor/lib/content.json`
8. `mathtutor/prisma/schema.prisma`
9. `mathtutor/prisma/seed.ts`
10. `mathtutor/middleware.ts`
11. `mathtutor/components/Header.tsx`
12. `mathtutor/components/LessonCard.tsx`
13. `mathtutor/__tests__/app/page.test.tsx`
14. `TASK.md` (at root)

**Files to MODIFY:**
1. `mathtutor/app/layout.tsx` - Add ClerkProvider
2. `mathtutor/app/page.tsx` - Replace with kid-friendly homepage
3. `mathtutor/app/globals.css` - Enhance with kid-friendly colors/fonts
4. `mathtutor/package.json` - Add @clerk/nextjs, @prisma/client, prisma, tsx
5. `.env.local` - Add Clerk keys (already present)
6. `README.md` - Update setup instructions

---

### Known Gotchas of Codebase & Library

#### Next.js 16 Specific

1. **CRITICAL: Async Params in v16**
   - `params` and `searchParams` are NOW PROMISES
   - Must be awaited in page components and route handlers
   - Old code pattern WILL BREAK:
     ```typescript
     // ❌ OLD - Won't work in v16
     const id = params.id

     // ✅ NEW - Required
     const { id } = await params
     ```
   - Affects: All page.tsx and layout.tsx with route parameters

2. **Middleware vs Proxy**
   - Next.js 16 has new `proxy.ts` (replaces `middleware.ts`)
   - Can still use `middleware.ts` but it's transitioning
   - For Clerk: Use Clerk's clerkMiddleware which handles both

3. **Server Components by Default**
   - Components are Server Components unless `'use client'` is added
   - Server Components can't use hooks (useState, useEffect)
   - This is a feature, not a bug - great for performance

#### Tailwind CSS 4

1. **No More tailwind.config.js**
   - Configuration goes directly in globals.css using `@theme`
   - Makes it harder to accidentally break - fewer config files
   - Example for kid colors:
     ```css
     @theme {
       --color-kid-blue: #60A5FA;
       --color-kid-button-hover: #3B82F6;
     }
     ```

2. **Automatic Content Detection**
   - No need to configure `content` array
   - Tailwind v4 uses heuristics to find template files
   - If styles aren't applied, ensure component files use proper extensions (.tsx, .jsx, .ts, .js)

3. **Responsive Classes**
   - Use prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
   - Kids use mobile first, so optimize for small screens:
     ```tsx
     <button className="text-lg sm:text-xl md:text-2xl">
       {/* Large on mobile, bigger on desktop */}
     </button>
     ```

#### Clerk Authentication

1. **Environment Variable Naming**
   - MUST have `NEXT_PUBLIC_` prefix for publishable key
   - Secret key goes without prefix (private)
   - Test keys format: `pk_test_...` and `sk_test_...`
   - Production: `pk_live_...` and `sk_live_...`
   - Your `.env` already has these set - verify in `.env.local`

2. **ClerkProvider Must Wrap App**
   - Add to root layout.tsx
   - Manages authentication state globally
   - All `useUser()` hooks depend on this provider

3. **Clerk Sign-In/Sign-Up Routing**
   - Use catch-all routes: `[[...sign-in]]/page.tsx`
   - This pattern allows `/sign-in`, `/sign-in/verify`, etc.
   - Redirect URLs in `.env` should match your app routes

4. **User Persistence**
   - Clerk handles persistence (sessions in httpOnly cookies)
   - No need to manually store tokens
   - `currentUser()` in server components, `useUser()` in client

#### Prisma

1. **No Migrations Yet**
   - We're only creating schema.prisma to document structure
   - Don't run `npx prisma migrate` until DB is connected
   - Safe to change schema.prisma freely before DB connection

2. **Singleton Pattern Required**
   - Next.js reloads modules in dev, causing multiple Prisma instances
   - Use `lib/prisma.ts` singleton wrapper (template provided in Implementation Blueprint)
   - Prevents "too many connections" errors

3. **Seed Data Should Be Separate**
   - Keep curriculum data in JSON (content.json)
   - Seed script will load JSON and populate DB later
   - This allows updates without code changes

#### TypeScript & ESLint

1. **Strict Mode Enabled**
   - Your `tsconfig.json` has `"strict": true`
   - This is good! But means every variable must be typed
   - Don't use `any` - use proper types instead

2. **ESLint Configuration**
   - You have `eslint-config-next` which includes React best practices
   - Run `npm run lint` to check
   - Some warnings can be fixed with `npm run lint -- --fix`

3. **Path Aliases**
   - You can use `@/*` for imports (from root mathtutor directory)
   - Example: `import { prisma } from '@/lib/prisma'`
   - Cleaner than `../../../lib/prisma`

#### Common AI Assistant Mistakes (Gotchas to Avoid)

1. **❌ Forgetting to await params in v16**
   - Will cause `Cannot read property 'id' of Promise` errors
   - Solution: Always await params

2. **❌ Creating page without awaiting async operations**
   - Next.js 16 supports async page components - USE THIS
   - Example: Fetch data in page.tsx directly, not in useEffect

3. **❌ Using client components when server components work**
   - Server components are faster, smaller JS bundles
   - Only use `'use client'` when you need interactivity (forms, hooks)

4. **❌ Forgetting NEXT_PUBLIC_ prefix on Clerk publishable key**
   - This key needs to be in browser, so MUST have prefix
   - Secret key must NOT have prefix

5. **❌ Hardcoding environment variables**
   - Always use process.env.VARIABLE_NAME
   - Never hardcode API keys, routes, or config
   - Use @env-validator or early validation in layout.tsx

6. **❌ Adding multiple Prisma instances**
   - Always use singleton from lib/prisma.ts
   - Don't do `new PrismaClient()` in multiple files

7. **❌ Skipping middleware setup**
   - Clerk needs middleware to protect routes
   - Must be at app root level (mathtutor/middleware.ts)
   - This validates user session before rendering protected pages

8. **❌ Not testing environment variables early**
   - Add a console.log in layout.tsx to verify .env.local is loaded
   - Nothing worse than env var undefined errors at runtime
   - Remove logs after verification

---

## Implementation Blueprint

### Data Models and Structure

**Curriculum & Lesson Structure (content.json):**
```typescript
// Structure for 3 lessons with sub-lessons and items
interface CurriculumItem {
  id: string;
  question: string;
  answer: number;
  strategyTag: string; // e.g., "complement_miss", "decompose"
}

interface SubLesson {
  id: string;
  title: string;
  description: string;
  items: CurriculumItem[];
  diagnosticPrompt: string; // For AI feedback
}

interface Lesson {
  id: string;
  order: number;
  title: string;
  description: string;
  strategyTag: string; // "make-10", "doubles", "choosing-strategies"
  subLessons: SubLesson[];
  items: CurriculumItem[]; // All items for this lesson
}

interface Curriculum {
  lessons: Lesson[];
}
```

**Prisma Schema Models (prisma/schema.prisma):**
```prisma
// User - Linked to Clerk
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  firstName String?
  lastName  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  progress  UserProgress[]
  sessions  Session[]
}

// Lesson - Curriculum unit (3 total)
model Lesson {
  id          String   @id @default(cuid())
  order       Int      @unique
  title       String
  description String
  strategyTag String   // "make-10", "doubles", "choosing-strategies"
  createdAt   DateTime @default(now())

  subLessons SubLesson[]
  items       LessonItem[]
  progress    UserProgress[]
}

// SubLesson - Targeted remediation topic
model SubLesson {
  id          String   @id @default(cuid())
  lessonId    String
  title       String
  description String
  order       Int
  diagnosticPrompt String

  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  items       LessonItem[]

  @@unique([lessonId, order])
}

// LessonItem - Individual question
model LessonItem {
  id          String   @id @default(cuid())
  lessonId    String
  question    String   // e.g., "8 + 5 = ?"
  answer      Int
  strategyTag String   // Tag for AI feedback routing
  order       Int

  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  responses   SessionResponse[]

  @@unique([lessonId, order])
}

// UserProgress - Track mastery per lesson
model UserProgress {
  id           String   @id @default(cuid())
  userId       String
  lessonId     String
  masteryScore Float    @default(0)
  completed    Boolean  @default(false)
  lastAttempt  DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  lesson       Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonId])
}

// Session - Quiz attempt
model Session {
  id         String   @id @default(cuid())
  userId     String
  lessonId   String
  startedAt  DateTime @default(now())
  score      Float?
  passed     Boolean  @default(false)

  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  responses  SessionResponse[]
}

// SessionResponse - Single question response
model SessionResponse {
  id        String   @id @default(cuid())
  sessionId String
  itemId    String
  answer    Int
  isCorrect Boolean
  timeMs    Int      // Response time

  session   Session    @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  item      LessonItem @relation(fields: [itemId], references: [id], onDelete: Cascade)
}
```

---

### Task List (in order)

#### Task 1: Install Dependencies
**File:** `mathtutor/package.json`

Add to dependencies:
```json
"@clerk/nextjs": "^6.0.0",
"@prisma/client": "^6.0.0"
```

Add to devDependencies:
```json
"prisma": "^6.0.0",
"tsx": "^4.0.0"
```

Run: `npm install` (from mathtutor directory)

**Pseudocode:**
```
// Install Clerk for authentication
npm install @clerk/nextjs

// Install Prisma for schema definition (DB not connected yet)
npm install @prisma/client
npm install -D prisma

// Install tsx for running TypeScript scripts
npm install -D tsx

// Verify all installed
npm list @clerk/nextjs @prisma/client prisma tsx
```

---

#### Task 2: Configure Clerk Environment Variables
**File:** `mathtutor/.env.local` (create if doesn't exist, add to .gitignore)

Add/verify:
```bash
# Clerk Test Keys (from .env, should already be present)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk Route Configuration
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

**Pseudocode:**
```
// Verify .env.local exists in mathtutor/
// Copy keys from .env if needed
// Ensure NEXT_PUBLIC_ prefixes are correct
// Never commit .env.local - add to .gitignore
```

---

#### Task 3: Update Root Layout with ClerkProvider
**File:** `mathtutor/app/layout.tsx`

Wrap entire app with ClerkProvider:

```typescript
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Math Tutor AI',
  description: 'K-5 math mastery through adaptive lessons',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

**Pseudocode:**
```
// Import ClerkProvider from '@clerk/nextjs'
// Wrap <html> element with <ClerkProvider>
// Update metadata title and description
// Test: npm run dev should start without errors
```

---

#### Task 4: Create Kid-Friendly Homepage
**File:** `mathtutor/app/page.tsx`

Replace existing content with:

```typescript
import Link from 'next/link';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

export default async function HomePage() {
  const user = await currentUser();

  if (user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-kid-blue-50 to-kid-purple-50 px-4">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-kid-blue-700">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Ready to master math?
          </p>
          <Link
            href="/dashboard"
            className="inline-block rounded-full bg-kid-blue-500 px-8 py-4 text-2xl font-bold text-white hover:bg-kid-blue-600 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-kid-blue-50 to-kid-purple-50 px-4">
      <div className="text-center">
        <h1 className="mb-4 text-5xl font-bold text-kid-blue-700">
          Welcome to Math Tutor! 🎓
        </h1>
        <p className="mb-4 text-xl text-gray-700">
          Learn addition facts the fun way
        </p>
        <p className="mb-8 text-lg text-gray-600">
          Sign in to get started, or create a new account
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <SignInButton
            fallbackRedirectUrl="/dashboard"
            mode="modal"
          >
            <button className="w-full sm:w-auto rounded-full bg-kid-green-500 px-8 py-4 text-2xl font-bold text-white hover:bg-kid-green-600 transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton
            fallbackRedirectUrl="/dashboard"
            mode="modal"
          >
            <button className="w-full sm:w-auto rounded-full bg-kid-purple-500 px-8 py-4 text-2xl font-bold text-white hover:bg-kid-purple-600 transition-colors">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}
```

**Pseudocode:**
```
// Check if user is signed in with currentUser()
// If signed in: show welcome message with link to dashboard
// If not signed in: show homepage with Sign In / Sign Up buttons
// Use kid-friendly colors and large fonts
// Make buttons tappable (large padding)
// Use emoji for visual interest (kid-friendly)
// Test: npm run dev -> visit http://localhost:3000
```

---

#### Task 5: Enhance globals.css with Kid-Friendly Theme
**File:** `mathtutor/app/globals.css`

Update to include custom kid colors:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;

  /* Kid-Friendly Colors */
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
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  /* Kid-Friendly Colors */
  --color-kid-blue-50: var(--kid-blue-50);
  --color-kid-blue-500: var(--kid-blue-500);
  --color-kid-blue-700: var(--kid-blue-700);

  --color-kid-green-500: var(--kid-green-500);
  --color-kid-green-600: var(--kid-green-600);

  --color-kid-purple-50: var(--kid-purple-50);
  --color-kid-purple-500: var(--kid-purple-500);
  --color-kid-purple-600: var(--kid-purple-600);

  --color-kid-yellow-500: var(--kid-yellow-500);
  --color-kid-pink-500: var(--kid-pink-500);

  --color-success: var(--success-color);
  --color-error: var(--error-color);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

/* Kid-Friendly Button Styles */
@layer components {
  .kid-button {
    @apply rounded-full px-6 py-3 text-lg font-bold text-white transition-colors;
  }

  .kid-button-primary {
    @apply kid-button bg-kid-blue-500 hover:bg-kid-blue-700;
  }

  .kid-button-success {
    @apply kid-button bg-kid-green-500 hover:bg-kid-green-600;
  }

  .kid-heading {
    @apply text-4xl font-bold text-kid-blue-700 md:text-5xl;
  }
}
```

**Pseudocode:**
```
// Add CSS variables for all kid-friendly colors
// Use @theme directive to make them available in Tailwind
// Add @layer components for reusable button and heading styles
// Test: Colors should be accessible via class names like "bg-kid-blue-500"
```

---

#### Task 6: Create Sign-In Page
**File:** `mathtutor/app/sign-in/[[...sign-in]]/page.tsx`

```typescript
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-kid-purple-50 px-4">
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </div>
  );
}
```

**Pseudocode:**
```
// Use Clerk's built-in SignIn component
// Wrap in centered container with kid-friendly background
// File path: app/sign-in/[[...sign-in]]/page.tsx
// (double brackets allow catch-all routing for sign-in flow pages)
```

---

#### Task 7: Create Sign-Up Page
**File:** `mathtutor/app/sign-up/[[...sign-up]]/page.tsx`

```typescript
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-kid-blue-50 px-4">
      <div className="w-full max-w-md">
        <SignUp />
      </div>
    </div>
  );
}
```

**Pseudocode:**
```
// Use Clerk's built-in SignUp component
// Wrap in centered container with kid-friendly background
// File path: app/sign-up/[[...sign-up]]/page.tsx
```

---

#### Task 8: Create Dashboard Layout
**File:** `mathtutor/app/dashboard/layout.tsx`

```typescript
import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-kid-blue-50 to-kid-purple-50">
      {/* Header */}
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-kid-blue-700">
          Math Tutor 🎓
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium text-gray-700">
            {user?.firstName}
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 md:px-8">
        {children}
      </main>
    </div>
  );
}
```

**Pseudocode:**
```
// Create shared header for all dashboard pages
// Display user's first name and sign-out button
// Use kid-friendly colors and layout
// Wrap children for any dashboard pages (lesson, settings, etc.)
```

---

#### Task 9: Create Dashboard Page
**File:** `mathtutor/app/dashboard/page.tsx`

```typescript
export default async function DashboardPage() {
  // Mock lessons for now
  const lessons = [
    {
      id: '1',
      title: 'Make-10 Strategy',
      description: 'Learn to make 10 to solve addition',
      order: 1,
      completed: false,
      locked: false,
    },
    {
      id: '2',
      title: 'Doubles & Near-Doubles',
      description: 'Double the number and variations',
      order: 2,
      completed: false,
      locked: true,
    },
    {
      id: '3',
      title: 'Choosing Strategies',
      description: 'Pick the best strategy for each problem',
      order: 3,
      completed: false,
      locked: true,
    },
  ];

  return (
    <div>
      <h2 className="kid-heading mb-8">Your Lessons</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map(lesson => (
          <div
            key={lesson.id}
            className={`rounded-lg p-6 shadow-md transition-opacity ${
              lesson.locked
                ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                : 'bg-white hover:shadow-lg'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-kid-blue-700">
                {lesson.title}
              </h3>
              {lesson.completed && <span className="text-2xl">✅</span>}
              {lesson.locked && <span className="text-2xl">🔒</span>}
            </div>

            <p className="mb-6 text-gray-700">{lesson.description}</p>

            {!lesson.locked && (
              <a
                href={`/lesson/${lesson.id}`}
                className="inline-block kid-button-primary"
              >
                Start Lesson
              </a>
            )}
            {lesson.locked && (
              <button
                disabled
                className="inline-block rounded-full bg-gray-300 px-6 py-3 text-lg font-bold text-gray-600 cursor-not-allowed"
              >
                Locked
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Pseudocode:**
```
// Display 3 mock lessons with progression:
//   Lesson 1: Available (not locked)
//   Lesson 2, 3: Locked (show lock icon, disabled button)
// Each lesson card shows:
//   - Title
//   - Description
//   - Completion status (✅ if done)
//   - Lock status (🔒 if locked)
//   - Button: "Start Lesson" (if available) or "Locked" (disabled, if locked)
// Grid layout: responsive (1 col on mobile, 3 on desktop)
// Test: npm run dev -> /dashboard should show 3 lesson cards
```

---

#### Task 10: Create Lesson Stub Page
**File:** `mathtutor/app/lesson/[id]/page.tsx`

```typescript
interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="kid-heading mb-4">Lesson {id}</h1>
        <p className="text-xl text-gray-700 mb-8">
          Quiz content coming soon! 🚀
        </p>
        <a
          href="/dashboard"
          className="inline-block kid-button-primary"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
```

**Pseudocode:**
```
// Create dynamic route page that accepts lesson ID
// CRITICAL: Await params (Next.js 16 requirement)
// Display placeholder message
// Provide back button to dashboard
// This is a stub - actual quiz logic comes in later features
```

---

#### Task 11: Create Prisma Schema
**File:** `mathtutor/prisma/schema.prisma`

Copy the schema from Data Models section above. Full content in "Data Models and Structure" section.

**Pseudocode:**
```
// Create prisma/ directory if not exists
// Define models for User, Lesson, SubLesson, Item, UserProgress, Session, SessionResponse
// Include relationships (relations) between models
// Use @unique constraints for composite keys
// Add onDelete: Cascade for proper cleanup
// Note: This is schema-only, not connected to DB yet
```

---

#### Task 12: Create Prisma Seed Template
**File:** `mathtutor/prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import curriculum from '../lib/content.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding curriculum data...');

  // When DB is connected, this will load curriculum from content.json
  // For now, just template to show structure
  console.log('📚 Curriculum structure:', {
    numLessons: curriculum.lessons.length,
    lessons: curriculum.lessons.map(l => ({
      title: l.title,
      itemCount: l.items.length,
    })),
  });

  console.log('✅ Seed template ready for database integration');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Pseudocode:**
```
// Create seed.ts template
// This will load curriculum data when DB is connected
// For now, just log curriculum structure
// Add to package.json: "prisma": { "seed": "tsx prisma/seed.ts" }
```

---

#### Task 13: Create Content JSON
**File:** `mathtutor/lib/content.json`

```json
{
  "lessons": [
    {
      "id": "lesson-1",
      "order": 1,
      "title": "Make-10 Strategy",
      "description": "Learn to break numbers into 10 + more",
      "strategyTag": "make-10",
      "subLessons": [
        {
          "id": "sub-1-1",
          "title": "Introduction to Make-10",
          "description": "Learn how to use 10 as an anchor number",
          "order": 1,
          "diagnosticPrompt": "The student struggles with complement facts to 10. Show them how to count up from a number to 10."
        }
      ],
      "items": [
        {
          "id": "item-1-1",
          "question": "8 + 5 = ?",
          "answer": 13,
          "strategyTag": "complement_miss",
          "order": 1
        },
        {
          "id": "item-1-2",
          "question": "9 + 6 = ?",
          "answer": 15,
          "strategyTag": "complement_miss",
          "order": 2
        },
        {
          "id": "item-1-3",
          "question": "7 + 4 = ?",
          "answer": 11,
          "strategyTag": "basic_addition",
          "order": 3
        },
        {
          "id": "item-1-4",
          "question": "6 + 8 = ?",
          "answer": 14,
          "strategyTag": "complement_miss",
          "order": 4
        },
        {
          "id": "item-1-5",
          "question": "5 + 7 = ?",
          "answer": 12,
          "strategyTag": "basic_addition",
          "order": 5
        }
      ]
    },
    {
      "id": "lesson-2",
      "order": 2,
      "title": "Doubles & Near-Doubles",
      "description": "Double numbers and use them to solve similar problems",
      "strategyTag": "doubles",
      "subLessons": [
        {
          "id": "sub-2-1",
          "title": "Doubles Facts",
          "description": "Learn doubles: 5+5, 6+6, etc.",
          "order": 1,
          "diagnosticPrompt": "The student forgot their doubles facts. Practice with visual manipulatives."
        },
        {
          "id": "sub-2-2",
          "title": "Near-Doubles",
          "description": "Use doubles to solve 5+6, 6+7, etc.",
          "order": 2,
          "diagnosticPrompt": "The student doesn't see the connection to doubles. Show them: 6+7 is one more than 6+6."
        }
      ],
      "items": [
        {
          "id": "item-2-1",
          "question": "3 + 3 = ?",
          "answer": 6,
          "strategyTag": "doubles",
          "order": 1
        },
        {
          "id": "item-2-2",
          "question": "4 + 4 = ?",
          "answer": 8,
          "strategyTag": "doubles",
          "order": 2
        },
        {
          "id": "item-2-3",
          "question": "5 + 5 = ?",
          "answer": 10,
          "strategyTag": "doubles",
          "order": 3
        },
        {
          "id": "item-2-4",
          "question": "5 + 6 = ?",
          "answer": 11,
          "strategyTag": "near_double",
          "order": 4
        },
        {
          "id": "item-2-5",
          "question": "6 + 7 = ?",
          "answer": 13,
          "strategyTag": "near_double",
          "order": 5
        }
      ]
    },
    {
      "id": "lesson-3",
      "order": 3,
      "title": "Choosing Strategies",
      "description": "Decide which strategy works best for each problem",
      "strategyTag": "choosing-strategies",
      "subLessons": [
        {
          "id": "sub-3-1",
          "title": "Which Strategy Fits?",
          "description": "Decide whether to use Make-10 or Doubles",
          "order": 1,
          "diagnosticPrompt": "The student can do the strategies but doesn't know when to use each one. Help them decide based on the numbers."
        }
      ],
      "items": [
        {
          "id": "item-3-1",
          "question": "7 + 7 = ?",
          "answer": 14,
          "strategyTag": "choose_doubles",
          "order": 1
        },
        {
          "id": "item-3-2",
          "question": "8 + 4 = ?",
          "answer": 12,
          "strategyTag": "choose_make10",
          "order": 2
        },
        {
          "id": "item-3-3",
          "question": "6 + 5 = ?",
          "answer": 11,
          "strategyTag": "choose_either",
          "order": 3
        },
        {
          "id": "item-3-4",
          "question": "9 + 3 = ?",
          "answer": 12,
          "strategyTag": "choose_make10",
          "order": 4
        },
        {
          "id": "item-3-5",
          "question": "8 + 8 = ?",
          "answer": 16,
          "strategyTag": "choose_doubles",
          "order": 5
        }
      ]
    }
  ]
}
```

**Pseudocode:**
```
// Create lib/content.json with 3 lessons
// Each lesson has:
//   - id, order, title, description, strategyTag
//   - subLessons array with diagnostic prompts
//   - items array with 5+ addition problems
// Use realistic error tags (complement_miss, doubles, near_double, etc.)
// This data will be seed material for Prisma when DB connects
```

---

#### Task 14: Create Prisma Client Singleton
**File:** `mathtutor/lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Pseudocode:**
```
// Create singleton pattern for Prisma
// Prevents multiple PrismaClient instances in dev mode
// Add logging in development to debug queries
// Export as 'prisma' for use throughout app
```

---

#### Task 15: Create Middleware for Route Protection
**File:** `mathtutor/middleware.ts`

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/lesson(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

**Pseudocode:**
```
// Use Clerk's clerkMiddleware for authentication
// Protect /dashboard and /lesson routes
// Unprotected routes: home, /sign-in, /sign-up
// Middleware runs on every request
// If user tries to access protected route without auth, redirect to sign-in
```

---

#### Task 16: Update package.json Scripts
**File:** `mathtutor/package.json`

Add to scripts section:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "type-check": "tsc --noEmit",
  "prisma:generate": "prisma generate",
  "prisma:seed": "tsx prisma/seed.ts"
}
```

Update prisma configuration:
```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

**Pseudocode:**
```
// Add lint script to package.json
// Add type-check for TypeScript validation
// Add prisma scripts for future DB setup
// Test: npm run type-check should pass with no errors
```

---

#### Task 17: Create Header Component
**File:** `mathtutor/components/Header.tsx`

```typescript
import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

export async function Header() {
  const user = await currentUser();

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <h1 className="text-2xl font-bold text-kid-blue-700">
        Math Tutor 🎓
      </h1>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-lg font-medium text-gray-700">
            {user.firstName}
          </span>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
```

**Pseudocode:**
```
// Create reusable Header component
// Shows user's first name and sign-out button
// Use async component to get current user
// Shared across dashboard pages
```

---

#### Task 18: Create LessonCard Component
**File:** `mathtutor/components/LessonCard.tsx`

```typescript
import Link from 'next/link';

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  locked: boolean;
}

export function LessonCard({
  id,
  title,
  description,
  completed,
  locked,
}: LessonCardProps) {
  return (
    <div
      className={`rounded-lg p-6 shadow-md transition-all ${
        locked
          ? 'bg-gray-100 opacity-50 cursor-not-allowed'
          : 'bg-white hover:shadow-lg'
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-kid-blue-700">{title}</h3>
        {completed && <span className="text-3xl">✅</span>}
        {locked && <span className="text-3xl">🔒</span>}
      </div>

      <p className="mb-6 text-gray-700">{description}</p>

      {!locked && (
        <Link
          href={`/lesson/${id}`}
          className="inline-block kid-button-primary"
        >
          Start Lesson
        </Link>
      )}
      {locked && (
        <button
          disabled
          className="inline-block rounded-full bg-gray-300 px-6 py-3 text-lg font-bold text-gray-600 cursor-not-allowed"
        >
          Locked
        </button>
      )}
    </div>
  );
}
```

**Pseudocode:**
```
// Create reusable LessonCard component
// Accept props: id, title, description, completed, locked
// Show completion status (✅) and lock status (🔒)
// Disable button if lesson is locked
// Use for dashboard lesson grid
```

---

#### Task 19: Create Unit Test for Homepage
**File:** `mathtutor/__tests__/app/page.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

// Mock Clerk
jest.mock('@clerk/nextjs/server', () => ({
  currentUser: jest.fn(() => null),
}));

describe('HomePage', () => {
  it('displays welcome message when user is not signed in', async () => {
    render(await HomePage());
    expect(
      screen.getByText(/Welcome to Math Tutor/i)
    ).toBeInTheDocument();
  });

  it('displays sign in and sign up buttons', async () => {
    render(await HomePage());
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });
});
```

**Pseudocode:**
```
// Create Jest test for homepage
// Test 1: Welcome message displays when not signed in
// Test 2: Sign In and Sign Up buttons are present
// Test 3 (edge case): Verify button text is kid-friendly
// Mock Clerk's currentUser hook
// Run: npm test -- __tests__/app/page.test.tsx
```

---

#### Task 20: Update README.md
**File:** `README.md` (at root)

Add sections:
```markdown
## Setup Instructions

### Prerequisites
- Node.js 18+ (use nvm: `nvm install && nvm use`)
- npm or yarn

### Installation

1. **Clone repository and install dependencies:**
   ```bash
   cd math-tutor_v2/mathtutor
   npm install
   ```

2. **Configure environment variables:**
   Create `.env.local` with Clerk test keys:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   App available at http://localhost:3000

4. **Test the app:**
   - Homepage: Shows welcome + Sign In/Sign Up buttons
   - Click Sign In: Redirects to Clerk sign-in modal
   - Sign in with test email: Redirected to /dashboard
   - Dashboard: Shows 3 lessons (first available, others locked)
   - Click "Start Lesson": Placeholder page with back button

### Validation

- **Type checking:** `npm run type-check` (should pass)
- **Linting:** `npm run lint` (should have no errors)
- **Dev server:** `npm run dev` (should start cleanly)

## Tech Stack

- **Frontend:** Next.js 16.0.1, React 19.2, Tailwind CSS 4
- **Authentication:** Clerk
- **Database:** Prisma (schema defined, DB not connected yet)
- **Styling:** Kid-friendly colors and large fonts for K-5 audience
- **Development:** TypeScript strict mode, ESLint, Prettier

## Architecture

- **Pages:** Home, Sign-In, Sign-Up, Dashboard, Lesson (stub)
- **Components:** Header, LessonCard, ProgressBar (coming)
- **Data Models:** User, Lesson, SubLesson, Item, UserProgress, Session, SessionResponse
- **Curriculum:** 3 lessons with 5+ items each (Make-10, Doubles, Choosing Strategies)

## Next Steps

1. **Auth & DB:** Connect Supabase database and run Prisma migrations
2. **Quiz Logic:** Implement session-based quiz in Lesson page
3. **Feedback:** Integrate OpenAI API for personalized tips
4. **Progress Tracking:** Save scores and unlock next lesson at 90% mastery
5. **Polish:** Add animations, confetti, progress bars

## Contributing

Follow CLAUDE.md conventions:
- TypeScript strict mode
- Jest tests for new features (3 cases: happy path, edge case, failure)
- Max 500 lines per file
- JSDoc comments for functions

## License

MIT - Built as an AI product management showcase.
```

**Pseudocode:**
```
// Update README with setup instructions
// Include Clerk env var setup
// Add validation steps (npm run dev, npm run lint, npm run type-check)
// Document tech stack and architecture
// Outline next steps for future features
```

---

#### Task 21: Initialize Git and Create Commit
**Bash Commands:**

```bash
# From math-tutor_v2/ directory
cd math-tutor_v2

# Check git status
git status

# Add all files (should see: pages, components, schema, etc.)
git add .

# Create clean commit
git commit -m "feat: project setup with Next.js, Tailwind, Clerk auth, and Prisma schema

- Set up Next.js 16.0.1 with App Router
- Configured Tailwind CSS 4 with kid-friendly colors
- Integrated Clerk authentication with sign-in/sign-up pages
- Created dashboard and lesson stubs
- Documented Prisma schema for User, Lesson, Item models
- Seeded curriculum data for 3 lessons (Make-10, Doubles, Choosing Strategies)
- Added TypeScript strict mode and ESLint validation
- Created reusable components (Header, LessonCard)
- Added Jest unit tests for homepage
- Updated README with setup instructions"

# Verify commit
git log -1 --oneline
```

**Pseudocode:**
```
// Initialize git with clean commit message
// Include all setup changes in one logical commit
// Keep commit message concise but descriptive
// Verify with git log
```

---

#### Task 22: Final Validation
**Commands:**

```bash
# Type checking
npm run type-check
# Expected: ✓ No errors

# Linting
npm run lint
# Expected: ✓ No errors (or only warnings for unused variables)

# Run dev server
npm run dev
# Expected: ✓ Server starts at http://localhost:3000

# Manual test flow:
# 1. Visit http://localhost:3000 -> See homepage with Sign In button
# 2. Click Sign In -> Clerk modal appears
# 3. Sign in with test email -> Redirected to /dashboard
# 4. Dashboard shows 3 lesson cards
# 5. Click "Start Lesson" on Lesson 1 -> Stub page with back button
# 6. Click "Back to Dashboard" -> Return to dashboard
# 7. Lessons 2 & 3 show lock icon and disabled button
```

**Pseudocode:**
```
// Run all validation checks
// Verify no TypeScript errors
// Verify no ESLint errors
// Test dev server startup
// Manually test user flows
```

---

## Validation Loop

### Level 1: Syntax & Style
```bash
# From mathtutor/ directory
npm run lint -- --fix       # Auto-fix ESLint errors
npm run type-check          # TypeScript validation

# Expected: No errors, clean output
# If errors: Read error message, understand root cause, fix code
```

### Level 2: Unit Tests
```bash
# Install testing dependencies first if needed
npm install --save-dev @testing-library/react @testing-library/jest-dom jest @types/jest jest-environment-jsdom

# Create jest.config.js if missing with Next.js preset

# Run tests
npm test -- __tests__/app/page.test.tsx

# Expected: All tests pass (3 test cases minimum)
# If failing: Read error, identify issue (mocking, assertion), fix code, re-run
```

### Level 3: Integration Test
```bash
# Start dev server
npm run dev

# In another terminal, test key flows:
# 1. Visit http://localhost:3000 - homepage loads
# 2. Click Sign In - Clerk modal appears (requires test key)
# 3. Test account sign-in - redirects to /dashboard
# 4. Dashboard loads with 3 lesson cards
# 5. First lesson unlocked, others locked
# 6. Click "Start Lesson" - route to /lesson/lesson-1
# 7. Stub page displays correctly

# Check console for errors (should be clean)
```

### Final Validation Checklist

- [ ] `npm run type-check` passes with no errors
- [ ] `npm run lint` shows no errors (warnings OK)
- [ ] `npm run dev` starts cleanly at `http://localhost:3000`
- [ ] Homepage displays with kid-friendly styling
- [ ] Sign-In button opens Clerk modal
- [ ] After sign-in, redirects to `/dashboard`
- [ ] Dashboard shows 3 lesson cards (1 unlocked, 2 locked)
- [ ] Lesson click routes to `/lesson/[id]` with stub
- [ ] Back button works and returns to dashboard
- [ ] Clerk UserButton shows in dashboard header
- [ ] No console errors or warnings (except expected Clerk logs)
- [ ] Git commit created with clean message
- [ ] README updated with setup instructions
- [ ] All files follow CLAUDE.md conventions (TypeScript, naming, structure)
- [ ] No .env.local or node_modules in git (verify with `git status`)

---

## Anti-Patterns to Avoid

- ❌ **Don't forget to await params in v16** - Will break route params
- ❌ **Don't hardcode environment variables** - Use process.env
- ❌ **Don't use client-only patterns in server components** - No hooks in server components
- ❌ **Don't commit .env.local** - Add to .gitignore immediately
- ❌ **Don't create multiple Prisma client instances** - Use singleton from lib/prisma.ts
- ❌ **Don't skip TypeScript strict mode** - It catches real bugs early
- ❌ **Don't forget ClerkProvider wrapper** - Auth won't work without it
- ❌ **Don't skip unit tests** - Required by CLAUDE.md
- ❌ **Don't use `any` type** - Use proper TypeScript types
- ❌ **Don't ignore ESLint warnings** - Fix them (or they become errors)

---

## Known Limitations & Future Work

**Out of Scope for This Step:**
- Database connection (schema only)
- Quiz logic (stub only)
- Progress tracking (models defined, not implemented)
- AI feedback integration (planned for next step)
- Animations and confetti (planned for polish step)

**For Next Sprint:**
- Connect Supabase database via DATABASE_URL
- Implement quiz session logic in `/lesson/[id]`
- Create OpenAI API integration for feedback
- Add progress tracking and lesson unlock logic
- Implement error handling and loading states

---

## Confidence Score

**PRP Quality: 9/10** ✅

**Why High Confidence:**
- ✅ Complete context from official docs (Next.js 16, Tailwind 4, Clerk, Prisma)
- ✅ All async/await patterns documented for v16
- ✅ Real file structure matching existing project
- ✅ Reusable component patterns shown
- ✅ Step-by-step implementation blueprint with pseudocode
- ✅ Executable validation loops (lint, type-check, dev server)
- ✅ Multiple gotchas documented (params, Clerk keys, env vars)
- ✅ Aligns with CLAUDE.md conventions (testing, typing, structure)
- ✅ Covers both happy path and error handling

**Potential Risks & Mitigations:**
- **Risk:** Clerk test keys may expire
  - **Mitigation:** Instructions included for getting new keys from Clerk dashboard
- **Risk:** Tailwind v4 CSS syntax differences
  - **Mitigation:** Provided working examples with @theme directive
- **Risk:** Environment variables not loaded
  - **Mitigation:** Suggested verification in layout.tsx
- **Risk:** Git conflicts on package.json
  - **Mitigation:** Clear instructions on what to add/modify

**Expected Implementation Time:** 4-6 hours for one developer
- Task 1-5: Dependencies & styling (30 min)
- Task 6-10: Pages & components (1.5 hours)
- Task 11-15: Prisma & auth (1 hour)
- Task 16-19: Polish & tests (1 hour)
- Task 20-22: Validation & commit (30 min)

---

## Summary

This PRP provides a complete foundation for the Math Tutor AI application with:

1. **Running Next.js 16 app** with Tailwind CSS 4
2. **Authentication ready** with Clerk (test keys configured)
3. **Navigation working** (home → sign-in → dashboard → lessons)
4. **Lesson structure** with 3 curriculum units (Make-10, Doubles, Choosing Strategies)
5. **Database schema documented** (Prisma models ready for DB integration)
6. **Type-safe codebase** with TypeScript strict mode and ESLint
7. **Git history clean** with meaningful commits
8. **Testable structure** with Jest unit tests included
9. **Developer-friendly** with clear comments and patterns to follow
10. **Kids-first design** with large fonts, pastel colors, and simple interactions

The application is now ready for feature development (quiz logic, AI feedback, progress tracking) without rework or refactoring the foundation.

