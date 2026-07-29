import { IsString, IsEnum, IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { AccountType } from "@prisma/client";

/**
 * DTO для создания нового счёта.
 * Содержит название, тип счёта (из AccountType) и опциональный начальный баланс.
 */
export class CreateAccountDto {
  @ApiProperty({ description: "Account name", example: "My Wallet" })
  @IsString()
  name!: string;

  @ApiProperty({ description: "Account type", enum: AccountType, example: "DEBIT_CARD" })
  @IsEnum(AccountType)
  type!: AccountType;

  @ApiProperty({ description: "Initial balance", example: 1000.50, required: false })
  @IsOptional()
  @IsNumber()
  balance?: number;
}
