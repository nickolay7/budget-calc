import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { ZodSchema, ZodError } from "zod";

/**
 * Pipe для валидации данных с использованием Zod-схемы.
 * При несоответствии схеме выбрасывает BadRequestException с описанием ошибок.
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  /**
   * @param schema - Zod-схема для валидации входящих данных
   */
  constructor(private schema: ZodSchema) {}

  /**
   * Валидирует входящее значение по переданной схеме.
   *
   * @param value - Входящее значение для проверки
   * @returns Валидированные и преобразованные данные
   * @throws BadRequestException при ошибке валидации
   */
  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(
          error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        );
      }
      throw error;
    }
  }
}
