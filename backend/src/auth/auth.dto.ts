import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Зөв имэйл хаяг оруулна уу' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Нууц үг хамгийн багадаа 6 тэмдэгт' })
  password: string;

  @IsString()
  @MinLength(2, { message: 'Нэр оруулна уу' })
  name: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Зөв имэйл хаяг оруулна уу' })
  email: string;

  @IsString()
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Зөв имэйл хаяг оруулна уу' })
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6, { message: 'Нууц үг хамгийн багадаа 6 тэмдэгт' })
  password: string;
}
