import { IsEmail, IsString, MinLength } from "class-validator";

/**
 * DTO для создания пользователя (используется внутри сервиса аутентификации).
 * Содержит email, имя и пароль (минимум 6 символов).
 */
export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  name!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
