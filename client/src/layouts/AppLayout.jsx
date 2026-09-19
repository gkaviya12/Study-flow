/**
 * StudyFlow — App Layout
 * 
 * Responsive navigation shell:
 * - Desktop Sidebar with StudyFlow Logo, Navigation, and 1-Click Day/Night Toggle
 * - Mobile Top Header with Logo and Theme Switch
 * - Mobile Bottom Navigation Bar
 * - Floating Quick Scratchpad & Lumi Companion
 */

import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  House,
  CheckSquare,
  Timer,
  Sparkles,
  BarChart3,
  User,
  Sun,
  Moon,
} from "lucide-react";
import Lumi from "../components/Lumi.jsx";
import StudyFlowLogo from "../components/StudyFlowLogo.jsx";
import QuickScratchpad from "../components/QuickScratchpad.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Home", icon: House },
  { to: "/planner", label: "Planner", icon: CheckSquare },
  { to: "/focus", label: "Focus", icon: Timer },
  { to: "/buddy", label: "Buddy", icon: Sparkles },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
];

export default function AppLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-[var(--bg-card)] border-r border-[var(--border-color)] shadow-xs z-20">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-[var(--border-color)]">
          <StudyFlowLogo size="md" />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[var(--color-soft-mint)] text-[var(--color-forest)] shadow-xs font-bold"
                    : "text-[var(--color-secondary)] hover:bg-[var(--color-soft-mint)]/60 hover:text-[var(--color-heading)]"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Sidebar Footer: 1-Click Day / Night Toggle */}
        <div className="p-3 border-t border-[var(--border-color)]">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold text-[var(--color-heading)] bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--color-sage)] transition-all"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
          >
            <span className="flex items-center gap-2">
              {theme === "dark" ? (
                <Sun size={15} className="text-amber-400" />
              ) : (
                <Moon size={15} className="text-slate-600" />
              )}
              {theme === "dark" ? "Day Mode" : "Night Mode"}
            </span>
            <span className="text-[10px] uppercase font-bold text-[var(--color-secondary)] px-1.5 py-0.5 rounded bg-[var(--bg-card)]">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile top bar (logo + theme toggle) */}
        <header className="lg:hidden h-14 bg-[var(--bg-card)] border-b border-[var(--border-color)] flex items-center justify-between px-4 z-10 shrink-0">
          <StudyFlowLogo size="sm" />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--color-heading)] hover:bg-[var(--bg-primary)]"
            title="Toggle Day/Night"
            aria-label="Toggle Day/Night mode"
          >
            {theme === "dark" ? (
              <Sun size={16} className="text-amber-400" />
            ) : (
              <Moon size={16} className="text-slate-600" />
            )}
          </button>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-card)] border-t border-[var(--border-color)] z-30 safe-area-bottom shadow-lg">
        <div className="flex justify-around items-center h-16">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 px-2 min-w-[50px] transition-colors ${
                  isActive
                    ? "text-[var(--color-forest)] font-bold"
                    : "text-[var(--color-secondary)]"
                }`
              }
              aria-label={label}
            >
              <Icon size={18} />
              <span className="text-[10px] leading-none">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ── Floating Utilities: Quick Scratchpad & Lumi Companion ── */}
      <QuickScratchpad />
      <Lumi />
    </div>
  );
}