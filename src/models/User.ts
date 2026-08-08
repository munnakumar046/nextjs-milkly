import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      default: null,
    },

    image: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    provider: {
      type: String,
      default: "credentials",
    },
  },
  {
    timestamps: true,
  },
);

export const User = models.User || model("User", userSchema);
