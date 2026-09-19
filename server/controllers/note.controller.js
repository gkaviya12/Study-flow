/**
 * StudyFlow V2 — Note Controller
 * TRD §9: GET /notes | POST | PUT /notes/:id | DELETE /notes/:id
 * Supports `?subjectId=`, `?page=`, `?limit=` query params.
 *
 * Notes (user answer #8): content as Markdown/HTML, JSON tags column,
 * is_checklist boolean flag. No separate note_tags table until V2.1.
 */

import { body, query, validationResult } from "express-validator";
import db from "../models/index.js";

const validateNotePayload = [
  body("title").isString().isLength({ min: 1, max: 255 }).withMessage("Title required (1-255 chars)"),
  body("content").isString().withMessage("Content required"),
  body("subject_id").optional({ values: "falsy" }).isInt(),
  body("tags").optional(),
  body("is_checklist").optional().isBoolean(),
];

const validateNoteQuery = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("subjectId").optional().isInt(),
];

export const listNotes = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const userId = req.user.userId;
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const offset = (page - 1) * limit;

  const where = ["user_id = ?"];
  const params = [userId];

  if (req.query.subjectId) {
    where.push("subject_id = ?");
    params.push(req.query.subjectId);
  }

  const [rows] = await db.query(
    `SELECT id, user_id, subject_id, title, content, tags, is_checklist, updated_at FROM notes WHERE ${where.join(" AND ")} ORDER BY updated_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM notes WHERE ${where.join(" AND ")}`,
    params
  );

  res.json({
    success: true,
    data: {
      notes: rows,
      pagination: {
        page,
        limit,
        total: countRows[0].total,
        pages: Math.ceil(countRows[0].total / limit),
      },
    },
  });
};

export const createNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const userId = req.user.userId;
  const { title, content, subject_id, tags, is_checklist } = req.body;
  const tagsJson = tags ? JSON.stringify(tags) : null;

  const [result] = await db.query(
    "INSERT INTO notes (user_id, subject_id, title, content, tags, is_checklist) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, subject_id || null, title, content, tagsJson, is_checklist || false]
  );

  res.status(201).json({ success: true, data: { id: result.insertId } });
};

export const updateNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const userId = req.user.userId;
  const noteId = Number(req.params.id);
  const { title, content, subject_id, tags, is_checklist } = req.body;

  const updateFields = [];
  const updateParams = [];

  if (title !== undefined) { updateFields.push("title = ?"); updateParams.push(title); }
  if (content !== undefined) { updateFields.push("content = ?"); updateParams.push(content); }
  if (subject_id !== undefined) { updateFields.push("subject_id = ?"); updateParams.push(subject_id); }
  if (tags !== undefined) { updateFields.push("tags = ?"); updateParams.push(JSON.stringify(tags)); }
  if (is_checklist !== undefined) { updateFields.push("is_checklist = ?"); updateParams.push(is_checklist); }

  if (updateFields.length === 0) {
    return res.status(400).json({ success: false, message: "No fields to update" });
  }

  updateParams.push(noteId, userId);
  const [result] = await db.query(
    `UPDATE notes SET ${updateFields.join(", ")} WHERE id = ? AND user_id = ?`,
    updateParams
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: "Note not found" });
  }

  res.json({ success: true, message: "Note updated" });
};

export const deleteNote = async (req, res) => {
  const userId = req.user.userId;
  const noteId = Number(req.params.id);

  const [result] = await db.query(
    "DELETE FROM notes WHERE id = ? AND user_id = ?",
    [noteId, userId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: "Note not found" });
  }

  res.json({ success: true, message: "Note deleted" });
};

export { validateNotePayload, validateNoteQuery };