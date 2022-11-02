import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { ElasticSearchHealthIndicator } from './elastic-search.health-indicator';

@Controller('health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private typeormHealthIndicator: TypeOrmHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private diskHealthIndicator: DiskHealthIndicator,
    private elasticSearchHealthIndicator: ElasticSearchHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      () => this.typeormHealthIndicator.pingCheck('database'),
      // The process should not use more than 300MB of memory
      () =>
        this.memoryHealthIndicator.checkHeap('memory_heap', 300 * 1024 * 1024),
      // The process should not have more than 300MB of RSS memory allocated
      () =>
        this.memoryHealthIndicator.checkRSS('memory_rss', 300 * 1024 * 1024),
      // The disk storage should not exceed 50% of available space
      () =>
        this.diskHealthIndicator.checkStorage('disk', {
          thresholdPercent: 0.5,
          path: '/',
        }),
      () => this.elasticSearchHealthIndicator.isHealthy('elasticsearch'),
    ]);
  }
}
