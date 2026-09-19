import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Moon, Sun, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isGuest, isLoading, updateProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState("");
  const [dailyFocusGoal, setDailyFocusGoal] = useState(120);
  const [lumiVisible, setLumiVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Hydrate form from the user object whenever it changes
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setDailyFocusGoal(user.daily_focus_goal_minutes ?? 120);
      setLumiVisible(Boolean(user.lumi_visible));
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <p className="text-[var(--color-secondary)]">Loading…</p>
      </div>
    );
  }

  if (isGuest) {
    return (
      <div className="px-6 py-8 max-w-5xl mx-auto lg:px-12 lg:py-10">
        <h1 className="text-3xl font-bold text-[var(--color-heading)] mb-2">Profile</h1>
        <p className="text-[var(--color-secondary)] mb-8">
          You&apos;re using StudyFlow as a guest. Your data is stored locally in this browser only.
        </p>
        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Save your work</h2>
          <p className="text-sm text-[var(--color-secondary)] mb-4">
            Create an account to keep your tasks, notes, and focus sessions across devices.
            We&apos;ll move your existing data over for you.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="btn btn-primary"
          >
            Create account
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // ProtectedRoute should have caught this, but defensive
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setSaving(true);
    try {
      await updateProfile({
        name,
        theme,
        lumi_visible: lumiVisible,
        daily_focus_goal_minutes: Number(dailyFocusGoal),
      });
      setMessage("Profile saved");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto lg:px-12 lg:py-10">
      <h1 className="text-3xl font-bold text-[var(--color-heading)] mb-2">Profile</h1>
      <p className="text-[var(--color-secondary)] mb-8">Account and preferences</p>

      {message && (
        <div className="mb-4 p-3 rounded-md bg-green-50 text-green-800 text-sm" role="status">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <User size={20} className="text-[var(--color-sage)]" />
            <h2 className="text-lg font-semibold">Account</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1.5">Name</label>
              <input
                id="name"
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={2}
                maxLength={120}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                value={user.email}
                readOnly
                disabled
              />
              <p className="mt-1 text-xs text-[var(--color-secondary)]">
                Email is currently read-only.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Preferences</h2>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-[var(--color-secondary)]">Light or Dark — applies instantly.</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-secondary flex items-center gap-2"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Show Lumi</p>
              <p className="text-sm text-[var(--color-secondary)]">Your study companion appears in the corner of every page.</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={lumiVisible}
                onChange={(e) => setLumiVisible(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[var(--color-sage)] transition-colors relative">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          </div>

          <div>
            <label htmlFor="goal" className="block text-sm font-medium mb-1.5">
              Daily focus goal (minutes)
            </label>
            <input
              id="goal"
              type="number"
              className="input"
              value={dailyFocusGoal}
              onChange={(e) => setDailyFocusGoal(e.target.value)}
              min={10}
              max={1440}
              step={5}
            />
            <p className="mt-1 text-xs text-[var(--color-secondary)]">
              Recommended: 60–180 minutes.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>

      <div className="card mt-8">
        <h2 className="text-lg font-semibold mb-2 text-red-700">Sign out</h2>
        <p className="text-sm text-[var(--color-secondary)] mb-4">
          You can sign back in any time. Your data stays in your account.
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="btn flex items-center gap-2 border border-red-300 text-red-700 hover:bg-red-50"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );
}
