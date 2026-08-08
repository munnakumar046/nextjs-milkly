import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1),

  AUTH_SECRET: z.string().min(1),
  AUTH_URL: z.string().url(),

  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),

  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(
    `Invalid or missing environment variables:\n${missing}\n\nCheck your .env.local file against the variables required in src/lib/env.ts.`,
  );
}

export const env = parsed.data;
