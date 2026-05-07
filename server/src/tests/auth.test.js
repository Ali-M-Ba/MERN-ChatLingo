import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import User from "../models/User.js";

describe("Auth routes", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
      dbName: "streamify_test",
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("POST /api/auth/signup", () => {
    it("creates a new user and sets a cookie", async () => {
      const response = await request(app).post("/api/auth/signup").send({
        name: "Alice",
        email: "alice@example.com",
        username: "alice123",
        password: "password123",
        bio: "Hello world",
        avatar: "https://example.com/avatar.png",
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("user created successfully");
      expect(response.body.user).toMatchObject({
        name: "Alice",
        username: "alice123",
        bio: "Hello world",
        avatar: "https://example.com/avatar.png",
      });
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("returns 409 when username already exists", async () => {
      await User.create({
        name: "Bob",
        email: "bob@example.com",
        username: "bob123",
        password: "password123",
      });

      const response = await request(app).post("/api/auth/signup").send({
        name: "Robert",
        email: "robert@example.com",
        username: "bob123",
        password: "password123",
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("username already exists");
    });

    it("returns 409 when email already exists", async () => {
      await User.create({
        name: "Carol",
        email: "carol@example.com",
        username: "carol123",
        password: "password123",
      });

      const response = await request(app).post("/api/auth/signup").send({
        name: "Caroline",
        email: "carol@example.com",
        username: "caroline123",
        password: "password123",
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("email already exists");
    });

    it("returns 400 for invalid signup data", async () => {
      const response = await request(app).post("/api/auth/signup").send({
        name: "",
        email: "not-an-email",
        username: "ab",
        password: "123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });

  describe("POST /api/auth/login", () => {
    it("returns 200 and sets a cookie for valid credentials", async () => {
      await User.create({
        name: "Alice",
        email: "alice@example.com",
        username: "alice123",
        password: "password123",
      });

      const response = await request(app).post("/api/auth/login").send({
        username: "alice123",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("login successful");
      expect(response.body.user.username).toBe("alice123");
      expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("returns 401 for invalid credentials", async () => {
      await User.create({
        name: "Alice",
        email: "alice@example.com",
        username: "alice123",
        password: "password123",
      });

      const response = await request(app).post("/api/auth/login").send({
        username: "alice123",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("invalid credentials");
    });

    it("returns 400 for invalid login payload", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "ab",
        password: "123",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });
});
