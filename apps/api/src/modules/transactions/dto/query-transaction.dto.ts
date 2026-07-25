import { IsOptional, IsString, IsEnum, IsDateString } from "class-validator";
import { TransactionType } from "@prisma/client";
import { PaginationDto } from "../../../common/dto/pagination.dto";

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
