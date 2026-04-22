import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { InsightLabel } from 'src/common/enums/insight-label.enum';
import { PainExtractionResult } from 'src/common/interfaces/pain-extraction.interface';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly client?: OpenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('app.openAiApiKey');
    this.model = this.configService.get<string>('app.openAiModel') ?? 'gpt-4.1-mini';

    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    } else {
      this.logger.warn('OPENAI_API_KEY is missing. Falling back to deterministic mock analysis.');
    }
  }

  async extractPainSignals(input: string): Promise<PainExtractionResult> {
    if (!this.client) {
      return this.mockExtraction(input);
    }

    const response = await this.client.responses.create({
      model: this.model,
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: [
                'You analyze user-generated content and extract startup pain signals.',
                'Return strict JSON with fields:',
                'isRelevant, label, title, summary, urgencyScore, commercialScore, willingnessToPayScore, sentimentScore, confidence, evidence, tags.',
                'Scores must be numbers between 0 and 100.',
              ].join(' '),
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: input,
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_object',
        },
      },
    });

    const raw = response.output_text;
    return JSON.parse(raw) as PainExtractionResult;
  }

  async generateIdeaSuggestions(painTitle: string, evidenceSummary: string) {
    if (!this.client) {
      return [
        {
          title: `SaaS to solve ${painTitle}`,
          description: `A focused tool that addresses ${painTitle} using automation and visibility.`,
          businessModel: 'subscription',
          audience: 'SMB teams',
          monetization: 'monthly subscription',
          difficulty: 'medium',
          mvpFeatures: ['pain dashboard', 'alerts', 'shared workspace'],
        },
      ];
    }

    const response = await this.client.responses.create({
      model: this.model,
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: [
                'You are a startup strategist.',
                'Return JSON with a field suggestions containing an array.',
                'Each suggestion needs title, description, businessModel, audience, monetization, difficulty, mvpFeatures.',
              ].join(' '),
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `Pain title: ${painTitle}\nEvidence summary: ${evidenceSummary}`,
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_object',
        },
      },
    });

    const parsed = JSON.parse(response.output_text) as {
      suggestions: Array<{
        title: string;
        description: string;
        businessModel: string;
        audience: string;
        monetization: string;
        difficulty: string;
        mvpFeatures: string[];
      }>;
    };

    return parsed.suggestions;
  }

  private mockExtraction(input: string): PainExtractionResult {
    const lowered = input.toLowerCase();
    const looksPainful =
      lowered.includes('hate') ||
      lowered.includes('annoy') ||
      lowered.includes('problem') ||
      lowered.includes('frustrat') ||
      lowered.includes('manual');

    return {
      isRelevant: looksPainful,
      label: looksPainful ? InsightLabel.PAIN_POINT : InsightLabel.FEATURE_REQUEST,
      title: looksPainful ? 'Recurring user frustration' : 'General feedback',
      summary: input.slice(0, 180),
      urgencyScore: looksPainful ? 75 : 35,
      commercialScore: looksPainful ? 68 : 28,
      willingnessToPayScore: looksPainful ? 60 : 20,
      sentimentScore: looksPainful ? 80 : 40,
      confidence: 0.72,
      evidence: input.slice(0, 220),
      tags: looksPainful ? ['pain', 'workflow'] : ['feedback'],
    };
  }
}

