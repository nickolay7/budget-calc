/**
 * Запрос на получение категории по ID с последними 10 транзакциями.
 * Проверяет принадлежность категории пользователю.
 */
export class GetCategoryByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
