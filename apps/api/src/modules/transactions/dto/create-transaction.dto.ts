import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TransactionType } from "@prisma/client";

/**
 * DTO для создания новой транзакции.
 * Содержит сумму, тип, ID счёта и опциональные описание, дату, категорию и целевой счёт.
 */
export class CreateTransactionDto {
  @ApiProperty({ description: "Transaction amount", example: 150.00 })
  @IsNumber()
  amount!: number;

  @ApiProperty({ description: "Transaction type", enum: TransactionType, example: "EXPENSE" })
  @IsEnum(TransactionType)
  type!: TransactionType;

  @ApiProperty({ description: "Transaction description", example: "Groceries at Walmart", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "Transaction date (ISO 8601)", example: "2025-01-15T10:30:00Z", required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ description: "Category ID", example: "uuid-category-id", required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ description: "Source account ID", example: "uuid-account-id" })
  @IsString()
  accountId!: string;

  @ApiProperty({ description: "Target account ID (for transfers)", example: "uuid-target-account-id", required: false })
  @IsOptional()
  @IsString()
  toAccountId?: string;
}
