import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

/**
 * Глобальный JWT- Guard, проверяющий наличие и валидность Bearer-токена.
 * Учитывает декоратор @Public(): если маршрут или класс помечен как публичный,
 * проверка токена пропускается.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  /**
   * @param reflector - Рефлектор для чтения метаданных @Public()
   */
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Определяет, разрешён ли доступ к маршруту.
   * Проверяет наличие метаданных isPublic; если true — пропускает без аутентификации.
   *
   * @param context - Контекст выполнения
   * @returns true, если доступ разрешён, или результат проверки JWT
   */
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
