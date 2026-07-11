// NOTE: this package exposes a `pg`-backed repository layer today because
// the build sandbox used to create this project blocks binaries.prisma.sh,
// so `prisma generate` cannot run here. On a machine with normal internet
// access, run `pnpm db:generate` and you can additionally import the
// generated Prisma client from "@prisma/client" for ad-hoc queries — the
// schema in prisma/schema.prisma is still the single source of truth for
// table structure, and this repository's SQL matches it exactly.
export * from "./pg";
export * from "./repository";
