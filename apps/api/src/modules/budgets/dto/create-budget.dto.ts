import { IsString, IsNumber, IsOptional, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO для создания нового бюджета.
 * Содержит название, сумму, период, ID категории и опциональные даты начала/окончания.
 */
export class CreateBudgetDto {
  @ApiProperty({ description: "Budget name", example: "Monthly Groceries" })
  @IsString()
  name!: string;

  @ApiProperty({ description: "Budget amount", example: 500.00 })
  @IsNumber()
  amount!: number;

  @ApiProperty({ description: "Budget period", example: "MONTHLY" })
  @IsString()
  period!: string;

  @ApiProperty({ description: "Budget start date (ISO 8601)", example: "2025-01-01", required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: "Budget end date (ISO 8601)", example: "2025-12-31", required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: "Category ID", example: "uuid-category-id" })
  @IsString()
  categoryId!: string;
}
