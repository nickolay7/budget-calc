import { IsOptional, IsString, IsNumber, IsEnum, IsDateString } from "class-validator";
import { TransactionType } from "@prisma/client";

/**
 * DTO для обновления транзакции.
 * Все поля опциональны — обновляются только переданные значения.
 */
export class UpdateTransactionDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  accountId?: string;
}
