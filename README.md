# ASII Website

Official public website repository for **ASII — Continuity-Native Financial Crime Intelligence Infrastructure**.

ASII is being developed for regulated institutions. The current institutional-entry and evaluation track focuses on **Tajikistan** while the core platform remains jurisdiction-neutral. Broader jurisdictional expansion is separate from the September evaluation gate. Public language in this repository is intentionally conservative and must not imply customers, partnerships, regulatory approval, guaranteed compliance, or completed deployments without authoritative evidence.

## Current application

- Framework: Next.js 16 App Router
- UI: React 19 and Tailwind CSS 3
- Language: strict TypeScript
- Package manager: npm
- Runtime policy: Node.js 22.x
- Hosting: Vercel
- Current public deployment: <https://asii.site>

The active application is defined by `app/`, `components/`, `data/`, and `lib/`. Historical static pages are retained only under `archive/` and are not part of the deployed application.

## Public routes

- `/` — institutional overview
- `/platform` — intelligence layer and integration model
- `/services` — proposed Continuity Pilot
- `/contact` — institutional enquiry route
- `/verify` — official public-contact verification route

The repository also contains a synthetic controlled demo under `/pilot` and related routes. Demo data is not operational institution or customer data. The current Tajikistan evaluation track is intended to demonstrate investigation continuity, evidence lineage, accountable human review, and regulator-ready output without implying an active institutional pilot. Placeholder routes are excluded from the public sitemap until their content is complete.

## Local development

```bash
npm ci
npm run dev
```

Open the local URL printed by Next.js.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Environment variables

The current contact endpoint recognises the following server-side variables:

- `CRM_WEBHOOK_URL`
- `CRM_WEBHOOK_SECRET`

Never place webhook secrets or other credentials in frontend code or commit them to the repository.

## Deployment

Vercel is connected to the GitHub repository. CI is defined in `.github/workflows/nextjs-ci.yml`. Deployment, environment changes, commits, and pushes must be performed only with explicit owner authorisation.

## Messaging guardrails

ASII should be described as infrastructure being developed for regulated institutions. Prefer language such as:

- continuity-native financial crime intelligence infrastructure;
- designed for regulated institutions;
- intended to support human-reviewed workflows;
- infrastructure for preserving investigative context and evidence lineage;
- regulator-ready reporting preparation;
- current Tajikistan institutional evaluation track, where relevant.

Do not claim regulatory approval, legal compliance guarantees, certifications, customers, partnerships, integrations, performance metrics, controlled PoC acceptance, pilot status, or completed deployments unless verified evidence is present.
