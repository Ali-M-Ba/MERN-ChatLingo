import { describe, expect, it } from "vitest";
import {
  signupSchema,
  loginSchema,
  onboardingSchema,
} from "../../../shared/schemas/auth.schema.js";

describe("shared auth schemas", () => {
  it("accepts valid signup payloads", () => {
    const payload = signupSchema.parse({
      name: "Alice",
      email: "ALICE@example.com",
      password: "password123",
    });

    expect(payload).toMatchObject({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
    });
  });

  it("accepts valid login payloads and normalizes email", () => {
    const payload = loginSchema.parse({
      email: "ALICE@example.com",
      password: "password123",
    });

    expect(payload.email).toBe("alice@example.com");
  });

  it("validates onboarding data with normalized username", () => {
    const payload = onboardingSchema.parse({
      name: "Alice",
      username: "ALICE_123",
      bio: "Hello world",
      avatar: "https://example.com/avatar.png",
    });

    expect(payload.username).toBe("alice_123");
  });

  it("rejects invalid onboarding usernames", () => {
    expect(() =>
      onboardingSchema.parse({
        name: "Alice",
        username: "Alice!",
        bio: "Hello world",
      }),
    ).toThrow();
  });
});
