// import { PartialType } from '@nestjs/mapped-types';
// import { CreatePostDto } from './create-post.dto';

// export class UpdatePostDto extends PartialType(CreatePostDto) {
//   id: number;
//   content: string;
//   title: string;
// }

export class UpdatePostDto {
  id: number;
  content: string;
  title: string;
}
