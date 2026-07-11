# Database

PostgreSQL via Prisma. Schema lives in `packages/database/prisma/schema.prisma`,
generated client re-exported from `packages/database/index.ts`.

## Entities
- **User** — root identity, `role` enum drives RBAC (`GUEST, FREE_USER,
  PAID_USER, DOCTOR, EDITOR, ADMIN`).
- **Doctor / Patient** — 1:1 profile extensions of `User`.
- **Appointment** — links a `Patient` and `Doctor`, carries `status`
  (`PENDING → CONFIRMED → COMPLETED`, or `CANCELLED` / `NO_SHOW`).
- **Payment / Subscription** — billing, optionally tied to an `Appointment`.
- **Category / Blog / Article** — CMS content, editor-owned.
- **Testimonial / Faq** — homepage content, editor-managed.
- **AiChat** — every Niro AI message (role: `user`/`assistant`), keyed by
  `sessionId` so a conversation can be reassembled; `userId` nullable for
  anonymous visitors.
- **ContactMessage / Notification / AuditLog / Setting** — platform plumbing.

## Why Postgres over Mongo here
Appointments, payments, and RBAC roles are inherently relational (foreign
keys, joins across doctor/patient/user), which Postgres + Prisma models more
safely than a document store — you get migrations, referential integrity,
and compile-time query types for free.

## How data access actually works today
`packages/database` exposes a small `pg`-backed repository
(`repository.ts`) that both apps import from `"database"`. This exists
because the environment this project was first built in blocks
`binaries.prisma.sh` (needed for `prisma generate`/`migrate`), so the Prisma
CLI couldn't run there — but the SQL in `prisma/manual_migration.sql`
matches `schema.prisma` exactly, and was applied directly with `psql` to get
a fully working, seeded database.

**On a machine with normal internet access**, `pnpm db:generate` and
`pnpm db:migrate` will work as designed and are the preferred path going
forward — `schema.prisma` remains the single source of truth for table
structure. The `pg` repository layer works either way and needs no changes;
it's a valid, production-reasonable data access pattern on its own.

```ts
// Both apps already do this — see repository.ts for the full list:
import { getDoctors, createAppointment } from "database";
const doctors = await getDoctors();
```

## Seeding
`prisma/seed.sql` contains realistic demo data (doctors, patients,
appointments, blogs, testimonials, FAQs, users with bcrypt-hashed
passwords). Apply it after the schema:
```bash
psql "$DATABASE_URL" -f packages/database/prisma/manual_migration.sql
psql "$DATABASE_URL" -f packages/database/prisma/seed.sql
```
(Or, once `prisma migrate` works in your environment, write an equivalent
`prisma/seed.ts` using the same values and run it via `prisma db seed`.)

## Indexes
Indexes are already declared in the schema for the columns that matter most
at query time: `role` on `User`, `(doctorId, date)` on `Appointment`,
`status`/`categoryId` on `Blog`, `sessionId`/`userId` on `AiChat`.
