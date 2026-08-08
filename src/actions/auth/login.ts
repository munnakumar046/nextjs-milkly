"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { LoginSchema } from "@/validations/auth";
import type { ActionResult } from "@/types/auth";

function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export async function loginUser(
  email: string,
  password: string,
): Promise<ActionResult> {
  const validated = LoginSchema.safeParse({ email, password });

  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0].message,
    };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      // We handle the redirect on the client after checking the result,
      // so NextAuth must not redirect (or throw a redirect) on our behalf.
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    // Next.js' internal redirect signal must never be swallowed.
    if (isNextRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid email or password.",
          };
        default:
          return {
            success: false,
            message: "Unable to sign in right now. Please try again.",
          };
      }
    }

    console.error("loginUser: unexpected error", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
