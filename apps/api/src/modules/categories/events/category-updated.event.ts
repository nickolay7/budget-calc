/**
 * Событие, публикуемое после успешного обновления категории.
 * Содержит ID категории, ID пользователя и название категории.
 */
export class CategoryUpdatedEvent {
  constructor(
    public readonly categoryId: string,
    public readonly userId: string,
    public readonly name: string,
  ) {}
}
