import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
} from "class-validator";
import { TransactionType } from "@prisma/client";

/**
 * DTO для создания новой транзакции.
 * Содержит сумму, тип, ID счёта и опциональные описание, дату, категорию и целевой счёт.
 */
export class CreateTransactionDto {
  @IsNumber()
  amount!: number;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsString()
  accountId!: string;

  @IsOptional()
  @IsString()
  toAccountId?: string;
}
