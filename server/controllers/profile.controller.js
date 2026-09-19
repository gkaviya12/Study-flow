/**
 * StudyFlow V2 — Profile Controller
 * GET/PUT /api/profile
 */

import { body, validationResult } from "express-validator";
import db from "../models/index.js";

const validateProfileUpdate = [
  body("name").optional().isString().isLength({ min: 2, max: 120 }),
  body("college").optional().isString().isLength({ max: 180 }),
  body("semester").optional().isString().isLength({ max: 40 }),
  body("study_goal").optional().isString().isLength({ max: 255 }),
  body("theme").optional().isIn(["light", "dark"]),
  body("lumi_visible").optional().isBoolean(),
  body("daily_focus_goal_minutes").optional().isInt({ min: 10, max: 1440 }).withMessage("Daily focus goal must be 10-1440 minutes"),
];

export const getProfile = async (req, res) => {
  const userId = req.user.userId;
  const [rows] = await db.query(
    "SELECT id, name, email, college, semester, study_goal, theme, lumi_visible, daily_focus_goal_minutes, created_at FROM users WHERE id = ?",
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
  const { name, college, semester, study_goal, theme, lumi_visible, daily_focus_goal_minutes } = req.body;

  const updateFields = [];
  const updateParams = [];
  if (name !== undefined) { updateFields.push("name = ?"); updateParams.push(name); }
  if (college !== undefined) { updateFields.push("college = ?"); updateParams.push(college); }
  if (semester !== undefined) { updateFields.push("semester = ?"); updateParams.push(semester); }
  if (study_goal !== undefined) { updateFields.push("study_goal = ?"); updateParams.push(study_goal); }
  if (theme !== undefined) { updateFields.push("theme = ?"); updateParams.push(theme); }
  if (lumi_visible !== undefined) { updateFields.push("lumi_visible = ?"); updateParams.push(lumi_visible); }
  if (daily_focus_goal_minutes !== undefined) { updateFields.push("daily_focus_goal_minutes = ?"); updateParams.push(daily_focus_goal_minutes); }

  if (updateFields.length === 0) {
    return res.status(400).json({ success: false, message: "No fields to update" });
  }

  updateParams.push(userId);
  await db.query(`UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`, updateParams);

  res.json({ success: true, message: "Profile updated" });
};

export { validateProfileUpdate };