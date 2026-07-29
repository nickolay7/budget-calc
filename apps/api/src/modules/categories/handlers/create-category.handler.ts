import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler, EventBus, QueryBus } from "@nestjs/cqrs";
import { CreateCategoryCommand } from "../commands/create-category.command";
import { CategoryCreatedEvent } from "../events/category-created.event";
import { GetUserByIdQuery } from "../../users/queries/get-user-by-id.query";
import { PrismaService } from "../../../prisma/prisma.service";

/**
 * Обработчик команды создания категории.
 * Проверяет существование пользователя, создаёт категорию и публикует CategoryCreatedEvent.
 */
@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
  /**
   * @param prisma - PrismaService для работы с БД
   * @param eventBus - EventBus для публикации событий
   * @param queryBus - QueryBus для проверки существования пользователя
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Выполняет создание категории.
   *
   * @param command - Команда с userId, name, опционально icon и color
   * @returns Созданная категория
   * @throws NotFoundException если пользователь не найден
   */
  async execute(command: CreateCategoryCommand) {
    const user = await this.queryBus.execute(new GetUserByIdQuery(command.userId));

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const category = await this.prisma.category.create({
      data: {
        name: command.name,
        icon: command.icon ?? null,
        color: command.color ?? null,
        userId: command.userId,
      },
    });

    this.eventBus.publish(
      new CategoryCreatedEvent(category.id, category.userId, category.name),
    );

    return category;
  }
}
