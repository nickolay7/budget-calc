import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
} from "class-validator";
import { TransactionType } from "@prisma/client";

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
