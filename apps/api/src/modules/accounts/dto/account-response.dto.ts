import { ApiProperty } from "@nestjs/swagger";
import { AccountType } from "@prisma/client";

export class AccountDto {
  @ApiProperty({ description: "Account ID", example: "uuid" })
  id!: string;

  @ApiProperty({ description: "Account name", example: "My Wallet" })
  name!: string;

  @ApiProperty({ description: "Account type", enum: AccountType, example: "DEBIT_CARD" })
  type!: AccountType;

  @ApiProperty({ description: "Current balance", example: 1500.50 })
  balance!: number;

  @ApiProperty({ description: "Currency code", example: "USD" })
  currency!: string;

  @ApiProperty({ description: "Owner user ID", example: "uuid" })
  userId!: string;

  @ApiProperty({ description: "Creation date", example: "2025-01-15T10:30:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ description: "Last update date", example: "2025-01-15T10:30:00.000Z" })
  updatedAt!: Date;
}
