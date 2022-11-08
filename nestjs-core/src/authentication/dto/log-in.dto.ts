import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

class LogInDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
}

export default LogInDto;
