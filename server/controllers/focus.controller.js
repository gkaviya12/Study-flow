/**
 * StudyFlow V2 — Focus Session Controller
 * TRD §9: POST /focus/start | /focus/complete | /focus/abandon | GET /focus/history
 * Sessions in 'abandoned' state are NOT counted in streak or focus-minute analytics
 * (TRD §5: "Abandoned sessions are saved but excluded from streaks/analytics").
 */

import { body, query, validationResult } from "express-validator";
import db from "../models/index.js";

const validateStartSession = [
  body("task_id").optional({ values: "falsy" }).isInt(),
  body("planned_minutes").isInt({ min: 1, max: 360 }).withMessage("planned_minutes must be 1-360"),
];

const validateCompleteOrAbandon = [
  body("session_id").isInt().withMessage("session_id required"),
  body("elapsed_minutes").isInt({ min: 0, max: 360 }).withMessage("elapsed_minutes 0-360"),
];

export const startSession = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const userId = req.user.userId;
  const { task_id, planned_minutes } = req.body;

  const [result] = await db.query(
    "INSERT INTO focus_sessions (user_id, task_id, status, planned_minutes, elapsed_minutes) VALUES (?, ?, 'in_progress', ?, 0)",
    [userId, task_id || null, planned_minutes]
  );

  res.status(201).json({ success: true, data: { sessionId: result.insertId } });
};

export const completeSession = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const userId = req.user.userId;
  const { session_id, elapsed_minutes } = req.body;

  const [result] = await db.query(
    "UPDATE focus_sessions SET status = 'completed', elapsed_minutes = ?, ended_at = NOW() WHERE id = ? AND user_id = ?",
    [elapsed_minutes, session_id, userId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  res.json({ success: true, message: "Focus session completed" });
};

export const abandonSession = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const userId = req.user.userId;
  const { session_id, elapsed_minutes } = req.body;

  // Save elapsed minutes but mark abandoned; do NOT contribute to streak or focus analytics.
  const [result] = await db.query(
    "UPDATE focus_sessions SET status = 'abandoned', elapsed_minutes = ?, ended_at = NOW() WHERE id = ? AND user_id = ?",
    [elapsed_minutes, session_id, userId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: "Session not found" });
  }

  res.json({ success: true, message: "Focus session abandoned" });
};

export const getHistory = async (req, res) => {
  const userId = req.user.userId;
  const limit = Math.min(Number(req.query.limit) || 50, 100);

  const [rows] = await db.query(
    `SELECT * FROM focus_sessions WHERE user_id = ? ORDER BY started_at DESC LIMIT ?`,
    [userId, limit]
  );

  res.json({ success: true, data: { sessions: rows } });
};

export { validateStartSession, validateCompleteOrAbandon };