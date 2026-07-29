import { IsOptional, IsString, IsEnum, IsDateString } from "class-validator";
import { TransactionType } from "@prisma/client";
import { PaginationDto } from "../../../common/dto/pagination.dto";

/**
 * DTO для запроса списка транзакций с фильтрацией.
 * Расширяет PaginationDto, добавляя поля для фильтрации по датам,
 * категории, счёту и типу транзакции.
 */
export class QueryTransactionDto extends PaginationDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  accountId?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}
