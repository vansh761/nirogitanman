import type { NextAuthConfig } from "next-auth";

// Kept free of any Node-only imports (pg, bcryptjs) so middleware — which
// runs on the Edge runtime by default — can use it to read the session
// without pulling in modules Edge can't execute.
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [], // real providers are only registered in lib/auth.ts (Node runtime)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};
