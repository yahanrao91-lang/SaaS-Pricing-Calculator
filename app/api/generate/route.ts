import { NextRequest, NextResponse } from "next/server";
import { generatePricing } from "@/lib/ai";
import type { PricingResult } from "@/lib/prompt";

// ── Minimal in-memory rate limiter (per IP, 5 requests per minute) ──
const rateLimit = new Map<string, number[]>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimit.get(ip) ?? []).filter(
    (t) => now - t < WINDOW_MS,
  );
  if (timestamps.length >= MAX_REQUESTS) return true;
  timestamps.push(now);
  rateLimit.set(ip, timestamps);
  return false;
}

// ── Input validation ──
function validateInput(body: Record<string, unknown>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!body.productType || typeof body.productType !== "string") {
    errors.push("productType is required and must be a string");
  }
  if (!body.targetUser || typeof body.targetUser !== "string") {
    errors.push("targetUser is required and must be a string");
  }
  const cost = Number(body.monthlyCost);
  if (isNaN(cost) || cost < 0) {
    errors.push("monthlyCost must be a positive number");
  }
  if (body.competitorPrice !== undefined && body.competitorPrice !== "") {
    const comp = Number(body.competitorPrice);
    if (isNaN(comp) || comp < 0) {
      errors.push("competitorPrice must be a positive number or empty");
    }
  }

  return { valid: errors.length === 0, errors };
}

export async function POST(request: NextRequest) {
  // ── Rate limit check ──
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  // ── Parse body ──
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body." },
      { status: 400 },
    );
  }

  // ── Validate ──
  const { valid, errors } = validateInput(body);
  if (!valid) {
    return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
  }

  // ── Generate pricing ──
  try {
    const fullResult: PricingResult = await generatePricing({
      productType: body.productType as string,
      targetUser: body.targetUser as string,
      monthlyCost: Number(body.monthlyCost),
      competitorPrice:
        body.competitorPrice !== undefined && body.competitorPrice !== ""
          ? Number(body.competitorPrice)
          : undefined,
    });

    return NextResponse.json(fullResult);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    // Don't leak API key errors to the client
    if (message.includes("API key") || message.includes("401") || message.includes("403")) {
      console.error("DeepSeek auth error — check your DEEPSEEK_API_KEY in .env.local");
      return NextResponse.json(
        { error: "AI service configuration error. Please try again later." },
        { status: 500 },
      );
    }

    console.error("Pricing generation error:", message);
    return NextResponse.json(
      { error: "Failed to generate pricing. Please try again." },
      { status: 500 },
    );
  }
}
