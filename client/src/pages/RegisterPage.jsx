/**
 * StudyFlow — Branded Split-Screen Register Page
 *
 * Features:
 * - Left Showcase Panel with Logo, Lumi greeting, and privacy benefits
 * - Right Form Panel with validation indicators and password toggle
 * - Automatic background guest data migration into the new account
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Database,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { hasGuestData } from "../services/guestStorage.js";
import StudyFlowLogo from "../components/StudyFlowLogo.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, continueAsGuest } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const hasExistingGuestData = hasGuestData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
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
      {/* ── Left Showcase Panel (lg: 5 cols) ── */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 bg-gradient-to-br from-[var(--color-forest)] to-[#1E1612] text-white relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[var(--color-sage)]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Brand Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-block">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <span className="text-xl">🌱</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Study<span className="text-emerald-300">Flow</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Value Proposition */}
        <div className="relative z-10 space-y-6 my-auto">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="w-12 h-12 flex items-center justify-center animate-bounce-gentle">
              <span className="text-3xl">🌱</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-200">Welcome to the sanctuary</p>
              <p className="text-xs text-white/80">&ldquo;A peaceful mind learns effortlessly.&rdquo;</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Transform the way you study, forever.
            </h2>
            <p className="text-sm text-white/75 leading-relaxed">
              Create a free account to sync your subjects, assignments, focus sessions, and study streaks across all your devices.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 text-xs text-white/85">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-emerald-300 shrink-0" />
              <span>Secure httpOnly cookie sessions (zero password tracking)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Database size={16} className="text-emerald-300 shrink-0" />
              <span>Automatic migration: your local guest data will be preserved</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} className="text-emerald-300 shrink-0" />
              <span>Lumi virtual companion evolves with your study habits</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 text-xs text-white/60">
          <p>&copy; {new Date().getFullYear()} StudyFlow. Built for learners.</p>
        </div>
      </div>

      {/* ── Right Form Panel (lg: 7 cols) ── */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center px-6 py-12 md:px-16">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden text-center pb-2">
            <StudyFlowLogo size="lg" className="justify-center" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)] mb-1">
              Create your account
            </h1>
            <p className="text-xs md:text-sm text-[var(--color-secondary)]">
              Join StudyFlow and cultivate your calm daily study habit.
            </p>
          </div>

          {/* Guest Migration Notice if local data exists */}
          {hasExistingGuestData ? (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Good news! We found local guest tasks &amp; notes. We will automatically move them to your new account.</span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-[var(--color-soft-mint)] border border-[var(--border-color)] flex items-center justify-between gap-3 text-xs">
              <span className="text-[var(--color-secondary)]">Just want to look around first?</span>
              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="btn btn-secondary text-xs py-1 px-3"
              >
                Continue as Guest
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-medium border border-rose-200" role="alert">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-[var(--color-heading)] mb-1.5">
                Your Full Name
              </label>
              <input
                id="name"
                type="text"
                className="input text-xs"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                maxLength={120}
                autoComplete="name"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[var(--color-heading)] mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="input text-xs"
                placeholder="alex@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-[var(--color-heading)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="input text-xs pr-10"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
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
              <p className="mt-1 text-[11px] text-[var(--color-secondary)]">
                Include uppercase &amp; lowercase letters, a number, and a symbol.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2 font-bold shadow-md"
              disabled={submitting}
            >
              {submitting ? "Creating Account…" : "Create Free Account"}
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-[var(--color-secondary)] border-t border-[var(--border-color)]">
            <span>Already have an account? </span>
            <Link to="/login" className="font-bold text-[var(--color-forest)] hover:underline">
              Sign in
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
