/**
 * StudyFlow — Analytics Page
 *
 * Visual productivity dashboard:
 * - Weekly focus minutes bar chart (Chart.js)
 * - Subject study distribution doughnut chart (Chart.js)
 * - Key productivity summary cards (Total Focus, Streak, Completion Rate, Productivity Score)
 * - Focus session efficiency breakdown (Completed vs Abandoned)
 */

import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  BarChart3,
  Clock,
  Flame,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  PieChart,
} from "lucide-react";
import { useStudy } from "../context/StudyContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const { analytics, tasks, focusHistory, subjects } = useStudy();
  const { theme } = useTheme();

  const weeklyChartRef = useRef(null);
  const subjectsChartRef = useRef(null);

  const weeklyChartInstance = useRef(null);
  const subjectsChartInstance = useRef(null);

  // Extract metrics
  const totalTasks = analytics?.tasks?.total ?? tasks.length;
  const completedTasks = analytics?.tasks?.completed ?? tasks.filter((t) => t.status === "completed").length;
  const completionRate = analytics?.tasks?.completionRate ?? (totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);

  const totalMinutes = analytics?.focus?.totalMinutes ?? 0;
  const totalHours = (totalMinutes / 60).toFixed(1);
  const streak = analytics?.streak ?? 0;
  const productivityScore = analytics?.productivityScore ?? 0;
  const completedSessions = analytics?.focus?.completedSessions ?? 0;
  const abandonedSessions = analytics?.focus?.abandonedSessions ?? 0;

  const last7Days = analytics?.focus?.last7Days || [];
  const subjectBreakdown = analytics?.subjects || [];

  // Theme-aware colors
  const isDark = theme === "dark";
  const textColor = isDark ? "#C7D2CE" : "#334155";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";

  // Build / update Weekly Focus Bar Chart
  useEffect(() => {
    if (!weeklyChartRef.current) return;

    if (weeklyChartInstance.current) {
      weeklyChartInstance.current.destroy();
    }

    const labels = last7Days.map((d) => d.day);
    const dataValues = last7Days.map((d) => d.minutes);

    const ctx = weeklyChartRef.current.getContext("2d");
    weeklyChartInstance.current = new ChartJS(ctx, {
      type: "bar",
      data: {
        labels: labels.length > 0 ? labels : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Focus Minutes",
            data: dataValues.length > 0 ? dataValues : [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: "#6FAF8F",
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.parsed.y} minutes focused`,
            },
          },
        },
        scales: {
          x: {
            ticks: { color: textColor, font: { size: 11 } },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: { color: textColor, font: { size: 11 } },
            grid: { color: gridColor },
          },
        },
      },
    });

    return () => {
      if (weeklyChartInstance.current) {
        weeklyChartInstance.current.destroy();
      }
    };
  }, [last7Days, textColor, gridColor]);

  // Build / update Subject Doughnut Chart
  useEffect(() => {
    if (!subjectsChartRef.current) return;

    if (subjectsChartInstance.current) {
      subjectsChartInstance.current.destroy();
    }

    const labels = subjectBreakdown.map((s) => s.name);
    const dataValues = subjectBreakdown.map((s) => s.taskCount || 1);
    const bgColors = subjectBreakdown.map((s) => s.color || "#6FAF8F");

    const ctx = subjectsChartRef.current.getContext("2d");
    subjectsChartInstance.current = new ChartJS(ctx, {
      type: "doughnut",
      data: {
        labels: labels.length > 0 ? labels : ["General"],
        datasets: [
          {
            data: dataValues.length > 0 ? dataValues : [1],
            backgroundColor: bgColors.length > 0 ? bgColors : ["#6FAF8F"],
            borderWidth: 2,
            borderColor: isDark ? "#1C2721" : "#FFFFFF",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: textColor, font: { size: 11 }, boxWidth: 12 },
          },
        },
      },
    });

    return () => {
      if (subjectsChartInstance.current) {
        subjectsChartInstance.current.destroy();
      }
    };
  }, [subjectBreakdown, textColor, isDark]);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto lg:px-12 lg:py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-heading)] mb-1">Productivity Analytics</h1>
        <p className="text-[var(--color-secondary)]">
          Insights automatically synthesized from your tasks and completed Pomodoro sessions.
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card hover:border-[var(--color-sage)] transition-colors">
          <div className="flex items-center justify-between text-[var(--color-secondary)] mb-2">
            <span className="text-xs font-medium">Total Study Time</span>
            <Clock size={16} className="text-[var(--color-sage)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--color-heading)]">{totalHours} hrs</p>
          <p className="text-[11px] text-[var(--color-secondary)] mt-1">{totalMinutes} total minutes</p>
        </div>

        <div className="card hover:border-[var(--color-sage)] transition-colors">
          <div className="flex items-center justify-between text-[var(--color-secondary)] mb-2">
            <span className="text-xs font-medium">Current Streak</span>
            <Flame size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-[var(--color-heading)] flex items-center gap-1">
            {streak} <span className="text-base font-normal">🔥</span>
          </p>
          <p className="text-[11px] text-[var(--color-secondary)] mt-1">
            {streak > 1 ? `${streak} days in a row` : "Kindle daily consistency"}
          </p>
        </div>

        <div className="card hover:border-[var(--color-sage)] transition-colors">
          <div className="flex items-center justify-between text-[var(--color-secondary)] mb-2">
            <span className="text-xs font-medium">Completion Rate</span>
            <CheckCircle2 size={16} className="text-[var(--color-sage)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--color-heading)]">{completionRate}%</p>
          <p className="text-[11px] text-[var(--color-secondary)] mt-1">
            {completedTasks} of {totalTasks} tasks done
          </p>
        </div>

        <div className="card hover:border-[var(--color-sage)] transition-colors">
          <div className="flex items-center justify-between text-[var(--color-secondary)] mb-2">
            <span className="text-xs font-medium">Productivity Score</span>
            <TrendingUp size={16} className="text-[var(--color-sage)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--color-heading)]">{productivityScore}%</p>
          <p className="text-[11px] text-[var(--color-secondary)] mt-1">Calibrated daily index</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Focus Bar Chart (2 cols) */}
        <div className="lg:col-span-2 card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[var(--color-heading)] flex items-center gap-2">
                <BarChart3 size={18} className="text-[var(--color-sage)]" />
                7-Day Focus Distribution
              </h2>
              <p className="text-xs text-[var(--color-secondary)]">
                Daily completed Pomodoro minutes (abandoned sessions excluded)
              </p>
            </div>
          </div>

          <div className="h-64 relative pt-2">
            <canvas ref={weeklyChartRef} />
          </div>
        </div>

        {/* Subject Breakdown Doughnut Chart (1 col) */}
        <div className="card space-y-4">
          <div>
            <h2 className="text-base font-bold text-[var(--color-heading)] flex items-center gap-2">
              <PieChart size={18} className="text-[var(--color-sage)]" />
              Subject Workload
            </h2>
            <p className="text-xs text-[var(--color-secondary)]">
              Tasks distributed by coursework subject
            </p>
          </div>

          <div className="h-64 relative pt-2">
            <canvas ref={subjectsChartRef} />
          </div>
        </div>
      </div>

      {/* Focus Session Ratio & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card space-y-3">
          <h3 className="text-sm font-bold text-[var(--color-heading)]">Focus Session Discipline</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--color-secondary)]">Completed Sessions</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{completedSessions}</span>
            </div>
            <div className="w-full bg-[var(--bg-primary)] rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full"
                style={{
                  width: `${
                    completedSessions + abandonedSessions > 0
                      ? (completedSessions / (completedSessions + abandonedSessions)) * 100
                      : 100
                  }%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[var(--color-secondary)]">Early Exits (Abandoned)</span>
              <span className="font-semibold text-[var(--color-secondary)]">{abandonedSessions}</span>
            </div>
          </div>
          <p className="text-[11px] text-[var(--color-secondary)] pt-1">
            TRD Protocol: Abandoned sessions preserve your elapsed study history while protecting streak purity.
          </p>
        </div>

        <div className="card space-y-3 bg-gradient-to-br from-[var(--color-soft-mint)]/30 to-transparent">
          <h3 className="text-sm font-bold text-[var(--color-forest)] flex items-center gap-1.5">
            <span>🌱</span> Lumi&apos;s Academic Reflection
          </h3>
          <p className="text-xs text-[var(--color-heading)] leading-relaxed">
            {completionRate >= 70
              ? "You have maintained an outstanding completion rhythm! Deep learning thrives when consistency is sustained without burnout."
              : totalTasks === 0
              ? "Your canvas is clean. Add your course syllabus to your planner to start tracking your academic journey!"
              : "Every journey begins with a single step. Complete one task or focus block today to fuel your momentum."}
          </p>
        </div>
      </div>
    </div>
  );
}