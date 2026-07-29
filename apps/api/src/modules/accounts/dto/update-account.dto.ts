import { IsOptional, IsString, IsEnum, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { AccountType } from "@prisma/client";

/**
 * DTO для обновления счёта.
 * Все поля опциональны — обновляются только переданные значения.
 */
export class UpdateAccountDto {
  @ApiProperty({ description: "Account name", example: "My Wallet", required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: "Account type", enum: AccountType, example: "DEBIT_CARD", required: false })
  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType;

  @ApiProperty({ description: "Current balance", example: 1500.00, required: false })
  @IsOptional()
  @IsNumber()
  balance?: number;
}
