import { CommandHandler, ICommandHandler, EventBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "../commands/create-user.command";
import { PrismaService } from "../../../prisma/prisma.service";
import { UserCreatedEvent } from "../events/user-created.event";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

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
