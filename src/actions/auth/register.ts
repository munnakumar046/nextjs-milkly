"use server";

import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { RegisterSchema } from "@/validations/auth";

export async function registerUser(data: unknown) {
  const validated = RegisterSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0].message,
    };
  }
  // console.log("success", success);

  const { name, email, password } = validated.data;

  await connectDB();

  console.log("✅ Connected");

  const existingUser = await User.findOne({ email });
  console.log("Existing User:", existingUser);

  if (existingUser) {
    return {
      success: false,
      message: "Email already exists.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    provider: "credentials",
  });

  console.log("Created User:", user);

  const check = await User.findOne({ email });
  console.log("Saved User:", check);

  return {
    success: true,
    message: "Account created successfully.",
  };
}
