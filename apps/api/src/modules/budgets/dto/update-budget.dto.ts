import { IsOptional, IsString, IsNumber, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO для обновления бюджета.
 * Все поля опциональны — обновляются только переданные значения.
 */
export class UpdateBudgetDto {
  @ApiProperty({ description: "Budget name", example: "Monthly Groceries", required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: "Budget amount", example: 500.00, required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ description: "Budget period", example: "MONTHLY", required: false })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiProperty({ description: "Budget start date (ISO 8601)", example: "2025-01-01", required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: "Budget end date (ISO 8601)", example: "2025-12-31", required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
