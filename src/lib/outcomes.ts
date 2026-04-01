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

  // ── Architecture (from role + brand equity) ──

  let architectureRecommendation: string;
  let architectureDescription: string;

  if (!isBrandActive) {
    // Pure holding company
    architectureRecommendation = "Discrete";
    architectureDescription =
      "The holdco operates behind the scenes. Portfolio companies maintain fully independent brands with no visible connection to the holding company.";
  } else if (isIndustryFacing) {
    architectureRecommendation = "Discrete / Hybrid";
    if (brand_equity === "significant") {
      architectureDescription =
        "The holdco brand operates as an industry-facing endorser \u2014 visible to PE firms, talent, and potential acquisitions \u2014 while portfolio companies maintain independent customer-facing identities. Strong portfolio brands retain their own market positioning and customer relationships.";
    } else {
      architectureDescription =
        "With limited portfolio brand equity, the holdco can serve as a unifying industry-facing identity \u2014 for PE relationships, employee engagement, and company culture. Portfolio companies maintain separate customer-facing identities as needed.";
    }
  } else {
    // Customer-facing
    if (brand_equity === "significant") {
      architectureRecommendation = "Endorsed or Hybrid";
      architectureDescription =
        "Your portfolio includes brands with meaningful equity worth preserving. An endorsed model lets each brand keep its identity with holdco credibility backing, while a hybrid model lets you lead with the holdco where it makes sense and preserve strong portfolio brands where they\u2019re stronger.";
    } else {
      architectureRecommendation = "Masterbrand or Endorsed";
      architectureDescription =
        "With limited existing portfolio brand equity, there\u2019s an opportunity to build unified brand power. A masterbrand approach replaces all brands with one identity, maximizing brand efficiency. An endorsed model works well if you want to maintain some brand diversity while still unifying under the holdco.";
    }
  }

  // ── Pure Holding Company paths ──

  if (!isBrandActive) {
    // Name aligned + Trademark cleared → Retain
    if (name_alignment === "yes" && trademark === "cleared") {
      return {
        nameRecommendation: 'Retain "Legal" Name',
        nameDescription:
          "Your holdco name is aligned with the portfolio scope and has adequate trademark protection. It serves its intended corporate and legal function well \u2014 no change needed.",
        architectureRecommendation,
        architectureDescription,
        investmentLevel: "minimal",
        investmentLabel: "Minimal",
        investmentDescription:
          "Maintain trademark registrations and ensure filings stay current as the portfolio evolves. No brand investment needed beyond legal maintenance.",
        considerations: [],
      };
    }

    // Name aligned + Trademark NOT cleared
    if (name_alignment === "yes" && trademark === "no_partial") {
      considerations.push(
        "The name aligns with the portfolio, but trademark gaps create legal exposure. A new name with clear trademark coverage is the simplest path forward for a holding company."
      );

      return {
        nameRecommendation: 'New "Legal" Name',
        nameDescription:
          "Your holdco name aligns with the portfolio scope but has trademark issues. Since this is a pure holding company, the new name only needs to serve a legal and corporate function \u2014 no brand-building required.",
        architectureRecommendation,
        architectureDescription,
        investmentLevel: "low",
        investmentLabel: "Low",
        investmentDescription:
          "New name development focused on legal and corporate requirements. Trademark clearance and basic documentation \u2014 no brand identity system needed.",
        considerations,
      };
    }

    // Name NOT aligned + Trademark cleared
    if (name_alignment === "no" && trademark === "cleared") {
      considerations.push(
        "The current name doesn\u2019t align with the portfolio scope. Since this is a pure holding company, the replacement only needs to serve a legal and corporate function."
      );

      return {
        nameRecommendation: 'New "Legal" Name',
        nameDescription:
          "Your holdco name doesn\u2019t align with the portfolio scope. Since this is a pure holding company, the new name only needs to serve a legal and corporate function \u2014 no brand-building required.",
        architectureRecommendation,
        architectureDescription,
        investmentLevel: "low",
        investmentLabel: "Low",
        investmentDescription:
          "New name development focused on legal and corporate requirements. Trademark clearance and basic documentation \u2014 no brand identity system needed.",
        considerations,
      };
    }

    // Name NOT aligned + Trademark NOT cleared
    considerations.push(
      "The current name doesn\u2019t align with the portfolio scope and has trademark gaps. Since this is a pure holding company, the replacement only needs to serve a legal and corporate function."
    );

    return {
      nameRecommendation: 'New "Legal" Name',
      nameDescription:
        "Your holdco name doesn\u2019t align with the portfolio scope and has trademark issues. Since this is a pure holding company, the new name only needs to serve a legal and corporate function \u2014 no brand-building required.",
      architectureRecommendation,
      architectureDescription,
      investmentLevel: "low",
      investmentLabel: "Low",
      investmentDescription:
        "New name development focused on legal and corporate requirements. Trademark clearance and basic documentation \u2014 no brand identity system needed.",
      considerations,
    };
  }

  // ── Brand-active paths (Customer-facing and Industry-facing) ──

  // Name aligned + Trademark cleared → Retain (or Leverage if significant equity)
  if (name_alignment === "yes" && trademark === "cleared") {
    considerations.push(
      isIndustryFacing
        ? "Your name and trademark position are strong. Focus investment on building industry presence and internal culture around the holdco brand."
        : "Your name and trademark position are strong. Focus investment on building the brand within your chosen architecture."
    );

    const nameRec =
      brand_equity === "significant"
        ? "Leverage One of the Acquired Brands for the HoldCo Name"
        : "Retain Existing HoldCo Name or Leverage One of the Acquired Brands for the HoldCo Name";
    const nameDesc =
      brand_equity === "significant"
        ? "One of the acquired portfolio company names is broad enough to cover the portfolio and has the trademark protection to back it up. Keep it, protect it, and invest in building the brand."
        : "Your holdco name is broad enough to cover the portfolio and has the trademark protection to back it up. Keep it, protect it, and invest in building the brand.";

    let nextSteps: string;
    if (isIndustryFacing) {
      nextSteps =
        brand_equity === "significant"
          ? "Maintain trademark registrations in relevant industry classes. Invest in industry-facing brand presence \u2014 investor materials, talent brand, and portfolio company communications \u2014 but no consumer brand investment needed.\n\n" + PLEASE_NOTE
          : "Maintain trademark registrations in relevant industry classes. Invest in industry-facing brand presence \u2014 investor materials, talent brand, and portfolio company communications \u2014 but no consumer brand identity system needed.\n\n" + PLEASE_NOTE;
    } else {
      nextSteps =
        "Maintain and expand trademark registrations as the portfolio grows. Invest in brand guidelines and consistent application across the portfolio \u2014 but no naming work needed.\n\n" + PLEASE_NOTE;
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

  // From here: brand-active + needs a new name

  if (name_alignment === "no") {
    considerations.push(
      "The current name is too narrow or limiting for the portfolio scope. A new name gives you room to grow without constant brand tension."
    );
  } else if (trademark === "no_partial") {
    considerations.push(
      isIndustryFacing
        ? "The name aligns with the portfolio, but trademark gaps create risk \u2014 even with fewer required classes for an industry-facing brand, clearance is essential. A new name with comprehensive clearance is the safer path."
        : "The name aligns with the portfolio, but trademark gaps create risk that grows with every acquisition. A new name with comprehensive clearance is the safer path."
    );
  }

  // Short hold: < 3 years → New Descriptive / Intuitive
  if (hold_period === "3_or_less") {
    considerations.push(
      "With a short hold period, a descriptive or intuitive name is the pragmatic choice \u2014 it communicates clearly without requiring years of brand-building to gain recognition."
    );

    return {
      nameRecommendation: "New Descriptive / Intuitive Name",
      nameDescription:
        "You need a new name, and the short hold period points toward a descriptive or intuitive approach \u2014 a name that communicates what the holdco does or represents without heavy brand-building investment.",
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
        ? "Your situation calls for a new name \u2014 one that evokes the right associations without being literally descriptive. With adequate resources and a longer hold period, you can invest in a proprietary name that builds industry credibility and compounds in value over time."
        : "Your situation calls for a new name \u2014 one that evokes the right associations without being literally descriptive. With adequate resources and a longer hold period, you can invest in a proprietary name that compounds in value over time.",
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
      ? "You need a new name, but budget constraints point toward a descriptive or intuitive approach. A name that clearly communicates the holdco\u2019s industry role \u2014 one that works without heavy brand-building investment but can still build recognition over a longer hold period."
      : "You need a new name, but budget constraints point toward a descriptive or intuitive approach. A name that clearly communicates the holdco\u2019s role \u2014 one that works without heavy brand-building investment but can still build recognition over a longer hold period.",
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
