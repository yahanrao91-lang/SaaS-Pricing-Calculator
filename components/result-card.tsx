import type { PricingResult } from "@/lib/prompt";

interface Props {
  data: PricingResult;
  free?: boolean;
}

/** Show only the first N features per plan, with a "locked" indicator for the rest */
function truncateFeatures(features: string[], free: boolean): string[] {
  if (!free) return features;
  return features.slice(0, 2);
}

export default function ResultCard({ data, free = true }: Props) {
  const plans = data.plans;
  const revenueEntries = Object.entries(data.revenue_projection);
  const strategyItems = free ? data.strategy.slice(0, 1) : data.strategy;
  const showWarnings = !free && data.warnings.length > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Section: Plans */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Pricing Plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const visibleFeatures = truncateFeatures(plan.features, free);
            const hiddenCount = plan.features.length - visibleFeatures.length;

            return (
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
                  {visibleFeatures.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-neutral-400"
                    >
                      <span className="text-green-400 mt-0.5 shrink-0">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                  {hiddenCount > 0 && (
                    <li className="flex items-start gap-2 text-sm text-neutral-600">
                      <span className="mt-0.5 shrink-0">🔒</span>
                      +{hiddenCount} more features —{" "}
                      <span className="text-yellow-400">unlock below</span>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section: Revenue Projection — free shows 1, paid shows all */}
      <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
        <h2 className="text-xl font-bold mb-4">
          Revenue Projections
          {free && (
            <span className="ml-2 text-xs font-normal text-yellow-500">
              (preview)
            </span>
          )}
        </h2>
        <div
          className={`grid grid-cols-1 ${
            free ? "" : "sm:grid-cols-3"
          } gap-4 text-center`}
        >
          {(free ? revenueEntries.slice(0, 1) : revenueEntries).map(
            ([users, revenue]) => (
              <div key={users}>
                <p className="text-sm text-neutral-500 capitalize">
                  {users.replace("_", " ")}
                </p>
                <p className="text-xl font-semibold text-green-400">
                  {revenue}
                </p>
              </div>
            ),
          )}
          {free && revenueEntries.length > 1 && (
            <div className="text-center">
              <p className="text-sm text-neutral-600">
                +{revenueEntries.length - 1} more projections
              </p>
              <p className="text-sm text-yellow-400">🔒 Unlock full report</p>
            </div>
          )}
        </div>
      </section>

      {/* Section: Strategy */}
      <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
        <h2 className="text-xl font-bold mb-3">
          Action Plan
          {free && (
            <span className="ml-2 text-xs font-normal text-yellow-500">
              (1 of {data.strategy.length})
            </span>
          )}
        </h2>
        <ol className="space-y-3">
          {strategyItems.map((item, i) => (
            <li key={i} className="flex gap-3 text-neutral-300">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
        {free && data.strategy.length > 1 && (
          <div className="mt-4 p-4 rounded-lg border border-dashed border-neutral-700 text-center">
            <p className="text-sm text-neutral-500">
              🔒 {data.strategy.length - 1} more strategies locked —{" "}
              <span className="text-yellow-400">unlock below</span>
            </p>
          </div>
        )}
      </section>

      {/* Section: Warnings — paid only */}
      {showWarnings && (
        <section className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-6">
          <h2 className="text-xl font-bold mb-3 text-yellow-400">
            ⚠ Revenue Risks
          </h2>
          <ul className="space-y-2">
            {data.warnings.map((warning, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm text-yellow-200/80"
              >
                <span className="shrink-0">•</span>
                {warning}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Locked warnings teaser */}
      {free && data.warnings.length > 0 && (
        <section className="rounded-xl border border-dashed border-yellow-500/20 bg-yellow-500/5 p-6 text-center">
          <p className="text-sm text-neutral-500">
            🔒 {data.warnings.length} revenue risk warnings hidden —{" "}
            <span className="text-yellow-400">see what could cost you money</span>
          </p>
        </section>
      )}
    </div>
  );
}
