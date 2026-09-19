/**
 * StudyFlow V2 — AuthContext Tests
 *
 * Covers the state machine and the public methods:
 *   - Initial loading state, then "anonymous" on 401
 *   - login() sets the user, flips to "authenticated"
 *   - logout() clears the user, flips to "anonymous"
 *   - continueAsGuest() flips to "guest"
 *   - register() with guest data triggers migrateGuestData()
 *   - Error paths surface a user-friendly message
 *
 * Run with: npm test --workspace=client
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { AuthProvider, useAuth } from "./AuthContext.jsx";

// Mock the auth API
vi.mock("../services/api.js", () => {
  const mockAPI = {
    getProfile: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    updateProfile: vi.fn(),
    migrateGuestData: vi.fn(),
  };
  return { authAPI: mockAPI };
});

// Mock the guest storage helpers
vi.mock("../services/guestStorage.js", () => ({
  getGuestData: vi.fn(() => ({
    subjects: [{ name: "Math", color: "#FFF" }],
    tasks: [{ title: "HW1" }],
    notes: [],
    focus_sessions: [],
  })),
  clearGuestData: vi.fn(),
  hasGuestData: vi.fn(() => false),
  setGuestData: vi.fn(),
  addGuestItem: vi.fn(),
  updateGuestItem: vi.fn(),
  removeGuestItem: vi.fn(),
}));

import { authAPI } from "../services/api.js";
import { hasGuestData, clearGuestData } from "../services/guestStorage.js";

// ── Test harness ──────────────────────────────────────────────────────────────
// A small component that exposes the current auth state via the DOM so we can
// assert on it without poking at internals.

function AuthStateDisplay() {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="status">{auth.status}</span>
      <span data-testid="is-guest">{String(auth.isGuest)}</span>
      <span data-testid="is-auth">{String(auth.isAuthenticated)}</span>
      <span data-testid="user-name">{auth.user?.name ?? ""}</span>
      <span data-testid="user-email">{auth.user?.email ?? ""}</span>
      <span data-testid="error">{auth.error ?? ""}</span>
      <button onClick={() => { auth.login("a@b.com", "pwd").catch(() => {}); }} data-testid="login-btn" />
      <button onClick={() => auth.logout()} data-testid="logout-btn" />
      <button onClick={() => auth.continueAsGuest()} data-testid="guest-btn" />
      <button
        onClick={() => { auth.register("Name", "a@b.com", "Pwd1234!").catch(() => {}); }}
        data-testid="register-btn"
      />
      <button onClick={() => { auth.migrateGuestData().catch(() => {}); }} data-testid="migrate-btn" />
    </div>
  );
}

function renderAuth() {
  return render(
    <AuthProvider>
      <AuthStateDisplay />
    </AuthProvider>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  hasGuestData.mockReset();
  hasGuestData.mockReturnValue(false);
  clearGuestData.mockReset();
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe("AuthContext", () => {
  describe("initial mount", () => {
    it("shows 'loading' then 'anonymous' when getProfile 401s", async () => {
      authAPI.getProfile.mockRejectedValueOnce(new Error("Unauthorized"));

      renderAuth();

      expect(screen.getByTestId("status").textContent).toBe("loading");

      await waitFor(() => {
        expect(screen.getByTestId("status").textContent).toBe("anonymous");
      });
      expect(screen.getByTestId("is-guest").textContent).toBe("false");
      expect(screen.getByTestId("is-auth").textContent).toBe("false");
      expect(screen.getByTestId("user-name").textContent).toBe("");
    });

    it("populates user state when getProfile succeeds", async () => {
      authAPI.getProfile.mockResolvedValueOnce({
        data: {
          data: {
            id: 1,
            name: "Real User",
            email: "real@example.com",
            theme: "light",
            lumi_visible: true,
            daily_focus_goal_minutes: 120,
          },
        },
      });

      renderAuth();

      await waitFor(() => {
        expect(screen.getByTestId("status").textContent).toBe("authenticated");
      });
      expect(screen.getByTestId("user-name").textContent).toBe("Real User");
      expect(screen.getByTestId("user-email").textContent).toBe("real@example.com");
      expect(screen.getByTestId("is-auth").textContent).toBe("true");
      expect(screen.getByTestId("is-guest").textContent).toBe("false");
    });
  });

  describe("login()", () => {
    it("calls the API, sets user, flips to authenticated", async () => {
      authAPI.getProfile.mockRejectedValueOnce(new Error("Unauthorized"));
      authAPI.login.mockResolvedValueOnce({
        data: {
          data: {
            userId: 7,
            name: "Logged In",
            email: "li@example.com",
            theme: "dark",
            lumi_visible: true,
            daily_focus_goal_minutes: 60,
          },
        },
      });

      const user = userEvent.setup();
      renderAuth();
      await waitFor(() => screen.getByTestId("login-btn"));

      await user.click(screen.getByTestId("login-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("status").textContent).toBe("authenticated");
      });
      expect(screen.getByTestId("user-name").textContent).toBe("Logged In");
      expect(authAPI.login).toHaveBeenCalledWith({
        email: "a@b.com",
        password: "pwd",
      });
    });

    it("surfaces a friendly error message when login fails", async () => {
      authAPI.getProfile.mockRejectedValueOnce(new Error("Unauthorized"));
      authAPI.login.mockRejectedValueOnce(new Error("Invalid credentials"));

      const user = userEvent.setup();
      renderAuth();
      await waitFor(() => screen.getByTestId("login-btn"));

      await user.click(screen.getByTestId("login-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("error").textContent).toBe("Invalid credentials");
      });
      expect(screen.getByTestId("status").textContent).toBe("anonymous");
    });
  });

  describe("logout()", () => {
    it("clears user state and calls the API", async () => {
      authAPI.getProfile.mockResolvedValueOnce({
        data: { data: { id: 1, name: "User", email: "u@e.com", theme: "light", lumi_visible: true, daily_focus_goal_minutes: 120 } },
      });
      authAPI.logout.mockResolvedValueOnce({ data: { success: true } });

      const user = userEvent.setup();
      renderAuth();

      await waitFor(() => {
        expect(screen.getByTestId("status").textContent).toBe("authenticated");
      });

      await user.click(screen.getByTestId("logout-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("status").textContent).toBe("anonymous");
      });
      expect(screen.getByTestId("user-name").textContent).toBe("");
      expect(authAPI.logout).toHaveBeenCalled();
    });
  });

  describe("continueAsGuest()", () => {
    it("flips status to 'guest' and writes the flag to localStorage", async () => {
      authAPI.getProfile.mockRejectedValueOnce(new Error("Unauthorized"));

      const user = userEvent.setup();
      renderAuth();
      await waitFor(() => screen.getByTestId("guest-btn"));

      await user.click(screen.getByTestId("guest-btn"));

      await waitFor(() => {
        expect(screen.getByTestId("status").textContent).toBe("guest");
      });
      expect(screen.getByTestId("is-guest").textContent).toBe("true");
      expect(localStorage.getItem("sf-is-guest")).toBe("1");
    });
  });

  describe("register() with guest data", () => {
    it("calls login() after register and triggers migration when hasGuestData is true", async () => {
      authAPI.getProfile.mockRejectedValueOnce(new Error("Unauthorized"));
      hasGuestData.mockReturnValueOnce(true);
      authAPI.register.mockResolvedValueOnce({
        data: { data: { userId: 8, name: "New", email: "new@e.com" } },
      });
      authAPI.login.mockResolvedValueOnce({
        data: { data: { userId: 8, name: "New", email: "new@e.com", theme: "light", lumi_visible: true, daily_focus_goal_minutes: 120 } },
      });
      authAPI.migrateGuestData.mockResolvedValueOnce({ data: { success: true, data: { migrated: { tasks: 1 } } } });

      const user = userEvent.setup();
      renderAuth();
      await waitFor(() => screen.getByTestId("register-btn"));

      await user.click(screen.getByTestId("register-btn"));

      await waitFor(() => {
        expect(authAPI.register).toHaveBeenCalled();
        expect(authAPI.login).toHaveBeenCalled();
        expect(authAPI.migrateGuestData).toHaveBeenCalled();
        expect(clearGuestData).toHaveBeenCalled();
      });

      // After migration, the guest flag should be cleared
      expect(localStorage.getItem("sf-is-guest")).not.toBe("1");
    });
  });

  describe("migrateGuestData()", () => {
    it("is a no-op when there is no guest data", async () => {
      authAPI.getProfile.mockRejectedValueOnce(new Error("Unauthorized"));
      hasGuestData.mockReturnValueOnce(false);

      const user = userEvent.setup();
      renderAuth();
      await waitFor(() => screen.getByTestId("migrate-btn"));

      await user.click(screen.getByTestId("migrate-btn"));

      await waitFor(() => {
        expect(authAPI.migrateGuestData).not.toHaveBeenCalled();
        expect(clearGuestData).not.toHaveBeenCalled();
      });
    });
  });
});

describe("useAuth() outside provider", () => {
  it("throws a helpful error", () => {
    // Suppress error boundary noise in test output
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    const Bad = () => {
      useAuth();
      return null;
    };

    expect(() => render(<Bad />)).toThrow(/must be used within an AuthProvider/);

    spy.mockRestore();
  });
});
