import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateProjectDto) {
    await this.prisma.user.upsert({
      where: {
        id: userId,
      },
      update: {},
      create: {
        id: userId,
        email: 'demo@problemfinder.local',
        name: 'Demo User',
      },
    });

    return this.prisma.project.create({
      data: {
        userId,
        name: dto.name,
        niche: dto.niche,
        language: dto.language,
        sources: dto.sourceTypes
          ? {
              createMany: {
                data: dto.sourceTypes.map((type) => ({
                  type,
                  configJson: {},
                })),
              },
            }
          : undefined,
      },
      include: {
        sources: true,
      },
    });
  }

  findAll() {
    return this.prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sources: true,
        analysisRuns: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  findOne(projectId: string) {
    return this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        sources: true,
        painPoints: {
          include: {
            evidences: true,
            suggestions: true,
          },
          orderBy: {
            totalScore: 'desc',
          },
        },
        analysisRuns: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }
}
