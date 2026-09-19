/**
 * StudyFlow V2 — Task Controller
 * Implements TRD §9: GET (with status/subjectId/page/limit filters),
 * POST (with optional recurrence), PUT (recurring tasks affect future only),
 * DELETE.
 *
 * Recurring tasks (user answer #3): materialized 60-day rolling window.
 * When a recurring task is created, we insert 60 un-completed future occurrences
 * linked via `recurrence_parent_id`. The original row holds the recurrence config.
 */

import { body, query, param, validationResult } from "express-validator";
import db from "../models/index.js";

const RECURRENCE_WINDOW_DAYS = 60;

const expandRecurrence = (parent) => {
  const occurrences = [];
  if (!parent.recurrence || parent.recurrence === "none") return occurrences;

  const start = new Date(parent.due_date || parent.created_at);
  const stepDays = parent.recurrence === "daily"
    ? 1
    : parent.recurrence === "weekly"
    ? 7
    : 0; // weekdays handled below

  let cursor = new Date(start);
  cursor.setDate(cursor.getDate() + 1); // start one day after parent
  const end = new Date();
  end.setDate(end.getDate() + RECURRENCE_WINDOW_DAYS);

  while (cursor <= end) {
    const weekday = cursor.getDay(); // 0 = Sun, 6 = Sat
    const isWeekday = weekday !== 0 && weekday !== 6;
    if (parent.recurrence === "weekdays") {
      if (isWeekday) {
        occurrences.push(formatOccurrence(parent, cursor));
      }
    } else if (parent.recurrence === "daily") {
      occurrences.push(formatOccurrence(parent, cursor));
    } else if (parent.recurrence === "weekly") {
      occurrences.push(formatOccurrence(parent, cursor));
    }
    cursor.setDate(cursor.getDate() + stepDays);
  }
  return occurrences;
};

const formatOccurrence = (parent, dueDate) => {
  return [
    parent.user_id,
    parent.subject_id,
    parent.title,
    parent.category,
    parent.priority,
    "todo", // generated occurrences always start as todo
    dueDate.toISOString().slice(0, 10), // YYYY-MM-DD
    parent.estimated_minutes,
    "none", // occurrences are not themselves recurring
    parent.id, // recurrence_parent_id
  ];
};

const validateTaskPayload = [
  body("title").isString().isLength({ min: 1, max: 255 }).withMessage("Title is required (1-255 chars)"),
  body("category").isIn(["Assignment", "Exam", "Placement", "Personal", "Project"]).withMessage("Invalid category"),
  body("priority").isIn(["Low", "Medium", "High"]).withMessage("Invalid priority"),
  body("status").optional().isIn(["todo", "in_progress", "completed"]).withMessage("Invalid status"),
  body("due_date").optional({ values: "falsy" }).isISO8601().withMessage("Invalid due_date"),
  body("estimated_minutes").optional({ values: "falsy" }).isInt({ min: 1, max: 1440 }).withMessage("Invalid estimated_minutes"),
  body("recurrence").optional().isIn(["none", "daily", "weekly", "weekdays"]).withMessage("Invalid recurrence"),
  body("subject_id").optional({ values: "falsy" }).isInt().withMessage("Invalid subject_id"),
];

const validateQuery = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("status").optional().isIn(["todo", "in_progress", "completed"]),
  query("subjectId").optional().isInt(),
];

