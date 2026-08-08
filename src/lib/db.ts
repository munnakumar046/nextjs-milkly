import mongoose from "mongoose";

import { env } from "@/lib/env";

declare global {
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Don't cache a failed connection attempt - the next call should retry.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
