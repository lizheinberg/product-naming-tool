export interface DecisionOutcome {
  architectureType: string;
  architectureDescription: string;
  nameRecommendation: string;
  nameDescription: string;
  investmentLevel: "high" | "moderate" | "low" | "minimal";
  investmentLabel: string;
  investmentDescription: string;
  considerations: string[];
}

const architectureDescriptions: Record<string, string> = {
  masterbrand:
    "One brand that replaces all portfolio brands. The holdco name becomes the single identity across the portfolio — every acquisition adopts it.",
  endorsed:
    'Each portfolio brand keeps its own identity, endorsed by the holdco — "a [HoldCo] company." The holdco brand adds trust without replacing individual brands.',
  hybrid:
    "A blend of Masterbrand and Endorsed, based on individual portfolio brand strength. The holdco leads where it fits and endorses where it doesn't.",
  pure_holding:
    "The holdco serves a corporate and legal function only. Portfolio companies operate as fully independent brands.",
};

const architectureLabels: Record<string, string> = {
  masterbrand: "Masterbrand",
  endorsed: "Endorsed",
  hybrid: "Hybrid",
  pure_holding: "Pure Holding Company",
};

export function getOutcome(
  answers: Record<string, string>
): DecisionOutcome {
  const {
    architecture_model,
    name_alignment,
    trademark,
    brand_equity,
    hold_period,
    budget,
  } = answers;

  const isCustomerFacing = architecture_model !== "pure_holding";
  const archType = architectureLabels[architecture_model] ?? architecture_model;
  const archDescription =
    architectureDescriptions[architecture_model] ?? "";

  const considerations: string[] = [];

  // ── Pure Holding Company paths ──

  if (!isCustomerFacing) {
    if (name_alignment === "yes" && trademark === "cleared") {
      return {
        architectureType: archType,
        architectureDescription: archDescription,
        nameRecommendation: 'Retain "Legal" Name',
        nameDescription:
          "Your holdco name is aligned with the portfolio scope and has adequate trademark protection. It serves its intended corporate and legal function well — no change needed.",
        investmentLevel: "minimal",
        investmentLabel: "Minimal",
        investmentDescription:
          "Maintain trademark registrations and ensure filings stay current as the portfolio evolves. No brand investment needed beyond legal maintenance.",
        considerations: [],
      };
    }

    // Pure holding: name not aligned OR trademark not cleared → new legal name
    if (name_alignment === "no") {
      considerations.push(
        "The current name doesn't align with the portfolio scope. Since this is a pure holding company, the replacement only needs to serve a legal and corporate function."
      );
    }
    if (name_alignment === "yes" && trademark === "no_partial") {
      considerations.push(
        "The name aligns with the portfolio, but trademark gaps create legal exposure. A new name with clear trademark coverage is the simpler path forward for a holding company."
      );
    }

    return {
      architectureType: archType,
      architectureDescription: archDescription,
      nameRecommendation: 'New "Legal" Name',
      nameDescription:
        "Your current holdco name either doesn't align with the portfolio scope or has trademark issues. Since this is a pure holding company, the new name only needs to serve a legal and corporate function — no brand-building required.",
      investmentLevel: "low",
      investmentLabel: "Low",
      investmentDescription:
        "New name development focused on legal and corporate requirements. Trademark clearance and basic documentation — no brand identity system needed.",
      considerations,
    };
  }

  // ── Customer-facing paths (Masterbrand, Endorsed, Hybrid) ──

  // Name aligned + Trademark cleared → Retain
  if (name_alignment === "yes" && trademark === "cleared") {
    considerations.push(
      "Your name and trademark position are strong. Focus investment on building the brand within the " +
        archType.toLowerCase() +
        " architecture you've chosen."
    );

    return {
      architectureType: archType,
      architectureDescription: archDescription,
      nameRecommendation: "Retain Existing HoldCo Name",
      nameDescription:
        "Your holdco name is broad enough to cover the portfolio and has the trademark protection to back it up. Keep it, protect it, and invest in building the brand.",
      investmentLevel: "low",
      investmentLabel: "Low",
      investmentDescription:
        "Maintain and expand trademark registrations as the portfolio grows. Invest in brand guidelines and consistent application across the portfolio — but no naming work needed.",
      considerations,
    };
  }

  // From here: customer-facing + needs a new name
  // (either name not aligned, or trademark not cleared)

  // Add equity consideration
  if (brand_equity === "significant") {
    considerations.push(
      "The current name carries meaningful brand equity. Walking away from it has real costs — factor the value of existing recognition into the transition plan."
    );
  } else if (brand_equity === "minimal") {
    considerations.push(
      "The current name carries little brand equity, which means the cost of changing is low. This is actually an advantage — you can move to a stronger name without losing much."
    );
  }

  // Add context about why a new name is needed
  if (name_alignment === "no") {
    considerations.push(
      "The current name is too narrow or limiting for the portfolio scope. A new name gives you room to grow without constant brand tension."
    );
  } else if (trademark === "no_partial") {
    considerations.push(
      "The name aligns with the portfolio, but trademark gaps create risk that grows with every acquisition. A new name with comprehensive clearance is the safer path."
    );
  }

  // Note about endorsed architecture and trademark criteria
  if (architecture_model === "endorsed") {
    considerations.push(
      "As an endorsed brand, the trademark criteria may differ from a masterbrand — but clearance is still essential. The endorsement needs to be legally protectable across the portfolio."
    );
  }

  // Short hold: < 3 years → New Descriptive / Intuitive
  if (hold_period === "3_or_less") {
    considerations.push(
      "With a short hold period, a descriptive or intuitive name is the pragmatic choice — it communicates clearly without requiring years of brand-building to gain recognition."
    );

    return {
      architectureType: archType,
      architectureDescription: archDescription,
      nameRecommendation: "New Descriptive / Intuitive Name",
      nameDescription:
        "You need a new name, and the short hold period points toward a descriptive or intuitive approach — a name that communicates what the holdco does or represents without heavy brand-building investment.",
      investmentLevel: "moderate",
      investmentLabel: "Moderate",
      investmentDescription:
        "Naming exploration focused on descriptive and intuitive directions, trademark clearance, and basic brand identity. The name should work on its own without years of marketing behind it.",
      considerations,
    };
  }

  // 3+ years with budget → New Intuitive / Associative
  if (budget === "yes") {
    considerations.push(
      "With a longer hold period and adequate resources, you can invest in a proprietary name that builds real brand equity over time. This is the path to a lasting platform brand."
    );

    return {
      architectureType: archType,
      architectureDescription: archDescription,
      nameRecommendation: "New Intuitive / Associative Name",
      nameDescription:
        "Your situation calls for a new name — one that evokes the right associations without being literally descriptive. With adequate resources and a longer hold period, you can invest in a proprietary name that compounds in value over time.",
      investmentLevel: "high",
      investmentLabel: "High",
      investmentDescription:
        "Full naming project: strategy, creative development, comprehensive trademark search, brand identity system, and launch activation across the portfolio.",
      considerations,
    };
  }

  // 3+ years without budget → New Descriptive / Intuitive
  considerations.push(
    "You have time but limited resources. A descriptive or intuitive name gives you a credible new identity without requiring the level of brand investment a fully proprietary name demands."
  );

  return {
    architectureType: archType,
    architectureDescription: archDescription,
    nameRecommendation: "New Descriptive / Intuitive Name",
    nameDescription:
      "You need a new name, but budget constraints point toward a descriptive or intuitive approach. A name that clearly communicates the holdco's role — one that works without heavy brand-building investment but can still build recognition over a longer hold period.",
    investmentLevel: "moderate",
    investmentLabel: "Moderate",
    investmentDescription:
      "Naming exploration focused on descriptive and intuitive directions, trademark clearance, and basic brand identity. Prioritize clarity and protectability over creative ambition.",
    considerations,
  };
}
