export interface Outcome {
  nameType: string;
  nameTypeDetail: string;
  architecture: string;
  investmentLevel: "Light" | "Light to Moderate" | "Moderate" | "Moderate to High" | "High" | "Minimal" | "Varies";
  investmentDetail: string;
  examples: string;
  needsBrainstorm: boolean;
  brainstormType?: "descriptor" | "descriptive" | "creative" | "coined";
  disclaimer?: string;
}

export function getOutcome(answers: Record<string, string>): Outcome {
  // ── Existing product paths ──────────────────────────────
  if (answers.classification === "existing") {
    if (answers.existing_type === "line_extension") {
      return {
        nameType: "Line Extension",
        nameTypeDetail:
          "Use your existing product name with a new descriptor (flavor, tier, size, etc.)",
        architecture: "Descriptive Extension",
        investmentLevel: "Light",
        investmentDetail:
          "Descriptor development and trademark check. No new brand name needed.",
        examples: "Think: iPhone 16, Coke Zero, Tide Pods",
        needsBrainstorm: true,
        brainstormType: "descriptor",
      };
    }
    if (answers.existing_type === "new_market") {
      return {
        nameType: "Market Adaptation",
        nameTypeDetail:
          "Keep your existing product name, but you may need a new descriptor or tagline for the new market.",
        architecture: "Endorsed or Descriptive",
        investmentLevel: "Light to Moderate",
        investmentDetail:
          "Market research, possible descriptor work, and trademark clearance in new markets.",
        examples:
          "Think: Uber Eats (new market), Google Workspace (rebrand for enterprise)",
        needsBrainstorm: true,
        brainstormType: "descriptor",
      };
    }
    if (answers.existing_type === "next_gen") {
      return {
        nameType: "Next Generation",
        nameTypeDetail:
          "Keep your existing product name with the existing or updated version descriptor.",
        architecture: "Existing Brand",
        investmentLevel: "Minimal",
        investmentDetail:
          "Version numbering or generational naming convention. Minimal creative work needed.",
        examples: "Think: PlayStation 5, macOS Ventura, Windows 11",
        needsBrainstorm: false,
      };
    }
  }

  // ── New product paths ───────────────────────────────────
  const { lifespan, market_factors, positioning, resources, parent_brand } =
    answers;

  // Short lifespan + parity
  if (lifespan === "short" && market_factors === "parity") {
    return {
      nameType: "Descriptive / Generic Name",
      nameTypeDetail:
        "A straightforward, descriptive name that communicates what the product does. No need for a coined or proprietary name.",
      architecture: "Descriptive",
      investmentLevel: "Light",
      investmentDetail:
        "Descriptor development with basic trademark screening. Minimal brand-building required.",
      examples: "Think: Amazon Prime Video, Google Maps, Microsoft Teams",
      needsBrainstorm: true,
      brainstormType: "descriptive",
    };
  }

  // Short lifespan + advantage
  if (lifespan === "short" && market_factors === "advantage") {
    if (positioning === "non_core") {
      return {
        nameType: "Proprietary / Intuitive to Associative",
        nameTypeDetail:
          "A name with its own identity, but visibly connected to the parent. Good for when you want credibility from the parent brand but need to signal something new.",
        architecture: "Endorsed Brand",
        investmentLevel: "Moderate",
        investmentDetail:
          "Creative naming, trademark screening, and brand identity development. Some launch marketing budget needed.",
        examples: "Think: Courtyard by Marriott, Polo by Ralph Lauren",
        needsBrainstorm: true,
        brainstormType: "creative",
      };
    }
    return {
      nameType: "Proprietary / Intuitive to Associative",
      nameTypeDetail:
        "A name that lives under the parent brand. It gets its own identity but stays clearly connected.",
      architecture: "Sub-Brand",
      investmentLevel: "Moderate",
      investmentDetail:
        "Naming strategy, creative development, trademark clearance, and brand guidelines. Moderate launch investment.",
      examples: "Think: Apple TV+, Nike Air, Amazon Prime",
      needsBrainstorm: true,
      brainstormType: "creative",
    };
  }

  // ── Long lifespan paths ─────────────────────────────────

  // Advantage + non-core + above resources = freestanding
  if (
    market_factors === "advantage" &&
    positioning === "non_core" &&
    resources === "above"
  ) {
    return {
      nameType: "Proprietary / Intuitive to Associative",
      nameTypeDetail:
        "A completely original, proprietary name with no visible connection to the parent brand. This is the highest level of naming investment — and the hardest to get right.",
      architecture: "Freestanding Brand",
      investmentLevel: "High",
      investmentDetail:
        "Full naming project: strategy, extensive creative development, comprehensive trademark search, brand identity system, and significant launch marketing.",
      examples: "Think: Acura (Honda), Lexus (Toyota), AWS (Amazon)",
      needsBrainstorm: true,
      brainstormType: "coined",
      disclaimer:
        "Coined names are the most challenging type of naming work. The creative exploration is broader, trademark clearance is harder, and the investment in brand-building is significant. Most companies underestimate what this takes.",
    };
  }

  // Advantage + non-core + below resources = endorsed
  if (
    market_factors === "advantage" &&
    positioning === "non_core" &&
    resources === "below"
  ) {
    return {
      nameType: "Proprietary / Intuitive to Associative",
      nameTypeDetail:
        "A name with its own identity, endorsed by the parent brand. This lets you signal something new without bearing the full cost of building a brand from scratch.",
      architecture: "Endorsed Brand",
      investmentLevel: "Moderate",
      investmentDetail:
        "Creative naming, trademark screening, brand identity basics. The parent brand does some of the heavy lifting.",
      examples: "Think: Courtyard by Marriott, Polo by Ralph Lauren",
      needsBrainstorm: true,
      brainstormType: "creative",
    };
  }

  // Advantage + core + above resources
  if (
    market_factors === "advantage" &&
    positioning === "core" &&
    resources === "above"
  ) {
    if (parent_brand === "yes") {
      return {
        nameType: "Proprietary / Intuitive to Associative",
        nameTypeDetail:
          "A distinctive name that lives under the parent brand. Strongest option when you have a competitive advantage within your core business and want to leverage existing brand equity.",
        architecture: "Sub-Brand",
        investmentLevel: "Moderate to High",
        investmentDetail:
          "Naming strategy, creative development, trademark clearance, brand guidelines, and meaningful launch investment.",
        examples: "Think: iPhone (Apple), Pixel (Google), Prime (Amazon)",
        needsBrainstorm: true,
        brainstormType: "creative",
      };
    }
    return {
      nameType: "Proprietary / Intuitive to Associative",
      nameTypeDetail:
        "A completely original, proprietary name. Since this sits within your core business but doesn't need to connect to the parent, you have creative freedom — but you also have a bigger branding job ahead.",
      architecture: "Freestanding Brand",
      investmentLevel: "High",
      investmentDetail:
        "Full naming project: strategy, extensive creative development, comprehensive trademark search, brand identity system, and significant launch marketing.",
      examples: "Think: Acura (Honda), Lexus (Toyota)",
      needsBrainstorm: true,
      brainstormType: "coined",
      disclaimer:
        "Coined names are the most challenging type of naming work. The creative exploration is broader, trademark clearance is harder, and the investment in brand-building is significant.",
    };
  }

  // Advantage + core + below resources = sub-brand
  if (
    market_factors === "advantage" &&
    positioning === "core" &&
    resources === "below"
  ) {
    return {
      nameType: "Proprietary / Intuitive to Associative",
      nameTypeDetail:
        "A name under the parent brand umbrella. With limited resources, leveraging the parent brand's equity is the smart move.",
      architecture: "Sub-Brand",
      investmentLevel: "Moderate",
      investmentDetail:
        "Naming strategy, creative development, trademark clearance. The parent brand reduces your marketing burden.",
      examples: "Think: Nike Air, Apple TV+, Amazon Fresh",
      needsBrainstorm: true,
      brainstormType: "creative",
    };
  }

  // Parity + non-core
  if (market_factors === "parity" && positioning === "non_core") {
    if (resources === "above") {
      return {
        nameType: "Proprietary / Intuitive to Associative",
        nameTypeDetail:
          "An endorsed name makes sense here. You're at parity in a non-core area, so the parent brand endorsement adds credibility while giving the product its own identity.",
        architecture: "Endorsed Brand",
        investmentLevel: "Moderate",
        investmentDetail:
          "Creative naming, trademark screening, brand identity development with parent brand integration.",
        examples: "Think: Courtyard by Marriott, Fairfield by Marriott",
        needsBrainstorm: true,
        brainstormType: "creative",
      };
    }
    return {
      nameType: "Descriptive / Generic Name",
      nameTypeDetail:
        "A straightforward, descriptive name. Without differentiation, limited resources, and a non-core positioning, a descriptive approach is the pragmatic call.",
      architecture: "Descriptive",
      investmentLevel: "Light",
      investmentDetail:
        "Descriptor development with basic trademark screening.",
      examples: "Think: Google Maps, Amazon Music, Microsoft Teams",
      needsBrainstorm: true,
      brainstormType: "descriptive",
    };
  }

  // Parity + core
  if (market_factors === "parity" && positioning === "core") {
    return {
      nameType: "Descriptive Sub-Brand",
      nameTypeDetail:
        "A descriptive name under the parent brand. When you're at parity within your core business, lean on the parent brand and keep the name functional.",
      architecture: "Descriptive Sub-Brand",
      investmentLevel: "Light to Moderate",
      investmentDetail:
        "Descriptor strategy and trademark check. Parent brand carries the weight.",
      examples: "Think: Apple Music, Google Docs, Amazon Fresh",
      needsBrainstorm: true,
      brainstormType: "descriptive",
    };
  }

  // Fallback
  return {
    nameType: "Custom Assessment Needed",
    nameTypeDetail:
      "Your situation doesn't map neatly to a standard naming path. That's not a bad thing — it just means the answer requires more nuance than a decision tree can provide.",
    architecture: "TBD",
    investmentLevel: "Varies",
    investmentDetail:
      "We'd recommend talking to a naming strategist to work through the specifics.",
    examples: "",
    needsBrainstorm: false,
  };
}
