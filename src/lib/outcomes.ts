export interface DecisionOutcome {
  nameRecommendation: string;
  nameDescription: string;
  architectureRecommendation: string;
  architectureDescription: string;
  investmentLevel: "high" | "moderate" | "low" | "minimal";
  investmentLabel: string;
  investmentDescription: string;
  considerations: string[];
}

export function getOutcome(
  answers: Record<string, string>
): DecisionOutcome {
  const {
    architecture_model,
    name_alignment,
    trademark,
    hold_period,
    budget,
    brand_equity,
  } = answers;

  const isCustomerFacing = architecture_model === "customer_facing";
  const considerations: string[] = [];

  // ── Architecture Recommendation (from brand equity) ──

  let architectureRecommendation: string;
  let architectureDescription: string;

  if (!isCustomerFacing) {
    architectureRecommendation = "Discrete";
    architectureDescription =
      "The holdco operates behind the scenes. Portfolio companies maintain fully independent brands with no visible connection to the holding company.";
  } else if (brand_equity === "significant") {
    architectureRecommendation = "Endorsed or Hybrid";
    architectureDescription =
      "Your portfolio includes brands with meaningful equity worth preserving. An endorsed model lets each brand keep its identity with holdco credibility backing, while a hybrid model lets you lead with the holdco where it makes sense and preserve strong portfolio brands where they're stronger.";
  } else {
    architectureRecommendation = "Masterbrand or Endorsed";
    architectureDescription =
      "With limited existing portfolio brand equity, there's an opportunity to build unified brand power. A masterbrand approach replaces all brands with one identity, maximizing brand efficiency. An endorsed model works well if you want to maintain some brand diversity while still unifying under the holdco.";
  }

  // ── Pure Holding Company paths ──

  if (!isCustomerFacing) {
    if (name_alignment === "yes" && trademark === "cleared") {
      return {
        nameRecommendation: 'Retain "Legal" Name',
        nameDescription:
          "Your holdco name is aligned with the portfolio scope and has adequate trademark protection. It serves its intended corporate and legal function well — no change needed.",
        architectureRecommendation,
        architectureDescription,
        investmentLevel: "minimal",
        investmentLabel: "Minimal",
        investmentDescription:
          "Maintain trademark registrations and ensure filings stay current as the portfolio evolves. No brand investment needed beyond legal maintenance.",
        considerations: [],
      };
    }

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
      nameRecommendation: 'New "Legal" Name',
      nameDescription:
        "Your current holdco name either doesn't align with the portfolio scope or has trademark issues. Since this is a pure holding company, the new name only needs to serve a legal and corporate function — no brand-building required.",
      architectureRecommendation,
      architectureDescription,
      investmentLevel: "low",
      investmentLabel: "Low",
      investmentDescription:
        "New name development focused on legal and corporate requirements. Trademark clearance and basic documentation — no brand identity system needed.",
      considerations,
    };
  }

  // ── Customer-facing paths (Masterbrand, Endorsed, Hybrid) ──

  // Name aligned + Trademark cleared → Retain (or Leverage if significant equity)
  if (name_alignment === "yes" && trademark === "cleared") {
    considerations.push(
      "Your name and trademark position are strong. Focus investment on building the brand within your chosen architecture."
    );

    const nameRec =
      brand_equity === "significant"
        ? "Leverage one of the acquired brands for the HoldCo Name"
        : "Retain Existing HoldCo Name";
    const nameDesc =
      brand_equity === "significant"
        ? "One of the acquired portfolio company names is broad enough to cover the portfolio and has the trademark protection to back it up. Keep it, protect it, and invest in building the brand."
        : "Your holdco name is broad enough to cover the portfolio and has the trademark protection to back it up. Keep it, protect it, and invest in building the brand.";

    return {
      nameRecommendation: nameRec,
      nameDescription: nameDesc,
      architectureRecommendation,
      architectureDescription,
      investmentLevel: "low",
      investmentLabel: "Low",
      investmentDescription:
        "Maintain and expand trademark registrations as the portfolio grows. Invest in brand guidelines and consistent application across the portfolio — but no naming work needed.",
      considerations,
    };
  }

  // From here: customer-facing + needs a new name

  if (name_alignment === "no") {
    considerations.push(
      "The current name is too narrow or limiting for the portfolio scope. A new name gives you room to grow without constant brand tension."
    );
  } else if (trademark === "no_partial") {
    considerations.push(
      "The name aligns with the portfolio, but trademark gaps create risk that grows with every acquisition. A new name with comprehensive clearance is the safer path."
    );
  }

  // Short hold: < 3 years → New Descriptive / Intuitive
  if (hold_period === "3_or_less") {
    considerations.push(
      "With a short hold period, a descriptive or intuitive name is the pragmatic choice — it communicates clearly without requiring years of brand-building to gain recognition."
    );

    return {
      nameRecommendation: "New Descriptive / Intuitive Name",
      nameDescription:
        "You need a new name, and the short hold period points toward a descriptive or intuitive approach — a name that communicates what the holdco does or represents without heavy brand-building investment.",
      architectureRecommendation,
      architectureDescription,
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
      "With a longer hold period and adequate resources, you can invest in a proprietary name that builds real brand equity over time."
    );

    return {
      nameRecommendation: "New Intuitive / Associative Name",
      nameDescription:
        "Your situation calls for a new name — one that evokes the right associations without being literally descriptive. With adequate resources and a longer hold period, you can invest in a proprietary name that compounds in value over time.",
      architectureRecommendation,
      architectureDescription,
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
    nameRecommendation: "New Descriptive / Intuitive Name",
    nameDescription:
      "You need a new name, but budget constraints point toward a descriptive or intuitive approach. A name that clearly communicates the holdco's role — one that works without heavy brand-building investment but can still build recognition over a longer hold period.",
    architectureRecommendation,
    architectureDescription,
    investmentLevel: "moderate",
    investmentLabel: "Moderate",
    investmentDescription:
      "Naming exploration focused on descriptive and intuitive directions, trademark clearance, and basic brand identity. Prioritize clarity and protectability over creative ambition.",
    considerations,
  };
}
