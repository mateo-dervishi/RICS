# RICS Career Pathway Platform

An end-to-end SaaS workspace for RICS candidates covering Student membership through Fellowship (FRICS). Built with Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Highlights

- **Intelligent Pathway Advisor** – multi-factor decision engine assessing qualifications, experience, leadership, and sector focus to recommend optimal RICS routes with timelines, fees, success probabilities, and risk profiles.
- **Membership lifecycle modules** – dedicated workspaces for Student, Academic Assessment, AssocRICS, MRICS (all routes), Senior, Specialist, Academic pathways, and Fellowship (FRICS).
- **Competency & Experience OS** – diary, competency heatmaps, CPD tracking, document prep, fee planning, and Supabase-backed evidence vaults.
- **AI & analytics** – personalised recommendations, writing assistant placeholders, predictive readiness scores, and outcome analytics.
- **Community & employer integration** – mentor matching, Matrics groups, employer dashboards, and networking utilities.

## Getting Started

> Node.js is not currently installed on this workspace. Install Node 18+ (or Bun) before running the commands below.

1. Install dependencies
   ```bash
   npm install
   ```
2. Configure environment
   ```bash
   cp .env.example .env.local
   # populate NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
3. Run Supabase migration (optional)
   ```bash
   supabase db push
   ```
4. Start the dev server
   ```bash
   npm run dev
   ```
5. Run tests
   ```bash
   npm test
   ```

## Key Scripts

| Script        | Purpose                                   |
| ------------- | ----------------------------------------- |
| `npm run dev` | Next.js development server                |
| `npm run build` | Production build                        |
| `npm run start` | Start Next.js in production mode        |
| `npm run lint` | ESLint with Next.js + TypeScript rules   |
| `npm test`    | Vitest (covers pathway engine heuristics) |

## Architecture Overview

- `src/app` – Next.js App Router pages for marketing site and platform areas (advisor, dashboard, modules, community).
- `src/components` – shadcn/ui inspired primitives + feature components (advisor, dashboard, modules, shared widgets).
- `src/lib` – Supabase helpers and the pathway recommendation engine.
- `src/data` – curated RICS pathway metadata, modules, fees, competencies, subscription tiers.
- `src/hooks` – reusable hooks (e.g., `usePathwayAdvisor`).
- `src/tests` – Vitest suite.
- `supabase/migrations` – first-class schema for persistence.
- `docs/` – architecture, implementation, and testing notes.

See `docs/architecture.md` for deeper breakdowns (RBAC, multi-tenant models, AI roadmap, integrations, compliance checklist).

## Deployment

- Deploy to Vercel with the Next.js adapter.
- Configure environment variables for Supabase (URL + anon key), OpenAI (for AI writing assistant), Stripe (billing), SendGrid (email), and AWS S3 (document storage) as they are introduced.
- Use Vercel cron jobs or Supabase scheduled functions for nightly analytics + backups.

## Testing & Quality

- Vitest covers deterministic pathway engine logic (recommendation counts, goal prioritisation, fellowship routing).
- Extend with component tests via `@testing-library/react` and integration tests via Playwright or Cypress once Node tooling is available.
- ESLint and TypeScript ensure type-safety; Tailwind + shadcn provide consistent UI tokens.

## Next Steps

- Implement live Supabase queries for diary entries, competencies, and community data.
- Connect AI writing assistant + interview simulator to OpenAI or Azure OpenAI endpoints.
- Build employer multi-tenant dashboards, RBAC, and offline sync (e.g., with IndexedDB + Service Workers).
- Wire up external integrations: Stripe, SendGrid, DocuSign, calendar providers, and video conferencing.
