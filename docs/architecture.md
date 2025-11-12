# Architecture & Implementation Notes

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui primitives.
- **State**: React Server Components with client islands, lightweight zustand store (future), `usePathwayAdvisor` hook for decision logic.
- **Backend**: Supabase (PostgreSQL + Auth + Storage). Server components and API routes use Supabase helpers for secure data fetching.
- **AI**: Pathway engine implemented locally today; future integration with OpenAI/Azure for writing assistant, readiness scoring, and interview bot.
- **Tooling**: Vitest, Testing Library, ESLint, Prettier (via tailwind prettier plugin if desired).

## Application Slices

1. **Marketing / Acquisition**: `/` landing page with hero CTA, AI showcase, analytics, and module routing.
2. **Advisor Workspace**: `/advisor` hosts the intelligent decision tree; server API `/api/pathway` exposes the heuristic engine for future integrations.
3. **Operations Dashboard**: `/dashboard` summarises competency performance, experience diary, CPD, documents, fees, networking, and tiers.
4. **Lifecycle Modules**: `/modules` surfaces Student → FRICS modules with call-to-action buttons hooking into Supabase workflows.
5. **Community Hub**: `/community` collates mentor matching, study groups, employer programmes, and Matrics style events.

## Data Model Summary

See `supabase/migrations/0001_init.sql` for the canonical schema covering:
- `users` – profile, membership level, pathway, multi-tenant org support.
- `qualifications` – degree accreditation + conversion evidence.
- `projects` / `experience_entries` – diary + competency tagging.
- `competencies` – mandatory/core/optional, required/current level, evidence references.
- `cpd_activities` – activity logs with certificate URLs.
- `assessments` – tracking of Student → FRICS assessment states.
- `documents` – version-controlled submissions (Summary of Experience, Case Study, CPD records, etc.).
- `mentorship` – counsellor ↔ mentee pairings, meeting notes, approvals.
- `fellowship_characteristics` – FRICS characteristic evidence store.

Multi-tenant architecture is supported via `organisation_id` plus row-level security policies (to be added in Supabase).

## Pathway Engine

`src/lib/pathway-engine.ts` encapsulates the advisor logic:
- Weights each assessment route with baseline confidence + heuristics for experience, leadership, accreditation, counsellor support, and explicit goals.
- Builds timeline projections (milestones, month ranges) + fee breakdowns.
- Surfaces prerequisites, risks, and competency focus from curated data.
- Exposed via hook (`usePathwayAdvisor`) and API route for future automation (e.g., Slack bot, employer dashboards).

## Feature Coverage Mapping

- **Student Module**: free membership assistant, placement tracker, Matrics resources.
- **Academic Assessment**: conversion guidance, document hub.
- **AssocRICS**: experience requirement tracker, 13-sector selector.
- **MRICS**: APC structured training, alternate routes (preliminary review, direct entry, SPA, specialist, academic).
- **Fellowship**: characteristic selector, peer-review prep.
- **Competency Framework**: mandatory list, dynamic mapping, level tracking.
- **Experience & CPD**: diary summary, CPD tracker with hours + categories.
- **Document Centre**: template statuses, version tracking, AI writer placeholder.
- **Assessment Suite**: recommendation cards include interview prep callouts; extend with question banks.
- **Counsellor Network**: community hub metrics, mentor matching CTA.
- **Financial Planning**: fee breakdown widget + reimbursements.
- **Subscription tiers**: tier cards, highlight features.
- **Analytics**: success metrics panel with change stats.

## Integrations Roadmap

- **Supabase Storage** – Document uploads + certificate storage.
- **Calendar APIs** – Sync mentor sessions + assessments.
- **DocuSign** – Signature workflow for employer-signed diaries.
- **SendGrid** – Notifications for deadlines, approvals, reminders.
- **Stripe** – Billing for Professional/Fellowship/Enterprise tiers.
- **Video Conferencing (Zoom/Teams)** – Interview simulator + mentor calls.
- **AI Providers** – Writing assistant, interview bot, predictive analytics.

## Security & Compliance

- RICS-aligned competency + ethics guardrails.
- GDPR readiness via Supabase encryption, data export, and deletion endpoints (to implement).
- ISO 27001 alignment: audit logging, least privilege RBAC, regular security reviews.
- Backups & disaster recovery via Supabase PITR + scheduled exports.

## Testing Strategy

- Vitest unit tests for deterministic engines (pathway scoring).
- Planned: Testing Library for advisor form interactions, Playwright for E2E across membership modules, data-contract tests via Supabase migrations.
- Use Vercel Preview deployments + Supabase branch-based DBs for QA.

## Deployment & Operations

- Deploy to Vercel, connect Supabase project.
- Environment secrets: Supabase URL/key, OpenAI key, Stripe, SendGrid, DocuSign, AWS S3, Zoom/Teams OAuth.
- Monitoring: Vercel Web Analytics + Supabase logs + Sentry (future) for API errors.
- Scheduled tasks: nightly analytics refresh, CPD reminders, backup verification.

