/**
 * Команда создания нового пользователя.
 * Содержит email, имя и хеш пароля для создания записи в БД.
 */
export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly passwordHash: string,
  ) {}
}
