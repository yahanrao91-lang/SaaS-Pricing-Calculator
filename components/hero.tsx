import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      {/* Badge — social proof hint */}
      <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-4 py-1.5 text-sm text-neutral-300 mb-8">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        Built for indie hackers & early-stage founders
      </div>

      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl max-w-3xl">
        Stop guessing your{" "}
        <span className="text-neutral-400">SaaS pricing.</span>
      </h1>

      <p className="mt-6 text-lg text-neutral-400 max-w-xl leading-relaxed">
        Describe your product in 30 seconds. Get a complete pricing strategy —
        tiered plans, revenue projections, and actionable advice — backed by AI
        analysis of thousands of successful SaaS products.
      </p>

      {/* CTA buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/tool"
          className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-black hover:bg-neutral-200 transition-colors"
        >
          Generate My Pricing Strategy
          <span className="ml-2 text-sm text-neutral-500">— free</span>
        </Link>
        <a
          href="#how-it-works"
          className="inline-flex items-center justify-center rounded-xl border border-neutral-700 px-8 py-3.5 text-base font-medium text-white hover:bg-neutral-900 transition-colors"
        >
          How it works
        </a>
      </div>

      {/* Trust signals */}
      <div className="mt-16 grid grid-cols-3 gap-8 text-center text-sm text-neutral-500">
        <div>
          <p className="text-lg font-semibold text-neutral-300">30s</p>
          <p>to get results</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-neutral-300">3 tiers</p>
          <p>pricing plans</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-neutral-300">100%</p>
          <p>free to try</p>
        </div>
      </div>

      {/* How it works section */}
      <div
        id="how-it-works"
        className="mt-32 max-w-3xl mx-auto text-left w-full"
      >
        <h2 className="text-2xl font-bold mb-8 text-center">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Describe your product",
              desc: "Tell us what you're building, who it's for, and your costs.",
            },
            {
              step: "02",
              title: "AI analyzes the market",
              desc: "Our model compares your inputs against proven SaaS pricing patterns.",
            },
            {
              step: "03",
              title: "Get your strategy",
              desc: "Receive tiered plans, revenue projections, and actionable next steps.",
            },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="rounded-xl border border-neutral-800 bg-neutral-950 p-6"
            >
              <p className="text-xs font-semibold text-neutral-500 mb-2">
                {step}
              </p>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-neutral-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
