import { ApiProperty } from "@nestjs/swagger";

class BudgetCategoryDto {
  @ApiProperty({ description: "Category ID", example: "uuid" })
  id!: string;

  @ApiProperty({ description: "Category name", example: "Groceries" })
  name!: string;

  @ApiProperty({ description: "Category icon", example: "🛒", nullable: true })
  icon!: string | null;

  @ApiProperty({ description: "Category color", example: "#FF0000", nullable: true })
  color!: string | null;
}

export class BudgetDto {
  @ApiProperty({ description: "Budget ID", example: "uuid" })
  id!: string;

  @ApiProperty({ description: "Budget name", example: "Monthly Groceries" })
  name!: string;

  @ApiProperty({ description: "Budget amount", example: 500.00 })
  amount!: number;

  @ApiProperty({ description: "Budget period", example: "MONTHLY" })
  period!: string;

  @ApiProperty({ description: "Start date", example: "2025-01-01T00:00:00.000Z", nullable: true })
  startDate!: Date | null;

  @ApiProperty({ description: "End date", example: "2025-12-31T00:00:00.000Z", nullable: true })
  endDate!: Date | null;

  @ApiProperty({ description: "Category ID", example: "uuid" })
  categoryId!: string;

  @ApiProperty({ description: "Owner user ID", example: "uuid" })
  userId!: string;

  @ApiProperty({ description: "Category relation", type: BudgetCategoryDto })
  category!: BudgetCategoryDto;

  @ApiProperty({ description: "Creation date", example: "2025-01-15T10:30:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ description: "Last update date", example: "2025-01-15T10:30:00.000Z" })
  updatedAt!: Date;
}
