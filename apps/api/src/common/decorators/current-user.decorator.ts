import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Декоратор параметра, извлекающий текущего пользователя из объекта запроса.
 * Пользователь добавляется в request стратегией JwtStrategy после валидации токена.
 *
 * @example
 * ```ts
 * // Получить весь объект пользователя
 * @CurrentUser() user: { id: string; email: string; name: string }
 *
 * // Получить только id пользователя
 * @CurrentUser("id") userId: string
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
