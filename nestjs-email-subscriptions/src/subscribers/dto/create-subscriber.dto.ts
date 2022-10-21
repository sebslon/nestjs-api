import { IsEmail, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsEmail()
  public email: string;

  @IsString()
  public name: string;
}
