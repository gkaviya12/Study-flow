/**
 * StudyFlow — Guest Mode localStorage Helpers
 *
 * In guest mode, the user has not registered or logged in. The server has
 * no record of them, and they cannot make authenticated API calls. To
 * still let them use the planner / notes / focus features, we mirror the
 * relevant server data shapes in localStorage under a single key.
 *
 * The shape matches what the server expects from POST /auth/migrate-guest-data:
 *   { tasks: [...], notes: [...], subjects: [...], focus_sessions: [...] }
 *
 * On register, AuthContext.migrateGuestData() reads this blob, POSTs it to
 * the server, and clears it.
 *
 * Guest IDs are strings with a "g_" prefix (e.g. "g_42") so we can tell
 * them apart from server-issued integer IDs and never accidentally clash.
 */

const STORAGE_KEY = "sf-guest-data";

const TABLES = ["subjects", "tasks", "notes", "focus_sessions"];

const emptyData = () => ({
  subjects: [],
  tasks: [],
  notes: [],
  focus_sessions: [],
});

const safeParse = (raw) => {
  if (!raw) return emptyData();
  try {
    const parsed = JSON.parse(raw);
    // Defensive: only return keys we know about
    const out = emptyData();
    for (const t of TABLES) {
      if (Array.isArray(parsed[t])) out[t] = parsed[t];
    }
    return out;
  } catch {
    return emptyData();
  }
};

export const getGuestData = () => {
  if (typeof window === "undefined") return emptyData();
  return safeParse(localStorage.getItem(STORAGE_KEY));
};

const writeAll = (data) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const setGuestData = (data) => {
  // Replace the entire blob (used by tests, and by data-loading code paths
  // that already have a full object).
  const sanitized = emptyData();
  for (const t of TABLES) {
    if (Array.isArray(data?.[t])) sanitized[t] = data[t];
  }
  writeAll(sanitized);
};

export const addGuestItem = (table, item) => {
  if (!TABLES.includes(table)) {
    throw new Error(`Unknown guest table: ${table}`);
  }
  const data = getGuestData();
  // Assign a guest ID if the caller didn't provide one
  const next = {
    ...item,
    id: item.id ?? `g_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  };
  data[table] = [...data[table], next];
  writeAll(data);
  return next;
};

export const updateGuestItem = (table, id, patch) => {
  if (!TABLES.includes(table)) {
    throw new Error(`Unknown guest table: ${table}`);
  }
  const data = getGuestData();
  data[table] = data[table].map((row) => (row.id === id ? { ...row, ...patch } : row));
  writeAll(data);
  return data[table].find((row) => row.id === id) ?? null;
};

export const removeGuestItem = (table, id) => {
  if (!TABLES.includes(table)) {
    throw new Error(`Unknown guest table: ${table}`);
  }
  const data = getGuestData();
  data[table] = data[table].filter((row) => row.id !== id);
  writeAll(data);
};

export const clearGuestData = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
};

export const hasGuestData = () => {
  const data = getGuestData();
  return TABLES.some((t) => data[t].length > 0);
};

export const initDefaultGuestData = () => {
  if (hasGuestData()) return;
  const csId = "g_subj_cs";
  const mathId = "g_subj_math";
  const litId = "g_subj_lit";

  const defaultData = {
    subjects: [
      { id: csId, name: "Computer Science", color: "#6FAF8F", created_at: new Date().toISOString() },
      { id: mathId, name: "Mathematics", color: "#F6C453", created_at: new Date().toISOString() },
      { id: litId, name: "Literature", color: "#8EAFC8", created_at: new Date().toISOString() },
    ],
    tasks: [
      {
        id: "g_task_1",
        subject_id: csId,
        title: "Review Chapter 4: Graph Algorithms",
        category: "Study",
        priority: "high",
        status: "todo",
        due_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        estimated_minutes: 45,
        recurrence: "none",
        created_at: new Date().toISOString(),
      },
      {
        id: "g_task_2",
        subject_id: mathId,
        title: "Complete Calculus Problem Set #3",
        category: "Assignment",
        priority: "medium",
        status: "in_progress",
        due_date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
        estimated_minutes: 60,
        recurrence: "none",
        created_at: new Date().toISOString(),
      },
      {
        id: "g_task_3",
        subject_id: litId,
        title: "Read Essay on Modernist Poetry",
        category: "Reading",
        priority: "low",
        status: "completed",
        due_date: new Date().toISOString().split("T")[0],
        estimated_minutes: 30,
        recurrence: "none",
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      },
    ],
    notes: [
      {
        id: "g_note_1",
        subject_id: csId,
        title: "Dijkstra & A* Pathfinding",
        content: "Priority queue with min-heap.\nDistance array initialized to Infinity.\nRelax edges greedily.",
        tags: "algorithms, graph",
        is_checklist: 0,
        updated_at: new Date().toISOString(),
      },
    ],
    focus_sessions: [
      {
        id: "g_focus_1",
        task_id: "g_task_3",
        status: "completed",
        planned_minutes: 25,
        elapsed_minutes: 25,
        started_at: new Date(Date.now() - 3600000).toISOString(),
        ended_at: new Date(Date.now() - 2100000).toISOString(),
      },
    ],
  };

  writeAll(defaultData);
};
