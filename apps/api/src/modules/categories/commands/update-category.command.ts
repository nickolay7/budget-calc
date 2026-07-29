/**
 * Команда обновления категории.
 * Содержит ID категории, ID пользователя и опциональные поля для обновления.
 */
export class UpdateCategoryCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name?: string,
    public readonly icon?: string,
    public readonly color?: string,
  ) {}
}
