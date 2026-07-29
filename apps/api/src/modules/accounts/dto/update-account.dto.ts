import { IsOptional, IsString, IsEnum, IsNumber } from "class-validator";
import { AccountType } from "@prisma/client";

/**
 * DTO для обновления счёта.
 * Все поля опциональны — обновляются только переданные значения.
 */
export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType;

  @IsOptional()
  @IsNumber()
  balance?: number;
}
