/**
 * StudyFlow V2 — Auth Controller Integration Tests
 *
 * Uses supertest to hit the real Express router and mocks the mysql2 pool
 * so we don't need a live database. Each test gets a fresh mock.
 *
 * Auth-protected routes: the authenticate middleware is mocked so tests don't
 * depend on JWT signing/verification — we inject a fake req.user directly.
 *
 * Run with: npm test --workspace=server
 */

import { jest, describe, it, expect, beforeEach, afterAll } from "@jest/globals";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";

// ── Mock mysql2/promise ──────────────────────────────────────────────────────

const mockPool = {
  query: jest.fn(),
  getConnection: jest.fn(),
};

jest.unstable_mockModule("mysql2/promise", () => ({
  default: { createPool: () => mockPool },
  createPool: () => mockPool,
}));

// Mock nodemailer
jest.unstable_mockModule("../utils/mailer.js", () => ({
  sendPasswordResetEmail: jest.fn().mockResolvedValue({ messageId: "test-id" }),
}));

// Mock the models entry point
jest.unstable_mockModule("../models/index.js", () => ({
  default: mockPool,
}));

// Mock bcrypt so we control hash comparisons
jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: jest.fn().mockResolvedValue("$2b$12$hashedpasswordplaceholder"),
    compare: jest.fn().mockResolvedValue(true), // default: all passwords match
  },
}));

// Mock the auth middleware — inject a fake req.user for protected routes.
// This bypasses JWT signing/verification so tests only exercise the controller logic.
const mockReqUser = { userId: 1, email: "test@example.com" };

jest.unstable_mockModule("../middleware/auth.middleware.js", () => ({
  __esModule: true,
  default: (req, res, next) => {
    req.user = mockReqUser;
    next();
  },
  authenticate: (req, res, next) => {
    req.user = mockReqUser;
    next();
  },
  authMiddleware: (req, res, next) => {
    req.user = mockReqUser;
    next();
  },
}));

// ── Import the router AFTER all mocks are registered ─────────────────────────

let authRouter;
beforeAll(async () => {
  const mod = await import("../routes/auth.routes.js");
  authRouter = mod.default;
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
  mockPool.query.mockReset();
  mockPool.getConnection.mockReset();
});

// ── Test app builder ─────────────────────────────────────────────────────────

function buildApp() {
  const app = express();
  app.use(express.json({ strict: false }));
  app.use(cookieParser());
  app.use("/api/auth", authRouter);
  app.use((req, res) => res.status(404).json({ success: false, message: "Not found" }));
  return app;
}

// mysql2 query result shape: [rows, fields]
const qr = (rows, fields = []) => [rows, fields];

