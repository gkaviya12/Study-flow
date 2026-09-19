import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../services/api.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "done" | "error"
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setStatus("loading");
    try {
      await authAPI.forgotPassword(email);
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[var(--bg-primary)]">
      <div className="card w-full max-w-md">
        {status === "done" ? (
          <>
            <h1 className="text-2xl font-bold text-[var(--color-heading)] mb-2">Check your email</h1>
            <p className="text-[var(--color-secondary)] mb-6">
              If an account with <strong>{email}</strong> exists, we&apos;ve sent a password-reset link to that address.
              It expires in 1 hour.
            </p>
            <p className="text-sm text-[var(--color-secondary)] mb-6">
              Didn&apos;t get it? Check your spam folder, or{" "}
              <button
                onClick={() => setStatus("idle")}
                className="text-[var(--color-sage)] font-medium"
              >
                try again
              </button>
              .
            </p>
            <Link to="/login" className="btn btn-secondary w-full text-center">
              Back to sign in
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-[var(--color-heading)] mb-1">Reset password</h1>
            <p className="text-[var(--color-secondary)] mb-6">
              Enter your email and we&apos;ll send you a link to set a new password.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm" role="alert">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <p className="text-sm text-center text-[var(--color-secondary)] mt-6">
              Remember your password?{" "}
              <Link to="/login" className="text-[var(--color-sage)] font-medium">Sign in</Link>
            </p>
          </>
        )}
        <p className="text-sm text-center mt-2">
          <Link to="/" className="text-[var(--color-secondary)]">← Back home</Link>
        </p>
      </div>
    </div>
  );
}
