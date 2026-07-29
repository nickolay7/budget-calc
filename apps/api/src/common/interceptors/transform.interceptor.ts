import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

/** Тип ответа API, обёрнутого в стандартный конверт { data, timestamp }. */
export interface ApiResponse<T> {
  data: T;
  timestamp: string;
}

/**
 * Глобальный interceptor, оборачивающий все успешные ответы в единый конверт
 * вида { data, timestamp }. Применяется ко всем маршрутам.
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  /**
   * Перехватывает ответ и оборачивает данные в стандартный конверт.
   *
   * @param _context - Контекст выполнения (не используется)
   * @param next - Обработчик следующего шага
   * @returns Observable с объектом { data, timestamp }
   */
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
