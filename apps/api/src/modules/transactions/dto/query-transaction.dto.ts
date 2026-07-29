import { IsOptional, IsString, IsEnum, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TransactionType } from "@prisma/client";
import { PaginationDto } from "../../../common/dto/pagination.dto";

/**
 * DTO для запроса списка транзакций с фильтрацией.
 * Расширяет PaginationDto, добавляя поля для фильтрации по датам,
 * категории, счёту и типу транзакции.
 */
export class QueryTransactionDto extends PaginationDto {
  @ApiProperty({ description: "Filter by start date (ISO 8601)", example: "2025-01-01", required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: "Filter by end date (ISO 8601)", example: "2025-12-31", required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: "Filter by category ID", example: "uuid-category-id", required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ description: "Filter by account ID", example: "uuid-account-id", required: false })
  @IsOptional()
  @IsString()
  accountId?: string;

  @ApiProperty({ description: "Filter by transaction type", enum: TransactionType, example: "EXPENSE", required: false })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}
