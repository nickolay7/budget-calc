import { IsOptional, IsString, IsEnum, IsNumber } from "class-validator";
import { AccountType } from "@prisma/client";

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType;

  @IsOptional()
  @IsNumber()
  balance?: number;
}
