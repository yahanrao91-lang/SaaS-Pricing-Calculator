"use client";

export default function Paywall() {
  function handleUnlock() {
    // When you're ready to accept payments:
    // 1. Create a Stripe product at https://dashboard.stripe.com/products
    // 2. Set NEXT_PUBLIC_STRIPE_PRICE_ID in .env.local
    // 3. Uncomment the redirect below (requires @stripe/stripe-js)
    //
    // import { loadStripe } from '@stripe/stripe-js';
    // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    // await stripe?.redirectToCheckout({ lineItems: [{ price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID, quantity: 1 }], mode: 'payment', successUrl: window.location.origin + '/success', cancelUrl: window.location.href });

    alert(
      "Stripe checkout coming soon! This is where users pay $9 to unlock the full report.",
    );
  }

  return (
    <div className="mt-8 rounded-xl border-2 border-yellow-500/50 bg-gradient-to-b from-yellow-500/5 to-transparent p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold">
            Unlock the Full Strategy Report
          </h3>
          <p className="mt-1 text-sm text-neutral-400">
            The free preview shows the basics. The full report includes
            everything you need to launch with confidence.
          </p>
          <ul className="mt-4 space-y-2">
            {[
              "Competitor pricing breakdown & positioning map",
              "Pricing psychology strategy (anchoring, decoy effect, framing)",
              "Revenue optimization plan with 30/60/90 day milestones",
              "Ready-to-use pricing page copy (just paste into your site)",
              "PDF export — share with your team or investors",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-neutral-300">
                <span className="text-yellow-400 mt-0.5 shrink-0">✔</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="shrink-0 text-center">
          <p className="text-3xl font-bold">$9</p>
          <p className="text-sm text-neutral-500">one-time</p>
          <button
            onClick={handleUnlock}
            className="mt-4 w-full sm:w-auto rounded-xl bg-yellow-500 px-8 py-3 font-semibold text-black hover:bg-yellow-400 transition-colors"
          >
            Unlock Full Report
          </button>
          <p className="mt-2 text-xs text-neutral-600">
            30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}
