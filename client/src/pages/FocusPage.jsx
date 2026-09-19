/**
 * StudyFlow — Focus Mode & Fullscreen Zen Mode
 * 
 * Deep study companion with Pomodoro cycles:
 * - 25m Focus / 5m Short Break / 15m Long Break / Custom duration
 * - Link sessions to pending course tasks
 * - Circular timer with Play / Pause / Complete / Abandon lifecycle
 * - Fullscreen Zen Mode overlay with ambient sound engine (Rain, Cafe, Wind, White Noise)
 * - Mute / Volume icon toggle
 * - Singing bowl chime on session completion
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Coffee,
  Sparkles,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  CloudRain,
  Wind,
  Radio,
} from "lucide-react";
import { useStudy } from "../context/StudyContext.jsx";
import { soundEngine } from "../utils/soundEngine.js";

const PRESETS = [
  { id: "pomodoro", label: "Focus", minutes: 25, icon: BookOpen },
  { id: "shortBreak", label: "Short Break", minutes: 5, icon: Coffee },
  { id: "longBreak", label: "Long Break", minutes: 15, icon: Sparkles },
];

const ATMOSPHERES = [
  { id: "rain", label: "Rain", icon: CloudRain },
  { id: "cafe", label: "Café", icon: Coffee },
  { id: "wind", label: "Wind", icon: Wind },
  { id: "white", label: "White Noise", icon: Radio },
];

export default function FocusPage() {
  const {
    tasks,
    activeSession,
    startFocusSession,
    completeFocusSession,
    abandonFocusSession,
    focusHistory,
  } = useStudy();

  const [selectedPreset, setSelectedPreset] = useState("pomodoro");
  const [targetMinutes, setTargetMinutes] = useState(25);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  // Timer state
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Zen mode & audio states
  const [isZenMode, setIsZenMode] = useState(false);
  const [activeAtmosphere, setActiveAtmosphere] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // Modals
  const [showAbandonModal, setShowAbandonModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const timerRef = useRef(null);

  // Escape key to exit Zen mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isZenMode) {
        setIsZenMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZenMode]);

  // Clean up sounds on unmount
  useEffect(() => {
    return () => {
      soundEngine.stopAtmosphere();
    };
  }, []);

  const handleSelectPreset = (preset) => {
    if (isRunning) return;
    setSelectedPreset(preset.id);
    setTargetMinutes(preset.minutes);
    setSecondsLeft(preset.minutes * 60);
    setElapsedSeconds(0);
  };

  // Timer countdown loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleAutoFinish();
            return 0;
          }
          return prev - 1;
        });
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleStart = async () => {
    if (!activeSession) {
      await startFocusSession({
        taskId: selectedTaskId ? Number(selectedTaskId) || selectedTaskId : null,
        plannedMinutes: targetMinutes,
      });
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleAutoFinish = async () => {
    soundEngine.playCompletionChime();
    const elapsedMinutes = Math.max(Math.round(elapsedSeconds / 60), 1);
    await completeFocusSession({ elapsedMinutes });
    setShowCompletionModal(true);
  };

  const handleManualComplete = async () => {
    soundEngine.playCompletionChime();
    setIsRunning(false);
    const elapsedMinutes = Math.max(Math.round(elapsedSeconds / 60), 1);
    await completeFocusSession({ elapsedMinutes });
    setShowCompletionModal(true);
  };

  const handleConfirmAbandon = async () => {
    setIsRunning(false);
    setShowAbandonModal(false);
    soundEngine.stopAtmosphere();
    setActiveAtmosphere(null);
    const elapsedMinutes = Math.round(elapsedSeconds / 60);
    await abandonFocusSession({ elapsedMinutes });
    setSecondsLeft(targetMinutes * 60);
    setElapsedSeconds(0);
  };

  // Sound Controls
  const handleToggleAtmosphere = (id) => {
    if (activeAtmosphere === id) {
      soundEngine.stopAtmosphere();
      setActiveAtmosphere(null);
    } else {
      soundEngine.playAtmosphere(id);
      setActiveAtmosphere(id);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
  };

  // Format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const totalSeconds = targetMinutes * 60;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const linkedTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto lg:px-12 lg:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-heading)] mb-1">Focus Mode</h1>
          <p className="text-xs text-[var(--color-secondary)]">
            Deep, uninterrupted study blocks. Immerse yourself with ambient soundscapes.
          </p>
        </div>

        {/* Enter Zen Mode Button */}
        <button
          onClick={() => setIsZenMode(true)}
          className="btn btn-secondary text-xs flex items-center gap-2 border-[var(--color-sage)] hover:bg-[var(--color-soft-mint)] self-start md:self-auto"
          title="Enter Fullscreen Zen Mode"
        >
          <Maximize2 size={14} className="text-[var(--color-forest)]" />
          <span>Enter Zen Fullscreen</span>
        </button>
      </div>

      {/* Preset Mode Tabs */}
      <div className="flex justify-center gap-2">
        {PRESETS.map((p) => {
          const Icon = p.icon;
          const isSelected = selectedPreset === p.id;
          return (
            <button
              key={p.id}
              disabled={isRunning}
              onClick={() => handleSelectPreset(p)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                isSelected
                  ? "bg-[var(--color-forest)] text-white shadow-sm"
                  : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--color-secondary)] hover:border-[var(--color-sage)]"
              } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Icon size={14} />
              {p.label} ({p.minutes}m)
            </button>
          );
        })}
      </div>

      {/* Task Linking Bar & Audio Tray */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
        {/* Task dropdown */}
        <div className="card p-2.5 flex items-center gap-2.5">
          <BookOpen size={16} className="text-[var(--color-sage)] shrink-0" />
          <select
            disabled={isRunning}
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="input text-xs py-1 w-full bg-transparent border-none focus:ring-0"
          >
            <option value="">(Optional) Link Coursework Task...</option>
            {pendingTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* Ambient audio selectors */}
        <div className="card p-2.5 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1">
            {ATMOSPHERES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleToggleAtmosphere(id)}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  activeAtmosphere === id
                    ? "bg-[var(--color-soft-mint)] text-[var(--color-forest)] font-bold border border-[var(--color-sage)]"
                    : "text-[var(--color-secondary)] hover:text-[var(--color-heading)]"
                }`}
                title={`Ambient ${label}`}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>

          {/* Mute toggle icon & volume */}
          <div className="flex items-center gap-2 border-l border-[var(--border-color)] pl-2">
            <button
              onClick={handleToggleMute}
              className={`p-1 rounded transition-colors ${
                isMuted
                  ? "text-rose-500 hover:text-rose-600"
                  : activeAtmosphere
                  ? "text-[var(--color-forest)] hover:text-[var(--color-heading)]"
                  : "text-[var(--color-secondary)] hover:text-[var(--color-heading)]"
              }`}
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1.5 accent-[var(--color-sage)] cursor-pointer"
              title="Atmosphere Volume"
            />
          </div>
        </div>
      </div>

      {/* Circular Timer Main Card */}
      <div className="card max-w-md mx-auto p-8 text-center space-y-6 flex flex-col items-center">
        {linkedTask && (
          <div className="px-3 py-1 rounded-full bg-[var(--color-soft-mint)] text-[var(--color-forest)] text-xs font-semibold truncate max-w-[260px]">
            Target: {linkedTask.title}
          </div>
        )}

        {/* Circular Clock Display */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="currentColor"
              strokeWidth="10"
              className="text-[var(--bg-primary)]"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="var(--color-sage)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center space-y-1">
            <span className="text-5xl font-bold tracking-tight text-[var(--color-heading)] font-mono">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-xs text-[var(--color-secondary)] uppercase tracking-wider font-semibold">
              {isRunning ? "Session in Progress" : secondsLeft === totalSeconds ? "Ready" : "Paused"}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="btn btn-primary px-8 py-2.5 text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-transform"
            >
              <Play size={16} className="fill-current" />
              {secondsLeft < totalSeconds ? "Resume" : "Start Focus"}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="btn btn-secondary px-8 py-2.5 text-sm flex items-center gap-2 border-[var(--color-sage)]"
            >
              <Pause size={16} />
              Pause
            </button>
          )}

          {elapsedSeconds > 0 && (
            <>
              <button
                onClick={handleManualComplete}
                className="btn btn-secondary p-2.5 rounded-full text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                title="Complete session now"
              >
                <CheckCircle2 size={18} />
              </button>
              <button
                onClick={() => setShowAbandonModal(true)}
                className="btn btn-secondary p-2.5 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                title="Abandon session"
              >
                <XCircle size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Focus Session History */}
      <div className="card space-y-4">
        <h2 className="text-lg font-bold text-[var(--color-heading)] flex items-center gap-2">
          <Clock size={18} className="text-[var(--color-sage)]" />
          Recent Focus Sessions
        </h2>

        {focusHistory.length === 0 ? (
          <p className="text-xs text-[var(--color-secondary)] py-6 text-center">
            No past focus sessions logged yet. Complete your first 25-minute Pomodoro!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-[var(--color-secondary)]">
                  <th className="pb-2 font-medium">Date &amp; Time</th>
                  <th className="pb-2 font-medium">Planned</th>
                  <th className="pb-2 font-medium">Elapsed</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {focusHistory.slice(0, 8).map((s) => {
                  const isCompleted = s.status === "completed";
                  const dateStr = s.started_at
                    ? new Date(s.started_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recent";

                  return (
                    <tr key={s.id} className="hover:bg-[var(--bg-primary)]/40">
                      <td className="py-2.5 text-[var(--color-heading)]">{dateStr}</td>
                      <td className="py-2.5 text-[var(--color-secondary)]">{s.planned_minutes} min</td>
                      <td className="py-2.5 font-semibold text-[var(--color-heading)]">{s.elapsed_minutes || 0} min</td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isCompleted
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {isCompleted ? "Completed" : "Abandoned"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── FULLSCREEN ZEN MODE OVERLAY ────────────────────────────── */}
      {isZenMode && (
        <div className="fixed inset-0 z-50 bg-[#16110F] text-[#EDE6DF] flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-300">
          {/* Top Bar of Zen Mode */}
          <div className="flex items-center justify-between">
            {/* Linked task or Mode indicator */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-semibold text-white/60">
                Zen Mode &bull; {selectedPreset === "pomodoro" ? "Focus" : "Break"}
              </span>
              {linkedTask && (
                <span className="ml-2 px-2.5 py-0.5 rounded-full bg-white/10 text-xs text-white/90 truncate max-w-[200px]">
                  {linkedTask.title}
                </span>
              )}
            </div>

            {/* Atmosphere & Mute button in Zen Mode */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                {ATMOSPHERES.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleToggleAtmosphere(id)}
                    className={`p-1.5 rounded-full text-xs transition-colors ${
                      activeAtmosphere === id
                        ? "bg-amber-500/30 text-amber-300 font-bold"
                        : "text-white/50 hover:text-white"
                    }`}
                    title={`Atmosphere: ${label}`}
                  >
                    <Icon size={14} />
                  </button>
                ))}

                {/* Instant Mute button */}
                <button
                  onClick={handleToggleMute}
                  className={`p-1.5 rounded-full transition-colors ml-1 ${
                    isMuted ? "text-rose-400" : "text-white/70 hover:text-white"
                  }`}
                  title={isMuted ? "Unmute" : "Mute sound"}
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
              </div>

              {/* Exit Zen Button */}
              <button
                onClick={() => setIsZenMode(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white/80 transition-colors"
                title="Exit Zen Fullscreen (Esc)"
              >
                <Minimize2 size={13} />
                <span className="hidden sm:inline">Exit (Esc)</span>
              </button>
            </div>
          </div>

          {/* Center Zen Timer */}
          <div className="my-auto flex flex-col items-center justify-center space-y-8">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="42%"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="42%"
                  stroke="#DDA16E"
                  strokeWidth="8"
                  strokeDasharray="1100"
                  strokeDashoffset={1100 - progressRatio * 1100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear drop-shadow-[0_0_15px_rgba(221,161,110,0.4)]"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center space-y-2 text-center">
                <span className="text-6xl sm:text-7xl font-extrabold tracking-tight font-mono text-white">
                  {formatTime(secondsLeft)}
                </span>
                <p className="text-xs uppercase tracking-widest text-white/50 font-medium">
                  {isRunning ? "Deep Focus In Progress" : "Paused"}
                </p>
              </div>
            </div>

            {/* Zen Controls */}
            <div className="flex items-center gap-4">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="px-8 py-3 rounded-full bg-[#DDA16E] hover:bg-[#C27038] text-[#16110F] text-sm font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
                >
                  <Play size={16} className="fill-current" />
                  <span>Resume</span>
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold flex items-center gap-2 transition-colors"
                >
                  <Pause size={16} />
                  <span>Pause</span>
                </button>
              )}

              {elapsedSeconds > 0 && (
                <button
                  onClick={handleManualComplete}
                  className="p-3 rounded-full bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
                  title="Complete Session"
                >
                  <CheckCircle2 size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Bottom Zen Quote */}
          <div className="text-center text-xs text-white/40 flex items-center justify-center gap-2">
            <span>🌱</span>
            <span>&ldquo;Flow is where focus meets calm effort.&rdquo;</span>
          </div>
        </div>
      )}

      {/* Abandon Confirm Modal */}
      {showAbandonModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-sm space-y-4 shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <AlertTriangle size={36} className="mx-auto text-amber-500" />
            <h3 className="text-base font-bold text-[var(--color-heading)]">End session early?</h3>
            <p className="text-xs text-[var(--color-secondary)] leading-relaxed">
              Your elapsed focus time ({Math.round(elapsedSeconds / 60)} min) will be saved in your history. Abandoned sessions do not count toward streaks.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setShowAbandonModal(false)}
                className="btn btn-secondary text-xs"
              >
                Keep Focusing
              </button>
              <button
                onClick={handleConfirmAbandon}
                className="btn btn-primary text-xs bg-rose-600 hover:bg-rose-700 text-white"
              >
                End &amp; Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Completed Celebration Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card w-full max-w-sm space-y-4 shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <Sparkles size={40} className="mx-auto text-[var(--color-sage)] animate-bounce" />
            <h3 className="text-lg font-bold text-[var(--color-heading)]">Session Complete! 🎉</h3>
            <p className="text-xs text-[var(--color-secondary)] leading-relaxed">
              Incredible dedication! You completed your planned deep work block. Lumi is celebrating with you!
            </p>
            <button
              onClick={() => {
                setShowCompletionModal(false);
                setIsZenMode(false);
                setSecondsLeft(targetMinutes * 60);
                setElapsedSeconds(0);
              }}
              className="btn btn-primary text-xs w-full"
            >
              Back to StudyFlow
            </button>
          </div>
        </div>
      )}
    </div>
  );
}