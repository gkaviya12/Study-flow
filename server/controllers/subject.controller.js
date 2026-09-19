/**
 * StudyFlow V2 — Subject Controller
 * TRD §9: GET /subjects | POST | PUT /subjects/:id | DELETE /subjects/:id
 *
 * Subjects are user-managed and shared across Planner, Notes, and Analytics.
 * Each subject can carry a `color` used consistently across Kanban, Calendar,
 * and charts (V1 design doc §3).
 */

import { body, query, param, validationResult } from "express-validator";
import db from "../models/index.js";

const validateSubjectPayload = [
  body("name").isString().isLength({ min: 1, max: 120 }).withMessage("Name required (1-120 chars)"),
  body("color").optional().isString().isLength({ max: 20 }),
];

export const listSubjects = async (req, res) => {
  const userId = req.user.userId;
  const [rows] = await db.query("SELECT id, name, color FROM subjects WHERE user_id = ? ORDER BY name ASC", [userId]);
  res.json({ success: true, data: { subjects: rows } });
};

export const createSubject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const userId = req.user.userId;
  const { name, color } = req.body;

  const [result] = await db.query(
    "INSERT INTO subjects (user_id, name, color) VALUES (?, ?, ?)",
    [userId, name, color || "#6FAF8F"]
  );

  res.status(201).json({ success: true, data: { id: result.insertId } });
};

export const updateSubject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const userId = req.user.userId;
  const subjectId = Number(req.params.id);
  const { name, color } = req.body;

  const [result] = await db.query(
    "UPDATE subjects SET name = COALESCE(?, name), color = COALESCE(?, color) WHERE id = ? AND user_id = ?",
    [name, color, subjectId, userId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: "Subject not found" });
  }

  res.json({ success: true, message: "Subject updated" });
};

export const deleteSubject = async (req, res) => {
  const userId = req.user.userId;
  const subjectId = Number(req.params.id);

  const [result] = await db.query(
    "DELETE FROM subjects WHERE id = ? AND user_id = ?",
    [subjectId, userId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: "Subject not found" });
  }

  res.json({ success: true, message: "Subject deleted" });
};

export { validateSubjectPayload };