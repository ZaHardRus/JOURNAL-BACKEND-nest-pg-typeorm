import { IsEmail, Length } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'необходимо указать email' })
  email: string;

  @Length(6, 48, { message: 'минимум 6 символов' })
  password?: string;
}
