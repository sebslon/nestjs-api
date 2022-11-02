import { LogLevel } from '@nestjs/common/services/logger.service';

// debug and verbose methods won’t produce logs on production.

export function getLogLevels(isProduction: boolean): LogLevel[] {
  if (isProduction) {
    return ['log', 'warn', 'error'];
  }
  return ['error', 'warn', 'log', 'verbose', 'debug'];
}
