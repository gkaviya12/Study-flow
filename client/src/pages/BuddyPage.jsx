/**
 * StudyFlow — Buddy Page (Lumi's Sanctuary & Evolution Milestones)
 *
 * Dedicated space for Lumi the study companion:
 * - Sanctuary ambience & mood testing
 * - Evolution Milestones (Scholar Glasses, Espresso Mug, Golden Aura)
 * - Companionship stats & study affirmations
 * - Calming ambient atmospheres
 */

import React, { useState } from "react";
import {
  Sparkles,
  Heart,
  BookOpen,
  Moon,
  Coffee,
  CloudRain,
  Wind,
  MessageCircle,
  CheckCircle2,
  Lock,
  Award,
} from "lucide-react";
import { useStudy } from "../context/StudyContext.jsx";
import { soundEngine } from "../utils/soundEngine.js";

const AFFIRMATIONS = [
  "You don't have to be great to start, but you have to start to be great.",
  "Progress isn't linear. Every small effort compounds over time.",
  "Deep focus is a superpower in a distracted world.",
  "Breathe deeply. Trust your intelligence and your work ethic.",
  "Rest when you're weary, not when you're done.",
];

export default function BuddyPage() {
  const { lumiState, triggerLumi, focusHistory, tasks, analytics } = useStudy();

  const [currentAffirmation, setCurrentAffirmation] = useState(AFFIRMATIONS[0]);
  const [activeSound, setActiveSound] = useState(null);

  const completedFocusSessions = focusHistory.filter((s) => s.status === "completed").length;
  const completedTasksCount = tasks.filter((t) => t.status === "completed").length;
  const streakDays = analytics?.streak || 0;

  // Evolution unlocks
  const hasGlasses = completedFocusSessions >= 2;
  const hasCoffeeMug = completedFocusSessions >= 4;
  const hasHalo = streakDays >= 2;

  const handleMoodChange = (mood, text) => {
    triggerLumi(mood, text, 5000);
  };

  const getRandomAffirmation = () => {
    const next = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
    setCurrentAffirmation(next);
    triggerLumi("happy", "Here's a thought for you today ✨");
  };

  const toggleSound = (soundId) => {
    if (activeSound === soundId) {
      soundEngine.stopAtmosphere();
      setActiveSound(null);
    } else {
      soundEngine.playAtmosphere(soundId);
      setActiveSound(soundId);
    }
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto lg:px-12 lg:py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-heading)] mb-1 flex items-center gap-2.5">
          <span>Meet Lumi</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-soft-mint)] text-[var(--color-forest)] font-bold">
            Virtual Study Companion
          </span>
        </h1>
        <p className="text-xs md:text-sm text-[var(--color-secondary)]">
          Your gentle forest guide that evolves and celebrates your academic consistency.
        </p>
      </div>

      {/* Main Sanctuary Card */}
      <div className="card bg-gradient-to-br from-[var(--bg-card)] to-[var(--color-soft-mint)]/40 border border-[var(--border-color)] p-8 text-center relative overflow-hidden">
        <div className="max-w-md mx-auto space-y-5">
          {/* Sprite */}
          <div className="relative inline-block">
            <div className="w-28 h-28 mx-auto animate-bounce-gentle">
              <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
                {hasHalo && (
                  <>
                    <ellipse cx="32" cy="4" rx="14" ry="3" stroke="#F59E0B" strokeWidth="1.8" fill="none" opacity="0.9" />
                    <circle cx="32" cy="4" r="1.5" fill="#FDE68A" />
                  </>
                )}
                <circle cx="32" cy="34" r="26" fill="var(--color-mint)" opacity="0.35" />
                <path d="M 32 14 Q 29 8, 24 6 Q 33 8, 32 14 Z" fill="var(--color-mint)" />
                <path d="M 32 14 Q 36 9, 41 7 Q 35 10, 32 14 Z" fill="var(--lumi-leaf)" />
                <line x1="32" y1="14" x2="32" y2="19" stroke="var(--color-forest)" strokeWidth="2" strokeLinecap="round" />
                <path d="M 15 25 C 15 17, 49 17, 49 25 C 52 35, 51 48, 32 48 C 13 48, 12 35, 15 25 Z" fill="var(--lumi-hoodie)" />
                <ellipse cx="32" cy="33" rx="12" ry="10" fill="#FDFBF7" />
                <ellipse cx="24" cy="35" rx="2.5" ry="1.5" fill="#F4A79D" opacity="0.8" />
                <ellipse cx="40" cy="35" rx="2.5" ry="1.5" fill="#F4A79D" opacity="0.8" />
                <circle cx="28" cy="32" r="2" fill="#2A1D17" />
                <circle cx="28.8" cy="31.2" r="0.7" fill="#FFFFFF" />
                <circle cx="36" cy="32" r="2" fill="#2A1D17" />
                <circle cx="36.8" cy="31.2" r="0.7" fill="#FFFFFF" />
                {hasGlasses && (
                  <g stroke="#D97706" strokeWidth="1.4" fill="none">
                    <circle cx="28" cy="32" r="3.5" />
                    <circle cx="36" cy="32" r="3.5" />
                    <line x1="31.5" y1="32" x2="32.5" y2="32" />
                  </g>
                )}
                <path d="M 30 35.5 Q 32 38, 34 35.5" stroke="#2A1D17" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <ellipse cx="23" cy="42" rx="3" ry="2" fill="var(--lumi-hoodie)" />
                {hasCoffeeMug ? (
                  <g>
                    <rect x="37" y="39" width="7" height="8" rx="2" fill="#D97706" />
                    <path d="M 44 40 C 46 40, 46 44, 44 44" stroke="#D97706" strokeWidth="1.2" fill="none" />
                  </g>
                ) : (
                  <ellipse cx="41" cy="42" rx="3" ry="2" fill="var(--lumi-hoodie)" />
                )}
              </svg>
            </div>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-[var(--color-forest)] text-white text-xs font-semibold">
              Mood: {lumiState.mood}
            </span>
          </div>

          {/* Speech Bubble */}
          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs">
            <p className="text-xs md:text-sm font-medium text-[var(--color-heading)] italic">
              &ldquo;{lumiState.speech || currentAffirmation}&rdquo;
            </p>
          </div>

          {/* Mood testing buttons */}
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <button
              onClick={() => handleMoodChange("happy", "Let's make today joyful and productive! ✨")}
              className="btn btn-secondary text-xs flex items-center gap-1.5"
            >
              <Sparkles size={14} className="text-amber-500" />
              Happy
            </button>
            <button
              onClick={() => handleMoodChange("focusing", "I've opened my notes. Let's study! 📖")}
              className="btn btn-secondary text-xs flex items-center gap-1.5"
            >
              <BookOpen size={14} className="text-[var(--color-forest)]" />
              Focusing
            </button>
            <button
              onClick={() => handleMoodChange("sleepy", "Rest consolidates your memory... zZz 🌙")}
              className="btn btn-secondary text-xs flex items-center gap-1.5"
            >
              <Moon size={14} className="text-indigo-400" />
              Sleepy
            </button>
          </div>
        </div>
      </div>

      {/* Evolution Milestone Accessories Tracker */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--color-heading)] flex items-center gap-2">
            <Award size={18} className="text-[var(--color-sage)]" />
            Lumi&apos;s Evolution Accessories
          </h2>
          <span className="text-xs text-[var(--color-secondary)]">Unlocked automatically as you study</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Milestone 1: Glasses */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              hasGlasses
                ? "bg-emerald-500/10 border-emerald-500/30 text-[var(--color-heading)]"
                : "bg-[var(--bg-primary)] border-[var(--border-color)] opacity-70"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">👓</span>
              {hasGlasses ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={13} /> Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-[var(--color-secondary)]">
                  <Lock size={12} /> {completedFocusSessions}/2 sessions
                </span>
              )}
            </div>
            <h3 className="text-xs font-bold text-[var(--color-heading)]">Scholar Glasses</h3>
            <p className="text-[11px] text-[var(--color-secondary)] mt-0.5">
              Complete 2 focus sessions to equip Lumi with intellectual wire-rim glasses.
            </p>
          </div>

          {/* Milestone 2: Coffee Mug */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              hasCoffeeMug
                ? "bg-amber-500/10 border-amber-500/30 text-[var(--color-heading)]"
                : "bg-[var(--bg-primary)] border-[var(--border-color)] opacity-70"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">☕</span>
              {hasCoffeeMug ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  <CheckCircle2 size={13} /> Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-[var(--color-secondary)]">
                  <Lock size={12} /> {completedFocusSessions}/4 sessions
                </span>
              )}
            </div>
            <h3 className="text-xs font-bold text-[var(--color-heading)]">Warm Espresso Mug</h3>
            <p className="text-[11px] text-[var(--color-secondary)] mt-0.5">
              Complete 4 focus sessions to give Lumi a steaming cup of study espresso.
            </p>
          </div>

          {/* Milestone 3: Golden Halo */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              hasHalo
                ? "bg-amber-500/10 border-amber-500/30 text-[var(--color-heading)]"
                : "bg-[var(--bg-primary)] border-[var(--border-color)] opacity-70"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">✨</span>
              {hasHalo ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  <CheckCircle2 size={13} /> Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-[var(--color-secondary)]">
                  <Lock size={12} /> {streakDays}/2 day streak
                </span>
              )}
            </div>
            <h3 className="text-xs font-bold text-[var(--color-heading)]">Golden Aura / Halo</h3>
            <p className="text-[11px] text-[var(--color-secondary)] mt-0.5">
              Reach a 2-day study streak to surround Lumi with a peaceful glowing aura.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Companionship Stats & Soundboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stats */}
        <div className="card space-y-4">
          <h2 className="text-base font-bold text-[var(--color-heading)] flex items-center gap-2">
            <Heart size={16} className="text-[var(--color-sage)]" />
            Study Journey Milestones
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
              <p className="text-[11px] text-[var(--color-secondary)] mb-1">Focus Sessions Shared</p>
              <p className="text-2xl font-bold text-[var(--color-forest)]">{completedFocusSessions}</p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
              <p className="text-[11px] text-[var(--color-secondary)] mb-1">Tasks Celebrated</p>
              <p className="text-2xl font-bold text-[var(--color-forest)]">{completedTasksCount}</p>
            </div>
          </div>
          <p className="text-xs text-[var(--color-secondary)] leading-relaxed">
            Lumi is designed to provide positive academic reinforcement without distractions. Every Pomodoro you complete directly levels up your companion!
          </p>
        </div>

        {/* Study Atmospheres */}
        <div className="card space-y-4">
          <h2 className="text-base font-bold text-[var(--color-heading)] flex items-center gap-2">
            <Wind size={16} className="text-[var(--color-sage)]" />
            Study Atmospheres
          </h2>
          <p className="text-xs text-[var(--color-secondary)]">
            Synthesized offline via browser Web Audio API:
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: "rain", label: "Gentle Rain", icon: CloudRain },
              { id: "cafe", label: "Café Murmur", icon: Coffee },
              { id: "wind", label: "Forest Wind", icon: Wind },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => toggleSound(id)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  activeSound === id
                    ? "bg-[var(--color-soft-mint)] border-[var(--color-sage)] text-[var(--color-forest)] font-bold shadow-xs"
                    : "bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--color-secondary)] hover:border-[var(--color-sage)]"
                }`}
              >
                <Icon size={18} className="mx-auto mb-1" />
                <span className="text-xs block">{label}</span>
                <span className="text-[10px] opacity-75">{activeSound === id ? "● Playing" : "Listen"}</span>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={getRandomAffirmation}
              className="btn btn-primary w-full text-xs flex items-center justify-center gap-2"
            >
              <MessageCircle size={14} />
              Inspire Me, Lumi!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}