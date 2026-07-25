# CQRS Pattern

## What is CQRS?

Command Query Responsibility Segregation (CQRS) separates operations into:

- **Commands** — change state (write), return data. *Example:* `CreateUserCommand`
- **Queries** — read state, no side effects. *Example:* `GetUserByEmailQuery`
- **Events** — notify that something happened. *Example:* `UserCreatedEvent`

## Structure

Each CQRS element consists of a **message class** and a **handler class**:

### Command

```typescript
// 1. Message: describes the intent
export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly passwordHash: string,
  ) {}
}

// 2. Handler: executes the intent
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand) {
    const user = await this.prisma.user.create({ data: { ... } });
    this.eventBus.publish(new UserCreatedEvent(user.id, ...));
    return user;
  }
}
```

### Query

```typescript
// Message
export class GetUserByEmailQuery {
  constructor(public readonly email: string) {}
}

// Handler
@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetUserByEmailQuery) {
    return this.prisma.user.findUnique({ where: { email: query.email } });
  }
}
```

### Event

```typescript
// Message (no dedicated handler required if nothing listens)
export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string | null,
  ) {}
}
```

## Dispatching

The dispatching side never imports the handler or its module:

```typescript
// AuthService — no import of UsersModule or UsersService
@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,  // from @nestjs/cqrs
    private readonly queryBus: QueryBus,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.commandBus.execute(
      new CreateUserCommand(dto.email, dto.name, passwordHash),  // ← just a plain object
    );
    return this.generateTokens(user);
  }
}
```

## Directory Layout

```
modules/users/
├── commands/
│   └── create-user.command.ts       # Message class only
├── queries/
│   ├── get-user-by-email.query.ts   # Message class
│   └── get-user-by-id.query.ts
├── handlers/
│   ├── create-user.handler.ts       # @CommandHandler
│   ├── get-user-by-email.handler.ts # @QueryHandler
│   └── get-user-by-id.handler.ts
├── events/
│   └── user-created.event.ts        # Event class only
├── users.module.ts                  # Provides all handlers
└── users.controller.ts             # Uses QueryBus/CommandBus
```

## Registration

For CQRS to work, every handler must be listed in its module's `providers`:

```typescript
@Module({
  imports: [CqrsModule],               // ← enables @CommandHandler/@QueryHandler decorators
  controllers: [UsersController],
  providers: [
    CreateUserHandler,                  // ← registered with internal CommandBus
    GetUserByEmailHandler,
    GetUserByIdHandler,
  ],
})
export class UsersModule {}
```

On the dispatching side, the module also imports `CqrsModule` to get access to the buses:

```typescript
@Module({
  imports: [CqrsModule],               // ← makes CommandBus/QueryBus injectable
  // ...
})
export class AuthModule {}
```

The magical glue is `CqrsModule.forRoot()` in `AppModule`, which makes the buses global singletons:

```typescript
@Module({
  imports: [CqrsModule.forRoot(), ...],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
```
