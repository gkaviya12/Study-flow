/**
 * StudyFlow V2 — App Root
 *
 * Owns the top-level routing. ThemeContext + AuthContext wrap everything so
 * any page (or any nested component) can read the current user, theme,
 * etc. without prop-drilling.
 *
 * Auth flow:
 *   - /            : public landing
 *   - /login       : public
 *   - /register    : public
 *   - /forgot-password, /reset-password : public
 *   - everything else: requires either a valid JWT cookie OR the
 *     "isGuest" flag in localStorage. The ProtectedRoute component
 *     enforces this.
 */

import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { StudyProvider } from "./context/StudyContext.jsx";
import { Navigate, useLocation } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PlannerPage from "./pages/PlannerPage.jsx";
import FocusPage from "./pages/FocusPage.jsx";
import BuddyPage from "./pages/BuddyPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

// Layouts
import AppLayout from "./layouts/AppLayout.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isGuest, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <p className="text-[var(--color-secondary)]">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StudyProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected routes — wrapped in AppLayout */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/planner" element={<PlannerPage />} />
                <Route path="/focus" element={<FocusPage />} />
                <Route path="/buddy" element={<BuddyPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </StudyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
