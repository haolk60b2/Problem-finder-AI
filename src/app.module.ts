import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { AnalysisModule } from './modules/analysis/analysis.module';
import { SourcesModule } from './modules/sources/sources.module';
import { AiModule } from './modules/ai/ai.module';
import { appConfig, validateEnv } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
      load: [appConfig],
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          url: configService.getOrThrow<string>('app.redisUrl'),
        },
      }),
    }),
    PrismaModule,
    AiModule,
    HealthModule,
    ProjectsModule,
    SourcesModule,
    AnalysisModule,
  ],
})
export class AppModule {}

