import { Router } from "express";
import { listTasks, createTask, updateTask, deleteTask, validateTaskPayload, validateQuery } from "../controllers/task.controller.js";

const router = Router();

/**
 * GET /api/tasks
 * Query: ?status=, ?subjectId=, ?page=, ?limit=
 * Returns paginated list + count
 */
router.get("/", validateQuery, listTasks);

/**
 * POST /api/tasks
 * Body: { title, category, priority, status?, due_date?, estimated_minutes?, recurrence?, subject_id? }
 * Optional recurrence: none | daily | weekly | weekdays
 */
router.post("/", validateTaskPayload, createTask);

/**
 * PUT /api/tasks/:id
 * Body: { title?, category?, priority?, status?, due_date?, estimated_minutes?, recurrence?, subject_id? }
 * If task is a recurrence parent, updates un-completed future occurrences only.
 */
router.put("/:id", validateTaskPayload, updateTask);

/**
 * DELETE /api/tasks/:id
 */
router.delete("/:id", deleteTask);

export default router;