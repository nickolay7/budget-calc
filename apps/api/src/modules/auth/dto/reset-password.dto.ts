import { IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO для сброса пароля.
 * Содержит токен сброса и новый пароль (минимум 6 символов).
 */
export class ResetPasswordDto {
  @ApiProperty({ description: "Password reset token", example: "abc123..." })
  @IsString()
  token!: string;

  @ApiProperty({ description: "New password (min 6 characters)", example: "newPassword123", minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}
