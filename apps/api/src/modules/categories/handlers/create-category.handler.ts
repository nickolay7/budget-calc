import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler, EventBus, QueryBus } from "@nestjs/cqrs";
import { CreateCategoryCommand } from "../commands/create-category.command";
import { CategoryCreatedEvent } from "../events/category-created.event";
import { GetUserByIdQuery } from "../../users/queries/get-user-by-id.query";
import { PrismaService } from "../../../prisma/prisma.service";

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

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
