# Testing & Quality Plan

## Current Coverage

- **Unit tests** (`src/tests/pathway-engine.test.ts`) validate pathway recommendation heuristics: top-3 cap, goal prioritisation, and fellowship routing logic.
- ESLint + TypeScript ensure type safety and accessible patterns.

## Near-Term Additions

1. **Advisor UI tests** – Use Testing Library to simulate user input (experience, degree type, leadership) and assert updated recommendations.
2. **Dashboard snapshot tests** – Validate competency + CPD cards render deterministic values when Supabase fixtures are injected.
3. **Playwright E2E** – Smoke test marketing hero → advisor CTA → modules navigation.
4. **Supabase contract tests** – Use Vitest + Supabase test containers to ensure migrations align with API expectations.

## QA Workflow

- PRs trigger `npm run lint` + `npm test`.
- Preview deployments on Vercel + Supabase branch DB for acceptance.
- Observability via Vercel Analytics + (future) Sentry for error tracking.
