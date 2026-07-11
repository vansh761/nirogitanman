# Setup Guide

## Prerequisites
- Node.js 20+
- pnpm 9+ (`npm i -g pnpm`)
- PostgreSQL 14+ running locally (or a hosted instance)

## 1. Install dependencies
```bash
pnpm install
```

## 2. Configure the database
```bash
cp packages/database/.env.example packages/database/.env
# edit packages/database/.env with your real Postgres credentials
```

**Preferred (normal internet access):**
```bash
pnpm db:generate
pnpm db:migrate
```

**Already tested and working, use if `prisma generate` can't reach
`binaries.prisma.sh` in your network:**
```bash
createdb niro_ayurveda
psql niro_ayurveda -f packages/database/prisma/manual_migration.sql
psql niro_ayurveda -f packages/database/prisma/seed.sql
```
This gives you the exact same tables plus realistic demo data (doctors,
patients, appointments, blogs, testimonials, FAQs, notifications, settings,
and login users — all with password `password123`).

`pnpm db:studio` opens Prisma Studio if you want to inspect/edit rows visually
(requires the Prisma CLI to be working).

## 3. Configure the public site (`apps/web`)
`apps/web/.env.local`:
```
GROQ_API_KEY=your_groq_key_here
DATABASE_URL=postgresql://...        # same as packages/database/.env
NEXTAUTH_SECRET=some_random_string
NEXTAUTH_URL=http://localhost:3000
```
Get a Groq key at https://console.groq.com — never commit it or paste it in
a shared chat; treat it like a password.

## 4. Configure the dashboard (`apps/dashboard`)
`apps/dashboard/.env.local`:
```
AUTH_SECRET=some_random_string
AUTH_URL=http://localhost:3001
DATABASE_URL=postgresql://...
```

## 5. Run everything
```bash
pnpm dev:web         # http://localhost:3000
pnpm dev:dashboard   # http://localhost:3001
```

## 6. Demo data
Already seeded via `packages/database/prisma/seed.sql` (see step 2) — you can
log into the dashboard immediately with any of the accounts listed there,
and the public site will show real doctors/testimonials/FAQs/blog posts
instead of mock data.
