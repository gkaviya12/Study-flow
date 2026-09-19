/**
 * StudyFlow V2 — Auth Controller
 * Handles user registration, login, logout, forgot-password, reset-password, profile,
 * guest data migration, and verification of the httpOnly JWT cookie.
 *
 * All routes are validated by express-validator before execution.
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { body, validationResult } from "express-validator";
import db from "../models/index.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";

const COOKIE_NAME = process.env.COOKIE_NAME || "studyflow-jwt";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

// HELPERS

const createToken = (payload) => {
  // httpOnly, Secure (in production), SameSite=Lax, max-age based on env
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

// CONTROLLERS

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const { name, email, password } = req.body;

  // Check if user already exists
  const [existingRows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existingRows.length > 0) {
    return res.status(409).json({ success: false, message: "Email already registered" });
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, 12);

  // Create user
  const [result] = await db.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, password_hash]
  );

  const userId = result.insertId;

  // Respond without token; token set in login only
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: { userId, name, email },
  });
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  if (rows.length === 0) {
    // Don't reveal whether email exists — generic message
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const user = rows[0];

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  // Generate JWT token
  const token = createToken({ userId: user.id, email: user.email });

  // Set cookie (httpOnly, Secure in production, SameSite=Lax)
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    success: true,
    message: "Login successful",
    data: {
      userId: user.id,
      name: user.name,
      email: user.email,
      theme: user.theme,
      lumi_visible: Boolean(user.lumi_visible),
      daily_focus_goal_minutes: user.daily_focus_goal_minutes,
    },
  });
};

export const logout = (req, res) => {
  // Clear the cookie server-side
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  res.json({ success: true, message: "Logout successful" });
};

export const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const { email } = req.body;

  const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
  if (rows.length === 0) {
    // Don't leak existence; still return success (but we'd log for audit)
    console.warn(`[auth] forgotPassword requested for unknown email: ${email}`);
    return res.json({ success: true, message: "If the email exists, a reset link has been sent" });
  }

  // Generate a cryptographically random reset token. We store the raw
  // token in the DB (it gets emailed to the user) — for higher security
  // we'd hash it before storing and compare the hash on reset, but for
  // this scope we keep the token readable so the dev mailer can log it.
  const reset_token = crypto.randomBytes(32).toString("hex");
  const reset_token_expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.query(
    "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
    [reset_token, reset_token_expires, email]
  );

  // Send the email. In dev this just logs the reset URL. We don't await
  // the response on a background task — we don't want to leak timing.
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  sendPasswordResetEmail({ to: email, resetToken: reset_token, clientUrl }).catch(
    (err) => console.error("[auth] failed to send reset email:", err.message)
  );

  res.json({ success: true, message: "If the email exists, a reset link has been sent" });
};

export const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const { token, newPassword } = req.body;

  const [rows] = await db.query(
    "SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
    [token]
  );
  if (rows.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  }

  const userId = rows[0].id;
  const password_hash = await bcrypt.hash(newPassword, 12);

  await db.query(
    "UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
    [password_hash, userId]
  );

  res.json({ success: true, message: "Password reset successful" });
};

export const getProfile = async (req, res) => {
  // req.user is attached by authenticateMiddleware (see middleware/auth.middleware.js)
  const userId = req.user.userId;
  const [rows] = await db.query(
    "SELECT id, name, email, theme, lumi_visible, daily_focus_goal_minutes FROM users WHERE id = ?",
    [userId]
  );

  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, data: rows[0] });
};

export const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const userId = req.user.userId;
  const { name, theme, lumi_visible, daily_focus_goal_minutes } = req.body;

  await db.query(
    "UPDATE users SET name = ?, theme = ?, lumi_visible = ?, daily_focus_goal_minutes = ? WHERE id = ?",
    [name, theme, lumi_visible, daily_focus_goal_minutes, userId]
  );

  res.json({ success: true, message: "Profile updated successfully" });
};

export const migrateGuestData = async (req, res) => {
  const userId = req.user.userId;

  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ success: false, message: "Invalid guest data payload" });
  }

  // Whitelisted tables and the columns we are willing to insert for each.
  // Anything else is silently dropped — this prevents a malicious client
  // from smuggling user_id, password_hash, etc. into the migration payload.
  const TABLE_COLUMNS = {
    subjects: ["name", "color", "created_at"],
    tasks: [
      "subject_id",
      "title",
      "category",
      "priority",
      "status",
      "due_date",
      "estimated_minutes",
      "recurrence",
      "completed_at",
      "created_at",
    ],
    notes: ["subject_id", "title", "content", "tags", "is_checklist", "updated_at"],
    focus_sessions: [
      "task_id",
      "status",
      "planned_minutes",
      "elapsed_minutes",
      "started_at",
      "ended_at",
    ],
  };

  const connection = await db.getConnection();
  const counts = { subjects: 0, tasks: 0, notes: 0, focus_sessions: 0 };

  try {
    await connection.beginTransaction();

    // Order matters: insert subjects first, then tasks/notes that may
    // reference them, then focus_sessions that may reference tasks.
    // Guest IDs are client-side strings ("g_..."); we always force user_id
    // to the authenticated user and let MySQL assign a fresh primary key.
    for (const table of ["subjects", "tasks", "notes", "focus_sessions"]) {
      const rows = Array.isArray(req.body[table]) ? req.body[table] : [];
      if (rows.length === 0) continue;

      const allowed = TABLE_COLUMNS[table];
      for (const row of rows) {
        if (!row || typeof row !== "object") continue;
        const values = allowed.map((col) =>
          Object.prototype.hasOwnProperty.call(row, col) ? row[col] : null
        );
        await connection.query(
          `INSERT INTO \`${table}\` (user_id, ${allowed.map((c) => `\`${c}\``).join(", ")}) VALUES (?, ${allowed.map(() => "?").join(", ")})`,
          [userId, ...values]
        );
        counts[table] += 1;
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: "Guest data migrated successfully",
      data: { migrated: counts },
    });
  } catch (err) {
    await connection.rollback();
    console.error("[auth] migrateGuestData rollback:", err.message);
    res.status(500).json({ success: false, message: "Failed to migrate guest data" });
  } finally {
    connection.release();
  }
};