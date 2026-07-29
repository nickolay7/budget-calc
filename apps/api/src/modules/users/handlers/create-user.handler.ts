import { CommandHandler, ICommandHandler, EventBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "../commands/create-user.command";
import { PrismaService } from "../../../prisma/prisma.service";
import { UserCreatedEvent } from "../events/user-created.event";

/**
 * Обработчик команды создания пользователя.
 * Создаёт запись пользователя в БД через Prisma и публикует событие UserCreatedEvent.
 */
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  /**
   * @param prisma - PrismaService для работы с БД
   * @param eventBus - EventBus для публикации событий
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Выполняет создание пользователя.
   *
   * @param command - Команда с email, name и passwordHash
   * @returns Созданный пользователь (id, email, name, createdAt)
   */
  async execute(command: CreateUserCommand) {
    const user = await this.prisma.user.create({
      data: {
        email: command.email,
        name: command.name,
        password: command.passwordHash,
      },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    this.eventBus.publish(
      new UserCreatedEvent(user.id, user.email, user.name),
    );

    return user;
  }
}
