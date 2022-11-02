import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateLogDto {
  @IsString()
  context: string;
  @IsString()
  message: string;
  @IsString()
  @IsNotEmpty()
  level: string;
}
