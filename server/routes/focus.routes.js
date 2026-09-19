import { Router } from "express";
import { startSession, completeSession, abandonSession, getHistory, validateStartSession, validateCompleteOrAbandon } from "../controllers/focus.controller.js";

const router = Router();

/**
 * POST /api/focus/start
 * Body: { task_id?, planned_minutes }
 */
router.post("/start", validateStartSession, startSession);

/**
 * POST /api/focus/complete
 * Body: { session_id, elapsed_minutes }
 * Marks session completed; contributes to streak and focus analytics.
 */
router.post("/complete", validateCompleteOrAbandon, completeSession);

/**
 * POST /api/focus/abandon
 * Body: { session_id, elapsed_minutes }
 * Marks session abandoned; elapsed saved but excluded from streaks/analytics.
 */
router.post("/abandon", validateCompleteOrAbandon, abandonSession);

/**
 * GET /api/focus/history
 * Query: ?limit= (default 50, max 100)
 */
router.get("/history", getHistory);

export default router;