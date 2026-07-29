/**
 * Запрос на получение всех категорий пользователя.
 * Возвращает категории, отсортированные по имени.
 */
export class GetCategoriesQuery {
  constructor(public readonly userId: string) {}
}
