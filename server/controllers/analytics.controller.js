/**
 * StudyFlow V2 — Analytics Controller
 * Computes derived productivity analytics from tasks and focus_sessions.
 * TRD: "Analytics is derived at query time from Tasks/FocusSessions — it is not its own duplicated table."
 * TRD §5: Abandoned sessions are excluded from streaks and focus minutes.
 */

import db from "../models/index.js";

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 1. Task counts (total, completed, pending, by priority, by status)
    const [taskRows] = await db.query(
      `SELECT 
        status, 
        priority, 
        COUNT(*) as count 
      FROM tasks 
      WHERE user_id = ? 
      GROUP BY status, priority`,
      [userId]
    );

    let totalTasks = 0;
    let completedTasks = 0;
    let pendingTasks = 0;
    const priorityCounts = { low: 0, medium: 0, high: 0 };
    const statusCounts = { todo: 0, in_progress: 0, completed: 0 };

    for (const row of taskRows) {
      const cnt = Number(row.count);
      totalTasks += cnt;
      if (row.status === "completed") {
        completedTasks += cnt;
      } else {
        pendingTasks += cnt;
      }
      if (row.priority && priorityCounts[row.priority] !== undefined) {
        priorityCounts[row.priority] += cnt;
      }
      if (row.status && statusCounts[row.status] !== undefined) {
        statusCounts[row.status] += cnt;
      }
    }

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 2. Focus stats (total minutes, today's minutes, sessions count)
    const [focusSummaryRows] = await db.query(
      `SELECT 
        status,
        COUNT(*) as sessionCount,
        COALESCE(SUM(elapsed_minutes), 0) as totalMinutes,
        COALESCE(SUM(CASE WHEN DATE(started_at) = CURDATE() THEN elapsed_minutes ELSE 0 END), 0) as todayMinutes
      FROM focus_sessions 
      WHERE user_id = ?
      GROUP BY status`,
      [userId]
    );

    let totalCompletedMinutes = 0;
    let todayFocusMinutes = 0;
    let completedSessionsCount = 0;
    let abandonedSessionsCount = 0;

    for (const row of focusSummaryRows) {
      if (row.status === "completed") {
        totalCompletedMinutes += Number(row.totalMinutes);
        todayFocusMinutes += Number(row.todayMinutes);
        completedSessionsCount += Number(row.sessionCount);
      } else if (row.status === "abandoned") {
        abandonedSessionsCount += Number(row.sessionCount);
      }
    }

    // 3. Last 7 days focus activity (by day)
    const [dailyFocusRows] = await db.query(
      `SELECT 
        DATE_FORMAT(started_at, '%Y-%m-%d') as date,
        COALESCE(SUM(elapsed_minutes), 0) as minutes
      FROM focus_sessions
      WHERE user_id = ? 
        AND status = 'completed'
        AND started_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE_FORMAT(started_at, '%Y-%m-%d')
      ORDER BY date ASC`,
      [userId]
    );

    const dailyFocusMap = {};
    for (const r of dailyFocusRows) {
      dailyFocusMap[r.date] = Number(r.minutes);
    }

    const last7Days = [];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = daysOfWeek[d.getDay()];
      last7Days.push({
        date: dateStr,
        day: dayName,
        minutes: dailyFocusMap[dateStr] || 0,
      });
    }

    // 4. Subject breakdown
    const [subjectRows] = await db.query(
      `SELECT 
        s.id,
        s.name,
        s.color,
        COUNT(t.id) as taskCount,
        COALESCE(SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END), 0) as completedTaskCount
      FROM subjects s
      LEFT JOIN tasks t ON t.subject_id = s.id AND t.user_id = ?
      WHERE s.user_id = ?
      GROUP BY s.id, s.name, s.color`,
      [userId, userId]
    );

    const subjectBreakdown = subjectRows.map((s) => ({
      id: s.id,
      name: s.name,
      color: s.color || "#6FAF8F",
      taskCount: Number(s.taskCount),
      completedTaskCount: Number(s.completedTaskCount),
    }));

    // 5. Daily Streak calculation (consecutive days of completed focus sessions or completed tasks)
    const [activeDatesRows] = await db.query(
      `SELECT DISTINCT date FROM (
        SELECT DATE_FORMAT(ended_at, '%Y-%m-%d') as date 
        FROM focus_sessions 
        WHERE user_id = ? AND status = 'completed' AND ended_at IS NOT NULL
        UNION
        SELECT DATE_FORMAT(completed_at, '%Y-%m-%d') as date 
        FROM tasks 
        WHERE user_id = ? AND status = 'completed' AND completed_at IS NOT NULL
      ) active_days ORDER BY date DESC`,
      [userId, userId]
    );

    const activeDates = new Set(activeDatesRows.map((r) => r.date));
    let streak = 0;
    let checkDate = new Date();
    const todayStr = checkDate.toISOString().split("T")[0];

    // Check if active today
    if (activeDates.has(todayStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If not active today yet, check yesterday to see if current streak is intact
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (activeDates.has(checkDate.toISOString().split("T")[0])) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // 6. User's daily focus goal for productivity scoring
    const [userRows] = await db.query(
      "SELECT daily_focus_goal_minutes FROM users WHERE id = ?",
      [userId]
    );
    const dailyGoal = (userRows[0] && userRows[0].daily_focus_goal_minutes) || 120;
    const goalRatio = Math.min(todayFocusMinutes / dailyGoal, 1);

    // Productivity score (0-100)
    let productivityScore = 0;
    if (totalTasks > 0 || todayFocusMinutes > 0) {
      const taskFactor = (completedTasks / (totalTasks || 1)) * 40;
      const focusFactor = goalRatio * 40;
      const streakFactor = Math.min(streak * 4, 20);
      productivityScore = Math.min(Math.round(taskFactor + focusFactor + streakFactor), 100);
    }

    res.json({
      success: true,
      data: {
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks,
          completionRate,
          priority: priorityCounts,
          status: statusCounts,
        },
        focus: {
          totalMinutes: totalCompletedMinutes,
          totalHours: (totalCompletedMinutes / 60).toFixed(1),
          todayMinutes: todayFocusMinutes,
          completedSessions: completedSessionsCount,
          abandonedSessions: abandonedSessionsCount,
          dailyGoal,
          last7Days,
        },
        streak,
        productivityScore,
        subjects: subjectBreakdown,
      },
    });
  } catch (err) {
    console.error("[analytics] error getting analytics:", err);
    res.status(500).json({ success: false, message: "Failed to compute analytics" });
  }
};
