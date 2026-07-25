# Module Communication

## Rule: No Direct Imports

Auth module must **never** import Users module, UsersService, or any User provider directly. All cross-module communication goes through CQRS buses.

## Communication Flow

```
AuthModule                     UsersModule
──────────                     ───────────
                                                               
AuthService                    CreateUserHandler                
  │                              │                             
  ├─CommandBus.execute(──────────┼─CreateUserCommand)          
  │   CreateUserCommand)         │   → prisma.user.create()    
  │                              │   → eventBus.publish()      
  │                              │                             
  ├─QueryBus.execute(────────────┼─GetUserByEmailQuery)        
  │   GetUserByEmailQuery)       │   → prisma.user.findUnique()
  │                              │                             
  └─QueryBus.execute(────────────┼─GetUserByIdQuery)           
      GetUserByIdQuery)          │   → prisma.user.findUnique()
```

## What Gets Imported

✅ **Allowed** — CQRS buses (from `@nestjs/cqrs`):
```typescript
import { CommandBus, QueryBus } from "@nestjs/cqrs";
```

✅ **Allowed** — Message classes (plain data objects with no logic):
```typescript
import { CreateUserCommand } from "../users/commands/create-user.command";
import { GetUserByEmailQuery } from "../users/queries/get-user-by-email.query";
```

❌ **Forbidden** — Any provider, service, or module from another module:
```typescript
import { UsersService } from "../users/users.service";          // ❌
import { UsersModule } from "../users/users.module";           // ❌
```

> **Why message imports are OK**: Commands, queries, and events are plain data classes — they hold no logic, inject nothing, and have no runtime dependencies. They are part of the *contract*, not the *implementation*. NestJS itself imports `CreateUserCommand` in the `@CommandHandler()` decorator on the handler side too.

## Module Registration

```typescript
// app.module.ts — both modules are registered independently
@Module({
  imports: [
    CqrsModule.forRoot(),   // ← global buses
    AuthModule,             // ← dispatches commands/queries
    UsersModule,            // ← handles commands/queries
  ],
})
export class AppModule {}
```

Each module only imports `CqrsModule` — not each other.

## Benefits

- **Decoupled** — Auth can be tested with mock buses, no database needed
- **Single Responsibility** — each handler does exactly one thing
- **Observable** — events can be logged, audited, or trigger side effects
- **Scalable** — add new handlers without touching existing modules
