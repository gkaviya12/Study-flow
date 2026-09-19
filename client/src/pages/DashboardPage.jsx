/**
 * StudyFlow — Dashboard (Home)
 *
 * Daily productivity command center:
 * - Greeting with user's name
 * - 4 Key productivity metrics (Today's Tasks, Focus Time, Daily Streak, Productivity Score)
 * - Quick Action Buttons (Add Task, Start Focus, New Note)
 * - Interactive Today's Tasks list with instant completion
 * - Upcoming Deadlines widget
 * - Lumi companion inspiration card
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  TrendingUp,
  Plus,
  Play,
  FileText,
  Calendar,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useStudy } from "../context/StudyContext.jsx";

export default function DashboardPage() {
  const { user, isGuest } = useAuth();
  const {
    tasks,
    subjects,
    analytics,
    toggleTaskComplete,
    createTask,
    isLoading,
  } = useStudy();
  const navigate = useNavigate();

  const [showQuickTaskModal, setShowQuickTaskModal] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickSubject, setQuickSubject] = useState("");
  const [quickPriority, setQuickPriority] = useState("medium");
  const [quickDueDate, setQuickDueDate] = useState(new Date().toISOString().split("T")[0]);

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const displayName = user?.name ? user.name.split(" ")[0] : "Scholar";

  // Today's date string
  const todayStr = new Date().toISOString().split("T")[0];

  // Filtering tasks
  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const todayTasks = tasks.filter(
    (t) => t.due_date === todayStr || (!t.due_date && t.status !== "completed")
  );
  const upcomingDeadlines = tasks
    .filter((t) => t.status !== "completed" && t.due_date && t.due_date > todayStr)
    .sort((a, b) => (a.due_date > b.due_date ? 1 : -1))
    .slice(0, 4);

  // Stats calculation
  const totalTasksCount = tasks.length;
  const completedTodayCount = tasks.filter(
    (t) => t.status === "completed" && t.completed_at && t.completed_at.startsWith(todayStr)
  ).length;

  const todayFocusMinutes = analytics?.focus?.todayMinutes || 0;
  const dailyFocusGoal = user?.daily_focus_goal_minutes || analytics?.focus?.dailyGoal || 120;
  const streakDays = analytics?.streak || 0;
  const productivityScore = analytics?.productivityScore || 0;

  const handleQuickCreateTask = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    await createTask({
      title: quickTitle.trim(),
      subject_id: quickSubject || null,
      priority: quickPriority,
      status: "todo",
      due_date: quickDueDate || todayStr,
      estimated_minutes: 25,
      recurrence: "none",
    });
    setQuickTitle("");
    setShowQuickTaskModal(false);
  };

  const getSubject = (id) => subjects.find((s) => s.id === id);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto lg:px-12 lg:py-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-heading)] mb-1">
            {greetingTime}, {displayName} 👋
          </h1>
          <p className="text-[var(--color-secondary)]">
            Plan your day, stay focused, and achieve your academic milestones.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowQuickTaskModal(true)}
            className="btn btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus size={14} />
            Add Task
          </button>
          <button
            onClick={() => navigate("/focus")}
            className="btn btn-secondary text-xs flex items-center gap-1.5"
          >
            <Play size={14} className="text-[var(--color-forest)] fill-[var(--color-forest)]" />
            Focus Session
          </button>
        </div>
      </div>

      {/* Guest Mode Banner (if guest) */}
      {isGuest && (
        <div className="p-4 rounded-xl bg-[var(--color-soft-mint)] border border-[var(--color-sage)]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5 text-[var(--color-forest)] font-medium">
            <Sparkles size={18} className="shrink-0" />
            <span>You are exploring StudyFlow in Guest Mode. Data is stored safely in this browser.</span>
          </div>
          <Link
            to="/register"
            className="btn btn-primary text-xs whitespace-nowrap self-start sm:self-auto"
          >
            Save &amp; Create Account
          </Link>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Tasks */}
        <div className="card hover:border-[var(--color-sage)] transition-colors">
          <div className="flex items-center justify-between text-[var(--color-secondary)] mb-2">
            <span className="text-xs font-medium">Today&apos;s Tasks</span>
            <CheckCircle2 size={16} className="text-[var(--color-sage)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--color-heading)]">
            {completedTodayCount} <span className="text-sm font-normal text-[var(--color-secondary)]">/ {todayTasks.length || 0}</span>
          </p>
          <p className="text-[11px] text-[var(--color-secondary)] mt-1">
            {pendingTasks.length} pending total
          </p>
        </div>

        {/* Card 2: Focus Time */}
        <div className="card hover:border-[var(--color-sage)] transition-colors">
          <div className="flex items-center justify-between text-[var(--color-secondary)] mb-2">
            <span className="text-xs font-medium">Focus Time</span>
            <Clock size={16} className="text-[var(--color-sage)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--color-heading)]">
            {todayFocusMinutes} <span className="text-sm font-normal text-[var(--color-secondary)]">/ {dailyFocusGoal} min</span>
          </p>
          <div className="w-full bg-[var(--bg-primary)] rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[var(--color-forest)] h-full transition-all duration-500"
              style={{ width: `${Math.min((todayFocusMinutes / dailyFocusGoal) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Card 3: Streak */}
        <div className="card hover:border-[var(--color-sage)] transition-colors">
          <div className="flex items-center justify-between text-[var(--color-secondary)] mb-2">
            <span className="text-xs font-medium">Daily Streak</span>
            <Flame size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-[var(--color-heading)] flex items-center gap-1">
            {streakDays} <span className="text-base font-normal">🔥</span>
          </p>
          <p className="text-[11px] text-[var(--color-secondary)] mt-1">
            {streakDays > 0 ? "Consistent habits! Keep it up" : "Start a session to kindle streak"}
          </p>
        </div>

        {/* Card 4: Productivity Score */}
        <div className="card hover:border-[var(--color-sage)] transition-colors">
          <div className="flex items-center justify-between text-[var(--color-secondary)] mb-2">
            <span className="text-xs font-medium">Productivity</span>
            <TrendingUp size={16} className="text-[var(--color-sage)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--color-heading)]">
            {productivityScore}%
          </p>
          <p className="text-[11px] text-[var(--color-secondary)] mt-1">
            Based on tasks &amp; focus goals
          </p>
        </div>
      </div>

      {/* Main Content Grid: Today's Tasks & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Tasks (2 cols) */}
        <div className="lg:col-span-2 card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--color-heading)] flex items-center gap-2">
              <Calendar size={18} className="text-[var(--color-sage)]" />
              Today&apos;s Focus Schedule
            </h2>
            <Link
              to="/planner"
              className="text-xs font-medium text-[var(--color-forest)] hover:underline"
            >
              Open Full Planner &rarr;
            </Link>
          </div>

          {todayTasks.length === 0 ? (
            <div className="py-12 text-center text-[var(--color-secondary)]">
              <CheckCircle2 size={36} className="mx-auto mb-2 text-[var(--color-sage)]/60" />
              <p className="text-sm font-medium">No tasks scheduled for today!</p>
              <p className="text-xs mt-1">Add a quick task or take a well-deserved study break.</p>
              <button
                onClick={() => setShowQuickTaskModal(true)}
                className="btn btn-secondary text-xs mt-4 inline-flex items-center gap-1.5"
              >
                <Plus size={14} /> Add First Task
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayTasks.map((task) => {
                const isCompleted = task.status === "completed";
                const subj = getSubject(task.subject_id);

                return (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isCompleted
                        ? "bg-[var(--bg-primary)]/50 border-[var(--border-color)] opacity-60 line-through"
                        : "bg-[var(--bg-primary)] border-[var(--border-color)] hover:border-[var(--color-sage)]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleTaskComplete(task)}
                        className="text-[var(--color-secondary)] hover:text-[var(--color-forest)] shrink-0 transition-colors"
                        title={isCompleted ? "Mark incomplete" : "Mark completed"}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={18} className="text-[var(--color-forest)] fill-[var(--color-soft-mint)]" />
                        ) : (
                          <Circle size={18} />
                        )}
                      </button>

                      <div className="min-w-0">
                        <p className={`text-sm font-medium text-[var(--color-heading)] truncate ${isCompleted ? "line-through text-[var(--color-secondary)]" : ""}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[var(--color-secondary)]">
                          {subj && (
                            <span
                              className="px-2 py-0.5 rounded-md font-medium"
                              style={{ backgroundColor: `${subj.color}25`, color: subj.color }}
                            >
                              {subj.name}
                            </span>
                          )}
                          {task.estimated_minutes && (
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> {task.estimated_minutes}m
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span
                        className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                          task.priority === "high"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                            : task.priority === "medium"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Deadlines & Lumi Whisper (1 col) */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="card space-y-4">
            <h2 className="text-lg font-semibold text-[var(--color-heading)] flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-500" />
              Upcoming Deadlines
            </h2>

            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-[var(--color-secondary)] py-4 text-center">
                No upcoming deadlines in the next few days. Relax or plan ahead!
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((task) => {
                  const subj = getSubject(task.subject_id);
                  return (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-[var(--color-heading)] truncate">
                          {task.title}
                        </p>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                          {task.due_date}
                        </span>
                      </div>
                      {subj && (
                        <p className="text-[10px] text-[var(--color-secondary)]">
                          {subj.name} &bull; {task.priority} priority
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Lumi Encouragement Box */}
          <div className="card bg-gradient-to-br from-[var(--color-soft-mint)]/40 to-transparent border border-[var(--color-sage)]/30 p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-card)] border border-[var(--color-sage)] flex items-center justify-center text-lg shrink-0">
                🌱
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[var(--color-forest)]">Lumi&apos;s Whisper</p>
                <p className="text-xs text-[var(--color-heading)] leading-relaxed">
                  &ldquo;Deep focus is like cultivating a garden. Plant a single seed with one 25-minute Pomodoro today.&rdquo;
                </p>
                <button
                  onClick={() => navigate("/focus")}
                  className="text-xs font-semibold text-[var(--color-forest)] hover:underline pt-2 block"
                >
                  Start Pomodoro &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Task Modal */}
      {showQuickTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-md space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--color-heading)]">Add Quick Task</h3>
              <button
                onClick={() => setShowQuickTaskModal(false)}
                className="text-[var(--color-secondary)] hover:text-[var(--color-heading)] text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleQuickCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read Physics Chapter 2"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="input text-sm"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Subject</label>
                  <select
                    value={quickSubject}
                    onChange={(e) => setQuickSubject(e.target.value)}
                    className="input text-xs"
                  >
                    <option value="">(No Subject)</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Priority</label>
                  <select
                    value={quickPriority}
                    onChange={(e) => setQuickPriority(e.target.value)}
                    className="input text-xs"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={quickDueDate}
                  onChange={(e) => setQuickDueDate(e.target.value)}
                  className="input text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setShowQuickTaskModal(false)}
                  className="btn btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}