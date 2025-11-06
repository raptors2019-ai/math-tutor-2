# Math Tutor Documentation Index

This index guides you through all available documentation for the Math Tutor codebase.

## Quick Start

Start here if you're new to the project:

1. **README.md** - Project overview, setup instructions, tech stack
2. **QUICK_REFERENCE.md** - Quick lookup guide for common tasks
3. **ARCHITECTURE.md** - System architecture and data flows

## Detailed Documentation

### For Understanding the Codebase
- **CODEBASE_ANALYSIS.md** (19 KB)
  - Complete breakdown of all code patterns
  - Every API, database, testing, and styling pattern
  - File locations and naming conventions
  - Environment setup details
  - 14 detailed sections covering all aspects

### For Development
- **QUICK_REFERENCE.md** (7.7 KB)
  - Database queries
  - Authentication patterns
  - API route templates
  - Styling and components
  - Common development tasks
  - npm scripts and commands

### For Architecture & Design
- **ARCHITECTURE.md** (21 KB)
  - System architecture diagrams
  - Data models and relationships
  - Complete data flow examples
  - Authentication flow
  - Mastery & progression logic
  - Curriculum structure
  - File dependencies
  - API request/response patterns
  - Deployment checklist

### For Project Guidelines
- **CLAUDE.md** - AI assistant guidelines and code standards
  - Project awareness requirements
  - Code structure rules
  - Testing requirements
  - Style and conventions
  - Documentation standards

## Documentation by Topic

### Database & ORM
- **CODEBASE_ANALYSIS.md**
  - Section 2: Prisma Client Usage
  - Section 3: Prisma Database Schema
  - Section 13: Data Seeding & Content
  - Section 14: Database Migrations

- **ARCHITECTURE.md**
  - Key Data Models & Relationships
  - Data Flow: Quiz Session Example
  - Curriculum Structure

- **QUICK_REFERENCE.md**
  - Section 1: Database & ORM

### Authentication
- **CODEBASE_ANALYSIS.md**
  - Section 5: Authentication & Authorization Patterns

- **ARCHITECTURE.md**
  - Authentication Flow section

- **QUICK_REFERENCE.md**
  - Section 2: Authentication (Clerk)

### API Routes
- **CODEBASE_ANALYSIS.md**
  - Section 1: API Route Structure
  - Section 4: Error Handling & Validation Patterns

- **ARCHITECTURE.md**
  - Backend API Routes section
  - API Request/Response Patterns

- **QUICK_REFERENCE.md**
  - Section 3: API Routes (TODO - Not Yet Created)

### Testing
- **CODEBASE_ANALYSIS.md**
  - Section 7: Existing Test Patterns & Setup

- **QUICK_REFERENCE.md**
  - Section 5: Testing with Jest

### Styling
- **CODEBASE_ANALYSIS.md**
  - Section 10: Styling & Tailwind CSS Configuration

- **QUICK_REFERENCE.md**
  - Section 4: Styling with Tailwind CSS 4

### Type Definitions
- **CODEBASE_ANALYSIS.md**
  - Section 8: Type Definitions & Interfaces

### File Structure
- **CODEBASE_ANALYSIS.md**
  - Section 9: File Structure & Naming Conventions

- **QUICK_REFERENCE.md**
  - Project Structure At A Glance

## Key Files Location Reference

