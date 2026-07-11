import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findUserByEmail, verifyPassword } from "database";
import type { Role } from "@/lib/rbac";
import { authConfig } from "@/lib/auth.config";

// Full config (Node runtime only) — used by the /api/auth/[...nextauth]
// route handler, which is where the actual DB + bcrypt work happens.
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email || "").toLowerCase();
        const password = String(credentials?.password || "");

        const user = await findUserByEmail(email);
        if (!user || !user.passwordHash) return null;

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role as Role };
      },
    }),
  ],
});
