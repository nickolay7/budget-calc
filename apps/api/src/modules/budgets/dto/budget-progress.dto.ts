import { ApiProperty } from "@nestjs/swagger";

export class BudgetProgressItemDto {
  @ApiProperty({ description: "Budget ID", example: "uuid" })
  budgetId!: string;

  @ApiProperty({ description: "Budget name", example: "Monthly Groceries" })
  budgetName!: string;

  @ApiProperty({ description: "Planned budget amount", example: 500.00 })
  budgetAmount!: number;

  @ApiProperty({ description: "Actual amount spent", example: 320.50 })
  spent!: number;

  @ApiProperty({ description: "Remaining amount", example: 179.50 })
  remaining!: number;

  @ApiProperty({ description: "Spending percentage (0–100)", example: 64.1 })
  percentage!: number;

  @ApiProperty({ description: "Budget period", example: "MONTHLY" })
  period!: string;

  @ApiProperty({ description: "Category ID", example: "uuid" })
  categoryId!: string;

  @ApiProperty({ description: "Category name", example: "Groceries" })
  categoryName!: string;

  @ApiProperty({ description: "Category icon", example: "🛒", nullable: true })
  categoryIcon!: string | null;

  @ApiProperty({ description: "Category color", example: "#FF0000", nullable: true })
  categoryColor!: string | null;
}
