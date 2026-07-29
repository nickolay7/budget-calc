import { IsEmail } from "class-validator";

/**
 * DTO для запроса сброса пароля.
 * Содержит email пользователя, на который будет отправлена ссылка для сброса.
 */
export class ForgotPasswordDto {
  @IsEmail()
  email!: string;
}
