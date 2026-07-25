import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler, EventBus } from "@nestjs/cqrs";
import { DeleteCategoryCommand } from "../commands/delete-category.command";
import { CategoryDeletedEvent } from "../events/category-deleted.event";
import { PrismaService } from "../../../prisma/prisma.service";

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler implements ICommandHandler<DeleteCategoryCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

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
