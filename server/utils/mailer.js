/**
 * StudyFlow V2 — Mailer Utility
 *
 * Wraps nodemailer. In development (when SMTP credentials are placeholders or
 * absent) it logs the email to the console instead of sending. In production
 * it uses the configured SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD.
 *
 * Usage:
 *   import { sendPasswordResetEmail } from "./utils/mailer.js";
 *   await sendPasswordResetEmail({ to: "user@example.com", resetToken: "abc123", clientUrl: "https://app.studyflow.com" });
 */

import nodemailer from "nodemailer";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Creates a nodemailer transport. In dev, uses ethereal/mock; in prod,
 * uses the real SMTP settings from env.
 *
 * The transporter is created lazily so this module can be imported at the
 * top of other modules without requiring env vars to be present at boot.
 */
let _transporter = null;

const getTransporter = () => {
  if (_transporter) return _transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  // If SMTP credentials look like dev placeholders, log instead of sending.
  // We detect this by checking if SMTP_HOST is empty or if the credentials
  // are the default "dev" values from .env.example.
  const isPlaceholder =
    !host ||
    host === "smtp.mailtrap.io" ||
    user === "dev" ||
    pass === "dev";

  if (isDev || isPlaceholder) {
    // Ethereal is a free fake SMTP service — nodemailer can create a test
    // account on the fly, but to keep it deterministic we use a pre-created
    // one that logs everything to the console.
    _transporter = nodemailer.createTransport({
      jsonTransport: true, // output as JSON string to console — no real network call
    });
    _transporter._isDev = true;
  } else {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
    _transporter._isDev = false;
  }

  return _transporter;
};

const FROM_ADDRESS =
  process.env.SMTP_FROM || "StudyFlow <no-reply@studyflow.com>";

/**
 * Send a password-reset email.
 *
 * @param {{ to: string, resetToken: string, clientUrl: string }} opts
 * @returns {Promise<{ messageId: string, previewUrl?: string }>}
 */
export const sendPasswordResetEmail = async ({ to, resetToken, clientUrl }) => {
  const transporter = getTransporter();
  const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: FROM_ADDRESS,
    to,
    subject: "Reset your StudyFlow password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #2d5a47;">Reset your StudyFlow password</h2>
        <p>Hi,</p>
        <p>We received a request to reset the password for your StudyFlow account.
           Click the button below to set a new password. This link expires in 1 hour.</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}"
             style="background: #2d5a47; color: #fff; padding: 12px 24px;
                    border-radius: 6px; text-decoration: none; font-weight: bold;">
            Reset Password
          </a>
        </p>
        <p style="color: #666; font-size: 13px;">
          If you didn't request a password reset, you can safely ignore this email.
          The link will stop working automatically.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">— The StudyFlow team</p>
      </div>
    `,
    text: `Reset your StudyFlow password:\n\n${resetUrl}\n\nIf you didn't request this, ignore this email.`,
  };

  if (transporter._isDev) {
    const info = await transporter.sendMail(mailOptions);
    const parsed = JSON.parse(info.message);
    console.log("\n[mailer:dev] Password reset email logged (not sent):");
    console.log("  To:", mailOptions.to);
    console.log("  Reset URL:", resetUrl);
    console.log("  Token:", resetToken);
    if (parsed.headers && parsed.headers["message-id"]) {
      console.log("  Message-Id:", parsed.headers["message-id"]);
    }
    return { messageId: parsed.headers?.["message-id"] || "dev", previewUrl: undefined };
  }

  const info = await transporter.sendMail(mailOptions);
  return { messageId: info.messageId, previewUrl: undefined };
};
