import React from "react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-20">
      <h1 className="text-6xl font-bold text-[var(--color-sage)] mb-4">404</h1>
      <p className="text-xl font-semibold text-[var(--color-heading)] mb-2">Page not found</p>
      <p className="text-[var(--color-secondary)] mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <a href="/dashboard" className="btn btn-primary">
        Back to Dashboard
      </a>
    </div>
  );
}