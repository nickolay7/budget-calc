import {
  IsString,
  IsOptional,
  IsNotEmpty,
  Matches,
} from "class-validator";

/**
 * DTO для создания новой категории.
 * Содержит название (обязательно), опциональные иконку и hex-цвет (например, #FF0000).
 */
export class CreateCategoryDto {
  @IsString({ message: "name must be a string" })
  @IsNotEmpty({ message: "name should not be empty" })
  name!: string;

  @IsOptional()
  @IsString({ message: "icon must be a string" })
  icon?: string;

  @IsOptional()
  @IsString({ message: "color must be a string" })
  @Matches(/^#[0-9a-fA-F]{6}$/, {
    message: "color must be a valid hex color (e.g. #FF0000)",
  })
  color?: string;
}
