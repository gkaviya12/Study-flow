/**
 * StudyFlow — Quick Scratchpad / Brain Dump
 * 
 * Floating distraction-free scratchpad:
 * - Capture stray thoughts during study sessions without leaving the screen
 * - Autosaves instantly to localStorage
 * - Quick "Convert to Task" button to send directly to Planner
 */

import React, { useState, useEffect } from "react";
import { StickyNote, X, Plus, Check, Trash2, ArrowUpRight } from "lucide-react";
import { useStudy } from "../context/StudyContext.jsx";

const SCRATCHPAD_KEY = "sf-scratchpad-content";

export default function QuickScratchpad() {
  const { createTask } = useStudy();
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(() => {
    return localStorage.getItem(SCRATCHPAD_KEY) || "";
  });
  const [copiedTaskAlert, setCopiedTaskAlert] = useState(false);

  useEffect(() => {
    localStorage.setItem(SCRATCHPAD_KEY, content);
  }, [content]);

  const handleConvertToTask = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    // Take the first line as task title
    const lines = trimmed.split("\n").filter((l) => l.trim().length > 0);
    const taskTitle = lines[0].replace(/^[-*•]\s*/, "");

    await createTask({
      title: taskTitle,
      priority: "medium",
      status: "todo",
      due_date: new Date().toISOString().split("T")[0],
      estimated_minutes: 25,
      recurrence: "none",
    });

    setCopiedTaskAlert(true);
    setTimeout(() => setCopiedTaskAlert(false), 2500);
  };

  const handleClear = () => {
    if (window.confirm("Clear scratchpad?")) {
      setContent("");
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Left outside sidebar) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed bottom-20 lg:bottom-6 left-4 lg:left-72 z-40 px-3.5 py-2.5 rounded-full border shadow-lg flex items-center gap-2 text-xs font-semibold transition-all hover:scale-105 active:scale-95 ${
          isOpen
            ? "bg-[var(--color-primary)] text-[var(--color-primary-text)] border-[var(--color-primary)]"
            : "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--color-heading)] hover:border-[var(--color-sage)]"
        }`}
        title="Quick Brain Dump Scratchpad"
      >
        <StickyNote size={15} className={isOpen ? "text-amber-300" : "text-[var(--color-sage)]"} />
        <span className="hidden sm:inline">Brain Dump</span>
      </button>

      {/* Slide-out Scratchpad Card */}
      {isOpen && (
        <div className="fixed bottom-32 lg:bottom-20 left-4 lg:left-72 z-50 w-[300px] sm:w-[350px] card p-4 shadow-2xl border border-[var(--border-color)] space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2">
              <StickyNote size={16} className="text-[var(--color-sage)]" />
              <span className="text-xs font-bold text-[var(--color-heading)]">Study Scratchpad</span>
            </div>
            <div className="flex items-center gap-1.5">
              {content.trim() && (
                <button
                  onClick={handleClear}
                  className="p-1 text-[var(--color-secondary)] hover:text-rose-600 rounded"
                  title="Clear note"
                >
                  <Trash2 size={13} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-[var(--color-secondary)] hover:text-[var(--color-heading)] rounded"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <textarea
            rows="5"
            placeholder="Jot down stray thoughts, things to Google later, or to-do notes..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input text-xs leading-relaxed bg-[var(--bg-primary)] resize-none border-[var(--border-color)]"
            autoFocus
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-[var(--color-secondary)]">Auto-saves locally</span>
            {content.trim() && (
              <button
                onClick={handleConvertToTask}
                className="btn btn-primary text-[11px] py-1 px-2.5 flex items-center gap-1"
                title="Convert first line to a task in Planner"
              >
                {copiedTaskAlert ? (
                  <>
                    <Check size={12} /> Task Created!
                  </>
                ) : (
                  <>
                    <ArrowUpRight size={12} /> Send to Planner
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
