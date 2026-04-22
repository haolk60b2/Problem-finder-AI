import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSourceDto } from './dto/create-source.dto';

@Injectable()
export class SourcesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSourceDto) {
    return this.prisma.source.create({
      data: {
        projectId: dto.projectId,
        type: dto.type,
        configJson: dto.configJson as Prisma.InputJsonValue,
      },
    });
  }

  findByProject(projectId: string) {
    return this.prisma.source.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
