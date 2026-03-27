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

export const decisionTreeQuestions: Question[] = [
  {
    id: "brand_role",
    question: "What role will the holdco brand play across the portfolio?",
    subtext:
      "This determines how much the holdco name matters to your customers and stakeholders.",
    options: [
      {
        label: "Customer-facing umbrella",
        description:
          "Portfolio companies will operate under the holdco name",
        value: "umbrella",
      },
      {
        label: "Endorsed identity",
        description:
          'Portfolio companies keep their names, endorsed as "a [holdco] company"',
        value: "endorsed",
      },
      {
        label: "Pure holding company",
        description:
          "Back-office / corporate entity — not customer-facing",
        value: "corporate",
      },
    ],
  },
  {
    id: "name_coverage",
    question:
      "Could the holdco name credibly cover the full range of portfolio companies and planned acquisitions?",
    subtext:
      "Think about where the platform is headed, not just where it is today.",
    condition: (answers) =>
      answers.brand_role === "umbrella" || answers.brand_role === "endorsed",
    options: [
      {
        label: "Yes — it's broad enough",
        description:
          "The name works across the current and anticipated portfolio",
        value: "broad",
      },
      {
        label: "It's a stretch",
        description:
          "It could work but might feel like a reach in some areas",
        value: "stretch",
      },
      {
        label: "No — it's too narrow",
        description:
          "The name is tied to a specific sector or service that doesn't cover the full scope",
        value: "narrow",
      },
    ],
  },
  {
    id: "trademark",
    question:
      "Has the holdco name cleared the requisite trademark G&S and International Classes?",
    subtext:
      "Trademark coverage needs to span the full scope of the portfolio — not just the original business.",
    options: [
      {
        label: "Yes — fully cleared",
        description:
          "Filed and cleared across all relevant classes for the portfolio scope",
        value: "cleared",
      },
      {
        label: "Partially or in progress",
        description: "Some filings in place, but gaps remain",
        value: "partial",
      },
      {
        label: "No, or we haven't checked",
        description:
          "No comprehensive trademark review has been done",
        value: "none",
      },
    ],
  },
  {
    id: "budget",
    question:
      "Will there be adequate resources to develop and support the brand?",
    subtext:
      "Brand building requires sustained investment — consider design, marketing, legal, and rollout costs.",
    options: [
      {
        label: "Yes",
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
  {
    id: "hold_period",
    question: "What's the anticipated hold period?",
    subtext: "Longer holds justify more investment in the holdco brand.",
    options: [
      {
        label: "Less than 3 years",
        description:
          "Near-term exit — the holdco brand is primarily functional",
        value: "short",
      },
      {
        label: "3–7 years",
        description:
          "Standard hold — the brand will need to work for a meaningful period",
        value: "standard",
      },
      {
        label: "7+ years or permanent capital",
        description:
          "Long-term or permanent — the holdco brand is a lasting asset",
        value: "long",
      },
    ],
  },
  {
    id: "existing_equity",
    question:
      "Does the holdco name currently carry meaningful brand recognition?",
    subtext:
      "Consider recognition among LPs, customers, talent, and industry stakeholders.",
    options: [
      {
        label: "Yes — significant recognition",
        description:
          "Key stakeholders know and associate value with the name",
        value: "significant",
      },
      {
        label: "Some recognition",
        description:
          "Moderate awareness, but it's not a strong brand",
        value: "some",
      },
      {
        label: "Minimal or none",
        description: "The name has little to no brand equity",
        value: "minimal",
      },
    ],
  },
];
