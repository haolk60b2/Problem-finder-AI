import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';

@Controller('analysis-runs')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post()
  createRun(@Body() dto: CreateAnalysisDto) {
    return this.analysisService.createRun(dto);
  }

  @Get()
  findAllRuns(@Query('projectId') projectId?: string) {
    return this.analysisService.findAllRuns(projectId);
  }

  @Get(':runId')
  findRun(@Param('runId') runId: string) {
    return this.analysisService.findRun(runId);
  }
}

