import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { ObjectWithIdDTO } from '../../utils/validators/object-with-id.dto';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  public content: string;

  @ValidateNested()
  @Type(() => ObjectWithIdDTO)
  post: ObjectWithIdDTO;
}
export default CreateCommentDto;
