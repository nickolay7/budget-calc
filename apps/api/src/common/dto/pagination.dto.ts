import { IsOptional, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";

/**
 * DTO для пагинированных запросов.
 * Содержит номер страницы (page) и количество элементов на странице (limit)
 * со значениями по умолчанию.
 */
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