// Mock connection for getConnection()
const mockConnection = () => ({
  beginTransaction: jest.fn().mockResolvedValue(),
  commit: jest.fn().mockResolvedValue(),
  rollback: jest.fn().mockResolvedValue(),
  release: jest.fn(),
  query: jest.fn().mockImplementation((sql, params) => {
    // Insert statements return { insertId: N }
    if (sql.trim().toUpperCase().startsWith("INSERT")) {
      return Promise.resolve([{ insertId: Math.floor(Math.random() * 9999) + 1 }, []]);
    }
    return Promise.resolve([[], []]);
  }),
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("POST /api/auth/register", () => {
  it("creates a user and returns 201", async () => {
    mockPool.query
      .mockResolvedValueOnce(qr([]))   // SELECT — no existing user
      .mockResolvedValueOnce(qr({ insertId: 42 })); // INSERT

    const res = await request(buildApp())
      .post("/api/auth/register")
      .send({ name: "Test User", email: "test@example.com", password: "Test1234!" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.userId).toBe(42);
    expect(res.body.data.email).toBe("test@example.com");
  });

  it("returns 409 when email already exists", async () => {
    mockPool.query.mockResolvedValueOnce(qr([{ id: 1 }]));

    const res = await request(buildApp())
      .post("/api/auth/register")
      .send({ name: "Test User", email: "test@example.com", password: "Test1234!" });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Email already registered");
  });

  it("returns 400 for invalid email", async () => {
    const res = await request(buildApp())
      .post("/api/auth/register")
      .send({ name: "Test User", email: "not-an-email", password: "Test1234!" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 for weak password", async () => {
    const res = await request(buildApp())
      .post("/api/auth/register")
      .send({ name: "Test User", email: "test@example.com", password: "weak" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 when name is too short", async () => {
    const res = await request(buildApp())
      .post("/api/auth/register")
      .send({ name: "X", email: "test@example.com", password: "Test1234!" });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  it("returns 200 and sets the JWT cookie on valid credentials", async () => {
    mockPool.query.mockResolvedValueOnce(qr([{
      id: 5,
      name: "Alice",
      email: "alice@example.com",
      theme: "dark",
      lumi_visible: 1,
      daily_focus_goal_minutes: 90,
      password_hash: "$2b$12$hash",
    }]));

    const res = await request(buildApp())
      .post("/api/auth/login")
      .send({ email: "alice@example.com", password: "Correct1!" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Alice");
    expect(res.body.data.theme).toBe("dark");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("returns 401 for unknown email", async () => {
    mockPool.query.mockResolvedValueOnce(qr([]));

    const res = await request(buildApp())
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "Test1234!" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("returns 401 for wrong password", async () => {
    mockPool.query.mockResolvedValueOnce(qr([{
      id: 1,
      email: "test@example.com",
      password_hash: "$2b$12$hash",
    }]));
    // bcrypt.compare is mocked to return true by default — override for wrong password
    const bcrypt = await import("bcrypt");
    bcrypt.default.compare.mockResolvedValueOnce(false);

    const res = await request(buildApp())
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "Wrong!" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("returns 400 for missing password", async () => {
    const res = await request(buildApp())
      .post("/api/auth/login")
      .send({ email: "test@example.com" });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/logout", () => {
  it("returns 200 and clears the cookie", async () => {
    const res = await request(buildApp())
      .post("/api/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const cookieHeader = res.headers["set-cookie"]?.[0] ?? "";
    // Express's clearCookie sets Expires to epoch (the modern equivalent of Max-Age=0)
    expect(cookieHeader).toContain("studyflow-jwt=");
    expect(cookieHeader).toMatch(/Expires=Thu, 01 Jan 1970/);
  });
});

describe("POST /api/auth/forgot-password", () => {
  it("returns 200 for unknown email (no enumeration)", async () => {
    mockPool.query.mockResolvedValueOnce(qr([])); // no user found

    const res = await request(buildApp())
      .post("/api/auth/forgot-password")
      .send({ email: "ghost@example.com" });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("reset link has been sent");
    // UPDATE should NOT be called when the user doesn't exist
    expect(mockPool.query).toHaveBeenCalledTimes(1); // only the SELECT
  });

  it("generates a reset token and stores it for a known user", async () => {
    mockPool.query
      .mockResolvedValueOnce(qr([{ id: 1 }]))   // SELECT finds the user
      .mockResolvedValueOnce(qr([{ affectedRows: 1 }])); // UPDATE

    const res = await request(buildApp())
      .post("/api/auth/forgot-password")
      .send({ email: "real@example.com" });

    expect(res.status).toBe(200);
    // SELECT + UPDATE = 2 calls
    expect(mockPool.query).toHaveBeenCalledTimes(2);
  });

  it("returns 400 for invalid email", async () => {
    const res = await request(buildApp())
      .post("/api/auth/forgot-password")
      .send({ email: "not-valid" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("POST /api/auth/reset-password", () => {
  it("returns 400 for unknown token", async () => {
    mockPool.query.mockResolvedValueOnce(qr([])); // no token match

    const res = await request(buildApp())
      .post("/api/auth/reset-password")
      .send({ token: "no-such-token", newPassword: "NewPass1!" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid or expired reset token");
  });

  it("returns 200 and updates the password for a valid token", async () => {
    mockPool.query
      .mockResolvedValueOnce(qr([{ id: 7 }]))  // SELECT finds the token
      .mockResolvedValueOnce(qr([{ affectedRows: 1 }])); // UPDATE password

    const res = await request(buildApp())
      .post("/api/auth/reset-password")
      .send({ token: "valid-token-abc123", newPassword: "NewPass1!" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Password reset successful");
  });

  it("returns 400 for weak new password", async () => {
    const res = await request(buildApp())
      .post("/api/auth/reset-password")
      .send({ token: "any-token", newPassword: "weak" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("GET /api/auth/profile", () => {
  it("returns 404 when user does not exist in DB", async () => {
    mockPool.query.mockResolvedValueOnce(qr([]));

    const res = await request(buildApp())
      .get("/api/auth/profile");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("returns user profile data", async () => {
    mockPool.query.mockResolvedValueOnce(qr([{
      id: 1,
      name: "Test User",
      email: "test@example.com",
      theme: "dark",
      lumi_visible: 1,
      daily_focus_goal_minutes: 60,
    }]));

    const res = await request(buildApp()).get("/api/auth/profile");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Test User");
    expect(res.body.data.theme).toBe("dark");
    expect(res.body.data.lumi_visible).toBe(1);
  });
});

describe("PUT /api/auth/profile", () => {
  it("updates the profile and returns 200", async () => {
    mockPool.query.mockResolvedValueOnce(qr([{ affectedRows: 1 }]));

    const res = await request(buildApp())
      .put("/api/auth/profile")
      .send({ name: "New Name", theme: "dark", lumi_visible: true, daily_focus_goal_minutes: 90 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Profile updated successfully");
    expect(mockPool.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE"),
      expect.arrayContaining(["New Name", "dark", 1, 90])
    );
  });

  it("returns 400 for invalid theme", async () => {
    const res = await request(buildApp())
      .put("/api/auth/profile")
      .send({ theme: "blue" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 for focus goal below minimum", async () => {
    const res = await request(buildApp())
      .put("/api/auth/profile")
      .send({ daily_focus_goal_minutes: 5 });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 for focus goal above maximum", async () => {
    const res = await request(buildApp())
      .put("/api/auth/profile")
      .send({ daily_focus_goal_minutes: 3000 });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/migrate-guest-data", () => {
  it("returns 400 for non-object body", async () => {
    const res = await request(buildApp())
      .post("/api/auth/migrate-guest-data")
      .set("Content-Type", "application/json")
      .send(JSON.stringify("not-an-object-string"));

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid guest data payload");
  });

  it("returns 400 for null body", async () => {
    const res = await request(buildApp())
      .post("/api/auth/migrate-guest-data")
      .set("Content-Type", "application/json")
      .send("null");

    expect(res.status).toBe(400);
  });

  it("inserts subjects, tasks, and notes as the authenticated user", async () => {
    const conn = mockConnection();
    mockPool.getConnection.mockResolvedValueOnce(conn);

    const res = await request(buildApp())
      .post("/api/auth/migrate-guest-data")
      .send({
        subjects: [{ name: "Math", color: "#FF0000" }],
        tasks: [{ title: "HW1", category: "Assignment", priority: "High", status: "todo" }],
        notes: [{ title: "Lecture 1", content: "Notes here" }],
        focus_sessions: [],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.migrated.subjects).toBe(1);
    expect(res.body.data.migrated.tasks).toBe(1);
    expect(res.body.data.migrated.notes).toBe(1);
    expect(res.body.data.migrated.focus_sessions).toBe(0);

    // Transaction lifecycle
    expect(conn.beginTransaction).toHaveBeenCalled();
    expect(conn.commit).toHaveBeenCalled();
    expect(conn.release).toHaveBeenCalled();

    // Each insert passes userId = mockReqUser.userId = 1
    const insertCalls = conn.query.mock.calls;
    expect(insertCalls[0][1][0]).toBe(1); // subjects user_id
    expect(insertCalls[1][1][0]).toBe(1); // tasks user_id
    expect(insertCalls[2][1][0]).toBe(1); // notes user_id
  });

  it("skips empty tables without inserting", async () => {
    const conn = mockConnection();
    mockPool.getConnection.mockResolvedValueOnce(conn);

    const res = await request(buildApp())
      .post("/api/auth/migrate-guest-data")
      .send({
        subjects: [{ name: "Physics", color: "#0000FF" }],
      });

    expect(res.status).toBe(200);
    expect(conn.query).toHaveBeenCalledTimes(1); // only subjects insert
  });

  it("rolls back and releases connection on database error", async () => {
    const conn = mockConnection();
    mockPool.getConnection.mockResolvedValueOnce(conn);
    conn.query.mockRejectedValueOnce(new Error("DB error"));

    const res = await request(buildApp())
      .post("/api/auth/migrate-guest-data")
      .send({ subjects: [{ name: "Math", color: "#FFF" }] });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Failed to migrate guest data");
    expect(conn.rollback).toHaveBeenCalled();
    expect(conn.release).toHaveBeenCalled();
  });
});
