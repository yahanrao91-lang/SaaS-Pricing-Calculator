import { getPricingPrompt, type PricingInput, type PricingResult } from "./prompt";

const DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1";
const MAX_RETRIES = 2;

/**
 * Strip markdown code fences that LLMs sometimes wrap JSON in.
 * e.g. ```json\n{...}\n``` → {...}
 */
function extractJson(raw: string): string {
  const trimmed = raw.trim();

  // Try to find JSON inside markdown code fences
  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }

  // If the response starts with {, return as-is
  if (trimmed.startsWith("{")) {
    return trimmed;
  }

  // Last resort: find the first { and last }
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  throw new Error("Could not extract JSON from AI response");
}

async function callDeepSeek(
  prompt: string,
  apiKey: string,
  model: string,
): Promise<string> {
  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a SaaS pricing strategist. You respond ONLY with valid JSON — no markdown, no explanation, no preamble.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4, // Lower = more consistent JSON
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(
      `DeepSeek API error (${response.status}): ${errorText.slice(0, 200)}`,
    );
  }

  const data = await response.json();

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error(
      "DeepSeek returned an empty response. The model may be overloaded.",
    );
  }

  return content;
}

export async function generatePricing(
  input: PricingInput,
): Promise<PricingResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not set in environment variables.");
  }

  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";
  const prompt = getPricingPrompt(input);

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const raw = await callDeepSeek(prompt, apiKey, model);
      const json = extractJson(raw);
      const parsed = JSON.parse(json) as PricingResult;

      // Basic validation: ensure required fields exist
      if (
        !Array.isArray(parsed.plans) ||
        parsed.plans.length === 0 ||
        !parsed.revenue_projection ||
        !Array.isArray(parsed.strategy)
      ) {
        throw new Error("AI response missing required fields");
      }

      return parsed;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry if it's an auth error
      if (lastError.message.includes("401") || lastError.message.includes("403")) {
        throw lastError;
      }

      // On last attempt, throw
      if (attempt === MAX_RETRIES) {
        throw lastError;
      }

      // Wait briefly before retry (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, 500 * Math.pow(2, attempt)),
      );
    }
  }

  // TypeScript needs this — should never reach here
  throw lastError ?? new Error("Unknown error in generatePricing");
}
