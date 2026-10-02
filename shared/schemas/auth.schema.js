import { z } from "zod";

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(50, "Name must be at most 50 characters");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address");

export const passwordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters");

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(
    /^[a-z0-9_]+$/,
    "Username can only contain lowercase letters, numbers, and underscores",
  );

export const bioSchema = z
  .string()
  .trim()
  .max(160, "Bio must be at most 160 characters")
  .optional()
  .or(z.literal(""));

export const avatarSchema = z.string().trim().optional().or(z.literal(""));

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const onboardingSchema = z.object({
  name: nameSchema,
  username: usernameSchema,
  bio: bioSchema,
  avatar: avatarSchema,
  nativeLanguage: z.string().trim().or(z.literal("")),
  learningLanguage: z.string().trim().or(z.literal("")),
  location: z.string().trim().optional().or(z.literal("")),
});
