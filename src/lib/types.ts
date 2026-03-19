export interface NameSuggestion {
  name: string;
  rationale: string;
}

export interface GenerateNamesRequest {
  brainstormAnswers: Record<string, string | string[]>;
  selectedChips: string[];
  outcome: {
    nameType: string;
    brainstormType: "descriptor" | "descriptive";
    architecture: string;
  };
}

export interface GenerateNamesResponse {
  names: NameSuggestion[];
}
