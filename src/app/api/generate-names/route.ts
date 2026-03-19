import Anthropic from "@anthropic-ai/sdk";
import type { GenerateNamesRequest, NameSuggestion } from "@/lib/types";

function buildPrompt(
  brainstormAnswers: Record<string, string | string[]>,
  selectedChips: string[],
  outcome: { nameType: string; brainstormType: string; architecture: string }
): string {
  const ba = brainstormAnswers;
  const toneList = selectedChips.join(", ");

  const intlMap: Record<string, string> = {
    english: "English-speaking markets only",
    global: "Global — needs to work across languages and cultures",
    specific: "Specific regions",
  };

  const isDescriptor = outcome.brainstormType === "descriptor";

  return `NAMING TYPE: ${outcome.nameType}
ARCHITECTURE: ${outcome.architecture}

BRIEF:
- Product: ${ba.product_description || "Not specified"}
- Target Audience: ${ba.target_audience || "Not specified"}
- Key Differentiator: ${ba.differentiator || "Not specified"}
- Category: ${ba.category || "Not specified"}
- Parent Brand: ${ba.parent_brand_name || "None"}
- Desired Tone: ${toneList || "Not specified"}
- Themes to Explore: ${ba.explore_themes || "None specified"}
- Themes to Avoid: ${ba.avoid_themes || "None specified"}
- International Scope: ${intlMap[(ba.international as string) || ""] || "Not specified"}

INSTRUCTIONS:
- Generate exactly 10 descriptive name suggestions.
- Each name should be clear, functional, and communicate what the product does or what makes it valuable.
${
  isDescriptor
    ? `- These are DESCRIPTORS — short modifiers that work alongside the parent brand "${ba.parent_brand_name || "[Brand]"}". Generate only the descriptor portion (e.g. "Pro", "Connect", "360"), not the full branded name.`
    : "- These are STANDALONE descriptive names that clearly convey the product's function or value proposition."
}
- Names should feel real and market-ready, not generic or placeholder-ish.
- Reflect the desired tone: ${toneList || "professional and clear"}.
${ba.explore_themes ? `- Lean into these themes: ${ba.explore_themes}` : ""}
${ba.avoid_themes ? `- Avoid these themes or words: ${ba.avoid_themes}` : ""}
${(ba.international as string) === "global" ? "- Names must be simple, translatable, and culturally neutral across languages." : ""}

Respond with ONLY a JSON array. No markdown, no code fences, no explanation outside the JSON. Each element must be an object with "name" (string) and "rationale" (string, 1 sentence explaining why this name works).`;
}

export async function POST(request: Request) {
  try {
    const body: GenerateNamesRequest = await request.json();
    const { brainstormAnswers, selectedChips, outcome } = body;

    // Validate brainstormType
    if (
      !outcome?.brainstormType ||
      !["descriptor", "descriptive"].includes(outcome.brainstormType)
    ) {
      return Response.json(
        {
          error:
            "Name generation is only available for descriptive name types.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "API configuration error. Please contact support." },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });
    const prompt = buildPrompt(brainstormAnswers, selectedChips, outcome);

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system:
        "You are an expert brand naming strategist specializing in descriptive and functional product names. You always respond with valid JSON only — no markdown fences, no commentary, no explanation outside the JSON structure.",
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((c) => c.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return Response.json(
        { error: "No response generated." },
        { status: 500 }
      );
    }

    // Strip markdown fences if Claude added them anyway
    let text = textBlock.text.trim();
    if (text.startsWith("```")) {
      text = text.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }

    const names: NameSuggestion[] = JSON.parse(text);

    // Basic validation
    if (
      !Array.isArray(names) ||
      names.length === 0 ||
      !names[0].name ||
      !names[0].rationale
    ) {
      return Response.json(
        { error: "Received an unexpected response format." },
        { status: 500 }
      );
    }

    return Response.json({ names });
  } catch (error) {
    console.error("Name generation error:", error);
    return Response.json(
      { error: "Failed to generate names. Please try again." },
      { status: 500 }
    );
  }
}
