/**
 * Команда создания новой категории.
 * Содержит ID пользователя, название и опциональные иконку и цвет.
 */
export class CreateCategoryCommand {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly icon?: string,
    public readonly color?: string,
  ) {}
}
