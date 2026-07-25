import { IsString, IsNumber, IsOptional, IsDateString } from "class-validator";

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
