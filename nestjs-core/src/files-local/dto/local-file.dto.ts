import { IsNotEmpty, IsString } from 'class-validator';

export class LocalFileDto {
  @IsString()
  filename: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  mimetype: string;
}
