import { IsOptional, IsString, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO для обновления профиля пользователя.
 * Все поля опциональны — обновляются только переданные значения.
 */
export class UpdateUserDto {
  @ApiProperty({ description: "User email address", example: "user@example.com", required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: "User display name", example: "John Doe", required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
