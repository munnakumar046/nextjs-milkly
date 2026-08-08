import "server-only";

import { auth } from "@/auth";
import { USER_ROLE } from "@/constants/roles";
import type { Session } from "next-auth";

/**
 * Thrown when no session exists at all. Server actions/route handlers
 * should catch this and surface a generic "please sign in" result -
 * never leak whether a resource exists to an unauthenticated caller.
 */
export class UnauthorizedError extends Error {
  constructor(message = "You must be signed in to do this.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Thrown when a session exists but lacks the required role.
 */
export class ForbiddenError extends Error {
  constructor(message = "You don't have permission to do this.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

type AuthedSession = Session & { user: Session["user"] };

/**
 * Use inside server actions / route handlers that require *any*
 * authenticated user. This re-checks the session server-side and must not
 * be replaced by relying on proxy.ts alone - actions can be called
 * directly, bypassing the proxy layer entirely.
 */
export async function requireAuth(): Promise<AuthedSession> {
  const session = await auth();

  if (!session?.user) {
    throw new UnauthorizedError();
  }

  return session as AuthedSession;
}

/**
 * Use inside server actions / route handlers that are admin-only
 * (product/category/order management, etc).
 */
export async function requireAdmin(): Promise<AuthedSession> {
  const session = await requireAuth();

  if (session.user.role !== USER_ROLE.ADMIN) {
    throw new ForbiddenError();
  }

  return session;
}

/**
 * Converts an UnauthorizedError/ForbiddenError into a safe, user-facing
 * message for server action results. Returns null for anything else so the
 * caller knows to treat it as an unexpected error instead.
 */
export function authErrorMessage(error: unknown): string | null {
  if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
    return error.message;
  }

  return null;
}
