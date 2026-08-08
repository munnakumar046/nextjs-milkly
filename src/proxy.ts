import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { USER_ROLE } from "@/constants/roles";

const ADMIN_PREFIX = "/admin";

const PROTECTED_PREFIXES = ["/admin", "/dashboard", "/profile", "/checkout"];

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

// This is a UX-level gate: it redirects obviously unauthenticated/unauthorized
// requests before a page ever renders. It must not be the only line of
// defense — protected layouts/pages/route handlers re-check the session
// server-side, since proxy checks rely on the (spoofable-at-the-edge) JWT
// cookie rather than a fresh DB lookup.
export default auth((req) => {
  const { pathname, origin } = req.nextUrl;

  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    matchesPrefix(pathname, prefix),
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const session = req.auth;

  if (!session?.user) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    matchesPrefix(pathname, ADMIN_PREFIX) &&
    session.user.role !== USER_ROLE.ADMIN
  ) {
    return NextResponse.redirect(new URL("/", origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/checkout/:path*",
  ],
};
