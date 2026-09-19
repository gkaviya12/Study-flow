/**
 * StudyFlow V2 — Authentication Context
 *
 * Owns user identity for the React app. The JWT itself is NEVER stored in
 * React state — it lives in an httpOnly cookie set by the server, so
 * JavaScript can't read or exfiltrate it. This context only stores the
 * server-returned user profile (id, name, email, theme, etc.).
 *
 * State machine:
 *   - "loading": initial bootstrap (calling /auth/profile to see if the
 *                cookie session is still valid)
 *   - "authenticated": user is signed in, `user` is populated
 *   - "guest": no server session, but the user picked "Continue as Guest"
 *   - "anonymous": no session, no guest flag (rare — only the very first
 *                  page load before the user has done anything)
 *
 * Methods:
 *   - login(email, password): POST /auth/login, on success store user
 *   - register(name, email, password): POST /auth/register, then auto-login
 *   - logout(): POST /auth/logout, clear user + isGuest
 *   - continueAsGuest(): set isGuest + write a marker to localStorage
 *   - migrateGuestData(): POST /auth/migrate-guest-data with the local
 *     guest data, then clear the localStorage copy
 *   - updateProfile(patch): PUT /auth/profile, refresh `user` from the
 *     response
 *   - checkAuth(): re-validate the cookie session (called on mount)
 */

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authAPI } from "../services/api.js";
import {
  getGuestData,
  clearGuestData,
  hasGuestData,
} from "../services/guestStorage.js";

const AuthContext = createContext(undefined);

const GUEST_FLAG_KEY = "sf-is-guest";

const readGuestFlag = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GUEST_FLAG_KEY) === "1";
};

const writeGuestFlag = (value) => {
  if (typeof window === "undefined") return;
  if (value) localStorage.setItem(GUEST_FLAG_KEY, "1");
  else localStorage.removeItem(GUEST_FLAG_KEY);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(readGuestFlag);
  // status: "loading" | "authenticated" | "guest" | "anonymous"
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  // Re-validate the httpOnly cookie session on mount.
  // If it succeeds, we know who the user is. If it 401s, fall back to guest
  // status based on the localStorage flag.
  const checkAuth = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await authAPI.getProfile();
      setUser(res.data.data);
      setIsGuest(false);
      writeGuestFlag(false);
      setStatus("authenticated");
    } catch {
      // No valid cookie. Either we're a returning guest or genuinely anonymous.
      setUser(null);
      setIsGuest(readGuestFlag());
      setStatus(readGuestFlag() ? "guest" : "anonymous");
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const res = await authAPI.login({ email, password });
      // Server returns userId/name/email/theme/lumi_visible/daily_focus_goal_minutes
      const u = res.data.data;
      const profile = {
        id: u.userId,
        name: u.name,
        email: u.email,
        theme: u.theme,
        lumi_visible: u.lumi_visible,
        daily_focus_goal_minutes: u.daily_focus_goal_minutes,
      };
      setUser(profile);
      setIsGuest(false);
      writeGuestFlag(false);
      setStatus("authenticated");
      return profile;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const migrateGuestData = useCallback(async () => {
    if (!hasGuestData()) {
      // Nothing to migrate — still flip the guest flag off so the UI
      // reflects that the user is no longer a guest.
      writeGuestFlag(false);
      setIsGuest(false);
      return { migrated: false };
    }
    const guestData = getGuestData();
    await authAPI.migrateGuestData(guestData);
    clearGuestData();
    writeGuestFlag(false);
    setIsGuest(false);
    return { migrated: true };
  }, []);

  const register = useCallback(async (name, email, password) => {
    setError(null);
    const res = await authAPI.register({ name, email, password });
    // Server doesn't return a cookie on register — sign in immediately.
    await login(email, password);
    await migrateGuestData();
    return res.data.data;
  }, [login, migrateGuestData]);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await authAPI.logout();
    } catch (err) {
      // Even if the server call fails (e.g. expired cookie), clear local state.
      console.warn("[auth] logout request failed:", err.message);
    }
    setUser(null);
    setStatus("anonymous");
    // NOTE: do NOT clear guest data here — the user might re-register from
    // the same device and we want migration to pick it up. Guest data is
    // cleared inside migrateGuestData() or by an explicit "Forget guest
    // data" action.
  }, []);

  const continueAsGuest = useCallback(() => {
    writeGuestFlag(true);
    setIsGuest(true);
    setUser(null);
    setStatus("guest");
  }, []);

  const updateProfile = useCallback(async (patch) => {
    setError(null);
    const res = await authAPI.updateProfile(patch);
    // The server's updateProfile only returns { success, message } — no
    // data. Re-fetch to get the fresh row.
    const fresh = await authAPI.getProfile();
    setUser(fresh.data.data);
    return fresh.data.data;
  }, []);

  const value = {
    user,
    isGuest,
    status,
    error,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    login,
    register,
    logout,
    continueAsGuest,
    migrateGuestData,
    updateProfile,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
