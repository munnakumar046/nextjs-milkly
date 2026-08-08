/**
 * Standard shape returned by auth-related server actions (login, register,
 * etc). Using a discriminated union on `success` lets consumers narrow the
 * type safely instead of guessing which fields exist.
 */
export type ActionResult =
  | { success: true }
  | { success: false; message: string };
