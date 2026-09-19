import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";

const router = Router();

/**
 * GET /api/analytics
 * Returns calculated productivity metrics:
 *   tasks (completion rate, counts), focus (today, last 7 days, streak), subjects
 */
router.get("/", getAnalytics);

export default router;
