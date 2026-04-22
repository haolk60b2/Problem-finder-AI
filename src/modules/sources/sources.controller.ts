import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateSourceDto } from './dto/create-source.dto';
import { SourcesService } from './sources.service';

@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Post()
  create(@Body() dto: CreateSourceDto) {
    return this.sourcesService.create(dto);
  }

  @Get('project/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.sourcesService.findByProject(projectId);
  }
}

