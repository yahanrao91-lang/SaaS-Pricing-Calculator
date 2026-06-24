"use client";

import { useState, type FormEvent } from "react";

export default function Paywall() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || saving) return;

    setSaving(true);

    // For MVP: store in localStorage + show confirmation.
    // Later: POST to /api/subscribe or a service like ConvertKit / Resend.
    try {
      const stored = JSON.parse(
        localStorage.getItem("pricing-pilot-emails") ?? "[]",
      );
      stored.push({ email: email.trim(), at: new Date().toISOString() });
      localStorage.setItem("pricing-pilot-emails", JSON.stringify(stored));
    } catch {
      // localStorage might be full or disabled — non-critical
    }

    setSubmitted(true);
    setSaving(false);
  }

  if (submitted) {
    return (
      <div className="mt-8 rounded-xl border border-green-500/30 bg-green-500/5 p-6 text-center">
        <p className="text-lg font-semibold text-green-400">You&apos;re on the list!</p>
        <p className="mt-1 text-sm text-neutral-400">
          We&apos;ll send you one email when premium features launch. No spam.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-neutral-700 bg-neutral-950 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold">Want more?</h3>
          <p className="mt-1 text-sm text-neutral-400">
            We&apos;re building premium features — competitor benchmarks, pricing
            psychology breakdowns, PDF exports, and more. Drop your email and
            we&apos;ll let you know when it&apos;s ready.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="shrink-0 flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full sm:w-56 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 disabled:opacity-50 transition-colors"
          >
            {saving ? "..." : "Notify me"}
          </button>
        </form>
      </div>
    </div>
  );
}
