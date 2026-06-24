export interface PricingInput {
  productType: string;
  targetUser: string;
  monthlyCost: number;
  competitorPrice?: number;
}

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
}

export interface RevenueProjection {
  "100_users": string;
  "500_users": string;
  "1000_users": string;
}

export interface PricingResult {
  plans: PricingPlan[];
  revenue_projection: RevenueProjection;
  strategy: string[];
  warnings: string[];
}

export function getPricingPrompt(input: PricingInput): string {
  const cost = input.monthlyCost;
  const competitor = input.competitorPrice
    ? `$${input.competitorPrice}/mo`
    : "unknown";

  // Calculate minimum viable price to guide the AI
  const minViable = Math.round(cost * 3);
  const suggestedPro = Math.round(cost * 5);
  const suggestedBusiness = Math.round(cost * 10);

  return `You are a SaaS pricing strategist. Your task is to generate a unique, data-driven pricing strategy for a SPECIFIC product. The output MUST vary significantly based on the input numbers — different costs MUST produce different prices.

## Product Data (USE THESE EXACT NUMBERS)

- Product: ${input.productType}
- Target users: ${input.targetUser}
- Monthly running cost: $${cost}/mo
- Competitor price: ${competitor}

## Pricing Formula (FOLLOW THIS)

Your monthly cost is $${cost}. Price each tier as a healthy markup over cost:

- **Starter**: 3–4× cost = roughly $${minViable}–$${Math.round(cost * 4)}/mo
  → DO NOT go below $${minViable}/mo or the business loses money
- **Pro**: 5–7× cost = roughly $${suggestedPro}–$${Math.round(cost * 7)}/mo
  → This is the anchor plan — make it the obvious best value
- **Business**: 10–15× cost = roughly $${suggestedBusiness}–$${Math.round(cost * 15)}/mo
  → Enterprise tier with premium features

IMPORTANT: If competitor price is known (${competitor}), adjust your pricing relative to it. If you're cheaper, explain why. If you're more expensive, justify the premium.

${input.competitorPrice && input.competitorPrice < minViable ? `⚠ WARNING: The competitor charges $${input.competitorPrice}/mo which is BELOW your minimum viable price of $${minViable}/mo. You MUST address this — either justify a premium position or warn the user they cannot compete on price alone.` : ""}

## Revenue Projection (COMPUTE FROM PRO PLAN)

Take the Pro plan price you chose, multiply by number of users, multiply by 12 months. Show annual revenue.
Example math: if Pro = $50/mo, then 100 users = $50 × 100 × 12 = $60,000/year

## Strategy & Warnings

- Strategy: 3 specific, actionable steps tied to THIS product and THESE numbers. No generic advice.
- Warnings: flag real risks based on the actual cost-to-price ratio. If cost is close to any plan price, warn about thin margins.

## Output Rules

1. Reply with ONLY valid JSON. No markdown, no code fences, no preamble.
2. Prices MUST be calculated from the input cost using the formula above.
3. If cost is $10 vs $1000, the output should look RADICALLY different.
4. Each plan needs 3–5 features specific to "${input.productType}".
5. DO NOT copy example numbers — compute fresh each time.
6. Strategy items must reference specific numbers (e.g., "Your Pro plan at $X needs Y").

## JSON Schema

{
  "plans": [
    { "name": "Starter", "price": "$X/mo", "features": ["..."] },
    { "name": "Pro", "price": "$X/mo", "features": ["..."] },
    { "name": "Business", "price": "$X/mo", "features": ["..."] }
  ],
  "revenue_projection": {
    "100_users": "$X/year",
    "500_users": "$X/year",
    "1000_users": "$X/year"
  },
  "strategy": ["...", "...", "..."],
  "warnings": ["...", "..."]
}`;
}
