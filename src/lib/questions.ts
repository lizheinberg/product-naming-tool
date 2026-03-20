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
    id: "classification",
    question: "How will customers see this offering?",
    subtext:
      "This determines whether you're building something new or evolving what exists.",
    options: [
      {
        label: "Brand new product or service",
        description:
          "Customers will see this as something that didn't exist before",
        value: "new",
      },
      {
        label: "Update or extension of something existing",
        description:
          "It's a new version, line extension, or refresh of a current product",
        value: "existing",
      },
    ],
  },
  {
    id: "existing_type",
    question: "What kind of change is this?",
    subtext: "Different types of changes call for different naming approaches.",
    condition: (answers) => answers.classification === "existing",
    options: [
      {
        label: "Line extension",
        description:
          "Adding a new flavor, size, tier, or variant to an existing product line",
        value: "line_extension",
      },
      {
        label: "New market or segment",
        description:
          "Taking an existing product into a new audience or geography",
        value: "new_market",
      },
      {
        label: "Next generation",
        description:
          "A significant upgrade or evolution of the current product",
        value: "next_gen",
      },
    ],
  },
  {
    id: "lifespan",
    question: "How long will this product be in market?",
    subtext:
      "Longer-lived products generally justify more investment in naming.",
    condition: (answers) => answers.classification === "new",
    options: [
      {
        label: "5+ years",
        description:
          "This is a long-term play — a core part of the business going forward",
        value: "long",
      },
      {
        label: "Less than 5 years",
        description:
          "Shorter lifespan — seasonal, campaign-driven, or limited run",
        value: "short",
      },
    ],
  },
  {
    id: "market_factors",
    question: "Does this product have a competitive edge?",
    subtext:
      "Products with real differentiation earn more naming investment.",
    condition: (answers) => answers.classification === "new",
    options: [
      {
        label: "Yes — clear competitive advantage",
        description: "It does something competitors can't match (yet)",
        value: "advantage",
      },
      {
        label: "No — it's at parity",
        description: "It's competitive, but not meaningfully differentiated",
        value: "parity",
      },
    ],
  },
  {
    id: "positioning",
    question: "How does this fit within your core business?",
    subtext:
      "Products outside your core may need a name that stands on its own.",
    condition: (answers) => answers.classification === "new",
    options: [
      {
        label: "Core business",
        description: "Squarely within what your company is known for",
        value: "core",
      },
      {
        label: "Stretch or new territory",
        description:
          "Beyond your current capabilities or customer expectations",
        value: "non_core",
      },
    ],
  },
  {
    id: "resources",
    question: "Do you have resources to build and support a new brand?",
    subtext:
      "A new brand name needs marketing investment to gain recognition. Be honest about budget.",
    condition: (answers) => answers.classification === "new",
    options: [
      {
        label: "Yes — we can invest in brand building",
        description:
          "We have budget for launch marketing, brand guidelines, and ongoing support",
        value: "above",
      },
      {
        label: "No — limited resources",
        description:
          "We need something that works without heavy marketing investment",
        value: "below",
      },
    ],
  },
  {
    id: "parent_brand",
    question: "Is there a parent brand this needs to connect to?",
    subtext:
      "This affects whether the name stands alone or lives under an existing brand umbrella.",
    condition: (answers) => answers.classification === "new",
    options: [
      {
        label: "Yes — it should connect to our parent brand",
        description:
          "The new product should clearly be part of a larger brand family",
        value: "yes",
      },
      {
        label: "No — it can stand alone",
        description:
          "The product can have its own identity, separate from the parent",
        value: "no",
      },
    ],
  },
];

export interface BrainstormQuestion {
  id: string;
  question: string;
  subtext: string;
  type: "textarea" | "text" | "chips" | "select";
  placeholder?: string;
  optional?: boolean;
  options?: string[] | { label: string; value: string }[];
  maxSelect?: number;
}

export const brainstormQuestions: BrainstormQuestion[] = [
  {
    id: "product_description",
    question: "What does this product or service actually do?",
    subtext:
      "In plain language. Pretend you're explaining it to someone at a dinner party.",
    type: "textarea",
    placeholder:
      "e.g., It's a software platform that helps small businesses manage their inventory across multiple sales channels...",
  },
  {
    id: "target_audience",
    question: "Who is it for?",
    subtext:
      "Be as specific as you can about the people who will buy or use this.",
    type: "textarea",
    placeholder:
      "e.g., Small business owners with 5-50 employees who sell both online and in physical stores...",
  },
  {
    id: "differentiator",
    question: "What makes it different from competitors?",
    subtext:
      "If you said 'parity' earlier, focus on what's different about YOUR version, even if it's subtle.",
    type: "textarea",
    placeholder:
      "e.g., It's the only platform that syncs inventory in real-time across all channels without manual input...",
  },
  {
    id: "category",
    question: "What category does it sit in?",
    subtext: "What would someone Google to find a product like this?",
    type: "text",
    placeholder:
      "e.g., Inventory management software, Athletic footwear, Plant-based protein bars...",
  },
  {
    id: "parent_brand_name",
    question: "What's the parent brand name (if applicable)?",
    subtext: "Leave blank if there isn't one or if the name will stand alone.",
    type: "text",
    placeholder: "e.g., Acme Corp",
    optional: true,
  },
  {
    id: "tone",
    question: "What personality should the name convey?",
    subtext: "Pick up to 3 that feel right.",
    type: "chips",
    options: [
      "Professional",
      "Approachable",
      "Technical",
      "Playful",
      "Premium",
      "Bold",
      "Trustworthy",
      "Innovative",
      "Warm",
      "Minimalist",
      "Energetic",
      "Sophisticated",
    ],
    maxSelect: 3,
  },
  {
    id: "explore_themes",
    question: "Any words, themes, or directions to explore?",
    subtext:
      "Concepts, metaphors, root words — anything that feels like the right territory.",
    type: "textarea",
    placeholder:
      "e.g., Speed, clarity, connection, simplicity. Or: Latin roots, weather metaphors, short punchy words...",
    optional: true,
  },
  {
    id: "avoid_themes",
    question: "Anything to avoid?",
    subtext: "Words, sounds, themes, or associations that are off-limits.",
    type: "textarea",
    placeholder:
      "e.g., Don't want anything techy-sounding. Avoid words that are hard to spell or pronounce...",
    optional: true,
  },
  {
    id: "international",
    question: "Does the name need to work internationally?",
    subtext: "This affects what kinds of names are viable.",
    type: "select",
    options: [
      { label: "English-speaking markets only", value: "english" },
      { label: "Global — needs to work across languages", value: "global" },
      { label: "Specific regions", value: "specific" },
    ],
  },
];

// Descriptive path: skip tone, explore_themes, avoid_themes (questions 6-8)
const descriptiveSkipIds = new Set(["tone", "explore_themes", "avoid_themes"]);

export const descriptiveBrainstormQuestions = brainstormQuestions.filter(
  (q) => !descriptiveSkipIds.has(q.id)
);
