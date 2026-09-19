/**
 * StudyFlow — Unified Study Context
 * 
 * Manages all academic state (Tasks, Subjects, Notes, Focus, Analytics, Lumi mood)
 * seamlessly across both Authenticated API Mode and Guest Mode.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext.jsx";
import {
  tasksAPI,
  subjectsAPI,
  notesAPI,
  focusAPI,
  analyticsAPI,
} from "../services/api.js";
import {
  getGuestData,
  addGuestItem,
  updateGuestItem,
  removeGuestItem,
  initDefaultGuestData,
} from "../services/guestStorage.js";

const StudyContext = createContext(undefined);

export function StudyProvider({ children }) {
  const { isAuthenticated, isGuest, user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [focusHistory, setFocusHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Active focus session state (persists across page tabs)
  const [activeSession, setActiveSession] = useState(null);

  // Lumi emotional state
  const [lumiState, setLumiState] = useState({
    mood: "idle", // idle | focusing | happy | sleepy | neutral
    speech: "Ready to study? Let's take it one step at a time 🌱",
    speechTimer: null,
  });

  const triggerLumi = useCallback((mood, speech = null, durationMs = 4000) => {
    setLumiState((prev) => {
      if (prev.speechTimer) clearTimeout(prev.speechTimer);
      let timer = null;
      if (speech) {
        timer = setTimeout(() => {
          setLumiState((curr) => ({ ...curr, speech: null, speechTimer: null }));
        }, durationMs);
      }
      return {
        mood: mood || prev.mood,
        speech: speech !== undefined ? speech : prev.speech,
        speechTimer: timer,
      };
    });
  }, []);

  // Compute local analytics for guest mode
  const computeLocalAnalytics = useCallback((data) => {
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter((t) => t.status === "completed").length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    let totalMinutes = 0;
    let todayMinutes = 0;
    let completedSessions = 0;
    let abandonedSessions = 0;

    const todayStr = new Date().toISOString().split("T")[0];

    data.focus_sessions.forEach((s) => {
      const elapsed = Number(s.elapsed_minutes) || 0;
      if (s.status === "completed") {
        totalMinutes += elapsed;
        completedSessions++;
        const sDate = s.started_at ? s.started_at.split("T")[0] : todayStr;
        if (sDate === todayStr) {
          todayMinutes += elapsed;
        }
      } else if (s.status === "abandoned") {
        abandonedSessions++;
      }
    });

    const dailyGoal = 120;
    const streak = completedSessions > 0 || completedTasks > 0 ? 1 : 0;
    const score = Math.min(
      Math.round(completionRate * 0.4 + (Math.min(todayMinutes / dailyGoal, 1) * 40) + streak * 10),
      100
    );

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split("T")[0];
      const dayMinutes = data.focus_sessions
        .filter((s) => s.status === "completed" && s.started_at && s.started_at.startsWith(dStr))
        .reduce((sum, s) => sum + (Number(s.elapsed_minutes) || 0), 0);
      last7Days.push({
        date: dStr,
        day: daysOfWeek[d.getDay()],
        minutes: dayMinutes,
      });
    }

    const subjectBreakdown = data.subjects.map((subj) => ({
      id: subj.id,
      name: subj.name,
      color: subj.color || "#6FAF8F",
      taskCount: data.tasks.filter((t) => t.subject_id === subj.id).length,
      completedTaskCount: data.tasks.filter((t) => t.subject_id === subj.id && t.status === "completed").length,
    }));

    return {
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        completionRate,
      },
      focus: {
        totalMinutes,
        totalHours: (totalMinutes / 60).toFixed(1),
        todayMinutes,
        completedSessions,
        abandonedSessions,
        dailyGoal,
        last7Days,
      },
      streak,
      productivityScore: score,
      subjects: subjectBreakdown,
    };
  }, []);

  // Fetch or refresh all data
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        const [taskRes, subjRes, noteRes, focusRes, analyticRes] = await Promise.allSettled([
          tasksAPI.list({ limit: 100 }),
          subjectsAPI.list(),
          notesAPI.list({ limit: 100 }),
          focusAPI.history(),
          analyticsAPI.get(),
        ]);

        if (taskRes.status === "fulfilled") setTasks(taskRes.value.data.data.tasks || []);
        if (subjRes.status === "fulfilled") setSubjects(subjRes.value.data.data.subjects || []);
        if (noteRes.status === "fulfilled") setNotes(noteRes.value.data.data.notes || []);
        if (focusRes.status === "fulfilled") setFocusHistory(focusRes.value.data.data.sessions || []);
        if (analyticRes.status === "fulfilled") setAnalytics(analyticRes.value.data.data || null);
      } else if (isGuest) {
        initDefaultGuestData();
        const data = getGuestData();
        setTasks(data.tasks || []);
        setSubjects(data.subjects || []);
        setNotes(data.notes || []);
        setFocusHistory(data.focus_sessions || []);
        setAnalytics(computeLocalAnalytics(data));
      }
    } catch (err) {
      console.error("[StudyContext] Error loading data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isGuest, computeLocalAnalytics]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Tasks CRUD
  const createTask = async (payload) => {
    if (isAuthenticated) {
      const res = await tasksAPI.create(payload);
      triggerLumi("happy", "New task added! Let's get it done ✨");
      await refreshData();
      return res.data;
    } else {
      const item = addGuestItem("tasks", {
        ...payload,
        status: payload.status || "todo",
        created_at: new Date().toISOString(),
      });
      triggerLumi("happy", "New task added! Let's get it done ✨");
      await refreshData();
      return item;
    }
  };

  const updateTask = async (id, patch) => {
    if (isAuthenticated) {
      await tasksAPI.update(id, patch);
      await refreshData();
    } else {
      updateGuestItem("tasks", id, patch);
      await refreshData();
    }
  };

  const toggleTaskComplete = async (task) => {
    const nextStatus = task.status === "completed" ? "todo" : "completed";
    const patch = {
      status: nextStatus,
      completed_at: nextStatus === "completed" ? new Date().toISOString() : null,
    };
    if (nextStatus === "completed") {
      triggerLumi("happy", "Awesome job completing that task! 🎉");
    }
    await updateTask(task.id, patch);
  };

  const deleteTask = async (id) => {
    if (isAuthenticated) {
      await tasksAPI.remove(id);
      await refreshData();
    } else {
      removeGuestItem("tasks", id);
      await refreshData();
    }
  };

  // Subjects CRUD
  const createSubject = async (payload) => {
    if (isAuthenticated) {
      const res = await subjectsAPI.create(payload);
      await refreshData();
      return res.data;
    } else {
      const item = addGuestItem("subjects", {
        ...payload,
        created_at: new Date().toISOString(),
      });
      await refreshData();
      return item;
    }
  };

  const deleteSubject = async (id) => {
    if (isAuthenticated) {
      await subjectsAPI.remove(id);
      await refreshData();
    } else {
      removeGuestItem("subjects", id);
      await refreshData();
    }
  };

  // Notes CRUD
  const createNote = async (payload) => {
    if (isAuthenticated) {
      const res = await notesAPI.create(payload);
      triggerLumi("happy", "Note saved! 📝");
      await refreshData();
      return res.data;
    } else {
      const item = addGuestItem("notes", {
        ...payload,
        updated_at: new Date().toISOString(),
      });
      triggerLumi("happy", "Note saved! 📝");
      await refreshData();
      return item;
    }
  };

  const updateNote = async (id, patch) => {
    if (isAuthenticated) {
      await notesAPI.update(id, patch);
      await refreshData();
    } else {
      updateGuestItem("notes", id, { ...patch, updated_at: new Date().toISOString() });
      await refreshData();
    }
  };

  const deleteNote = async (id) => {
    if (isAuthenticated) {
      await notesAPI.remove(id);
      await refreshData();
    } else {
      removeGuestItem("notes", id);
      await refreshData();
    }
  };

  // Focus Session Lifecycle
  const startFocusSession = async ({ taskId = null, plannedMinutes = 25 }) => {
    triggerLumi("focusing", "Focus time! I'll read quietly with you 📖");
    if (isAuthenticated) {
      const res = await focusAPI.start({ task_id: taskId, planned_minutes: plannedMinutes });
      const sessionId = res.data.data.sessionId;
      const session = {
        id: sessionId,
        taskId,
        plannedMinutes,
        startedAt: new Date(),
      };
      setActiveSession(session);
      return session;
    } else {
      const item = addGuestItem("focus_sessions", {
        task_id: taskId,
        status: "in_progress",
        planned_minutes: plannedMinutes,
        elapsed_minutes: 0,
        started_at: new Date().toISOString(),
      });
      const session = {
        id: item.id,
        taskId,
        plannedMinutes,
        startedAt: new Date(),
      };
      setActiveSession(session);
      return session;
    }
  };

  const completeFocusSession = async ({ elapsedMinutes }) => {
    if (!activeSession) return;
    triggerLumi("happy", "Great session! You kept focused and learned deeply ✨");
    if (isAuthenticated) {
      await focusAPI.complete({
        session_id: activeSession.id,
        elapsed_minutes: elapsedMinutes,
      });
    } else {
      updateGuestItem("focus_sessions", activeSession.id, {
        status: "completed",
        elapsed_minutes: elapsedMinutes,
        ended_at: new Date().toISOString(),
      });
    }
    setActiveSession(null);
    await refreshData();
  };

  const abandonFocusSession = async ({ elapsedMinutes }) => {
    if (!activeSession) return;
    triggerLumi("neutral", "Every bit counts 🌱 We'll pick it up again soon.");
    if (isAuthenticated) {
      await focusAPI.abandon({
        session_id: activeSession.id,
        elapsed_minutes: elapsedMinutes,
      });
    } else {
      updateGuestItem("focus_sessions", activeSession.id, {
        status: "abandoned",
        elapsed_minutes: elapsedMinutes,
        ended_at: new Date().toISOString(),
      });
    }
    setActiveSession(null);
    await refreshData();
  };

  return (
    <StudyContext.Provider
      value={{
        tasks,
        subjects,
        notes,
        focusHistory,
        analytics,
        isLoading,
        activeSession,
        lumiState,
        triggerLumi,
        refreshData,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        createSubject,
        deleteSubject,
        createNote,
        updateNote,
        deleteNote,
        startFocusSession,
        completeFocusSession,
        abandonFocusSession,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error("useStudy must be used within a StudyProvider");
  }
  return context;
}
