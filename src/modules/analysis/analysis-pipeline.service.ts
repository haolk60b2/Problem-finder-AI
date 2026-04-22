import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DocumentType } from 'src/common/enums/document-type.enum';
import { RunStatus } from 'src/common/enums/run-status.enum';
import { SourceType } from 'src/common/enums/source-type.enum';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { NormalizedDocument } from './interfaces/normalized-document.interface';

@Injectable()
export class AnalysisPipelineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async execute(runId: string, projectId: string, filters: Record<string, unknown>) {
    await this.updateRun(runId, RunStatus.FETCHING);

    const documents = await this.fetchDocuments(projectId, filters);
    await this.persistDocuments(projectId, documents);

    await this.updateRun(runId, RunStatus.PROCESSING, {
      totalDocuments: documents.length,
    });

    const extracted = [];

    for (const document of documents) {
      const result = await this.aiService.extractPainSignals(document.content);
      if (!result.isRelevant) {
        continue;
      }

      extracted.push({
        document,
        result,
      });
    }

    await this.updateRun(runId, RunStatus.CLUSTERING);

    const clusters = this.clusterByTitle(extracted);

    await this.prisma.$transaction(async (tx: any) => {
      for (const cluster of clusters) {
        const painPoint = await tx.painPoint.create({
          data: {
            projectId,
            title: cluster.title,
            description: cluster.summary,
            category: cluster.label,
            urgencyScore: cluster.urgencyScore,
            frequencyScore: cluster.frequencyScore,
            commercialScore: cluster.commercialScore,
            totalScore: cluster.totalScore,
          },
        });

        for (const item of cluster.items) {
          const rawPost = await tx.rawPost.findFirst({
            where: {
              projectId,
              sourcePostId: item.document.externalId,
            },
          });

          await tx.painEvidence.create({
            data: {
              painPointId: painPoint.id,
              rawPostId: item.document.documentType === DocumentType.POST ? rawPost?.id : null,
              excerpt: item.result.evidence,
              sentiment: item.result.sentimentScore,
              confidence: item.result.confidence,
            },
          });
        }

        const suggestions = await this.aiService.generateIdeaSuggestions(
          cluster.title,
          cluster.summary,
        );

        await tx.ideaSuggestion.createMany({
          data: suggestions.map((suggestion) => ({
            painPointId: painPoint.id,
            title: suggestion.title,
            description: suggestion.description,
            businessModel: suggestion.businessModel,
            mvpFeaturesJson: suggestion.mvpFeatures,
            difficulty: suggestion.difficulty,
            monetization: suggestion.monetization,
            audience: suggestion.audience,
          })),
        });
      }
    });

    await this.updateRun(runId, RunStatus.COMPLETED, {
      totalPainPoints: clusters.length,
      finishedAt: new Date(),
    });
  }

  private async updateRun(
    runId: string,
    status: RunStatus,
    extra: Record<string, unknown> = {},
  ) {
    await this.prisma.analysisRun.update({
      where: {
        id: runId,
      },
      data: {
        status,
        ...extra,
      },
    });
  }

  private async fetchDocuments(
    projectId: string,
    filters: Record<string, unknown>,
  ): Promise<NormalizedDocument[]> {
    const project = await this.prisma.project.findUniqueOrThrow({
      where: {
        id: projectId,
      },
      include: {
        sources: true,
      },
    });

    const selectedSourceTypes = Array.isArray(filters.sourceTypes)
      ? (filters.sourceTypes as SourceType[])
      : project.sources.map((source: any) => source.type as SourceType);

    return selectedSourceTypes.map((sourceType: SourceType, index: number) => ({
      externalId: `${sourceType}-${index + 1}`,
      sourceType,
      documentType: DocumentType.POST,
      title: `Collected feedback from ${sourceType}`,
      content: `Users say they hate how manual and slow the workflow is in ${project.niche}. They want a simpler system with fewer repetitive steps.`,
      author: 'community-user',
      url: `https://example.com/${sourceType}/${index + 1}`,
      publishedAt: new Date(),
      metadata: {
        mocked: true,
      },
    }));
  }

  private async persistDocuments(projectId: string, documents: NormalizedDocument[]) {
    for (const document of documents) {
      if (document.documentType === DocumentType.POST) {
        await this.prisma.rawPost.upsert({
          where: {
            projectId_sourcePostId: {
              projectId,
              sourcePostId: document.externalId,
            },
          },
          update: {
            title: document.title,
            content: document.content,
            author: document.author,
            url: document.url,
            publishedAt: document.publishedAt,
            metadataJson: (document.metadata ?? {}) as Prisma.InputJsonValue,
            sourceType: document.sourceType,
          },
          create: {
            projectId,
            sourcePostId: document.externalId,
            sourceType: document.sourceType,
            title: document.title,
            content: document.content,
            author: document.author,
            url: document.url,
            publishedAt: document.publishedAt,
            metadataJson: (document.metadata ?? {}) as Prisma.InputJsonValue,
          },
        });
      }
    }
  }

  private clusterByTitle(
    extracted: Array<{
      document: NormalizedDocument;
      result: Awaited<ReturnType<AiService['extractPainSignals']>>;
    }>,
  ) {
    const grouped = new Map<
      string,
      Array<{
        document: NormalizedDocument;
        result: Awaited<ReturnType<AiService['extractPainSignals']>>;
      }>
    >();

    for (const item of extracted) {
      const key = item.result.title.toLowerCase().trim();
      const group = grouped.get(key) ?? [];
      group.push(item);
      grouped.set(key, group);
    }

    return Array.from(grouped.entries()).map(([title, items]) => {
      const urgencyScore =
        items.reduce((sum, item) => sum + item.result.urgencyScore, 0) / items.length;
      const commercialScore =
        items.reduce((sum, item) => sum + item.result.commercialScore, 0) / items.length;
      const frequencyScore = Math.min(100, items.length * 20);
      const totalScore = Math.round(
        urgencyScore * 0.35 + commercialScore * 0.35 + frequencyScore * 0.3,
      );

      return {
        title,
        summary: items.map((item) => item.result.summary).join(' '),
        label: items[0].result.label,
        urgencyScore: Math.round(urgencyScore),
        commercialScore: Math.round(commercialScore),
        frequencyScore,
        totalScore,
        items,
      };
    });
  }
}
