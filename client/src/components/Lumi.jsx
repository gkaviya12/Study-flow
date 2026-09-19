/**
 * StudyFlow — Lumi Companion & Evolution Accessories
 * 
 * Interactive forest spirit companion:
 * - Reactive states: idle, focusing, happy, sleepy, neutral
 * - Dynamic speech bubbles based on user events and timer
 * - Clickable for study motivation tips
 * - Evolution Accessories unlocked by achievements:
 *     👓 Scholar Glasses (2+ completed focus sessions)
 *     ☕ Warm Espresso Mug (4+ completed focus sessions)
 *     ✨ Golden Aura / Halo (2+ day streak)
 */

import React, { useState, useEffect } from "react";
import { X, Sparkles, BookOpen, Moon } from "lucide-react";
import { useStudy } from "../context/StudyContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const LUMI_TIPS = [
  "Take a deep breath. You've got this! 🌱",
  "One task at a time is how big goals get conquered.",
  "25 minutes of deep focus beats hours of distracted skimming.",
  "Hydrate! Your brain works better with water 💧",
  "Resting is a crucial part of learning, not a reward 🌿",
  "Small daily consistency creates monumental results ✨",
];

export default function Lumi() {
  const { lumiState, triggerLumi, activeSession, focusHistory, analytics } = useStudy();
  const { user } = useAuth();

  const [visible, setVisible] = useState(() => {
    if (user?.lumi_visible !== undefined) return Boolean(user.lumi_visible);
    return true;
  });

  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (user?.lumi_visible !== undefined) {
      setVisible(Boolean(user.lumi_visible));
    }
  }, [user]);

  // Evolution accessory unlocks
  const completedCount = focusHistory.filter((s) => s.status === "completed").length;
  const streakDays = analytics?.streak || 0;

  const hasGlasses = completedCount >= 2;
  const hasCoffeeMug = completedCount >= 4;
  const hasHalo = streakDays >= 2;

  const handleClickLumi = () => {
    if (activeSession) {
      triggerLumi("focusing", "Stay in the zone! We're studying together 📖");
      return;
    }
    const nextTip = LUMI_TIPS[tipIndex % LUMI_TIPS.length];
    setTipIndex((prev) => prev + 1);
    triggerLumi("happy", nextTip, 5000);
  };

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed bottom-20 md:bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[var(--bg-card)] border border-[var(--color-sage)] flex items-center justify-center text-[var(--color-sage)] shadow-lg hover:scale-110 transition-transform"
        title="Summon Lumi"
        aria-label="Show Lumi"
      >
        <Sparkles size={18} />
      </button>
    );
  }

  const mood = activeSession ? "focusing" : lumiState.mood;

  return (
    <aside aria-label="Study Companion" className="fixed bottom-20 md:bottom-6 right-6 z-40 flex flex-col items-end select-none">
      {/* Speech Bubble */}
      {lumiState.speech && (
        <div className="relative mb-2 max-w-[220px] px-3.5 py-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl text-xs text-[var(--color-heading)] font-medium leading-snug animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p>{lumiState.speech}</p>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[var(--bg-card)] border-r border-b border-[var(--border-color)] rotate-45" />
        </div>
      )}

      {/* Lumi Sprite Wrapper */}
      <div className="relative group flex items-center justify-center">
        {/* Hide Button */}
        <button
          onClick={() => setVisible(false)}
          className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--color-secondary)] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[var(--color-heading)] z-10"
          title="Dismiss Lumi"
          aria-label="Hide Lumi"
        >
          <X size={10} />
        </button>

        {/* Character Container */}
        <button
          type="button"
          onClick={handleClickLumi}
          className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none"
          title="Click Lumi for study tips and affirmations!"
        >
          {/* Mood status accessory badge */}
          {mood === "focusing" && (
            <span className="absolute -top-1 -right-1 bg-[var(--color-forest)] text-white p-1 rounded-full shadow">
              <BookOpen size={10} />
            </span>
          )}
          {mood === "sleepy" && (
            <span className="absolute -top-1 -right-1 bg-indigo-500 text-white p-1 rounded-full shadow animate-pulse">
              <Moon size={10} />
            </span>
          )}
          {mood === "happy" && (
            <span className="absolute -top-1 -right-1 bg-amber-400 text-stone-900 p-1 rounded-full shadow animate-bounce">
              <Sparkles size={10} />
            </span>
          )}

          {/* SVG Character */}
          <div className={`w-14 h-14 md:w-16 md:h-16 ${mood === "focusing" ? "animate-pulse" : "animate-bounce-gentle"}`}>
            <LumiSprite
              mood={mood}
              hasGlasses={hasGlasses}
              hasCoffeeMug={hasCoffeeMug}
              hasHalo={hasHalo}
            />
          </div>
        </button>
      </div>
    </aside>
  );
}

