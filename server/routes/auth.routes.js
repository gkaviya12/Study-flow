import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { body } from "express-validator";

const router = Router();

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 */
router.post(
  "/register",
  [
    body("name").isString().isLength({ min: 2, max: 120 }).withMessage("Name must be 2-120 chars"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
      .withMessage("Password must be at least 8 chars with upper, lower, number, symbol"),
  ],
  authController.register
);

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").isString().notEmpty().withMessage("Password required"),
  ],
  authController.login
);

/**
 * POST /api/auth/logout
 */
router.post("/logout", authController.logout);

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 */
router.post(
  "/forgot-password",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  ],
  authController.forgotPassword
);

/**
 * POST /api/auth/reset-password
 * Body: { token, newPassword }
 */
router.post(
  "/reset-password",
  [
    body("token").isString().notEmpty().withMessage("Reset token required"),
    body("newPassword").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
      .withMessage("Password must be at least 8 chars with upper, lower, number, symbol"),
  ],
  authController.resetPassword
);

/**
 * GET /api/auth/profile
 * Requires authentication.
 */
router.get("/profile", authenticate, authController.getProfile);

/**
 * PUT /api/auth/profile
 * Body: { name?, theme?, lumi_visible?, daily_focus_goal_minutes? }
 * Requires authentication.
 */
router.put(
  "/profile",
  authenticate,
  [
    body("name").optional().isString().isLength({ min: 2, max: 120 }),
    body("theme").optional().isIn(["light", "dark"]),
    body("lumi_visible").optional().isBoolean(),
    body("daily_focus_goal_minutes").optional().isInt({ min: 10, max: 1440 }).withMessage("Daily focus goal must be 10-1440 minutes"),
  ],
  authController.updateProfile
);

/**
 * POST /api/auth/migrate-guest-data
 * Body: { tasks?: [], notes?: [], subjects?: [], focus_sessions?: [] }
 * Each array value should be an object. The controller sanitises and
 * whitelist-filters the fields — unknown fields are dropped.
 *
 * Requires authentication — must be called immediately after a successful
 * register/login so the server can attribute the rows to the new user.
 */
router.post("/migrate-guest-data", authenticate, authController.migrateGuestData);

export default router;