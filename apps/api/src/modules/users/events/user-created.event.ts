/**
 * Событие, публикуемое после успешного создания пользователя.
 * Содержит ID, email и имя созданного пользователя.
 */
export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string | null,
  ) {}
}
