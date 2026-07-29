import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";

/**
 * Глобальный фильтр исключений для HTTP-ошибок.
 * Перехватывает HttpException и возвращает единообразный JSON-ответ
 * с полями statusCode, message и timestamp.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Обрабатывает выброшенное HTTP-исключение и формирует ответ.
   *
   * @param exception - Выброшенное HTTP-исключение
   * @param host - Контекст выполнения для получения объекта ответа Express
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      statusCode: status,
      message:
        typeof exceptionResponse === "string"
          ? exceptionResponse
          : (exceptionResponse as Record<string, unknown>).message,
      timestamp: new Date().toISOString(),
    });
  }
}
