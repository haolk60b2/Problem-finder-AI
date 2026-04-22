import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { ANALYSIS_JOB, ANALYSIS_QUEUE } from './constants/analysis-job.constant';
import { AnalysisPipelineService } from './analysis-pipeline.service';

@Injectable()
@Processor(ANALYSIS_QUEUE)
export class AnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalysisProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly pipelineService: AnalysisPipelineService,
  ) {
    super();
  }

  async process(job: Job<{ runId: string }>) {
    this.logger.log(`Processing analysis run ${job.data.runId}`);

    const run = await this.prisma.analysisRun.findUniqueOrThrow({
      where: {
        id: job.data.runId,
      },
      include: {
        project: {
          include: {
            sources: true,
          },
        },
      },
    });

    await this.pipelineService.execute(run.id, run.projectId, run.filtersJson as Record<string, unknown>);

    return {
      runId: run.id,
      modelReady: Boolean(this.aiService),
    };
  }
}

