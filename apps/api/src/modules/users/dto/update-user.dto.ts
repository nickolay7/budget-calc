import { IsOptional, IsString, IsEmail } from "class-validator";

/**
 * DTO для обновления профиля пользователя.
 * Все поля опциональны — обновляются только переданные значения.
 */
export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
