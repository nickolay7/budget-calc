import { IsOptional, IsString, IsNumber, IsEnum, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TransactionType } from "@prisma/client";

/**
 * DTO для обновления транзакции.
 * Все поля опциональны — обновляются только переданные значения.
 */
export class UpdateTransactionDto {
  @ApiProperty({ description: "Transaction amount", example: 150.00, required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ description: "Transaction type", enum: TransactionType, example: "EXPENSE", required: false })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

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

  @ApiProperty({ description: "Account ID", example: "uuid-account-id", required: false })
  @IsOptional()
  @IsString()
  accountId?: string;
}
