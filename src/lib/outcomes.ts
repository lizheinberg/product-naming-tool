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

const PLEASE_NOTE =
  "Please note: Internal communication and portfolio company receptivity is important; sometimes even if all signs point to leveraging one of the portfolio brands for the holdco name, internal politics can make a new name and a fresh start a compelling option.";

/** True when the effective TM status is "cleared" — either directly or via search */
function tmIsCleared(answers: Record<string, string>): boolean {
  return (
    answers.trademark === "cleared" || answers.tm_search_result === "clear"
  );
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
  const isIndustryFacing = architecture_model === "industry_facing";
  const isBrandActive = isCustomerFacing || isIndustryFacing;
  const considerations: string[] = [];

  const effectiveTmCleared = tmIsCleared(answers);

  // ── Architecture (from role + brand equity) ──
  // On "new name" paths, brand_equity may not be set — default to treating
  // it as unknown/not a factor for architecture framing.

  let architectureRecommendation: string;
  let architectureDescription: string;

  if (!isBrandActive) {
    // Pure holding company
    architectureRecommendation = "Discrete";
    architectureDescription =
      "The holdco operates behind the scenes. Portfolio companies maintain fully independent brands with no visible connection to the holding company.";
  } else if (isIndustryFacing) {
    if (brand_equity === "significant") {
      architectureRecommendation = "Discrete / Hybrid / Masterbrand";
      architectureDescription =
        "This brand can operate as an industry-facing endorser, a hybrid identity, or even evolve toward a masterbrand-dominant model with select portfolio brands remaining. Strong portfolio brands may retain their own customer-facing identities, or you may choose to unify under the holdco over time.";
    } else {
      architectureRecommendation = "Discrete / Hybrid / Endorsed";
      architectureDescription =
        "The holdco can serve as a unifying industry-facing identity — for PE relationships, employee engagement, and company culture. Portfolio companies maintain separate customer-facing identities as needed.";
    }
  } else {
    // Customer-facing
    if (brand_equity === "significant") {
      architectureRecommendation = "Endorsed or Hybrid";
      architectureDescription =
        "Your portfolio includes brands with meaningful equity worth preserving. An endorsed model lets each brand keep its identity with holdco credibility backing, while a hybrid model lets you lead with the holdco where it makes sense and preserve strong portfolio brands where they're stronger.";
    } else {
      architectureRecommendation = "Masterbrand or Endorsed";
      architectureDescription =
        "There's an opportunity to build unified brand power. A masterbrand approach replaces all brands with one identity, maximizing brand efficiency. An endorsed model works well if you want to maintain some brand diversity while still unifying under the holdco.";
    }
  }

  // ── Pure Holding Company paths ──

  if (!isBrandActive) {
    // Aligned + TM cleared → Retain
    if (name_alignment === "yes" && effectiveTmCleared) {
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

    // Aligned + TM conflict → New legal name
    if (name_alignment === "yes" && !effectiveTmCleared) {
      considerations.push(
        "The name aligns with the portfolio, but trademark gaps create legal exposure. A new name with clear trademark coverage is the simplest path forward for a holding company."
      );

      return {
        nameRecommendation: 'New "Legal" Name',
        nameDescription:
          "Your holdco name aligns with the portfolio scope but has trademark issues. Since this is a pure holding company, the new name only needs to serve a legal and corporate function — no brand-building required.",
        architectureRecommendation,
        architectureDescription,
        investmentLevel: "low",
        investmentLabel: "Low",
        investmentDescription:
          "New name development focused on legal and corporate requirements. Trademark clearance and basic documentation — no brand identity system needed.",
        considerations,
      };
    }

    // Not aligned → New legal name (TM doesn't matter)
    considerations.push(
      "The current name doesn't align with the portfolio scope. Since this is a pure holding company, the replacement only needs to serve a legal and corporate function."
    );

    return {
      nameRecommendation: 'New "Legal" Name',
      nameDescription:
        "Your holdco name doesn't align with the portfolio scope. Since this is a pure holding company, the new name only needs to serve a legal and corporate function — no brand-building required.",
      architectureRecommendation,
      architectureDescription,
      investmentLevel: "low",
      investmentLabel: "Low",
      investmentDescription:
        "New name development focused on legal and corporate requirements. Trademark clearance and basic documentation — no brand identity system needed.",
      considerations,
    };
  }

  // ── Brand-active paths (Customer-facing and Industry-facing) ──

  // ── Retain path: Aligned + TM cleared ──
  if (name_alignment === "yes" && effectiveTmCleared) {
    if (isIndustryFacing) {
      considerations.push(
        "Depending on the chosen brand architecture, this could become the Holdco name. If not, consider building an endorsed or discrete architecture and retaining the acquired brand(s) that meet the criteria at the portco level."
      );
    } else {
      considerations.push(
        "Your name and trademark position are strong. Focus investment on building the brand within your chosen architecture."
      );
    }

    let nameRec: string;
    let nameDesc: string;
    if (isIndustryFacing) {
      nameRec = "Consider Leveraging One of the Acquired Brands as the HoldCo Name";
      nameDesc =
        "One of the acquired portfolio company names is broad enough to cover the portfolio and has the trademark protection to back it up. Keep it, protect it, and invest in building the brand.";
    } else if (brand_equity === "significant") {
      nameRec = "Leverage One of the Acquired Brands for the HoldCo Name";
      nameDesc =
        "One of the acquired portfolio company names is broad enough to cover the portfolio and has the trademark protection to back it up. Keep it, protect it, and invest in building the brand.";
    } else {
      nameRec = "Retain Existing HoldCo Name or Leverage One of the Acquired Brands for the HoldCo Name";
      nameDesc =
        "Your holdco name is broad enough to cover the portfolio and has the trademark protection to back it up. Keep it, protect it, and invest in building the brand.";
    }

    let nextSteps: string;
    if (isIndustryFacing) {
      nextSteps =
        brand_equity === "significant"
          ? "Maintain trademark registrations in relevant industry classes. Invest in industry-facing brand presence — investor materials, talent brand, and portfolio company communications — but no consumer brand investment needed.\n\n" + PLEASE_NOTE
          : "Maintain trademark registrations in relevant industry classes. Invest in industry-facing brand presence — investor materials, talent brand, and portfolio company communications — but no consumer brand identity system needed.\n\n" + PLEASE_NOTE;
    } else {
      nextSteps =
        "Maintain and expand trademark registrations as the portfolio grows. Invest in brand guidelines and consistent application across the portfolio — but no naming work needed.\n\n" + PLEASE_NOTE;
    }

    return {
      nameRecommendation: nameRec,
      nameDescription: nameDesc,
      architectureRecommendation,
      architectureDescription,
      investmentLevel: "low",
      investmentLabel: "Low",
      investmentDescription: nextSteps,
      considerations,
    };
  }

  // ── New name paths ──

  if (name_alignment === "no") {
    considerations.push(
      "The current name is too narrow or limiting for the portfolio scope. A new name gives you room to grow without constant brand tension."
    );
  } else {
    // Aligned but TM conflict
    considerations.push(
      isIndustryFacing
        ? "The name aligns with the portfolio, but trademark conflicts create risk — even with fewer required classes for an industry-facing brand, clearance is essential. A new name with comprehensive clearance is the safer path."
        : "The name aligns with the portfolio, but trademark conflicts create risk that grows with every acquisition. A new name with comprehensive clearance is the safer path."
    );
  }

  // If any portfolio brands have significant equity and the architecture
  // is endorsed or discrete, trademark may still matter at the portco level —
  // but if the portco stays in its current geography/G&S, existing coverage
  // is likely sufficient. Add a consideration note for this scenario.
  if (name_alignment === "no" && isBrandActive) {
    considerations.push(
      "If any of the portfolio brands have significant equity and you plan to use an endorsed architecture model, consider the trademark status of those individual brands — particularly if you plan to expand their geographic reach or goods & services scope. If a strong portco brand will continue operating in its current market, existing trademark coverage is likely sufficient."
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
      investmentDescription: isIndustryFacing
        ? "Naming exploration focused on descriptive and intuitive directions, trademark clearance in relevant industry classes, and basic brand identity for industry-facing use. The name should communicate credibility without years of marketing behind it."
        : "Naming exploration focused on descriptive and intuitive directions, trademark clearance, and basic brand identity. The name should work on its own without years of marketing behind it.",
      considerations,
    };
  }

  // 3+ years with budget → New Intuitive / Associative
  if (budget === "yes") {
    considerations.push(
      isIndustryFacing
        ? "With a longer hold period and adequate resources, you can invest in a proprietary name that builds real brand equity within the industry over time."
        : "With a longer hold period and adequate resources, you can invest in a proprietary name that builds real brand equity over time."
    );

    return {
      nameRecommendation: "New Intuitive / Associative Name",
      nameDescription: isIndustryFacing
        ? "Your situation calls for a new name — one that evokes the right associations without being literally descriptive. With adequate resources and a longer hold period, you can invest in a proprietary name that builds industry credibility and compounds in value over time."
        : "Your situation calls for a new name — one that evokes the right associations without being literally descriptive. With adequate resources and a longer hold period, you can invest in a proprietary name that compounds in value over time.",
      architectureRecommendation,
      architectureDescription,
      investmentLevel: "high",
      investmentLabel: "High",
      investmentDescription: isIndustryFacing
        ? "Full naming project: strategy, creative development, trademark search in relevant industry classes, brand identity system for industry-facing use, and launch activation across the portfolio."
        : "Full naming project: strategy, creative development, comprehensive trademark search, brand identity system, and launch activation across the portfolio.",
      considerations,
    };
  }

  // 3+ years without budget → New Descriptive / Intuitive
  considerations.push(
    isIndustryFacing
      ? "You have time but limited resources. A descriptive or intuitive name gives you a credible industry-facing identity without requiring the level of brand investment a fully proprietary name demands."
      : "You have time but limited resources. A descriptive or intuitive name gives you a credible new identity without requiring the level of brand investment a fully proprietary name demands."
  );

  return {
    nameRecommendation: "New Descriptive / Intuitive Name",
    nameDescription: isIndustryFacing
      ? "You need a new name, but budget constraints point toward a descriptive or intuitive approach. A name that clearly communicates the holdco's industry role — one that works without heavy brand-building investment but can still build recognition over a longer hold period."
      : "You need a new name, but budget constraints point toward a descriptive or intuitive approach. A name that clearly communicates the holdco's role — one that works without heavy brand-building investment but can still build recognition over a longer hold period.",
    architectureRecommendation,
    architectureDescription,
    investmentLevel: "moderate",
    investmentLabel: "Moderate",
    investmentDescription: isIndustryFacing
      ? "Naming exploration focused on descriptive and intuitive directions, trademark clearance in relevant industry classes, and basic brand identity for industry-facing use. Prioritize clarity and protectability over creative ambition."
      : "Naming exploration focused on descriptive and intuitive directions, trademark clearance, and basic brand identity. Prioritize clarity and protectability over creative ambition.",
    considerations,
  };
}
