import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO для входа в систему.
 * Содержит email и пароль пользователя.
 */
export class LoginDto {
  @ApiProperty({ description: "User email address", example: "user@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: "User password", example: "password123" })
  @IsString()
  password!: string;
}
