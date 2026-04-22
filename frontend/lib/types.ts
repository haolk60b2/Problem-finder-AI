export type ReportStat = {
  label: string;
  value: string;
  note: string;
};

export type Opportunity = {
  id: string;
  title: string;
  category: string;
  score: number;
  frequency: number;
  urgency: number;
  commercialIntent: number;
  sources: string[];
  summary: string;
  evidenceCount: number;
  cta: "Build SaaS" | "Sell Service" | "Make Content";
};

export type EvidenceItem = {
  id: string;
  source: string;
  author: string;
  excerpt: string;
  sentiment: "Negative" | "Mixed" | "Buying";
  url: string;
};

export type Suggestion = {
  id: string;
  title: string;
  format: "SaaS" | "Service" | "Content Product";
  audience: string;
  monetization: string;
  difficulty: "Low" | "Medium" | "High";
  mvp: string[];
};

export type Report = {
  id: string;
  niche: string;
  query: string;
  dateRange: string;
  language: string;
  sources: string[];
  stats: ReportStat[];
  topOpportunities: Opportunity[];
  evidence: EvidenceItem[];
  suggestions: Suggestion[];
};