| What | Where |
|------|-------|
| Prisma Client | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/lib/prisma.ts` |
| Database Schema | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/prisma/schema.prisma` |
| Clerk Middleware | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/middleware.ts` |
| Global Styles | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/app/globals.css` |
| Curriculum Data | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/lib/content.json` |
| Jest Config | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/jest.config.ts` |
| Tests | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/__tests__/` |
| Environment | `/Users/josh/code/claude-code/math-tutor_v2/mathtutor/.env.local` |

## How to Use These Docs

### I want to...

**Understand the project structure**
- Start: README.md
- Then: QUICK_REFERENCE.md (Project Structure)
- Deep dive: CODEBASE_ANALYSIS.md (Section 9)

**Add a new API route**
- Reference: QUICK_REFERENCE.md (Section 3: API Routes Template)
- Full context: CODEBASE_ANALYSIS.md (Sections 1, 4, 5)
- Examples: ARCHITECTURE.md (API Request/Response Patterns)

**Write tests**
- Reference: QUICK_REFERENCE.md (Section 5)
- Details: CODEBASE_ANALYSIS.md (Section 7)
- Patterns: CLAUDE.md (Testing section)

**Query the database**
- Quick: QUICK_REFERENCE.md (Section 1)
- Details: CODEBASE_ANALYSIS.md (Sections 2, 3)
- Examples: ARCHITECTURE.md (Data Flow section)

**Implement authentication**
- Quick: QUICK_REFERENCE.md (Section 2)
- Details: CODEBASE_ANALYSIS.md (Section 5)
- Flow: ARCHITECTURE.md (Authentication Flow)

**Style components**
- Quick: QUICK_REFERENCE.md (Section 4)
- Details: CODEBASE_ANALYSIS.md (Section 10)

**Understand data flow**
- Diagrams: ARCHITECTURE.md (System Overview, Data Flow)
- Complete: ARCHITECTURE.md (All sections)

**Seed or migrate database**
- Commands: QUICK_REFERENCE.md (Section 7)
- Details: CODEBASE_ANALYSIS.md (Sections 13, 14)

## Project Stats

- **Lines of Documentation**: 1,600+
- **Code Files Analyzed**: 30+
- **Sections Documented**: 60+
- **Examples Provided**: 20+
- **Diagrams Included**: 10+

## Maintenance

This documentation was generated on: **2024-11-06**

### When to Update
- When adding new API routes
- When changing database schema
- When adding new components
- When modifying authentication flow
- When updating dependencies

### How to Update
1. Update relevant section in CODEBASE_ANALYSIS.md
2. Update QUICK_REFERENCE.md examples if applicable
3. Update ARCHITECTURE.md if data flows change
4. Update this index if creating new docs

## Related Files

- **PLANNING.md** - (Does not exist yet) High-level project planning
- **TASK.md** - (Does not exist yet) Development tasks checklist
- **.claude/commands/** - Custom CLI commands for the project

## Documentation Hierarchy

```
DOCUMENTATION_INDEX.md (you are here)
│
├─ Quick Learning Path
│  ├─ README.md (5 min)
│  ├─ QUICK_REFERENCE.md (10 min)
│  └─ ARCHITECTURE.md (20 min)
│
├─ Topic-Specific Deep Dives
│  ├─ CODEBASE_ANALYSIS.md
│  └─ ARCHITECTURE.md
│
├─ Implementation Guidelines
│  └─ CLAUDE.md
│
└─ Source Code (30 files)
   ├─ app/ (pages & routes)
   ├─ components/ (UI)
   ├─ lib/ (utilities)
   └─ prisma/ (database)
```

## Accessing Documentation

All documentation is in the project root:
```bash
/Users/josh/code/claude-code/math-tutor_v2/

├─ DOCUMENTATION_INDEX.md  (this file)
├─ CODEBASE_ANALYSIS.md    (detailed patterns)
├─ QUICK_REFERENCE.md      (quick lookup)
├─ ARCHITECTURE.md         (system design)
├─ CLAUDE.md               (guidelines)
├─ README.md               (overview)
├─ INITIAL.md              (template)
└─ mathtutor/              (source code)
```

## Quick Commands Reference

```bash
# Start development
cd mathtutor && npm run dev

# Run tests
npm test

# Type check
npm run type-check

# Lint code
npm run lint

# Seed database
npm run prisma:seed

# Generate Prisma client
npm run prisma:generate

# Build for production
npm run build
```

---

**Last Updated**: 2024-11-06
**Status**: Complete codebase analysis with 14 sections and 3 comprehensive docs
**Next Phase**: API route implementation and UI integration

