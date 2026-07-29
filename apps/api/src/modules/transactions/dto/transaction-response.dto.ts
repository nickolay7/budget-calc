import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TransactionType, AccountType } from "@prisma/client";

class TransactionAccountDto {
  @ApiProperty({ description: "Account ID", example: "uuid" })
  id!: string;

  @ApiProperty({ description: "Account name", example: "My Wallet" })
  name!: string;

  @ApiProperty({ description: "Account type", enum: AccountType, example: "DEBIT_CARD" })
  type!: AccountType;

  @ApiProperty({ description: "Balance", example: 1500.50 })
  balance!: number;

  @ApiProperty({ description: "Currency code", example: "USD" })
  currency!: string;
}

class TransactionCategoryDto {
  @ApiProperty({ description: "Category ID", example: "uuid" })
  id!: string;

  @ApiProperty({ description: "Category name", example: "Groceries" })
  name!: string;

  @ApiProperty({ description: "Category icon", example: "🛒", nullable: true })
  icon!: string | null;

  @ApiProperty({ description: "Category color", example: "#FF0000", nullable: true })
  color!: string | null;
}

export class TransactionDto {
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

  @ApiProperty({ description: "Category ID", example: "uuid", nullable: true })
  categoryId!: string | null;

  @ApiProperty({ description: "Account ID", example: "uuid" })
  accountId!: string;

  @ApiProperty({ description: "Target account ID", example: "uuid", nullable: true })
  toAccountId!: string | null;

  @ApiProperty({ description: "Owner user ID", example: "uuid" })
  userId!: string;

  @ApiProperty({ description: "Category relation", type: TransactionCategoryDto, nullable: true })
  category!: TransactionCategoryDto | null;

  @ApiProperty({ description: "Source account relation", type: TransactionAccountDto })
  account!: TransactionAccountDto;

  @ApiProperty({ description: "Target account relation", type: TransactionAccountDto, nullable: true })
  toAccount!: TransactionAccountDto | null;

  @ApiProperty({ description: "Creation date", example: "2025-01-15T10:30:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ description: "Last update date", example: "2025-01-15T10:30:00.000Z" })
  updatedAt!: Date;
}

class PaginationMetaDto {
  @ApiProperty({ description: "Total number of matching records", example: 50 })
  total!: number;

  @ApiProperty({ description: "Current page (1-indexed)", example: 1 })
  page!: number;

  @ApiProperty({ description: "Items per page", example: 20 })
  limit!: number;

  @ApiProperty({ description: "Total number of pages", example: 3 })
  totalPages!: number;
}

export class PaginatedTransactionsDto {
  @ApiProperty({ description: "Transaction list", type: [TransactionDto] })
  data!: TransactionDto[];

  @ApiProperty({ description: "Pagination metadata", type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
