/**
 * Событие, публикуемое после успешного создания категории.
 * Содержит ID категории, ID пользователя и название категории.
 */
export class CategoryCreatedEvent {
  constructor(
    public readonly categoryId: string,
    public readonly userId: string,
    public readonly name: string,
  ) {}
}
