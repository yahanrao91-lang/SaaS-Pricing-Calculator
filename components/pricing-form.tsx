"use client";

import { useState, type FormEvent } from "react";

export interface FormData {
  productType: string;
  targetUser: string;
  monthlyCost: string;
  competitorPrice: string;
}

interface Props {
  onSubmit: (data: FormData) => void;
  loading: boolean;
}

const FIELDS = [
  {
    name: "productType" as const,
    label: "What are you building?",
    placeholder: 'e.g. "AI writing tool", "Project management SaaS"',
    type: "text",
    hint: "Be specific — it helps the AI give better pricing advice.",
  },
  {
    name: "targetUser" as const,
    label: "Who is it for?",
    placeholder: 'e.g. "Indie hackers", "Small marketing teams"',
    type: "text",
    hint: "Who will pay for this product?",
  },
  {
    name: "monthlyCost" as const,
    label: "What's your monthly cost?",
    placeholder: "e.g. 200",
    type: "number",
    hint: "Server, API, and tooling costs. Rough estimate is fine.",
  },
  {
    name: "competitorPrice" as const,
    label: "Competitor price (optional)",
    placeholder: "e.g. 49",
    type: "number",
    hint: "What do similar products charge? Leave blank if unsure.",
  },
];

export default function PricingForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<FormData>({
    productType: "",
    targetUser: "",
    monthlyCost: "",
    competitorPrice: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.productType.trim()) errs.productType = "Required";
    if (!form.targetUser.trim()) errs.targetUser = "Required";
    const cost = Number(form.monthlyCost);
    if (!form.monthlyCost.trim() || isNaN(cost) || cost < 0) {
      errs.monthlyCost = "Enter a valid positive number";
    }
    if (form.competitorPrice.trim()) {
      const comp = Number(form.competitorPrice);
      if (isNaN(comp) || comp < 0) {
        errs.competitorPrice = "Enter a valid positive number or leave blank";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  }

  function updateField(name: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto space-y-6"
      noValidate
    >
      {FIELDS.map(({ name, label, placeholder, type, hint }) => (
        <div key={name}>
          <label
            htmlFor={name}
            className="block text-sm font-medium text-neutral-300 mb-1.5"
          >
            {label}
          </label>
          <input
            id={name}
            name={name}
            type={type}
            inputMode={type === "number" ? "numeric" : undefined}
            placeholder={placeholder}
            value={form[name]}
            onChange={(e) => updateField(name, e.target.value)}
            disabled={loading}
            className={`w-full rounded-xl border bg-neutral-900 px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors ${
              errors[name]
                ? "border-red-500 focus:ring-red-500/30"
                : "border-neutral-700"
            }`}
          />
          {errors[name] ? (
            <p className="mt-1 text-sm text-red-400">{errors[name]}</p>
          ) : (
            <p className="mt-1 text-xs text-neutral-600">{hint}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Analyzing..." : "Generate Pricing Strategy"}
      </button>
    </form>
  );
}
