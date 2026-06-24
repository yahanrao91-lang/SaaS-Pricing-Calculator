"use client";

import { useState } from "react";

const PRO_FEATURES = [
  {
    label: "View Detailed Competitor Analysis",
    icon: "📊",
    desc: "See how your pricing stacks up against similar products",
  },
  {
    label: "Pricing Psychology Breakdown",
    icon: "🧠",
    desc: "Anchoring, decoy effect, framing — applied to your pricing",
  },
  {
    label: "Competitor Benchmark Report",
    icon: "📈",
    desc: "Side-by-side comparison with market averages",
  },
  {
    label: "Export as PDF",
    icon: "📄",
    desc: "Share with your team or investors",
  },
];

function trackClick(feature: string) {
  try {
    const stored = JSON.parse(
      localStorage.getItem("pricing-pilot-clicks") ?? "[]",
    );
    stored.push({ feature, at: new Date().toISOString() });
    localStorage.setItem("pricing-pilot-clicks", JSON.stringify(stored));
  } catch {
    // non-critical
  }
}

function saveEmail(email: string) {
  try {
    const stored = JSON.parse(
      localStorage.getItem("pricing-pilot-emails") ?? "[]",
    );
    stored.push({ email, at: new Date().toISOString() });
    localStorage.setItem("pricing-pilot-emails", JSON.stringify(stored));
  } catch {
    // non-critical
  }
}

export default function Paywall() {
  const [modalOpen, setModalOpen] = useState(false);
  const [clickedFeature, setClickedFeature] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleFeatureClick(feature: string) {
    trackClick(feature);
    setClickedFeature(feature);
    setModalOpen(true);
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!email.trim() || saving) return;
    setSaving(true);
    saveEmail(email.trim());
    setSubmitted(true);
    setSaving(false);
  }

  function closeModal() {
    setModalOpen(false);
    setSubmitted(false);
    setEmail("");
  }

  return (
    <>
      {/* ── Pro Report Teaser ── */}
      <div className="mt-10 rounded-xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
            🔒 Pro Report — Coming Soon
          </span>
          <h3 className="mt-3 text-xl font-bold">Unlock Pro Report</h3>
          <p className="mt-1 text-sm text-neutral-400">
            Click any feature below to get early access when it launches.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRO_FEATURES.map(({ label, icon, desc }) => (
            <button
              key={label}
              onClick={() => handleFeatureClick(label)}
              className="flex items-start gap-3 rounded-xl border border-neutral-700 bg-neutral-900 p-4 text-left hover:border-neutral-500 hover:bg-neutral-800 transition-colors group"
            >
              <span className="text-xl shrink-0 mt-0.5">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors">
                  {label}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Modal: Coming Soon + Email Capture ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Dialog */}
          <div
            className="relative max-w-sm w-full rounded-2xl bg-neutral-900 border border-neutral-700 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {!submitted ? (
              <>
                <p className="text-lg font-semibold">🚀 Coming Soon</p>
                <p className="mt-2 text-sm text-neutral-400">
                  <strong>&ldquo;{clickedFeature}&rdquo;</strong> is part of the
                  Pro Report — launching soon. Leave your email to get first
                  access.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 disabled:opacity-50 transition-colors"
                  >
                    {saving ? "Saving..." : "Notify Me"}
                  </button>
                </form>

                <button
                  onClick={closeModal}
                  className="mt-3 w-full text-center text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
                >
                  Maybe later
                </button>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-green-400">
                  ✅ You&apos;re on the list!
                </p>
                <p className="mt-2 text-sm text-neutral-400">
                  We&apos;ll send you one email when Pro features launch. No
                  spam.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-5 w-full rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors"
                >
                  Got it
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
