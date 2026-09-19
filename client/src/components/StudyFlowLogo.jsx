/**
 * StudyFlow — Official Brand Logo
 * Features a minimalist open hardcover notebook with a lively sage sprout rising from the spine.
 */

import React from "react";

export default function StudyFlowLogo({ size = "md", showWordmark = true, className = "" }) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-11 h-11",
    xl: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon SVG */}
      <div className={`relative shrink-0 ${iconSizes[size] || iconSizes.md}`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
          aria-hidden="true"
        >
          {/* Subtle warm glow behind sprout */}
          <circle cx="24" cy="20" r="14" fill="var(--color-mint)" opacity="0.3" />

          {/* Hardcover Open Book Left Page */}
          <path
            d="M6 34C12 33 18 31 24 33V15C18 13 12 15 6 16V34Z"
            fill="var(--bg-card)"
            stroke="var(--color-forest)"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Hardcover Open Book Right Page */}
          <path
            d="M42 34C36 33 30 31 24 33V15C30 13 36 15 42 16V34Z"
            fill="var(--bg-card)"
            stroke="var(--color-forest)"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Spine & Page lines */}
          <path
            d="M24 33V39"
            stroke="var(--color-forest)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M10 21C14 20 18 19 21 20"
            stroke="var(--color-secondary)"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M10 26C14 25 18 24 21 25"
            stroke="var(--color-secondary)"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M38 21C34 20 30 19 27 20"
            stroke="var(--color-secondary)"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M38 26C34 25 30 24 27 25"
            stroke="var(--color-secondary)"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Sprout Stem */}
          <path
            d="M24 24C24 17 24 13 24 9"
            stroke="var(--color-sage)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Left Leaf */}
          <path
            d="M24 13C20 13 16 10 17 6C22 6 24 10 24 13Z"
            fill="var(--color-mint)"
            stroke="var(--color-sage)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Right Leaf */}
          <path
            d="M24 10C27 10 31 7 30 3C25 4 24 8 24 10Z"
            fill="var(--color-sage)"
            stroke="var(--color-forest)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <span
          className={`font-bold tracking-tight text-[var(--color-heading)] ${
            textSizes[size] || textSizes.md
          }`}
        >
          Study<span className="text-[var(--color-sage)] font-extrabold">Flow</span>
        </span>
      )}
    </div>
  );
}
