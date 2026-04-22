import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AiModule } from '../ai/ai.module';
import { RedditService } from '../reddit/reddit.service';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { AnalysisProcessor } from './analysis.processor';
import { AnalysisPipelineService } from './analysis-pipeline.service';
import { ANALYSIS_QUEUE } from './constants/analysis-job.constant';

@Module({
  imports: [
    AiModule,
    BullModule.registerQueue({
      name: ANALYSIS_QUEUE,
    }),
  ],
  controllers: [AnalysisController],
  providers: [AnalysisService, AnalysisProcessor, AnalysisPipelineService, RedditService],
})
export class AnalysisModule {}
