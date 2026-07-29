import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TransactionType } from "@prisma/client";

class StatsByCategoryDto {
  @ApiProperty({ description: "Category ID", example: "uuid", nullable: true })
  categoryId!: string | null;

  @ApiProperty({ description: "Category name", example: "Groceries" })
  categoryName!: string;

  @ApiProperty({ description: "Category icon", example: "🛒", nullable: true })
  categoryIcon!: string | null;

  @ApiProperty({ description: "Total amount for this category", example: 450.00 })
  total!: number;

  @ApiProperty({ description: "Transaction count for this category", example: 10 })
  count!: number;
}

class StatsByMonthDto {
  @ApiProperty({ description: "Month in YYYY-MM format", example: "2025-01" })
  month!: string;

  @ApiProperty({ description: "Transaction type", enum: TransactionType, example: "EXPENSE" })
  type!: TransactionType;

  @ApiProperty({ description: "Total amount for this month and type", example: 1200.00 })
  total!: number;

  @ApiProperty({ description: "Transaction count for this month and type", example: 25 })
  count!: number;
}

export class TransactionStatsDto {
  @ApiProperty({ description: "Total income amount", example: 5000.00 })
  totalIncome!: number;

  @ApiProperty({ description: "Total expense amount", example: 3200.00 })
  totalExpense!: number;

  @ApiProperty({ description: "Net amount (income - expense)", example: 1800.00 })
  netAmount!: number;

  @ApiProperty({ description: "Total transaction count", example: 100 })
  totalTransactions!: number;

  @ApiProperty({ description: "Breakdown by category", type: [StatsByCategoryDto] })
  byCategory!: StatsByCategoryDto[];

  @ApiProperty({ description: "Breakdown by month", type: [StatsByMonthDto] })
  byMonth!: StatsByMonthDto[];
}
