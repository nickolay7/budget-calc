import { IsEmail, IsString } from "class-validator";

/**
 * DTO для входа в систему.
 * Содержит email и пароль пользователя.
 */
export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
