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
  const competitorLine = input.competitorPrice
    ? `Competitor monthly price: $${input.competitorPrice}`
    : "Competitor price: unknown — estimate based on market norms";

  return `You are a SaaS pricing strategist who has advised 500+ B2B and B2C SaaS companies.

## Product to analyze

- Product type: ${input.productType}
- Target user: ${input.targetUser}
- Monthly cost to run: $${input.monthlyCost}
- ${competitorLine}

## Rules

1. Suggest exactly 3 plans: Starter, Pro, and Business (or equivalent tiers).
2. Price realistically — Starter should be accessible, Pro is the main revenue driver, Business captures enterprise.
3. For indie-hacker / solo-founder products: Starter should be $9–29/mo, Pro $29–99/mo, Business $99–299/mo.
4. For B2B / team tools: double those ranges.
5. Every plan needs 3–5 concrete, differentiated features. Do NOT repeat features across plans.
6. Revenue projections should be simple annualized math: price × users × 12, rounded.
7. Strategy should give 3 actionable, specific recommendations — no generic advice like "focus on value."
8. Warnings should flag real risks (e.g., "Your cost is too close to Starter price").

## Output format

Reply with ONLY a valid JSON object. No markdown, no code fences, no preamble. Start with "{" and end with "}".

{
  "plans": [
    { "name": "Starter", "price": "$X/mo", "features": ["...", "...", "..."] },
    { "name": "Pro", "price": "$X/mo", "features": ["...", "...", "..."] },
    { "name": "Business", "price": "$X/mo", "features": ["...", "...", "..."] }
  ],
  "revenue_projection": {
    "100_users": "$X/year",
    "500_users": "$X/year",
    "1000_users": "$X/year"
  },
  "strategy": ["...", "...", "..."],
  "warnings": ["...", "..."]
}

## Example output

Input: AI writing tool for indie hackers, cost $200/mo, no competitor data
Output:
{
  "plans": [
    { "name": "Starter", "price": "$19/mo", "features": ["10,000 words/mo", "5 AI templates", "Basic export", "Email support"] },
    { "name": "Pro", "price": "$49/mo", "features": ["Unlimited words", "50+ templates", "Priority AI generation", "API access", "Chat support"] },
    { "name": "Business", "price": "$149/mo", "features": ["Everything in Pro", "Custom AI model", "Team seats (5)", "SSO", "Dedicated support"] }
  ],
  "revenue_projection": {
    "100_users": "$58,800/year",
    "500_users": "$294,000/year",
    "1000_users": "$588,000/year"
  },
  "strategy": [
    "Launch on Product Hunt with a lifetime deal to build initial user base",
    "Add a usage-based add-on for heavy users instead of raising base prices",
    "Publish pricing page with 'most popular' badge on Pro plan to anchor value"
  ],
  "warnings": [
    "Starter plan at $19 barely covers costs — upsell path to Pro must be strong",
    "No free tier means you need strong landing page social proof to convert"
  ]
}`;
}
