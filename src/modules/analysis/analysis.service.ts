import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { ANALYSIS_JOB, ANALYSIS_QUEUE } from './constants/analysis-job.constant';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { RunStatus } from 'src/common/enums/run-status.enum';

@Injectable()
export class AnalysisService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(ANALYSIS_QUEUE) private readonly analysisQueue: Queue,
  ) {}

  async createRun(dto: CreateAnalysisDto) {
    const run = await this.prisma.analysisRun.create({
      data: {
        projectId: dto.projectId,
        status: RunStatus.PENDING,
        filtersJson: {
          niche: dto.niche,
          language: dto.language,
          sourceTypes: dto.sourceTypes,
          fromDate: dto.fromDate,
          toDate: dto.toDate,
        },
      },
    });

    await this.analysisQueue.add(
      ANALYSIS_JOB,
      {
        runId: run.id,
      },
      {
        removeOnComplete: 50,
        removeOnFail: 100,
      },
    );

    return run;
  }

  findAllRuns(projectId?: string) {
    return this.prisma.analysisRun.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findRun(runId: string) {
    return this.prisma.analysisRun.findUnique({
      where: {
        id: runId,
      },
      include: {
        project: true,
      },
    });
  }
}

