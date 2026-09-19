/**
 * StudyFlow V2 — Theme Context
 *
 * Phase 1 implementation:
 *   - Reads theme from localStorage on mount
 *   - Applies [data-theme] to <html> for CSS variable swapping
 *   - Exports toggleTheme() for instant switching
 *
 * Phase 2 (AuthContext) wires this to the user profile so registered users
 * get their theme synced across devices via PUT /api/auth/profile.
 */

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(undefined);

const STORAGE_KEY = "sf-theme";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Read on mount — no flash of wrong theme
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || "light";
    }
    return "light";
  });

  useEffect(() => {
    // Sync to <html> and localStorage
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}