import { IsOptional, IsString, IsNumber, IsDateString } from "class-validator";

/**
 * DTO для обновления бюджета.
 * Все поля опциональны — обновляются только переданные значения.
 */
export class UpdateBudgetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
