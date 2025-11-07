## FEATURE:

Polish, Testing, and Deployment for Math Tutor AI

This mini-project finalizes the Math Tutor AI app by adding polish (animations with framer-motion, sound effects via Web Audio API), error handling (toast notifications with react-hot-toast), comprehensive testing (Jest for unit/integration logic, manual checks for UX flows), and deployment to Vercel with basic monitoring (Vercel Analytics). It ensures the app is production-ready, with engaging kid-friendly enhancements (e.g., bounce animations on correct answers, success sounds), robust error recovery (e.g., toasts for network fails), and verifiable quality. This completes the end-to-end build, making the 3-lesson curriculum (Make-10, Doubles & Near-Doubles, Choosing Strategies) fully functional and deployable, demonstrating a polished AI tutoring experience.

Key outputs:

- Animations/sounds: Smooth transitions (e.g., confetti bursts, button bounces) and audio cues (e.g., cheer on success).
- Error handling: User-friendly toasts for issues like invalid inputs or API errors.
- Tests: Jest suite for backend logic (scoring, progression) and manual UX scripts for flows (e.g., complete a lesson).
- Deployment: Live app on Vercel with env vars configured and Analytics enabled for usage tracking.

## EXAMPLES:

The `examples/` folder contains components, scripts, and configs to prototype polish and testing elements. These can be integrated into your app and run with `npm run dev` or `npm test` for validation.

1. **examples/animated-feedback.tsx**: A React component using framer-motion for answer feedback animations. Example: Animates a green checkmark bounce on correct, with Web Audio for a "ding" sound. Import to test in a stub page, simulating quiz responses.

2. **examples/toast-handler.tsx**: A wrapper for react-hot-toast showing error notifications. Example: Triggers toasts like "Oops! Network error—try again" on mock failures. Useful for testing UX resilience without full app errors.

3. **examples/jest-logic.test.ts**: A Jest test file for scoring/mastery logic. Example: Tests functions like tagErrors() with cases (e.g., expect(tagErrors("7+8", 15, 14)).toEqual(["near_doubles_confusion"])). Run with `npm test` to verify backend without UI.

4. **examples/deployment-script.sh**: A bash script for Vercel deployment prep. Example: Sets env vars, runs build, and deploys (`vercel --prod`). Includes Analytics setup. Run locally to simulate deploy process.

These examples are self-contained—run tests with `npm test` or components in a dev page to validate polish features before full integration.

## DOCUMENTATION:

The following resources are key for this mini-project, focusing on animations, error UX, testing, and deployment. Reference them for production best practices.

- **Framer Motion Guide**: For animations (https://www.framer.com/motion/). Quickstart examples (https://www.framer.com/motion/examples/).

- **Web Audio API Basics**: For sound effects (https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). Simple tutorial (https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API).

- **React Hot Toast Docs**: For notifications (https://react-hot-toast.com/). Customization guide (https://react-hot-toast.com/docs/toast).

- **Jest with Next.js**: Testing setup (https://nextjs.org/docs/app/building-your-application/testing/jest). Integration tests (https://jestjs.io/docs/getting-started).

- **Vercel Deployment and Analytics**: Quick deploy guide (https://vercel.com/docs/getting-started-with-vercel/deployments). Analytics setup (https://vercel.com/docs/analytics).

## OTHER CONSIDERATIONS:

- **Animation/Sound Accessibility**: Provide options to disable sounds (e.g., user settings) for sensory needs; ensure animations don't flash (WCAG compliance). Gotcha: AI assistants often add heavy animations—keep them subtle (e.g., duration <1s) to avoid distracting kids.

- **Error Handling Robustness**: Use toasts for non-critical errors (e.g., "Slow network—retrying..."); fallback to full-page errors only for crashes. Gotcha: Forgetting to handle API 4xx/5xx—add global error boundaries in React.

- **Testing Coverage**: Write Jest for 80% logic (e.g., scoring functions); manual scripts for UX (e.g., "Click through failure flow"). Gotcha: AIs might write brittle tests—use snapshots sparingly and focus on behavior (e.g., expect(summary.accuracy).toBe(0.9)).

- **Deployment Security**: Set env vars in Vercel dashboard (never in code); enable preview branches. Gotcha: Mismatched envs cause production bugs—test deploy with `vercel deploy` first.

- **Scope Guard**: Add polish to existing screens only—no new features. If using AI tools like Claude, prompt with "Implement polish, tests, and deploy only; enhance existing UI." Commit: "feat: polish testing deploy".
