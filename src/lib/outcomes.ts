export interface DecisionOutcome {
  architectureType: "monolithic" | "endorsed" | "hybrid" | "discrete";
  architectureLabel: string;
  architectureDescription: string;
  nameType: string;
  nameDescription: string;
  investmentLevel: "high" | "moderate" | "low";
  investmentLabel: string;
  investmentDescription: string;
  considerations: string[];
}

export function getOutcome(
  answers: Record<string, string>
): DecisionOutcome {
  const {
    brand_role,
    name_coverage,
    trademark,
    budget,
    hold_period,
    existing_equity,
  } = answers;

  // ── Step 1: Determine architecture type from brand role + name coverage ──

  let architectureType: DecisionOutcome["architectureType"];

  if (brand_role === "corporate") {
    architectureType = "discrete";
  } else if (brand_role === "umbrella") {
    if (name_coverage === "broad") {
      architectureType = "monolithic";
    } else if (name_coverage === "stretch") {
      architectureType = "hybrid";
    } else {
      // narrow — name can't support umbrella role
      architectureType = "discrete";
    }
  } else {
    // endorsed
    if (name_coverage === "narrow") {
      architectureType = "hybrid";
    } else {
      architectureType = "endorsed";
    }
  }

  // Short hold + no budget downgrades ambitions
  if (budget === "no" && hold_period === "short") {
    if (architectureType === "monolithic") architectureType = "endorsed";
    if (architectureType === "hybrid") architectureType = "discrete";
  }

  // ── Step 2: Determine investment level from hold period + budget ──

  let investmentLevel: DecisionOutcome["investmentLevel"];

  if (hold_period === "short") {
    investmentLevel = "low";
  } else if (hold_period === "long" && budget === "yes") {
    investmentLevel = architectureType === "discrete" ? "moderate" : "high";
  } else if (hold_period === "standard" && budget === "yes") {
    investmentLevel = architectureType === "discrete" ? "low" : "moderate";
  } else {
    // standard or long hold, but no budget
    investmentLevel = "low";
  }

  // ── Step 3: Architecture descriptions ──

  const archDescriptions: Record<
    DecisionOutcome["architectureType"],
    { label: string; description: string }
  > = {
    monolithic: {
      label: "Monolithic",
      description:
        "Unify all portfolio companies under a single holdco brand. The holdco name becomes the primary brand identity across the portfolio — every acquisition adopts it.",
    },
    endorsed: {
      label: "Endorsed",
      description:
        'Portfolio companies retain their own brand identities, with the holdco name serving as a credibility endorsement — "a [HoldCo] company." The holdco brand adds trust without replacing individual brands.',
    },
    hybrid: {
      label: "Hybrid",
      description:
        "Use the holdco brand as the primary identity where it fits naturally, while portfolio companies in less-aligned areas maintain independent brands with optional endorsement. This gives you flexibility as the portfolio evolves.",
    },
    discrete: {
      label: "Discrete",
      description:
        "Portfolio companies operate as fully independent brands. The holdco name serves a corporate and legal function only — it doesn't need to resonate with end customers.",
    },
  };

  // ── Step 4: Determine name type from architecture + inputs ──

  let nameType: string;
  let nameDescription: string;

  if (architectureType === "discrete" && brand_role === "corporate") {
    nameType = "Functional name";
    nameDescription =
      "Your holdco name serves a legal and administrative purpose. It doesn't need to carry brand weight, tell a story, or appeal to customers — it just needs to be clear and protectable.";
  } else if (
    architectureType === "discrete" &&
    brand_role === "umbrella" &&
    name_coverage === "narrow"
  ) {
    if (existing_equity === "significant") {
      nameType = "Name evolution needed";
      nameDescription =
        "Your current name carries equity but can't support the umbrella role you envision. Consider evolving the name to be broader while preserving the recognition you've built — or shift to an endorsed architecture that works with the name as-is.";
    } else {
      nameType = "New name recommended";
      nameDescription =
        "Your current name is too narrow for the umbrella role you want it to play, and there's little equity to protect. This is a good time to develop a new, broader platform name — or reconsider whether an endorsed or discrete architecture better fits your reality.";
    }
  } else if (architectureType === "monolithic") {
    if (name_coverage === "broad" && trademark === "cleared") {
      nameType = "Platform brand";
      nameDescription =
        "Your name has the breadth and legal protection to serve as a unifying platform brand across the portfolio. Invest in building it as the single face of the organization.";
    } else {
      nameType = "Platform brand — gaps to address";
      nameDescription =
        "Your name has the potential to unify the portfolio, but there are trademark or coverage gaps to address before going all-in on a monolithic identity. Close these gaps before scaling the brand.";
    }
  } else if (architectureType === "endorsed") {
    if (name_coverage === "broad") {
      nameType = "Endorser brand";
      nameDescription =
        "Your holdco name works well as an endorser — broad enough to add credibility across the portfolio without constraining individual company brands.";
    } else {
      nameType = "Endorser brand — refinement needed";
      nameDescription =
        "The name can serve an endorsement role, but its fit across the full portfolio isn't seamless. A subtle positioning refresh could strengthen its endorsement power.";
    }
  } else {
    // hybrid
    if (existing_equity === "significant") {
      nameType = "Flexible brand — leverage existing equity";
      nameDescription =
        "Your name has recognition worth preserving. Use it as the primary brand where it fits naturally, and deploy it as an endorser elsewhere. Over time, you can expand its reach as the portfolio matures.";
    } else {
      nameType = "Flexible brand";
      nameDescription =
        "A hybrid architecture gives you room to lead with the holdco brand where it fits and step back where it doesn't. This is a pragmatic approach while the portfolio strategy crystallizes.";
    }
  }

  // ── Step 5: Investment level descriptions ──

  const investmentDescriptions: Record<
    DecisionOutcome["investmentLevel"],
    { label: string; description: string }
  > = {
    high: {
      label: "High investment",
      description:
        "Full brand build-out: identity system, naming architecture guidelines, brand activation strategy, and coordinated rollout across the portfolio. Justified by your hold period and the central role the brand will play.",
    },
    moderate: {
      label: "Moderate investment",
      description:
        "Targeted brand development: address key gaps in trademark coverage, refine the visual identity, and establish brand guidelines. Focus spending where it has the most strategic impact.",
    },
    low: {
      label: "Low investment",
      description:
        "Minimal brand investment: ensure legal protections are in place and the name functions for its intended purpose. Allocate resources to the portfolio companies instead.",
    },
  };

  // ── Step 6: Build contextual considerations ──

  const considerations: string[] = [];

  if (trademark === "none") {
    considerations.push(
      "Conduct a comprehensive trademark search before making any architecture decisions. Uncleared names carry legal risk that grows with every acquisition."
    );
  } else if (trademark === "partial") {
    considerations.push(
      "Fill trademark gaps — ensure filings cover all current and anticipated G&S classes and international territories relevant to the portfolio."
    );
  }

  if (
    existing_equity === "significant" &&
    (architectureType === "discrete" || name_coverage === "narrow")
  ) {
    considerations.push(
      "Your name carries meaningful equity. Walking away from it has real costs — factor the value of existing recognition into any naming decision."
    );
  } else if (
    existing_equity === "minimal" &&
    architectureType !== "discrete"
  ) {
    considerations.push(
      "With limited existing brand equity, the cost of change is low. If the name doesn't fit the architecture, now is the ideal time to act."
    );
  }

  if (budget === "no" && architectureType !== "discrete") {
    considerations.push(
      "Limited budget constrains the architecture you can realistically execute. A simpler brand structure (endorsed or discrete) may be more practical until resources are available."
    );
  }

  if (hold_period === "short") {
    considerations.push(
      "With a short hold period, focus on making the brand functional rather than aspirational. Protect it legally, keep it clean, and invest energy in the portfolio companies."
    );
  } else if (hold_period === "long") {
    considerations.push(
      "A long hold period means the brand will compound in value over time. Early investment in getting the name and architecture right pays dividends across every future acquisition."
    );
  }

  if (brand_role === "umbrella" && architectureType === "discrete") {
    considerations.push(
      "You want an umbrella brand, but the current name can't support that role. Either invest in a new name that enables monolithic architecture, or adjust your brand strategy to endorsed or discrete."
    );
  }

  if (brand_role === "endorsed" && name_coverage === "narrow") {
    considerations.push(
      "Even an endorsement role requires the name to be credible across the portfolio. A name tied to a specific sector may undermine the endorsement's value in unrelated areas."
    );
  }

  return {
    architectureType,
    architectureLabel: archDescriptions[architectureType].label,
    architectureDescription: archDescriptions[architectureType].description,
    nameType,
    nameDescription,
    investmentLevel,
    investmentLabel: investmentDescriptions[investmentLevel].label,
    investmentDescription: investmentDescriptions[investmentLevel].description,
    considerations,
  };
}
