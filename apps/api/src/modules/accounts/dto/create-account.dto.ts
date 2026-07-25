import { IsString, IsEnum, IsOptional, IsNumber } from "class-validator";
import { AccountType } from "@prisma/client";

export class CreateAccountDto {
  @IsString()
  name!: string;

  @IsEnum(AccountType)
  type!: AccountType;

  @IsOptional()
  @IsNumber()
  balance?: number;
}
