import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler, EventBus } from "@nestjs/cqrs";
import { DeleteCategoryCommand } from "../commands/delete-category.command";
import { CategoryDeletedEvent } from "../events/category-deleted.event";
import { PrismaService } from "../../../prisma/prisma.service";

/**
 * Обработчик команды удаления категории.
 * Удаляет категорию через deleteMany (с проверкой userId) и публикует CategoryDeletedEvent.
 */
@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler implements ICommandHandler<DeleteCategoryCommand> {
  /**
   * @param prisma - PrismaService для работы с БД
   * @param eventBus - EventBus для публикации событий
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Выполняет удаление категории.
   *
   * @param command - Команда с id и userId
   * @throws NotFoundException если категория не найдена
   */
  async execute(command: DeleteCategoryCommand) {
    const result = await this.prisma.category.deleteMany({
      where: { id: command.id, userId: command.userId },
    });

    if (result.count === 0) {
      throw new NotFoundException("Category not found");
    }

    this.eventBus.publish(
      new CategoryDeletedEvent(command.id, command.userId),
    );
  }
}
