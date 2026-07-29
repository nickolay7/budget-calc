import { IsEmail, IsString, MinLength } from "class-validator";

/**
 * DTO для регистрации нового пользователя.
 * Содержит email, имя и пароль (минимум 6 символов).
 */
export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  name!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
