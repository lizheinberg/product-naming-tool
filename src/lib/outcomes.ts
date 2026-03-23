export interface Factor {
  label: string;
  status: "clear" | "caution" | "risk";
  detail: string;
}

export interface Outcome {
  verdict: string;
  verdictDetail: string;
  riskLevel: "low" | "moderate" | "high";
  factors: Factor[];
  nextSteps: string[];
  equityNote?: string;
  shortHold?: boolean;
}

export function getOutcome(answers: Record<string, string>): Outcome {
  const {
    brand_role,
    name_coverage,
    trademark,
    domain,
    geographic,
    portfolio_coherence,
    hold_period,
    existing_equity,
  } = answers;

  const factors: Factor[] = [];
  let score = 0;

  const isCustomerFacing =
    brand_role === "umbrella" || brand_role === "endorsed";

  // ── Brand Role (informational, no score) ──────────────────
  if (brand_role === "corporate") {
    factors.push({
      label: "Brand Role",
      status: "clear",
      detail:
        "The holdco is a corporate entity only — the name carries less external weight.",
    });
  } else if (brand_role === "endorsed") {
    factors.push({
      label: "Brand Role",
      status: "clear",
      detail:
        "As an endorsed brand, the holdco name is visible to customers and needs to work across the portfolio.",
    });
  } else {
    factors.push({
      label: "Brand Role",
      status: "caution",
      detail:
        "As a customer-facing umbrella, the holdco name is doing heavy lifting. Every factor below matters more.",
    });
  }

  // ── Name Coverage (customer-facing only) ──────────────────
  if (isCustomerFacing) {
    if (name_coverage === "broad") {
      factors.push({
        label: "Name Scope",
        status: "clear",
        detail:
          "The holdco name is broad enough to cover the current and planned portfolio.",
      });
    } else if (name_coverage === "stretch") {
      factors.push({
        label: "Name Scope",
        status: "caution",
        detail:
          "The name is a stretch for the full portfolio scope. This tension will grow with every acquisition.",
      });
      score += 1;
    } else {
      factors.push({
        label: "Name Scope",
        status: "risk",
        detail:
          "The holdco name is too narrow for the portfolio scope. This is a fundamental limitation that won't resolve itself.",
      });
      score += 2;
    }
  }

  // ── Trademark Clearance ───────────────────────────────────
  if (trademark === "cleared") {
    factors.push({
      label: "Trademark Clearance",
      status: "clear",
      detail:
        "Trademark protection is in place across relevant G&S descriptions and International Classes.",
    });
  } else if (trademark === "partial") {
    factors.push({
      label: "Trademark Clearance",
      status: "caution",
      detail:
        "Trademark coverage has gaps. Each new acquisition may expose you to conflicts in unprotected classes.",
    });
    score += 1;
  } else {
    factors.push({
      label: "Trademark Clearance",
      status: "risk",
      detail:
        "No comprehensive trademark clearance. You could face opposition from existing mark holders as the portfolio expands.",
    });
    score += 2;
  }

  // ── Domain ────────────────────────────────────────────────
  if (domain === "yes") {
    factors.push({
      label: "Domain",
      status: "clear",
      detail: "You own the exact-match .com domain.",
    });
  } else if (domain === "alternative") {
    factors.push({
      label: "Domain",
      status: "caution",
      detail:
        "Using an alternative domain. Workable, but not ideal for a platform brand.",
    });
    score += 1;
  } else {
    factors.push({
      label: "Domain",
      status: "risk",
      detail:
        "The .com domain is unavailable. This creates friction for brand-building and credibility.",
    });
    score += 2;
  }

  // ── Geographic / Linguistic (customer-facing only) ────────
  if (isCustomerFacing) {
    if (geographic === "no_concerns") {
      factors.push({
        label: "Geographic / Linguistic",
        status: "clear",
        detail:
          "No linguistic or cultural issues identified in target markets.",
      });
    } else if (geographic === "possible") {
      factors.push({
        label: "Geographic / Linguistic",
        status: "caution",
        detail:
          "Potential issues in some markets. Worth investigating before expanding into those geographies.",
      });
      score += 1;
    } else {
      factors.push({
        label: "Geographic / Linguistic",
        status: "risk",
        detail:
          "Known linguistic or cultural problems. This will limit expansion or require a separate brand in affected markets.",
      });
      score += 2;
    }
  }

  // ── Portfolio Coherence (customer-facing only) ────────────
  if (isCustomerFacing) {
    if (portfolio_coherence === "same") {
      factors.push({
        label: "Portfolio Coherence",
        status: "clear",
        detail:
          "Portfolio companies are in the same or adjacent sectors — the holdco name can unify them naturally.",
      });
    } else if (portfolio_coherence === "loosely") {
      factors.push({
        label: "Portfolio Coherence",
        status: "caution",
        detail:
          "Loosely related portfolio — the holdco name needs to be flexible enough to span diverse markets.",
      });
      score += 1;
    } else {
      factors.push({
        label: "Portfolio Coherence",
        status: "risk",
        detail:
          "Diverse, unrelated portfolio. A sector-specific holdco name will create confusion as you add companies in new verticals.",
      });
      score += 2;
    }
  }

  // ── Equity Context ────────────────────────────────────────
  let equityNote: string | undefined;
  if (existing_equity === "significant") {
    equityNote =
      "The current holdco name carries significant brand equity. Changing it means walking away from real recognition — factor that into the cost-benefit analysis.";
  } else if (existing_equity === "minimal") {
    equityNote =
      "The current name carries little brand equity, which means the cost of changing is low. If other factors point toward a new name, now is the time to act.";
  }

  // ── Determine verdict ─────────────────────────────────────
  let riskLevel: "low" | "moderate" | "high";
  let verdict: string;
  let verdictDetail: string;
  let nextSteps: string[];

  // Short hold override
  if (hold_period === "short") {
    riskLevel = score >= 6 ? "high" : score >= 3 ? "moderate" : "low";
    verdict =
      score >= 6
        ? "There are serious issues — but your timeline is short"
        : "A rebrand probably isn't worth it";
    verdictDetail =
      score >= 6
        ? "Your holdco name has significant limitations, but with less than 3 years on the clock, a full rebrand may not deliver enough ROI. Focus on mitigating the biggest risks rather than starting from scratch."
        : "Given a near-term exit, the investment required to rename and rebrand the holdco is unlikely to pay off. Focus on the basics: make sure the name is legally protected and functional.";
    nextSteps =
      score >= 6
        ? [
            "Address the most critical risk factors above — especially trademark and coverage issues",
            "If the name is actively causing confusion or legal exposure, reconsider despite the timeline",
            "For the next platform, start with the name question on day one",
          ]
        : [
            "Ensure trademark filings are current and cover the portfolio scope",
            "Secure the domain if you haven't already",
            "Focus brand-building resources on the portfolio companies rather than the holdco",
          ];

    return {
      verdict,
      verdictDetail,
      riskLevel,
      factors,
      nextSteps,
      equityNote,
      shortHold: true,
    };
  }

  if (score <= 2) {
    riskLevel = "low";
    verdict = "Your holdco name is likely fine";
    verdictDetail =
      brand_role === "corporate"
        ? "As a back-office entity, your holdco name has fewer requirements. Based on your answers, there are no major red flags. Focus on maintaining legal protection."
        : "Based on your answers, the current holdco name doesn't have any deal-breaking issues. Keep it, protect it, and focus your energy on growing the portfolio.";
    nextSteps = [
      "Maintain and expand trademark registrations as you add portfolio companies",
      "Ensure brand guidelines are documented and consistent across the portfolio",
      "Revisit this assessment after any major strategic shifts (new verticals, international expansion, etc.)",
    ];
  } else if (score <= 5) {
    riskLevel = "moderate";
    verdict = "Your holdco name may work — but there are issues to address";
    verdictDetail =
      "The current name isn't fatally flawed, but there are gaps that will create increasing friction as the platform scales. Address the issues flagged below before they compound.";
    nextSteps = [
      "Address the specific caution and risk factors identified above — these are your priority",
      "Conduct a formal trademark audit covering all anticipated portfolio G&S classes",
      "If multiple factors are trending toward risk, consider engaging a naming strategist before the next acquisition",
    ];
  } else {
    riskLevel = "high";
    verdict = "You should seriously consider a new holdco name";
    verdictDetail =
      "Multiple factors indicate the current holdco name has fundamental limitations that will create real problems as the platform grows. Renaming now — while the portfolio is still being assembled — is significantly easier and cheaper than doing it later.";
    nextSteps = [
      "Engage a naming strategist to develop a new holdco name — this is not a DIY project",
      "Don't wait — every acquisition you add under the current name increases the switching cost",
      "A good holdco name should be broad, trademarkable, domain-available, and linguistically clean across your target markets",
    ];
  }

  return { verdict, verdictDetail, riskLevel, factors, nextSteps, equityNote };
}
