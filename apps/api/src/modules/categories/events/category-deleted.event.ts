/**
 * Событие, публикуемое после успешного удаления категории.
 * Содержит ID категории и ID пользователя.
 */
export class CategoryDeletedEvent {
  constructor(
    public readonly categoryId: string,
    public readonly userId: string,
  ) {}
}