function LumiSprite({ mood, hasGlasses, hasCoffeeMug, hasHalo }) {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      {/* Golden Aura / Halo (Unlocked at streak >= 2) */}
      {hasHalo && (
        <>
          <ellipse cx="32" cy="4" rx="14" ry="3" stroke="#F59E0B" strokeWidth="1.8" fill="none" opacity="0.9" />
          <circle cx="32" cy="4" r="1.5" fill="#FDE68A" />
        </>
      )}

      {/* Soft Glow */}
      <circle cx="32" cy="34" r="24" fill="var(--color-mint)" opacity="0.25" />

      {/* Sprout on Head */}
      <path d="M 32 16 Q 30 10, 26 8 Q 33 10, 32 16 Z" fill="var(--color-mint)" />
      <path d="M 32 16 Q 35 11, 39 9 Q 34 12, 32 16 Z" fill="var(--lumi-leaf)" />
      <line x1="32" y1="16" x2="32" y2="20" stroke="var(--color-forest)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Hood (Warm Mocha) */}
      <path
        d="M 17 26 C 17 19, 47 19, 47 26 C 50 34, 49 46, 32 46 C 15 46, 14 34, 17 26 Z"
        fill="var(--lumi-hoodie)"
      />

      {/* Face Inner (Warm Parchment) */}
      <ellipse cx="32" cy="33" rx="11" ry="9" fill="#FDFBF7" />

      {/* Cheeks (Soft Peach Blush) */}
      <ellipse cx="25" cy="35" rx="2" ry="1.2" fill="#F4A79D" opacity="0.8" />
      <ellipse cx="39" cy="35" rx="2" ry="1.2" fill="#F4A79D" opacity="0.8" />

      {/* Eyes depending on mood */}
      {mood === "focusing" || mood === "sleepy" ? (
        <>
          <path d="M 27 32 Q 29 34, 31 32" stroke="#2A1D17" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M 33 32 Q 35 34, 37 32" stroke="#2A1D17" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </>
      ) : mood === "happy" ? (
        <>
          <path d="M 27 33 Q 29 30, 31 33" stroke="#2A1D17" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M 33 33 Q 35 30, 37 33" stroke="#2A1D17" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="29" cy="32" r="1.8" fill="#2A1D17" />
          <circle cx="29.6" cy="31.4" r="0.6" fill="#FFFFFF" />
          <circle cx="35" cy="32" r="1.8" fill="#2A1D17" />
          <circle cx="35.6" cy="31.4" r="0.6" fill="#FFFFFF" />
        </>
      )}

      {/* Scholar Glasses (Unlocked at 2+ sessions) */}
      {hasGlasses && (
        <g stroke="#D97706" strokeWidth="1.2" fill="none">
          <circle cx="28.5" cy="32" r="3.2" />
          <circle cx="35.5" cy="32" r="3.2" />
          <line x1="31.7" y1="32" x2="32.3" y2="32" strokeWidth="1.4" />
        </g>
      )}

      {/* Mouth */}
      {mood === "happy" ? (
        <path d="M 30.5 35.5 Q 32 37.5, 33.5 35.5" stroke="#2A1D17" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      ) : (
        <circle cx="32" cy="35.5" r="0.8" fill="#2A1D17" />
      )}

      {/* Hands / Props */}
      {mood === "focusing" ? (
        <rect x="26" y="40" width="12" height="7" rx="2" fill="var(--color-forest)" stroke="var(--color-mint)" strokeWidth="0.5" />
      ) : hasCoffeeMug ? (
        /* Steaming Ceramic Espresso Mug */
        <g>
          <ellipse cx="24" cy="41" rx="2.2" ry="1.8" fill="var(--lumi-hoodie)" />
          {/* Ceramic cup */}
          <rect x="36" y="38" width="6" height="7" rx="1.5" fill="#D97706" />
          <path d="M 42 39 C 44 39, 44 43, 42 43" stroke="#D97706" strokeWidth="1" fill="none" />
          {/* Steam curl */}
          <path d="M 38 36 Q 39 34, 38 33" stroke="#C8BFB8" strokeWidth="0.8" fill="none" opacity="0.7" />
        </g>
      ) : (
        <>
          <ellipse cx="24" cy="41" rx="2.2" ry="1.8" fill="var(--lumi-hoodie)" />
          <ellipse cx="40" cy="41" rx="2.2" ry="1.8" fill="var(--lumi-hoodie)" />
        </>
      )}
    </svg>
  );
}