export const listTasks = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const userId = req.user.userId;
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const offset = (page - 1) * limit;

  // Build WHERE clause
  const where = ["user_id = ?"];
  const params = [userId];

  if (req.query.status) {
    where.push("status = ?");
    params.push(req.query.status);
  }
  if (req.query.subjectId) {
    where.push("subject_id = ?");
    params.push(req.query.subjectId);
  }

  const [rows] = await db.query(
    `SELECT * FROM tasks WHERE ${where.join(" AND ")} ORDER BY due_date ASC, created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [countRows] = await db.query(
    `SELECT COUNT(*) AS total FROM tasks WHERE ${where.join(" AND ")}`,
    params
  );

  res.json({
    success: true,
    data: {
      tasks: rows,
      pagination: {
        page,
        limit,
        total: countRows[0].total,
        pages: Math.ceil(countRows[0].total / limit),
      },
    },
  });
};

export const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const userId = req.user.userId;
  const { title, category, priority, status, due_date, estimated_minutes, recurrence, subject_id } = req.body;

  const recurrenceValue = recurrence || "none";
  const taskStatus = status || "todo";

  // Insert parent task
  const [result] = await db.query(
    "INSERT INTO tasks (user_id, subject_id, title, category, priority, status, due_date, estimated_minutes, recurrence) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [userId, subject_id || null, title, category, priority, taskStatus, due_date || null, estimated_minutes || null, recurrenceValue]
  );

  const parentId = result.insertId;

  // If recurring, materialize future occurrences
  if (recurrenceValue !== "none" && due_date) {
    const [parentRows] = await db.query("SELECT * FROM tasks WHERE id = ?", [parentId]);
    const parent = parentRows[0];
    const occurrences = expandRecurrence(parent);

    if (occurrences.length > 0) {
      const placeholders = occurrences.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(",");
      const flatParams = occurrences.flat();
      await db.query(
        `INSERT INTO tasks (user_id, subject_id, title, category, priority, status, due_date, estimated_minutes, recurrence, recurrence_parent_id) VALUES ${placeholders}`,
        flatParams
      );
    }
  }

  res.status(201).json({ success: true, message: "Task created successfully", data: { id: parentId } });
};

export const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  const userId = req.user.userId;
  const taskId = Number(req.params.id);

  // Ensure task belongs to user
  const [taskRows] = await db.query(
    "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
    [taskId, userId]
  );
  if (taskRows.length === 0) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  const task = taskRows[0];
  const isOccurrence = task.recurrence_parent_id !== null;
  const isParent = task.recurrence !== "none" && task.recurrence_parent_id === null;

  const { title, category, priority, status, due_date, estimated_minutes, recurrence, subject_id } = req.body;

  // Per TRD: editing a recurring task only affects future occurrences
  if (isParent) {
    // Update parent + all un-completed future occurrences
    const updateFields = [];
    const updateParams = [];

    if (title !== undefined) { updateFields.push("title = ?"); updateParams.push(title); }
    if (category !== undefined) { updateFields.push("category = ?"); updateParams.push(category); }
    if (priority !== undefined) { updateFields.push("priority = ?"); updateParams.push(priority); }
    if (status !== undefined) { updateFields.push("status = ?"); updateParams.push(status); }
    if (due_date !== undefined) { updateFields.push("due_date = ?"); updateParams.push(due_date); }
    if (estimated_minutes !== undefined) { updateFields.push("estimated_minutes = ?"); updateParams.push(estimated_minutes); }
    if (recurrence !== undefined) { updateFields.push("recurrence = ?"); updateParams.push(recurrence); }
    if (subject_id !== undefined) { updateFields.push("subject_id = ?"); updateParams.push(subject_id); }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    // Update parent
    updateParams.push(taskId);
    await db.query(`UPDATE tasks SET ${updateFields.join(", ")} WHERE id = ?`, updateParams);

    // Update un-completed future occurrences
    const occUpdateFields = [...updateFields];
    const occUpdateParams = [...updateParams];
    await db.query(
      `UPDATE tasks SET ${occUpdateFields.join(", ")} WHERE recurrence_parent_id = ? AND status != 'completed'`,
      occUpdateParams.slice(0, -1) // remove the trailing id param
    );
  } else {
    // Regular task or single occurrence — update the row directly
    const updateFields = [];
    const updateParams = [];

    if (title !== undefined) { updateFields.push("title = ?"); updateParams.push(title); }
    if (category !== undefined) { updateFields.push("category = ?"); updateParams.push(category); }
    if (priority !== undefined) { updateFields.push("priority = ?"); updateParams.push(priority); }
    if (status !== undefined) {
      updateFields.push("status = ?");
      updateParams.push(status);
      if (status === "completed") {
        updateFields.push("completed_at = NOW()");
      } else {
        updateFields.push("completed_at = NULL");
      }
    }
    if (due_date !== undefined) { updateFields.push("due_date = ?"); updateParams.push(due_date); }
    if (estimated_minutes !== undefined) { updateFields.push("estimated_minutes = ?"); updateParams.push(estimated_minutes); }
    if (subject_id !== undefined) { updateFields.push("subject_id = ?"); updateParams.push(subject_id); }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    updateParams.push(taskId);
    await db.query(`UPDATE tasks SET ${updateFields.join(", ")} WHERE id = ?`, updateParams);
  }

  res.json({ success: true, message: "Task updated successfully" });
};

export const deleteTask = async (req, res) => {
  const userId = req.user.userId;
  const taskId = Number(req.params.id);

  const [result] = await db.query(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [taskId, userId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  res.json({ success: true, message: "Task deleted successfully" });
};

export { validateTaskPayload, validateQuery };