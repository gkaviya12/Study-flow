// StudyFlow V2 — Node/Express Backend Bootstrap
// Sets up: helmet, cors (credentials:true, explicit origin), cookie-parser, body parser, rate-limit, error envelope, /health
// Follows: JWT via httpOnly Secure SameSite=Lax cookie (never in React state)
// Reads .env: PORT, NODE_ENV, DB_HOST/USER/PASSWORD/NAME, JWT_SECRET, COOKIE_NAME, CLIENT_URL, SMTP vars, RESET_TOKEN_EXPIRY_MINUTES
// Usage: npm run dev (also works as production with .env NODE_ENV=production)

import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import subjectRoutes from "./routes/subject.routes.js";
import noteRoutes from "./routes/note.routes.js";
import focusRoutes from "./routes/focus.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import authenticateMiddleware from "./middleware/auth.middleware.js";

const app = express();

// --- Middleware ---

// Trust first proxy if behind a reverse proxy ( Render / Railway set REMOTE_ADDR )
app.enable("trust proxy");

// Security headers
app.use(helmet());

// CORS: must allow credentials + non-wildcard origin — wildcard * silently breaks httpOnly cookies
app.use(
  cors({
    origin: process.env.CLIENT_URL, // e.g. http://localhost:5173 or https://your-app.vercel.app
    credentials: true,
  })
);

// Rate limiting on auth routes only
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // limit each IP to 100 requests per window
  message: { success: false, message: "Too many requests from this IP, please try again later." },
});
app.use("/api/auth", authLimiter);

// Body parsing (urlencoded + json)
app.use(express.json({ limit: "10kb", strict: false }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Cookie parser (reads the JWT from incoming requests)
app.use(cookieParser());

// --- Health / root ---

app.get("/health", (req, res) => {
  res.json({ success: true, message: "API healthy" });
});

// --- API routes ---

// Public auth routes
app.use("/api/auth", authRoutes);

// Protected routes — require JWT cookie authentication
app.use("/api/tasks", authenticateMiddleware, taskRoutes);
app.use("/api/subjects", authenticateMiddleware, subjectRoutes);
app.use("/api/notes", authenticateMiddleware, noteRoutes);
app.use("/api/focus", authenticateMiddleware, focusRoutes);
app.use("/api/profile", authenticateMiddleware, profileRoutes);
app.use("/api/analytics", authenticateMiddleware, analyticsRoutes);

// --- Unknown route ---

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

// --- Global error handler ---

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🛰  StudyFlow server listening on http://localhost:${PORT}`);
});