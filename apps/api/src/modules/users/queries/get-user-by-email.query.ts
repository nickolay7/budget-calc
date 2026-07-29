/**
 * Запрос на получение пользователя по email.
 * Используется при регистрации (проверка уникальности) и при входе в систему.
 */
export class GetUserByEmailQuery {
  constructor(public readonly email: string) {}
}
