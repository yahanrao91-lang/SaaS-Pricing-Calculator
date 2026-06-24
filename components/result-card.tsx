import type { PricingResult } from "@/lib/prompt";

interface Props {
  data: PricingResult;
}

export default function ResultCard({ data }: Props) {
  const plans = data.plans;
  const revenueEntries = Object.entries(data.revenue_projection);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Section: Plans */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Pricing Plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 flex flex-col relative"
            >
              {/* "Most Popular" badge on Pro */}
              {plan.name.toLowerCase() === "pro" && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-0.5 text-xs font-semibold text-black">
                  Most Popular
                </span>
              )}

              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <p className="text-2xl font-bold mt-2 mb-4">{plan.price}</p>
              <ul className="space-y-2 flex-1">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-neutral-400"
                  >
                    <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Revenue Projection */}
      <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
        <h2 className="text-xl font-bold mb-4">Revenue Projections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {revenueEntries.map(([users, revenue]) => (
            <div key={users}>
              <p className="text-sm text-neutral-500 capitalize">
                {users.replace("_", " ")}
              </p>
              <p className="text-xl font-semibold text-green-400">{revenue}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Strategy */}
      <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
        <h2 className="text-xl font-bold mb-3">Action Plan</h2>
        <ol className="space-y-3">
          {data.strategy.map((item, i) => (
            <li key={i} className="flex gap-3 text-neutral-300">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      </section>

      {/* Section: Warnings */}
      {data.warnings.length > 0 && (
        <section className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-6">
          <h2 className="text-xl font-bold mb-3 text-yellow-400">
            ⚠ Revenue Risks
          </h2>
          <ul className="space-y-2">
            {data.warnings.map((warning, i) => (
              <li key={i} className="flex gap-2 text-sm text-yellow-200/80">
                <span className="shrink-0">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
