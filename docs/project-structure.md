# Project Structure

```
niro-ayurveda/
├── pnpm-workspace.yaml
├── package.json                  # root scripts: dev:web, dev:dashboard, db:*
├── README.md
├── docs/
│   ├── setup.md
│   ├── database.md
│   ├── api.md
│   ├── deployment.md
│   ├── design.md
│   ├── agent.md
│   ├── erd.eraser                # paste into eraser.io
│   └── project-structure.md      # this file
│
├── packages/
│   └── database/
│       ├── prisma/schema.prisma  # single source of truth for all models
│       ├── index.ts              # exported Prisma client singleton
│       └── .env.example
│
├── apps/
│   ├── web/                      # public site — localhost:3000
│   │   └── src/
│   │       ├── app/
│   │       │   ├── layout.tsx
│   │       │   ├── page.tsx      # assembles all landing sections
│   │       │   ├── globals.css   # design tokens (Tailwind v4 @theme)
│   │       │   └── api/ai-chat/route.ts   # Groq streaming endpoint
│   │       ├── components/
│   │       │   ├── layout/       # navbar.tsx, footer.tsx
│   │       │   ├── sections/     # hero, stats, services, consultation, ...
│   │       │   ├── ai/           # niro-ai-widget.tsx
│   │       │   └── ui/           # button.tsx
│   │       └── lib/              # utils.ts, groq.ts, mock-data.ts
│   │
│   └── dashboard/                # admin/editor/doctor console — localhost:3001
│       └── src/
│           ├── app/
│           │   ├── login/        # login-form.tsx (client) + page.tsx (Suspense wrapper)
│           │   └── dashboard/
│           │       ├── layout.tsx        # session check + sidebar shell
│           │       ├── page.tsx          # home: KPIs + chart
│           │       ├── appointments/     # fully built table
│           │       ├── forbidden/        # RBAC denial page
│           │       └── <15 more>/        # scaffolded, TODO-marked
│           ├── components/layout/sidebar.tsx
│           ├── components/providers.tsx  # SessionProvider wrapper
│           ├── lib/auth.ts       # NextAuth v5 config
│           ├── lib/rbac.ts       # role → route access matrix
│           └── middleware.ts     # enforces auth + RBAC on /dashboard/*
```

## Where things live, by concern
- **Design tokens**: `apps/*/src/app/globals.css` (kept identical across
  both apps so they feel like one product).
- **RBAC source of truth**: `apps/dashboard/src/lib/rbac.ts`.
- **AI system prompt / guardrails**: `apps/web/src/lib/groq.ts`.
- **Database schema**: `packages/database/prisma/schema.prisma` only —
  never redefine models inside an app.
