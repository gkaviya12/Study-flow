/**
 * StudyFlow V2 — Authentication Middleware
 * Reads the httpOnly JWT cookie set by the server, verifies it, and attaches
 * the decoded payload to `req.user` as { userId, email }.
 *
 * The JWT itself is never exposed to React — this middleware is the only
 * place it is read server-side (TRD §7).
 */

import jwt from "jsonwebtoken";

const COOKIE_NAME = process.env.COOKIE_NAME || "studyflow-jwt";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

export default (req, res, next) => {
  const token = req.signedCookies ? req.signedCookies[COOKIE_NAME] : req.cookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

// Named alias for use in route files
export const authenticate = (req, res, next) => {
  const token = req.signedCookies ? req.signedCookies[COOKIE_NAME] : req.cookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

// Legacy alias — prefer `authenticate`
export const authMiddleware = authenticate;