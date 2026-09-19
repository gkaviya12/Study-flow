/**
 * StudyFlow — Branded Split-Screen Login Page
 * 
 * Features:
 * - Left Showcase Panel with StudyFlow Logo, animated Lumi lantern art, and student milestones
 * - Right Form Panel with password visibility toggle, error handling, and 1-click Guest Mode
 */

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Sparkles,
  BookOpen,
  Timer,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import StudyFlowLogo from "../components/StudyFlowLogo.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, continueAsGuest } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinueAsGuest = () => {
    continueAsGuest();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[var(--bg-primary)]">
      {/* ── Left Showcase Panel (Desktop lg: 5 cols) ── */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-gradient-to-br from-[var(--color-forest)] to-[#1E1612] text-white relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[var(--color-sage)]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Brand Logo Top */}
        <div className="relative z-10">
          <Link to="/" className="inline-block">
            <div className="flex items-center gap-2.5">
              {/* White silhouette logo mark */}
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <span className="text-xl">🌱</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Study<span className="text-emerald-300">Flow</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center Mascot & Value Props */}
        <div className="relative z-10 space-y-6 my-auto">
          {/* Lumi Lantern Illustration */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="w-12 h-12 flex items-center justify-center animate-bounce-gentle">
              <span className="text-3xl">🌱</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-200">Lumi is waiting for you</p>
              <p className="text-xs text-white/80">&ldquo;Let&apos;s pick up where we left off!&rdquo;</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Your calm, distraction-free study sanctuary.
            </h2>
            <p className="text-sm text-white/75 leading-relaxed">
              Coursework planning, Zen Pomodoro cycles, and academic insights unified into one peaceful workspace.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 text-xs text-white/85">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
              <span>Pomodoro focus timer with ambient soundscapes</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
              <span>Interactive Kanban, Calendar &amp; Notes</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-300 shrink-0" />
              <span>No signup required — full guest mode supported</span>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="relative z-10 pt-6 border-t border-white/10 text-xs text-white/60">
          <p>&copy; {new Date().getFullYear()} StudyFlow. Designed for mindful learners.</p>
        </div>
      </div>

      {/* ── Right Form Panel (lg: 7 cols) ── */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center px-6 py-12 md:px-16">
        <div className="w-full max-w-md space-y-6">
          {/* Top Logo for Mobile */}
          <div className="lg:hidden text-center pb-2">
            <StudyFlowLogo size="lg" className="justify-center" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)] mb-1">
              Welcome back
            </h1>
            <p className="text-xs md:text-sm text-[var(--color-secondary)]">
              Sign in to your StudyFlow workspace or continue as a guest.
            </p>
          </div>

          {/* Quick Guest CTA Banner */}
          <div className="p-3.5 rounded-xl bg-[var(--color-soft-mint)] border border-[var(--border-color)] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[var(--color-heading)] font-medium">
              <Sparkles size={15} className="text-[var(--color-sage)] shrink-0" />
              <span>In a hurry? Test everything without signing in.</span>
            </div>
            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="btn btn-primary text-xs py-1 px-3 whitespace-nowrap"
            >
              Guest Mode
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-medium border border-rose-200 dark:border-rose-900/50" role="alert">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[var(--color-heading)] mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="input text-xs"
                placeholder="scholar@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-[var(--color-heading)]">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-[var(--color-sage)] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="input text-xs pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)] hover:text-[var(--color-heading)]"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2 font-bold shadow-md"
              disabled={submitting}
            >
              {submitting ? "Signing in…" : "Sign In to StudyFlow"}
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Switch to Register */}
          <div className="pt-2 text-center text-xs text-[var(--color-secondary)] border-t border-[var(--border-color)]">
            <span>Don&apos;t have an account yet? </span>
            <Link to="/register" className="font-bold text-[var(--color-forest)] hover:underline">
              Create free account
            </Link>
          </div>

          <div className="text-center">
            <Link to="/" className="text-xs text-[var(--color-secondary)] hover:text-[var(--color-heading)]">
              &larr; Return to landing page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
