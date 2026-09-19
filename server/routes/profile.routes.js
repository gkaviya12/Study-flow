import { Router } from "express";
import * as profileController from "../controllers/profile.controller.js";
import { body } from "express-validator";

const router = Router();

/**
 * GET /api/profile
 */
router.get("/", profileController.getProfile);

/**
 * PUT /api/profile
 * Body: { name?, college?, semester?, study_goal?, theme?, lumi_visible?, daily_focus_goal_minutes? }
 */
router.put(
  "/",
  [
    body("name").optional().isString().isLength({ min: 2, max: 120 }),
    body("college").optional().isString().isLength({ max: 180 }),
    body("semester").optional().isString().isLength({ max: 40 }),
    body("study_goal").optional().isString().isLength({ max: 255 }),
    body("theme").optional().isIn(["light", "dark"]),
    body("lumi_visible").optional().isBoolean(),
    body("daily_focus_goal_minutes").optional().isInt({ min: 10, max: 1440 }).withMessage("Daily focus goal must be 10-1440 minutes"),
  ],
  profileController.updateProfile
);

export default router;