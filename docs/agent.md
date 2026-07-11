# agent.md

Guidance for any AI coding agent (or future contributor) extending this
project.

## Project goal
Niro Ayurveda connects visitors to verified Ayurvedic doctors and an
educational AI assistant (Niro AI), with a role-gated back office for
running the business (doctors, editors, admins).

## Architecture
- **Monorepo**, pnpm workspaces: `apps/web`, `apps/dashboard`,
  `packages/database`.
- `apps/web` is the only app allowed to call Groq directly, and only from a
  server route (`/api/ai-chat`) — never expose `GROQ_API_KEY` to the client.
- `apps/dashboard` is deliberately a separate deployable app, not a route
  inside `web`, so its auth/session and the public site's are independent.
- `packages/database` is the single source of truth for the schema. Do not
  duplicate model definitions in either app — import from `database`.

## Coding standards
- TypeScript everywhere, strict mode on (default from `create-next-app`).
- Tailwind v4 (`@theme` tokens in `globals.css`), no inline hex colors —
  use the tokens (`canvas`, `forest`, `emerald`, `mint`, `sky`, `saffron`).
- Fonts are self-hosted via `@fontsource/*` (not `next/font/google`) because
  this environment's egress proxy blocks `fonts.googleapis.com`. Keep it that
  way unless you've confirmed the deploy target has open network access.
- Components: Server Components by default; add `"use client"` only where
  state, effects, or browser APIs are needed.
- New dashboard pages must be registered in `src/lib/rbac.ts` (`NAV_ITEMS`
  and, if role-restricted, `ROLE_ROUTE_ACCESS`) — the middleware enforces
  from that single table.

## Folder structure
```
apps/web/src/
  app/                # routes + api/ai-chat
  components/
    layout/           # navbar, footer
    sections/         # one file per landing-page section
    ai/               # Niro AI widget
    ui/               # small primitives (button, etc.)
  lib/                # utils, groq client, mock-data

apps/dashboard/src/
  app/
    login/
    dashboard/        # one folder per nav item, layout.tsx = shell
  components/layout/  # sidebar
  lib/                # auth.ts, rbac.ts, mock-data.ts
```

## How to contribute a new feature
1. Check `docs/database.md` — does it need a new Prisma model? Add it,
   `pnpm db:generate`, `pnpm db:migrate`.
2. Build the UI against `mock-data.ts` first (fast iteration, no DB
   dependency), then swap in a real Prisma query behind the same shape.
3. If it's a dashboard page: add the route under `app/dashboard/<name>`,
   register it in `rbac.ts`.
4. Keep the design tokens and motion restraint described in `docs/design.md`
   — the Breath Ring hero is the one "big" animation; everything else should
   be a restrained fade/slide.

## Roadmap (not yet built)
- Real Prisma wiring for all dashboard list pages (currently TODO scaffolds)
- Doctor availability calendar UI (schema already supports it via
  `Doctor.availability` JSON)
- Payment provider integration (Razorpay/Stripe) behind the `Payment` model
- Blog/article rich-text editor for the Editor role
- `robots.txt` / `sitemap.xml` / structured data for SEO
