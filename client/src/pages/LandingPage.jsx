/**
 * StudyFlow V2 — Landing Page
 *
 * Phase 1 stub: basic hero layout matching the App Flow §5.1 spec.
 * Full implementation in subsequent phases.
 *
 * Primary buttons: Continue as Guest | Login | Create Account
 * Success: user reaches Dashboard within one click.
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function LandingPage() {
  const { continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleContinueAsGuest = () => {
    continueAsGuest();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <span className="text-xl font-bold text-[var(--color-forest)]">StudyFlow</span>
        <div className="flex gap-3">
          <Link to="/login" className="btn btn-secondary text-sm">Login</Link>
          <Link to="/register" className="btn btn-primary text-sm">Create Account</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-soft-mint)] text-[var(--color-sage)] text-sm font-medium mb-6">
          <Sparkles size={14} />
          Plan Smarter. Focus Deeper. Learn Better.
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-heading)] mb-6 leading-tight">
          Your calm study companion
        </h1>
        <p className="text-lg text-[var(--color-secondary)] max-w-xl mx-auto mb-10">
          A peaceful digital workspace that keeps tasks, calendars, focus sessions, notes, and your study companion Lumi in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleContinueAsGuest}
            className="btn btn-primary text-base px-8 py-3"
          >
            Continue as Guest
          </button>
          <Link to="/register" className="btn btn-secondary text-base px-8 py-3">
            Create Account
          </Link>
        </div>
      </section>

      {/* Features placeholder */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        {[
          { title: "Task Planner", desc: "List, Kanban, and Calendar views — your tasks, your way." },
          { title: "Focus Mode", desc: "25-minute Pomodoro sessions with Lumi keeping you company." },
          { title: "Analytics", desc: "Track your streaks, completion rates, and study consistency." },
        ].map(({ title, desc }) => (
          <div key={title} className="card text-center">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-[var(--color-secondary)]">{desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-6 text-center text-sm text-[var(--color-secondary)]">
        <p>&copy; {new Date().getFullYear()} StudyFlow. Built for learners.</p>
      </footer>
    </div>
  );
}