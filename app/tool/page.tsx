"use client";

import { useState } from "react";
import PricingForm from "@/components/pricing-form";
import ResultCard from "@/components/result-card";
import Paywall from "@/components/paywall";
import type { FormData } from "@/components/pricing-form";
import type { PricingResult } from "@/lib/prompt";

type Status = "idle" | "loading" | "success" | "error";

export default function ToolPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<PricingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: FormData) {
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productType: data.productType,
          targetUser: data.targetUser,
          monthlyCost: data.monthlyCost,
          competitorPrice: data.competitorPrice || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? `Server error (${res.status})`);
      }

      setResult(json);
      setStatus("success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setStatus("error");
    }
  }

  function handleReset() {
    setStatus("idle");
    setResult(null);
    setError(null);
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <a
            href="/"
            className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            ← Back to home
          </a>
          <h1 className="mt-4 text-3xl font-bold">Pricing Strategy Generator</h1>
          <p className="mt-2 text-neutral-400">
            Fill in the details below and get a complete SaaS pricing strategy in
            seconds.
          </p>
        </div>

        {/* Idle state: show form */}
        {status === "idle" && (
          <PricingForm onSubmit={handleSubmit} loading={false} />
        )}

        {/* Loading state */}
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-600 border-t-white" />
            <p className="mt-6 text-lg text-neutral-400">
              Analyzing SaaS pricing patterns...
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              This usually takes 5–10 seconds
            </p>
          </div>
        )}

        {/* Success state */}
        {status === "success" && result && (
          <>
            <ResultCard data={result} free />
            <Paywall />
            <div className="mt-6 text-center">
              <button
                onClick={handleReset}
                className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                ← Generate another strategy
              </button>
            </div>
          </>
        )}

        {/* Error state */}
        {status === "error" && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-8 text-center max-w-xl mx-auto">
            <p className="text-lg font-semibold text-red-400">
              Something went wrong
            </p>
            <p className="mt-2 text-sm text-neutral-400">{error}</p>
            <button
              onClick={handleReset}
              className="mt-6 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
