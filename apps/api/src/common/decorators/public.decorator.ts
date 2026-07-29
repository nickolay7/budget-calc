import { SetMetadata } from "@nestjs/common";

/**
 * Ключ метаданных, используемый JwtAuthGuard для проверки,
 * помечен ли маршрут как публичный (не требует авторизации).
 */
export const IS_PUBLIC_KEY = "isPublic";

/**
 * Декоратор, помечающий маршрут как публичный.
 * Используется совместно с JwtAuthGuard: если на маршруте есть @Public(),
 * проверка JWT-токена пропускается.
 *
 * @example
 * ```ts
 * @Public()
 * @Post("register")
 * register(@Body() dto: RegisterDto) { ... }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
