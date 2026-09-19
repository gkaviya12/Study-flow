/**
 * StudyFlow V2 — Axios API Client
 *
 * Single configured instance. All requests go through /api/* which is proxied
 * to the Express backend in dev (see vite.config.js) and to the live API
 * origin in production.
 *
 * withCredentials=true is REQUIRED — the JWT is an httpOnly cookie and will
 * be silently dropped without it.
 */

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // CRITICAL: sends the httpOnly JWT cookie
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Response interceptor: normalize the standard error envelope
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default api;

// ── Typed endpoint helpers (will be used by service modules in later phases) ──

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  migrateGuestData: (guestData) => api.post("/auth/migrate-guest-data", guestData),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    api.post("/auth/reset-password", { token, newPassword }),
};

export const tasksAPI = {
  list: (params) => api.get("/tasks", { params }),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  remove: (id) => api.delete(`/tasks/${id}`),
};

export const subjectsAPI = {
  list: () => api.get("/subjects"),
  create: (data) => api.post("/subjects", data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  remove: (id) => api.delete(`/subjects/${id}`),
};

export const notesAPI = {
  list: (params) => api.get("/notes", { params }),
  create: (data) => api.post("/notes", data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  remove: (id) => api.delete(`/notes/${id}`),
};

export const focusAPI = {
  start: (data) => api.post("/focus/start", data),
  complete: (data) => api.post("/focus/complete", data),
  abandon: (data) => api.post("/focus/abandon", data),
  history: () => api.get("/focus/history"),
};

export const profileAPI = {
  get: () => api.get("/profile"),
  update: (data) => api.put("/profile", data),
};

export const analyticsAPI = {
  get: () => api.get("/analytics"),
};