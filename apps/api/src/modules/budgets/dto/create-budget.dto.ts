import { IsString, IsNumber, IsOptional, IsDateString } from "class-validator";

/**
 * DTO для создания нового бюджета.
 * Содержит название, сумму, период, ID категории и опциональные даты начала/окончания.
 */
export class CreateBudgetDto {
  @IsString()
  name!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  period!: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsString()
  categoryId!: string;
}
