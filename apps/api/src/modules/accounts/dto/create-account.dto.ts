import { IsString, IsEnum, IsOptional, IsNumber } from "class-validator";
import { AccountType } from "@prisma/client";

/**
 * DTO для создания нового счёта.
 * Содержит название, тип счёта (из AccountType) и опциональный начальный баланс.
 */
export class CreateAccountDto {
  @IsString()
  name!: string;

  @IsEnum(AccountType)
  type!: AccountType;

  @IsOptional()
  @IsNumber()
  balance?: number;
}
