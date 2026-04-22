import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'problem-finder-ai-backend',
      timestamp: new Date().toISOString(),
    };
  }
}

