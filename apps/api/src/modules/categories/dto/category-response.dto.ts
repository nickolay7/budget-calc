import { ApiProperty } from "@nestjs/swagger";
import { TransactionType } from "@prisma/client";

export class CategoryDto {
  @ApiProperty({ description: "Category ID", example: "uuid" })
  id!: string;

  @ApiProperty({ description: "Category name", example: "Groceries" })
  name!: string;

  @ApiProperty({ description: "Category icon (emoji)", example: "🛒", nullable: true })
  icon!: string | null;

  @ApiProperty({ description: "Category color in hex", example: "#FF0000", nullable: true })
  color!: string | null;

  @ApiProperty({ description: "Owner user ID", example: "uuid" })
  userId!: string;

  @ApiProperty({ description: "Creation date", example: "2025-01-15T10:30:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ description: "Last update date", example: "2025-01-15T10:30:00.000Z" })
  updatedAt!: Date;
}

class CategoryTransactionDto {
  @ApiProperty({ description: "Transaction ID", example: "uuid" })
  id!: string;

  @ApiProperty({ description: "Transaction amount", example: 150.00 })
  amount!: number;

  @ApiProperty({ description: "Transaction type", enum: TransactionType, example: "EXPENSE" })
  type!: TransactionType;

  @ApiProperty({ description: "Transaction description", example: "Groceries at Walmart", nullable: true })
  description!: string | null;

  @ApiProperty({ description: "Transaction date", example: "2025-01-15T10:30:00.000Z" })
  date!: Date;

  @ApiProperty({ description: "Account ID", example: "uuid" })
  accountId!: string;

  @ApiProperty({ description: "Target account ID (for transfers)", example: "uuid", nullable: true })
  toAccountId!: string | null;

  @ApiProperty({ description: "Owner user ID", example: "uuid" })
  userId!: string;

  @ApiProperty({ description: "Creation date", example: "2025-01-15T10:30:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ description: "Last update date", example: "2025-01-15T10:30:00.000Z" })
  updatedAt!: Date;
}

export class CategoryWithTransactionsDto extends CategoryDto {
  @ApiProperty({ description: "Last 10 transactions", type: [CategoryTransactionDto] })
  transactions!: CategoryTransactionDto[];
}
