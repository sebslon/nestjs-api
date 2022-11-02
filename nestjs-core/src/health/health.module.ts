import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { SearchModule } from '../search/search.module';

import { ElasticSearchHealthIndicator } from './elastic-search.health-indicator';

import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, SearchModule],
  controllers: [HealthController],
  providers: [ElasticSearchHealthIndicator],
})
export class HealthModule {}
