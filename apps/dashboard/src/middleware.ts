import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";
import { canAccess, type Role } from "@/lib/rbac";

// Uses the edge-safe config (no pg/bcrypt) so this can run on the Edge runtime.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/dashboard")) return NextResponse.next();

  const role = (req.auth?.user as { role?: Role } | undefined)?.role;

  if (!role) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!canAccess(role, pathname)) {
    return NextResponse.redirect(new URL("/dashboard/forbidden", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
