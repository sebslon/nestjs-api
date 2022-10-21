import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString({ each: true })
  @IsNotEmpty()
  paragraphs: string[];
}
