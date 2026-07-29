import { IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO для запроса сброса пароля.
 * Содержит email пользователя, на который будет отправлена ссылка для сброса.
 */
export class ForgotPasswordDto {
  @ApiProperty({ description: "User email address", example: "user@example.com" })
  @IsEmail()
  email!: string;
}
