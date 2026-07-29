import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler, EventBus } from "@nestjs/cqrs";
import { UpdateCategoryCommand } from "../commands/update-category.command";
import { CategoryUpdatedEvent } from "../events/category-updated.event";
import { PrismaService } from "../../../prisma/prisma.service";

/**
 * Обработчик команды обновления категории.
 * Обновляет только переданные поля через updateMany и публикует CategoryUpdatedEvent.
 */
@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  /**
   * @param prisma - PrismaService для работы с БД
   * @param eventBus - EventBus для публикации событий
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Выполняет обновление категории.
   *
   * @param command - Команда с id, userId и опциональными полями для обновления
   * @returns Обновлённая категория
   * @throws NotFoundException если категория не найдена
   */
  async execute(command: UpdateCategoryCommand) {
    const data: Record<string, string> = {};

    if (command.name !== undefined) data.name = command.name;
    if (command.icon !== undefined) data.icon = command.icon;
    if (command.color !== undefined) data.color = command.color;

    const result = await this.prisma.category.updateMany({
      where: { id: command.id, userId: command.userId },
      data,
    });

    if (result.count === 0) {
      throw new NotFoundException("Category not found");
    }

    const category = await this.prisma.category.findFirst({
      where: { id: command.id, userId: command.userId },
    });

    if (category) {
      this.eventBus.publish(
        new CategoryUpdatedEvent(category.id, category.userId, category.name),
      );
    }

    return category;
  }
}
