import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus';

@Injectable()
export class ElasticSearchHealthIndicator extends HealthIndicator {
  constructor(private readonly elasticSearchService: ElasticsearchService) {
    super();
  }

  async isHealthy(key: string) {
    try {
      await this.elasticSearchService.ping();
      return this.getStatus(key, true);
    } catch (err) {
      throw new HealthCheckError(
        'ElasticSearch Health Check Failed',
        this.getStatus(key, false),
      );
    }
  }
}
