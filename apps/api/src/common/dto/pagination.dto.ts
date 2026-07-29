import { IsOptional, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

/**
 * DTO для пагинированных запросов.
 * Содержит номер страницы (page) и количество элементов на странице (limit)
 * со значениями по умолчанию.
 */
export class PaginationDto {
  @ApiProperty({ description: "Page number (1-indexed)", example: 1, required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: "Number of items per page", example: 20, required: false, default: 20, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
