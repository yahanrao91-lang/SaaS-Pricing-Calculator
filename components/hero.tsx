import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      {/* Badge — urgency */}
      <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-sm text-yellow-300 mb-8">
        ⚠ Most indie hackers underprice by 30–50%
      </div>

      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl max-w-3xl">
        You&apos;re probably{" "}
        <span className="text-red-400">underpricing</span> your SaaS.
      </h1>

      <p className="mt-6 text-lg text-neutral-400 max-w-xl leading-relaxed">
        One pricing mistake can cost you $500–$2,000/month in lost revenue.
        Describe your product in 30 seconds and see exactly what you should
        charge — backed by AI analysis of thousands of successful SaaS products.
      </p>

      {/* CTA buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/tool"
          className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-black hover:bg-neutral-200 transition-colors"
        >
          See What I Should Charge
          <span className="ml-2 text-sm text-neutral-500">— free</span>
        </Link>
        <a
          href="#how-it-works"
          className="inline-flex items-center justify-center rounded-xl border border-neutral-700 px-8 py-3.5 text-base font-medium text-white hover:bg-neutral-900 transition-colors"
        >
          How it works
        </a>
      </div>

      {/* Trust signals — loss-framed */}
      <div className="mt-16 grid grid-cols-3 gap-8 text-center text-sm text-neutral-500">
        <div>
          <p className="text-lg font-semibold text-red-400">30–50%</p>
          <p>average underpricing</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-neutral-300">3 tiers</p>
          <p>optimized for your cost</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-neutral-300">30s</p>
          <p>from input to strategy</p>
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
              desc: "Tell us what you're building, who it's for, and your monthly cost.",
            },
            {
              step: "02",
              title: "AI analyzes your pricing gap",
              desc: "Our model identifies how much revenue you're leaving on the table.",
            },
            {
              step: "03",
              title: "Get your pricing blueprint",
              desc: "Data-backed tiers, revenue projections, and what to fix today.",
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
