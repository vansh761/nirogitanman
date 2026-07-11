# Deployment

## Recommended: Vercel (one project per app)
Because the dashboard must be a genuinely separate app, deploy `apps/web`
and `apps/dashboard` as **two separate Vercel projects** pointing at the same
repo with different "Root Directory" settings (`apps/web`, `apps/dashboard`).

1. Push the repo to GitHub.
2. In Vercel: New Project → import repo → set Root Directory to `apps/web`.
   Add env vars: `GROQ_API_KEY`, `DATABASE_URL`, `NEXTAUTH_SECRET`,
   `NEXTAUTH_URL` (your production web URL).
3. Repeat for `apps/dashboard` with Root Directory `apps/dashboard`. Add
   `AUTH_SECRET`, `AUTH_URL` (production dashboard URL, e.g.
   `https://dashboard.yourdomain.com`), `DATABASE_URL`.
4. Point a subdomain (`dashboard.yourdomain.com`) at the dashboard project in
   your DNS + Vercel domain settings, per the brief's "dashboard.domain.com"
   option.

## Database
Use a managed Postgres instance (Neon, Supabase, or Railway all work well
with Prisma and have generous free tiers). Set the same `DATABASE_URL` on
both apps and on `packages/database/.env` for local migrations.

Run migrations against production from a machine with the production
`DATABASE_URL`:
```bash
pnpm db:migrate deploy
```

## Environment variable checklist
| App | Variable | Notes |
|---|---|---|
| web | `GROQ_API_KEY` | server-only, never `NEXT_PUBLIC_` |
| web | `DATABASE_URL` | |
| web | `NEXTAUTH_SECRET` / `NEXTAUTH_URL` | if wiring public-site auth later |
| web | `RAZORPAY_KEY_ID` | public, reaches the client to open checkout |
| web | `RAZORPAY_KEY_SECRET` | server-only, used to create orders + verify signatures |
| dashboard | `AUTH_SECRET` / `AUTH_URL` | required by NextAuth v5 |
| dashboard | `DATABASE_URL` | |

Leaving `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` blank keeps the payment flow
in demo mode (fully functional, just simulated) — set both to go live with
real payments, no code changes required.

## Pre-launch checklist
- [ ] Rotate the Groq API key if it was ever shared outside a secrets manager
- [ ] Run `pnpm db:migrate deploy` against production DB (or apply
      `packages/database/prisma/manual_migration.sql` if Prisma migrate is
      unavailable in your environment)
- [ ] Add real `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` to go live with payments
- [ ] Swap demo login users for real Prisma-backed accounts if you move off
      the seeded rows in `prisma/seed.sql`
- [ ] Add `robots.txt` / `sitemap.xml` domain to match your real production URL
      (currently pointing at the placeholder `nirotanman.example.com`)
- [ ] Run Lighthouse against the deployed `apps/web` URL
