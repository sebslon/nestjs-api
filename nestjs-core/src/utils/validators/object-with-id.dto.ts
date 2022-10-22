import { IsNumber } from 'class-validator';

export class ObjectWithIdDTO {
  @IsNumber()
  id: number;
}
