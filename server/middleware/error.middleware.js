/**
 * StudyFlow V2 — Global Error Handler Middleware
 * Returns the standardized error envelope:
 *   { success: false, message: "<string>" }
 *
 * Logs errors in development; hides details in production.
 */

const errorMiddleware = (err, req, res, next) => {
  console.error("[StudyFlow] Error caught in middleware:", err);

  // If we already responded (e.g., duplicate call), let it be
  if (res.headersSent) {
    return next(err);
  }

  // For known validation or bad-request issues, use status 400
  // For unauthorized/unauthenticated, 401
  // For forbidden, 403
  // For not found, 404
  // For other server errors, 500

  const status = err.status || 500;
  const message = status < 500 && err.message ? err.message : "Internal server error";

  // Never expose stack traces in production
  const errorDetails = process.env.NODE_ENV === "production" ? undefined : { stack: err.stack, ...err };

  res.status(status).json({
    success: false,
    message,
    ...(errorDetails && { _debug: errorDetails }),
  });
};

export default errorMiddleware;
