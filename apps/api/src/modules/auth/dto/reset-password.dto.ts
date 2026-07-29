import { IsString, MinLength } from "class-validator";

/**
 * DTO для сброса пароля.
 * Содержит токен сброса и новый пароль (минимум 6 символов).
 */
export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
