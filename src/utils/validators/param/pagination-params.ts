import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationParams {
  // Offset pagination
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  offset?: number;

  // Keyset pagination
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  startId?: number;
}
