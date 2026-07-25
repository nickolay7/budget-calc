# Guide: Adding a New CQRS Flow

This guide walks through adding a new cross-module operation using CQRS. Example: allowing the Auth module to **update a user's email** via CQRS.

## Step 1: Create the Command (in Users module)

```typescript
// apps/api/src/modules/users/commands/update-user-email.command.ts
export class UpdateUserEmailCommand {
  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {}
}
```

## Step 2: Create the Handler (in Users module)

```typescript
// apps/api/src/modules/users/handlers/update-user-email.handler.ts
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserEmailCommand } from "../commands/update-user-email.command";
import { PrismaService } from "../../../prisma/prisma.service";

@CommandHandler(UpdateUserEmailCommand)
export class UpdateUserEmailHandler implements ICommandHandler<UpdateUserEmailCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: UpdateUserEmailCommand) {
    return this.prisma.user.update({
      where: { id: command.userId },
      data: { email: command.email },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }
}
```

## Step 3: Register the Handler (in Users module)

```typescript
// users.module.ts
@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [
    CreateUserHandler,
    GetUserByEmailHandler,
    GetUserByIdHandler,
    UpdateUserEmailHandler,      // ← add here
  ],
})
export class UsersModule {}
```

## Step 4: Dispatch from Auth (or any other module)

```typescript
// auth.service.ts — no imports from UsersModule
import { CommandBus } from "@nestjs/cqrs";
import { UpdateUserEmailCommand } from "../users/commands/update-user-email.command";

@Injectable()
export class AuthService {
  constructor(private readonly commandBus: CommandBus) {}

  async updateEmail(userId: string, newEmail: string) {
    return this.commandBus.execute(
      new UpdateUserEmailCommand(userId, newEmail),
    );
  }
}
```

## Recap

| Step | What | Where |
|---|---|---|
| 1 | Message class (command/query/event) | `modules/{owner}/commands/` |
| 2 | Handler class with `@CommandHandler()` decorator | `modules/{owner}/handlers/` |
| 3 | Register handler in owner's `providers` | `modules/{owner}/*.module.ts` |
| 4 | Dispatch via `CommandBus`/`QueryBus` | Any other module |

## Checklist

- [ ] Message class is a plain data object — no logic, no injectable dependencies
- [ ] Handler is in the **owning** module, not the consuming module
- [ ] Consumer imports `CqrsModule` only (not the owning module)
- [ ] Handler is registered in the owning module's `providers`
- [ ] Consumer dispatches via `CommandBus.execute()` / `QueryBus.execute()`
