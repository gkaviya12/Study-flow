/**
 * StudyFlow V2 — Planner Module
 * 
 * 4 Synchronized Views:
 * 1. List View (Search, filter by subject & priority, recurrence, CRUD)
 * 2. Kanban Board (To Do, In Progress, Completed columns with quick move)
 * 3. Calendar View (Interactive monthly grid, day inspection)
 * 4. Notes View (Subject-based notes, search, checklists)
 */

import React, { useState, useMemo } from "react";
import {
  List,
  LayoutGrid,
  Calendar as CalendarIcon,
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Repeat,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Tag,
  ArrowRight,
  ArrowLeft,
  X,
} from "lucide-react";
import { useStudy } from "../context/StudyContext.jsx";

export default function PlannerPage() {
  const {
    tasks,
    subjects,
    notes,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    createSubject,
    deleteSubject,
    createNote,
    updateNote,
    deleteNote,
  } = useStudy();

  const [activeTab, setActiveTab] = useState("list"); // list | kanban | calendar | notes

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");

  // Task Modal state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    subject_id: "",
    category: "General",
    priority: "medium",
    status: "todo",
    due_date: new Date().toISOString().split("T")[0],
    estimated_minutes: 30,
    recurrence: "none",
  });

  // Note Modal state
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({
    title: "",
    subject_id: "",
    content: "",
    tags: "",
    is_checklist: false,
  });

  // Subject Modal state
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectColor, setNewSubjectColor] = useState("#6FAF8F");

  // Calendar State
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDayTasks, setSelectedDayTasks] = useState(null);

  // Subject lookup map
  const subjectMap = useMemo(() => {
    const map = {};
    subjects.forEach((s) => {
      map[s.id] = s;
    });
    return map;
  }, [subjects]);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchCategory = task.category?.toLowerCase().includes(q);
        if (!matchTitle && !matchCategory) return false;
      }
      if (selectedSubjectFilter !== "all" && task.subject_id !== selectedSubjectFilter) {
        return false;
      }
      if (selectedPriorityFilter !== "all" && task.priority !== selectedPriorityFilter) {
        return false;
      }
      if (selectedStatusFilter !== "all" && task.status !== selectedStatusFilter) {
        return false;
      }
      return true;
    });
  }, [tasks, searchQuery, selectedSubjectFilter, selectedPriorityFilter, selectedStatusFilter]);

  // Open task modal for create / edit
  const handleOpenTaskModal = (task = null, initialStatus = "todo") => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        title: task.title,
        subject_id: task.subject_id || "",
        category: task.category || "General",
        priority: task.priority || "medium",
        status: task.status || "todo",
        due_date: task.due_date ? task.due_date.split("T")[0] : "",
        estimated_minutes: task.estimated_minutes || 30,
        recurrence: task.recurrence || "none",
      });
    } else {
      setEditingTask(null);
      setTaskForm({
        title: "",
        subject_id: subjects[0]?.id || "",
        category: "General",
        priority: "medium",
        status: initialStatus,
        due_date: new Date().toISOString().split("T")[0],
        estimated_minutes: 30,
        recurrence: "none",
      });
    }
    setTaskModalOpen(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    const payload = {
      ...taskForm,
      subject_id: taskForm.subject_id || null,
      estimated_minutes: Number(taskForm.estimated_minutes) || 30,
    };

    if (editingTask) {
      await updateTask(editingTask.id, payload);
    } else {
      await createTask(payload);
    }
    setTaskModalOpen(false);
  };

  // Open note modal for create / edit
  const handleOpenNoteModal = (note = null) => {
    if (note) {
      setEditingNote(note);
      setNoteForm({
        title: note.title,
        subject_id: note.subject_id || "",
        content: note.content || "",
        tags: note.tags || "",
        is_checklist: Boolean(note.is_checklist),
      });
    } else {
      setEditingNote(null);
      setNoteForm({
        title: "",
        subject_id: subjects[0]?.id || "",
        content: "",
        tags: "",
        is_checklist: false,
      });
    }
    setNoteModalOpen(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!noteForm.title.trim()) return;

    const payload = {
      ...noteForm,
      subject_id: noteForm.subject_id || null,
      is_checklist: noteForm.is_checklist ? 1 : 0,
    };

    if (editingNote) {
      await updateNote(editingNote.id, payload);
    } else {
      await createNote(payload);
    }
    setNoteModalOpen(false);
  };

  // Add Subject
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    await createSubject({
      name: newSubjectName.trim(),
      color: newSubjectColor,
    });
    setNewSubjectName("");
    setSubjectModalOpen(false);
  };

  // Calendar Helpers
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCalendarDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCalendarDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto lg:px-12 lg:py-10 space-y-6">
      {/* Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-heading)] mb-1">Study Planner</h1>
          <p className="text-[var(--color-secondary)]">
            Manage your coursework across list, visual board, calendar schedule, and subject notes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubjectModalOpen(true)}
            className="btn btn-secondary text-xs"
          >
            Subjects ({subjects.length})
          </button>
          <button
            onClick={() => handleOpenTaskModal()}
            className="btn btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus size={14} /> Add Task
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-color)] gap-2">
        {[
          { id: "list", label: "List View", icon: List },
          { id: "kanban", label: "Kanban Board", icon: LayoutGrid },
          { id: "calendar", label: "Calendar", icon: CalendarIcon },
          { id: "notes", label: "Notes", icon: BookOpen },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`pb-3 px-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${
              activeTab === id
                ? "border-[var(--color-forest)] text-[var(--color-forest)] font-semibold"
                : "border-transparent text-[var(--color-secondary)] hover:text-[var(--color-heading)]"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* ─── TAB 1: LIST VIEW ────────────────────────────────────────── */}
      {activeTab === "list" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="card p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[220px]">
              <Search size={16} className="text-[var(--color-secondary)] shrink-0" />
              <input
                type="text"
                placeholder="Search tasks by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input text-xs py-1.5 w-full"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="input py-1.5 text-xs"
              >
                <option value="all">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedPriorityFilter}
                onChange={(e) => setSelectedPriorityFilter(e.target.value)}
                className="input py-1.5 text-xs"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="input py-1.5 text-xs"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Tasks List */}
          {filteredTasks.length === 0 ? (
            <div className="card text-center py-16 text-[var(--color-secondary)]">
              <CheckCircle2 size={44} className="mx-auto mb-3 text-[var(--color-sage)]/60" />
              <p className="text-base font-semibold text-[var(--color-heading)]">No tasks match your criteria</p>
              <p className="text-xs mt-1">Try adjusting your filters or create a new assignment.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task) => {
                const isCompleted = task.status === "completed";
                const subj = subjectMap[task.subject_id];

                return (
                  <div
                    key={task.id}
                    className={`card p-3.5 flex items-center justify-between gap-3 transition-all ${
                      isCompleted ? "opacity-60 bg-[var(--bg-primary)]/40" : "hover:border-[var(--color-sage)]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleTaskComplete(task)}
                        className="text-[var(--color-secondary)] hover:text-[var(--color-forest)] shrink-0 transition-colors"
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={20} className="text-[var(--color-forest)] fill-[var(--color-soft-mint)]" />
                        ) : (
                          <Circle size={20} />
                        )}
                      </button>

                      <div className="min-w-0">
                        <p className={`text-sm font-medium text-[var(--color-heading)] truncate ${isCompleted ? "line-through text-[var(--color-secondary)]" : ""}`}>
                          {task.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[var(--color-secondary)]">
                          {subj && (
                            <span
                              className="px-2 py-0.5 rounded-md font-medium text-[10px]"
                              style={{ backgroundColor: `${subj.color}25`, color: subj.color }}
                            >
                              {subj.name}
                            </span>
                          )}
                          {task.due_date && (
                            <span className="flex items-center gap-1">
                              <CalendarIcon size={11} /> {task.due_date.split("T")[0]}
                            </span>
                          )}
                          {task.estimated_minutes && (
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> {task.estimated_minutes}m
                            </span>
                          )}
                          {task.recurrence && task.recurrence !== "none" && (
                            <span className="flex items-center gap-1 text-[var(--color-forest)]">
                              <Repeat size={11} /> {task.recurrence}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
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
                      <button
                        onClick={() => handleOpenTaskModal(task)}
                        className="p-1 text-[var(--color-secondary)] hover:text-[var(--color-heading)] rounded"
                        title="Edit Task"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-[var(--color-secondary)] hover:text-rose-600 rounded"
                        title="Delete Task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: KANBAN BOARD ────────────────────────────────────── */}
      {activeTab === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: "todo", title: "To Do", bg: "bg-amber-500/10 text-amber-600" },
            { id: "in_progress", title: "In Progress", bg: "bg-blue-500/10 text-blue-600" },
            { id: "completed", title: "Completed", bg: "bg-emerald-500/10 text-emerald-600" },
          ].map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);

            return (
              <div key={col.id} className="card p-4 flex flex-col space-y-3 bg-[var(--bg-primary)]/40 border border-[var(--border-color)]">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${col.bg}`}>
                      {col.title}
                    </span>
                    <span className="text-xs text-[var(--color-secondary)]">({colTasks.length})</span>
                  </div>
                  <button
                    onClick={() => handleOpenTaskModal(null, col.id)}
                    className="text-[var(--color-secondary)] hover:text-[var(--color-heading)]"
                    title={`Add task to ${col.title}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="space-y-2.5 flex-1 min-h-[300px]">
                  {colTasks.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-[var(--border-color)] rounded-xl flex items-center justify-center text-xs text-[var(--color-secondary)]">
                      Empty column
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const subj = subjectMap[task.subject_id];

                      return (
                        <div
                          key={task.id}
                          className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs hover:border-[var(--color-sage)] transition-all space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-[var(--color-heading)] leading-snug">
                              {task.title}
                            </p>
                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                task.priority === "high"
                                  ? "bg-rose-100 text-rose-700"
                                  : task.priority === "medium"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          {subj && (
                            <span
                              className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium"
                              style={{ backgroundColor: `${subj.color}25`, color: subj.color }}
                            >
                              {subj.name}
                            </span>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]/50 text-[10px] text-[var(--color-secondary)]">
                            <span>{task.due_date ? task.due_date.split("T")[0] : "No date"}</span>
                            <div className="flex items-center gap-1">
                              {col.id !== "todo" && (
                                <button
                                  onClick={() =>
                                    updateTask(task.id, {
                                      status: col.id === "completed" ? "in_progress" : "todo",
                                    })
                                  }
                                  className="p-1 hover:text-[var(--color-heading)]"
                                  title="Move Left"
                                >
                                  <ArrowLeft size={12} />
                                </button>
                              )}
                              {col.id !== "completed" && (
                                <button
                                  onClick={() =>
                                    updateTask(task.id, {
                                      status: col.id === "todo" ? "in_progress" : "completed",
                                      completed_at: col.id === "in_progress" ? new Date().toISOString() : null,
                                    })
                                  }
                                  className="p-1 hover:text-[var(--color-heading)]"
                                  title="Move Right"
                                >
                                  <ArrowRight size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── TAB 3: CALENDAR VIEW ────────────────────────────────────── */}
      {activeTab === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card space-y-4">
            {/* Calendar Month Navigation */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--color-heading)]">
                {monthNames[month]} {year}
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-primary)]"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-primary)]"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[var(--color-secondary)] py-1">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[70px] p-1 rounded-lg bg-[var(--bg-primary)]/30 opacity-40" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const formattedMonth = String(month + 1).padStart(2, "0");
                const formattedDay = String(dayNum).padStart(2, "0");
                const dateKey = `${year}-${formattedMonth}-${formattedDay}`;

                const dayTasks = tasks.filter((t) => t.due_date && t.due_date.startsWith(dateKey));
                const isSelected = selectedDayTasks?.date === dateKey;

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => setSelectedDayTasks({ date: dateKey, tasks: dayTasks })}
                    className={`min-h-[70px] p-1.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? "border-[var(--color-forest)] bg-[var(--color-soft-mint)]/30 ring-1 ring-[var(--color-forest)]"
                        : "border-[var(--border-color)] hover:border-[var(--color-sage)] bg-[var(--bg-card)]"
                    }`}
                  >
                    <span className="text-xs font-semibold text-[var(--color-heading)]">{dayNum}</span>
                    <div className="space-y-0.5 overflow-hidden">
                      {dayTasks.slice(0, 2).map((t) => (
                        <div
                          key={t.id}
                          className="text-[9px] truncate px-1 rounded bg-[var(--color-soft-mint)] text-[var(--color-forest)] font-medium"
                        >
                          {t.title}
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <span className="text-[8px] text-[var(--color-secondary)] block">
                          +{dayTasks.length - 2} more
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Details Panel */}
          <div className="card space-y-4">
            <h3 className="text-base font-semibold text-[var(--color-heading)] flex items-center gap-2">
              <CalendarIcon size={16} className="text-[var(--color-sage)]" />
              {selectedDayTasks ? `Schedule for ${selectedDayTasks.date}` : "Select a Date"}
            </h3>

            {!selectedDayTasks ? (
              <p className="text-xs text-[var(--color-secondary)] py-6 text-center">
                Click any day in the calendar to inspect or add scheduled coursework.
              </p>
            ) : selectedDayTasks.tasks.length === 0 ? (
              <div className="py-6 text-center space-y-2">
                <p className="text-xs text-[var(--color-secondary)]">No tasks scheduled for this date.</p>
                <button
                  onClick={() => {
                    setTaskForm((prev) => ({ ...prev, due_date: selectedDayTasks.date }));
                    setTaskModalOpen(true);
                  }}
                  className="btn btn-primary text-xs"
                >
                  Schedule Task on This Day
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDayTasks.tasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[var(--color-heading)]">{t.title}</span>
                      <span className="text-[9px] uppercase font-bold">{t.priority}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[var(--color-secondary)]">
                      <span>Status: {t.status}</span>
                      <span>{t.estimated_minutes} min</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 4: NOTES VIEW ──────────────────────────────────────── */}
      {activeTab === "notes" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[var(--color-secondary)]">
              Store assignment briefs, lecture takeaways, and exam cheatsheets organized by subject.
            </p>
            <button
              onClick={() => handleOpenNoteModal()}
              className="btn btn-primary text-xs flex items-center gap-1.5"
            >
              <Plus size={14} /> New Note
            </button>
          </div>

          {notes.length === 0 ? (
            <div className="card text-center py-16 text-[var(--color-secondary)]">
              <BookOpen size={44} className="mx-auto mb-3 text-[var(--color-sage)]/60" />
              <p className="text-base font-semibold text-[var(--color-heading)]">Your notebook is empty</p>
              <p className="text-xs mt-1">Capture key ideas, checklists, and revision summaries.</p>
              <button
                onClick={() => handleOpenNoteModal()}
                className="btn btn-secondary text-xs mt-4"
              >
                Create First Note
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => {
                const subj = subjectMap[note.subject_id];

                return (
                  <div
                    key={note.id}
                    className="card p-4 flex flex-col justify-between space-y-3 hover:border-[var(--color-sage)] transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-[var(--color-heading)]">{note.title}</h3>
                        {subj && (
                          <span
                            className="text-[9px] font-semibold px-2 py-0.5 rounded"
                            style={{ backgroundColor: `${subj.color}20`, color: subj.color }}
                          >
                            {subj.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-secondary)] whitespace-pre-line line-clamp-4 leading-relaxed">
                        {note.content || "(No content)"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)] text-[11px] text-[var(--color-secondary)]">
                      <span>{note.tags ? `#${note.tags}` : "Untagged"}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenNoteModal(note)}
                          className="p-1 hover:text-[var(--color-heading)]"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-1 hover:text-rose-600"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── TASK MODAL ─────────────────────────────────────────────── */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-lg space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--color-heading)]">
                {editingTask ? "Edit Task" : "Create New Task"}
              </h3>
              <button
                onClick={() => setTaskModalOpen(false)}
                className="text-[var(--color-secondary)] hover:text-[var(--color-heading)] text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve Linear Algebra Exercise 3"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="input text-sm"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Subject</label>
                  <select
                    value={taskForm.subject_id}
                    onChange={(e) => setTaskForm({ ...taskForm, subject_id: e.target.value })}
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
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="input text-xs"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Status</label>
                  <select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                    className="input text-xs"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskForm.due_date}
                    onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                    className="input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Est. Minutes</label>
                  <input
                    type="number"
                    min="5"
                    max="360"
                    value={taskForm.estimated_minutes}
                    onChange={(e) => setTaskForm({ ...taskForm, estimated_minutes: e.target.value })}
                    className="input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Recurrence</label>
                <select
                  value={taskForm.recurrence}
                  onChange={(e) => setTaskForm({ ...taskForm, recurrence: e.target.value })}
                  className="input text-xs"
                >
                  <option value="none">None (Single Task)</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="weekdays">Weekdays Only</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setTaskModalOpen(false)}
                  className="btn btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  {editingTask ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── NOTE MODAL ─────────────────────────────────────────────── */}
      {noteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-lg space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--color-heading)]">
                {editingNote ? "Edit Note" : "Create Study Note"}
              </h3>
              <button
                onClick={() => setNoteModalOpen(false)}
                className="text-[var(--color-secondary)] hover:text-[var(--color-heading)] text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems: Deadlock Conditions"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  className="input text-sm"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Subject</label>
                  <select
                    value={noteForm.subject_id}
                    onChange={(e) => setNoteForm({ ...noteForm, subject_id: e.target.value })}
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
                  <label className="block text-xs font-medium mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="theory, formulas, exam"
                    value={noteForm.tags}
                    onChange={(e) => setNoteForm({ ...noteForm, tags: e.target.value })}
                    className="input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Content</label>
                <textarea
                  rows="5"
                  placeholder="Jot down notes, bullet points, and key equations..."
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  className="input text-xs leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setNoteModalOpen(false)}
                  className="btn btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  {editingNote ? "Update Note" : "Save Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── SUBJECTS MANAGEMENT MODAL ──────────────────────────────── */}
      {subjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-md space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[var(--color-heading)]">Manage Subjects</h3>
              <button
                onClick={() => setSubjectModalOpen(false)}
                className="text-[var(--color-secondary)] hover:text-[var(--color-heading)] text-lg"
              >
                &times;
              </button>
            </div>

            {/* List of existing subjects */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {subjects.length === 0 ? (
                <p className="text-xs text-[var(--color-secondary)]">No subjects created yet.</p>
              ) : (
                subjects.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: s.color || "#6FAF8F" }}
                      />
                      <span className="text-xs font-semibold text-[var(--color-heading)]">{s.name}</span>
                    </div>
                    <button
                      onClick={() => deleteSubject(s.id)}
                      className="text-[var(--color-secondary)] hover:text-rose-600 p-1"
                      title="Delete Subject"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add new subject form */}
            <form onSubmit={handleCreateSubject} className="space-y-3 pt-3 border-t border-[var(--border-color)]">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input
                    type="text"
                    required
                    placeholder="New subject name..."
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="input text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newSubjectColor}
                    onChange={(e) => setNewSubjectColor(e.target.value)}
                    className="w-10 h-8 p-0.5 rounded cursor-pointer border border-[var(--border-color)]"
                    title="Choose color"
                  />
                  <button type="submit" className="btn btn-primary text-xs w-full">
                    Add
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}