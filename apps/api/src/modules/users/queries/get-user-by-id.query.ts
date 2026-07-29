/**
 * Запрос на получение пользователя по ID.
 * Используется для получения профиля и в JwtStrategy.
 */
export class GetUserByIdQuery {
  constructor(public readonly id: string) {}
}
