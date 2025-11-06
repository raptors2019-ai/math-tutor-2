name: "Base PRP Template v2 - Context-Rich with Validation Loops"

description: |

Purpose

Template optimized for AI agents to implement features with sufficient context and self-validation capabilities to achieve working code through iterative refinement.

Core Principles

1. Context is King: Include ALL necessary documentation, examples, and caveats

2. Validation Loops: Provide executable tests/lints the AI can run and fix

3. Information Dense: Use keywords and patterns from the codebase

4. Progressive Success: Start simple, validate, then enhance

5. Global rules: Be sure to follow all rules in CLAUDE.md

---

Goal

[What needs to be built - be specific about the end state and desires]

Why

- [Business value and user impact]

- [Integration with existing features]

- [Problems this solves and for whom]

What

[User-visible behavior and technical requirements]

Success Criteria

- [Specific measurable outcomes]

All Needed Context

Documentation & References (list all context needed to implement the feature)

    # MUST READ - Include these in your context window
    - url: [Official API docs URL]
      why: [Specific sections/methods you'll need]

    - file: [path/to/example.tsx]
      why: [Pattern to follow, gotchas to avoid]

    - doc: [Library documentation URL]
      section: [Specific section about common pitfalls]
      critical: [Key insight that prevents common errors]

    - docfile: [PRPs/ai_docs/file.md]
      why: [docs that the user has pasted in to the project]

Current Codebase tree (run tree in the root of the project) to get an overview of the codebase

Desired Codebase tree with files to be added and responsibility of file

Known Gotchas of our codebase & Library Quirks

    // CRITICAL: Next.js requires server-side props or getStaticProps for data fetching in pages
    // Example: Tailwind CSS purging must be configured in tailwind.config.ts to avoid large bundles
    // Example: TypeScript strict mode is enabled, so use non-null assertions sparingly
    // Example: We use Zod for schema validation and it requires explicit parsing

Implementation Blueprint

Data models and structure

Create the core data models, we ensure type safety and consistency.

    Examples:
     - TypeScript interfaces
     - Zod schemas
     - Zod validators
     - React context types

list of tasks to be completed to fullfill the PRP in the order they should be completed

    Task 1:
    MODIFY src/app/existing-page.tsx:
      - FIND pattern: "const OldComponent"
      - INJECT after line containing "useState"
      - PRESERVE existing hook signatures

    CREATE src/app/new-feature.tsx:
      - MIRROR pattern from: src/app/similar-feature.tsx
      - MODIFY component name and core logic
      - KEEP error handling pattern identical

    ...(...)

    Task N:
    ...

Per task pseudocode as needed added to each task

    // Task 1
    // Pseudocode with CRITICAL details dont write entire code
    async function newFeature(param: string): Promise<Result> {
        // PATTERN: Always validate input first (see src/utils/validators.ts)
        const validated = validateInput(param); // throws ZodError

        // GOTCHA: Next.js API routes require proper error handling for async
        try {
            // PATTERN: Use existing fetch wrapper
            const response = await fetchWithRetry('/api/external', { method: 'POST', body: JSON.stringify(validated) }); // see src/utils/fetch.ts

            // CRITICAL: Handle rate limiting (e.g., 429 errors)
            if (response.status === 429) {
                throw new Error('Rate limit exceeded');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            // PATTERN: Standardized error format
            return formatError(error); // see src/utils/errors.ts
        }
    }

Integration Points

    DATABASE:
      - migration: "Add field 'featureEnabled' to User model"  # If using Prisma or similar
      - index: "Ensure index on 'featureId' in schema.prisma"

    CONFIG:
      - add to: .env or src/config.ts
      - pattern: "export const FEATURE_TIMEOUT = Number(process.env.FEATURE_TIMEOUT ?? '30');"

    ROUTES:
      - add to: src/app/api/routes.ts  # Or directly in app/api/feature/route.ts
      - pattern: "Handle POST /api/feature with validation"

Validation Loop

Level 1: Syntax & Style

    # Run these FIRST - fix any errors before proceeding
    npm run lint -- --fix  # Auto-fix with ESLint
    npx tsc --noEmit      # Type checking

    # Expected: No errors. If errors, READ the error and fix.

Level 2: Unit Tests each new feature/file/function use existing test patterns

    // CREATE __tests__/new-feature.test.tsx with these test cases:
    import { newFeature } from '../src/app/new-feature';

    test('happy path', () => {
        const result = newFeature('valid_input');
        expect(result.status).toBe('success');
    });

    test('validation error', () => {
        expect(() => newFeature('')).toThrow('ZodError');
    });

    test('external API timeout', () => {
        // Mock fetch or use jest.mock
        jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Timeout'));
        const result = newFeature('valid');
        expect(result.status).toBe('error');
        expect(result.message).toContain('timeout');
    });


    # Run and iterate until passing:
    npm test -- --verbose
    # If failing: Read error, understand root cause, fix code, re-run (never mock to pass)

Level 3: Integration Test

    # Start the service
    npm run dev

    # Test the endpoint
    curl -X POST http://localhost:3000/api/feature \
      -H "Content-Type: application/json" \
      -d '{"param": "test_value"}'

    # Expected: {"status": "success", "data": {...}}
    # If error: Check console logs for stack trace

Final validation Checklist

- All tests pass: npm test

- No linting errors: npm run lint

- No type errors: npx tsc --noEmit

- Manual test successful: [specific curl/command]

- Error cases handled gracefully

- Logs are informative but not verbose

- Documentation updated if needed

---

Anti-Patterns to Avoid

- ❌ Don't create new patterns when existing ones work

- ❌ Don't skip validation because "it should work"

- ❌ Don't ignore failing tests - fix them

- ❌ Don't use non-async code in server components

- ❌ Don't hardcode values that should be config

- ❌ Don't catch all exceptions - be specific
