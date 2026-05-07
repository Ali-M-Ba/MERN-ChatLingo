import { z } from "zod";

// Zod schemas
export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  password: z.string().min(8, "Password must be at least 8 characters"),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

export const loginSchema = z.object({
  username: z.string().trim().toLowerCase().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
