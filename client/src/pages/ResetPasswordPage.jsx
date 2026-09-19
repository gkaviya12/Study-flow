import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api.js";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "done" | "error"
  const [error, setError] = useState(null);

  const isValidToken = token.length >= 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setStatus("loading");
    try {
      await authAPI.resetPassword(token, password);
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
            <h1 className="text-2xl font-bold text-[var(--color-heading)] mb-2">Password updated</h1>
            <p className="text-[var(--color-secondary)] mb-6">
              Your password has been changed. You can now sign in with your new password.
            </p>
            <Link to="/login" className="btn btn-primary w-full text-center">
              Sign in
            </Link>
          </>
        ) : !isValidToken ? (
          <>
            <h1 className="text-2xl font-bold text-[var(--color-heading)] mb-2">Invalid link</h1>
            <p className="text-[var(--color-secondary)] mb-6">
              This password-reset link is invalid or has expired. Please request a new one.
            </p>
            <Link to="/forgot-password" className="btn btn-secondary w-full text-center">
              Request new link
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-[var(--color-heading)] mb-1">Set new password</h1>
            <p className="text-[var(--color-secondary)] mb-6">
              Choose a strong password — at least 8 characters with upper and lower case letters,
              a number, and a symbol.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm" role="alert">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1.5">New password</label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium mb-1.5">Confirm password</label>
                <input
                  id="confirm"
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Saving…" : "Save new password"}
              </button>
            </form>
          </>
        )}
        <p className="text-sm text-center mt-6">
          <Link to="/login" className="text-[var(--color-secondary)]">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
