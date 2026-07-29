/**
 * Команда удаления категории.
 * Содержит ID категории и ID пользователя для проверки владельца.
 */
export class DeleteCategoryCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
