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

function isCustomerFacing(answers: Record<string, string>): boolean {
  return answers.architecture_model !== "pure_holding";
}

function needsNewName(answers: Record<string, string>): boolean {
  if (answers.name_alignment === "no") return true;
  if (answers.name_alignment === "yes" && answers.trademark === "no_partial")
    return true;
  return false;
}

export const decisionTreeQuestions: Question[] = [
  {
    id: "architecture_model",
    question: "What role will the holdco play?",
    subtext:
      "This determines the brand architecture model and how much the holdco name matters.",
    options: [
      {
        label: "Masterbrand",
        description: "One brand that replaces all portfolio brands",
        value: "masterbrand",
      },
      {
        label: "Endorsed",
        description:
          "Each portfolio brand keeps its brand; endorsed by common brand",
        value: "endorsed",
      },
      {
        label: "Hybrid",
        description:
          "Blend of Masterbrand and Endorsed based on individual portfolio brand's strength",
        value: "hybrid",
      },
      {
        label: "Pure Holding Company",
        description:
          "Back-office / corporate entity — not customer-facing",
        value: "pure_holding",
      },
    ],
  },
  {
    id: "name_alignment",
    question:
      "Could the name credibly cover the full range / is it too limiting?",
    subtext:
      "Think about where the platform is headed, not just where it is today.",
    options: [
      {
        label: "Yes — it's broad enough",
        description:
          "The name works across the current and anticipated portfolio",
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
  {
    id: "trademark",
    question:
      "Has the holdco name cleared the requisite trademark G&S and International Classes?",
    subtext:
      "Trademark coverage needs to span the full scope of the portfolio — not just the original business.",
    condition: (answers) => answers.name_alignment === "yes",
    options: [
      {
        label: "Yes — fully cleared",
        description:
          "Fully cleared in the relevant USPTO trademark classes for the current and planned goods & services",
        value: "cleared",
      },
      {
        label: "No or Partial",
        description:
          "Clear in some regions and/or some goods and services, or not checked",
        value: "no_partial",
      },
    ],
  },
  {
    id: "hold_period",
    question: "What's the anticipated hold period?",
    subtext: "Longer holds justify more investment in the holdco brand.",
    condition: (answers) =>
      isCustomerFacing(answers) && needsNewName(answers),
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
          "Near-term exit — the holdco brand is primarily functional",
        value: "3_or_less",
      },
    ],
  },
  {
    id: "budget",
    question:
      "Will there be adequate resources to develop and support the brand?",
    subtext:
      "Brand building requires sustained investment — consider design, marketing, legal, and rollout costs.",
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
  {
    id: "brand_equity",
    question:
      "Do any of the portfolio brands have significant equity?",
    subtext:
      "Consider brand recognition, customer loyalty, and market positioning of the individual portfolio companies.",
    condition: (answers) => isCustomerFacing(answers),
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
