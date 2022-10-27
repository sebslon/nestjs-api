import { IsString, IsNotEmpty } from 'class-validator';

class CheckVerificationCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export default CheckVerificationCodeDto;
