export interface QuestionOption {
  label: string;
  description: string;
  value: string;
}

export interface Question {
  id: string;
  question: string;
  subtext: string;
  options: QuestionOption[];
  condition?: (answers: Record<string, string>) => boolean;
}

function isBrandActive(answers: Record<string, string>): boolean {
  return (
    answers.architecture_model === "customer_facing" ||
    answers.architecture_model === "industry_facing"
  );
}

/** True when the effective TM status is "cleared" — either directly or via search */
function tmIsCleared(answers: Record<string, string>): boolean {
  return (
    answers.trademark === "cleared" || answers.tm_search_result === "clear"
  );
}

/** True when we know a new name is needed */
function needsNewName(answers: Record<string, string>): boolean {
  if (answers.name_alignment === "no") return true;
  if (answers.name_alignment === "yes" && answers.trademark === "known_conflict")
    return true;
  if (
    answers.name_alignment === "yes" &&
    answers.trademark === "unknown" &&
    answers.tm_search_result === "conflict"
  )
    return true;
  return false;
}

export const decisionTreeQuestions: Question[] = [
  // ── Q1: Role ──────────────────────────────────────────────────
  {
    id: "architecture_model",
    question: "What role will the holdco play?",
    subtext:
      "This determines the brand architecture model — the relationship between the holding company, the acquired brands, and how these interact with each other, customers, and the broader industry — which then defines how much the holdco name matters.",
    options: [
      {
        label: "Customer-facing",
        description:
          "The holdco brand will be visible to customers — as a masterbrand, endorsed brand, or hybrid",
        value: "customer_facing",
      },
      {
        label: "Industry-facing",
        description:
          "Visible within the industry — for attracting portfolio companies, PE relationships, talent, and company culture — but not relevant to end customers",
        value: "industry_facing",
      },
      {
        label: "Pure Holding Company",
        description:
          "Back-office / corporate entity — not visible externally",
        value: "pure_holding",
      },
    ],
  },

  // ── Q2: Alignment (moved before Trademark) ───────────────────
  {
    id: "name_alignment",
    question:
      "Could any of the acquired company names credibly cover the full range / are there any limitations?",
    subtext:
      "Think about where the platform is headed, not just where it is today - expanding the services and/or target customer base and supporting evolution and innovation in the sector.",
    options: [
      {
        label: "Yes — it's broad enough",
        description:
          "One of the names works across the current and anticipated portfolio",
        value: "yes",
      },
      {
        label: "No — it's too narrow",
        description:
          "Too narrow, descriptive of sector or service, doesn't cover full/anticipated scope, or specific to a single portco via surname or location",
        value: "no",
      },
    ],
  },

  // ── Q3: Trademark Status (only if a name is aligned) ─────────
  {
    id: "trademark",
    question:
      "Has the holdco name cleared the requisite trademark G&S and International Classes?",
    subtext:
      "Fewer than 10% of U.S. companies have federally registered trademarks for their company name. For smaller, regional businesses this often poses little risk. However, as companies expand geographically or broaden their services, trademark exposure increases significantly.\n\nFor national and international brands, trademark strategy becomes critical. Consumer-facing brands must both avoid infringing on existing marks and secure protection against future competitors.\n\nBrand architecture decisions also carry different trademark implications and should be evaluated early in the strategy and planning process.",
    condition: (answers) => answers.name_alignment === "yes",
    options: [
      {
        label: "Yes — fully cleared",
        description:
          "Fully cleared in the relevant USPTO trademark classes for the current and planned goods & services",
        value: "cleared",
      },
      {
        label: "No — known conflict",
        description:
          "A search has been conducted and there is a known conflict or issue in one or more relevant classes",
        value: "known_conflict",
      },
      {
        label: "Not checked",
        description:
          "A formal trademark search has not been conducted, or the status is unknown",
        value: "unknown",
      },
    ],
  },

  // ── Q3.5: TM Search (informational — only if TM status is unknown) ──
  {
    id: "tm_search_result",
    question: "Trademark Search",
    subtext:
      "Before moving forward with a name that hasn't been formally searched, it's important to understand the level of risk.\n\nA preliminary or \"knockout\" search can be conducted by your partner naming firm or trademark attorney. This is a relatively quick, low-cost screening that checks the USPTO database and common-law sources for obvious conflicts in the relevant goods & services classes.\n\nIf the name(s) clear that initial screening, your trademark attorney would then conduct a comprehensive (full) trademark search — a deeper analysis that includes state registrations, international marks, domain names, and common-law usage.\n\nWe recommend conducting at least a knockout search before proceeding. Once you have results, select the outcome below to continue.",
    condition: (answers) =>
      answers.name_alignment === "yes" && answers.trademark === "unknown",
    options: [
      {
        label: "Clear",
        description:
          "The name cleared the trademark search — no significant conflicts found",
        value: "clear",
      },
      {
        label: "Known Conflict",
        description:
          "The search revealed a conflict or issue in one or more relevant classes",
        value: "conflict",
      },
    ],
  },

  // ── Q4: Hold Period (only if a new name is needed + brand active) ──
  {
    id: "hold_period",
    question: "What's the anticipated hold period?",
    subtext:
      "Longer holds justify more investment in the holdco brand, as the brand has an opportunity to add value.",
    condition: (answers) =>
      isBrandActive(answers) && needsNewName(answers),
    options: [
      {
        label: "3+ years",
        description:
          "Standard to long-term hold — the brand will need to work for a meaningful period",
        value: "3plus",
      },
      {
        label: "3 years or less",
        description:
          "Near-term exit — the holdco brand is primarily functional; we don't need it to add value",
        value: "3_or_less",
      },
    ],
  },

  // ── Q5: Budget (only if hold period is 3+) ────────────────────
  {
    id: "budget",
    question:
      "Will there be adequate resources to develop and support the brand?",
    subtext:
      "Brand building requires initial and sustained investment — consider design, marketing, legal, and rollout costs.",
    condition: (answers) => answers.hold_period === "3plus",
    options: [
      {
        label: "Yes — adequate resources",
        description:
          "We have or can allocate budget for brand development",
        value: "yes",
      },
      {
        label: "No",
        description:
          "Resources are limited or allocated elsewhere",
        value: "no",
      },
    ],
  },

  // ── Q6: Brand Equity (only on the "retain" path — aligned + TM clear) ──
  {
    id: "brand_equity",
    question:
      "Do any of the portfolio brands have significant equity?",
    subtext:
      "Consider brand recognition, customer loyalty, and market positioning of the individual portfolio companies.",
    condition: (answers) =>
      isBrandActive(answers) &&
      answers.name_alignment === "yes" &&
      tmIsCleared(answers),
    options: [
      {
        label: "Yes — significant equity",
        description:
          "One or more portfolio brands have strong recognition and value worth preserving",
        value: "significant",
      },
      {
        label: "Minimal or none",
        description:
          "Portfolio brands have little existing brand equity",
        value: "minimal",
      },
    ],
  },
];
