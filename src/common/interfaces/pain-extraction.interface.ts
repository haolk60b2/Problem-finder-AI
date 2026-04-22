import { InsightLabel } from '../enums/insight-label.enum';

export interface PainExtractionResult {
  isRelevant: boolean;
  label: InsightLabel;
  title: string;
  summary: string;
  urgencyScore: number;
  commercialScore: number;
  willingnessToPayScore: number;
  sentimentScore: number;
  confidence: number;
  evidence: string;
  tags: string[];
}

