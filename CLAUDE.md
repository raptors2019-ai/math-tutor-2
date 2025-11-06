🔄 Project Awareness & Context

- Always read PLANNING.md at the start of a new conversation to understand the project's architecture, goals, style, and constraints.

- Check TASK.md before starting a new task. If the task isn’t listed, add it with a brief description and today's date.

- Use consistent naming conventions, file structure, and architecture patterns as described in PLANNING.md.

- Use nvm (Node Version Manager) or a consistent Node.js version on macOS whenever running commands, including for tests. Install dependencies with npm install or yarn install as needed.

🧱 Code Structure & Modularity

- Never create a file longer than 500 lines of code. If a file approaches this limit, refactor by splitting it into modules or helper files.

- Organize code into clearly separated modules, grouped by feature or responsibility.

For components this looks like: - index.tsx - Main component definition and logic

    - utils.ts - Utility functions used by the component

    - styles.ts - Tailwind-related styles or configurations

- Use clear, consistent imports (prefer relative imports within packages).

- Use clear, consistent imports (prefer relative imports within packages).

- Use process.env or a library like dotenv for environment variables in Next.js.

🧪 Testing & Reliability

- Always create Jest unit tests for new features (functions, components, pages, etc).

- After updating any logic, check whether existing unit tests need to be updated. If so, do it.

- Tests should live in a /**tests** folder mirroring the main app structure.
  - Include at least:
    - 1 test for expected use

    - 1 edge case

    - 1 failure case

✅ Task Completion

- Mark completed tasks in TASK.md immediately after finishing them.

- Add new sub-tasks or TODOs discovered during development to TASK.md under a “Discovered During Work” section.

📎 Style & Conventions

- Use TypeScript as the primary language for type-safe development.

- Follow ESLint rules, use type annotations, and format with Prettier (integrated via npm run lint or similar scripts).

- Use Zod for data validation in Next.js API routes or forms.

- Use Next.js for the app framework, with Tailwind CSS for styling (configure in tailwind.config.ts).

- Write JSDoc comments for every function using a friendly, readable style:

  /\*\*
  - Brief summary.
  -
  - @param param1 - Description.
  - @returns Description.
    \*/
    function example(param1: string): string {
    // ...
    }

📚 Documentation & Explainability

- Update README.md when new features are added, dependencies change, or setup steps are modified.

- Comment non-obvious code and ensure everything is understandable to a mid-level developer.

- When writing complex logic, add an inline // Reason: comment explaining the why, not just the what.

🧠 AI Behavior Rules

- Never assume missing context. Ask questions if uncertain.

- Never hallucinate libraries or functions – only use known, verified Next.js, TypeScript, or Tailwind packages.

- Always confirm file paths and module names exist before referencing them in code or tests.

- Never delete or overwrite existing code unless explicitly instructed to or if part of a task from TASK.md.
