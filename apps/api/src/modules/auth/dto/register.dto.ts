import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO для регистрации нового пользователя.
 * Содержит email, имя и пароль (минимум 6 символов).
 */
export class RegisterDto {
  @ApiProperty({ description: "User email address", example: "user@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: "User display name", example: "John Doe" })
  @IsString()
  @MinLength(3)
  name!: string;

  @ApiProperty({ description: "User password (min 6 characters)", example: "password123", minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}
