# Changed File Tree

All files added or modified during the auth/CQRS implementation.

## New Files (7 files)

```
apps/api/src/modules/users/
├── commands/
│   └── create-user.command.ts         ← NEW: command class
├── queries/
│   ├── get-user-by-email.query.ts     ← NEW: query class
│   └── get-user-by-id.query.ts        ← NEW: query class
├── handlers/
│   ├── create-user.handler.ts         ← NEW: @CommandHandler
│   ├── get-user-by-email.handler.ts   ← NEW: @QueryHandler
│   └── get-user-by-id.handler.ts      ← NEW: @QueryHandler
├── events/
│   └── user-created.event.ts          ← NEW: event class
```

## Modified Files (9 files)

```
apps/api/src/
├── app.module.ts                      ← MODIFIED: CqrsModule.forRoot(), APP_GUARD
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts             ← MODIFIED: CqrsModule instead of UsersModule
│   │   ├── auth.controller.ts         ← MODIFIED: DTO types, refresh @Public
│   │   └── auth.service.ts            ← REWRITTEN: CQRS + bcrypt + JWT
│   └── users/
│       ├── users.module.ts            ← REWRITTEN: CqrsModule, handlers, no export
│       └── users.controller.ts        ← MODIFIED: QueryBus instead of UsersService
│
packages/shared/src/
├── types/
│   └── user.types.ts                  ← MODIFIED: AuthTokens, AuthResponse, LoginDto
└── validation/
    └── user.schema.ts                 ← MODIFIED: loginSchema, LoginInput
```

## Deleted Files (1 file)

```
apps/api/src/modules/users/users.service.ts  ← DELETED: replaced by CQRS handlers
```

## Category Module (CQRS Conversion)

### New Files (11 files)

```
apps/api/src/modules/categories/
├── commands/
│   ├── create-category.command.ts         ← NEW: command class
│   ├── update-category.command.ts         ← NEW: command class
│   └── delete-category.command.ts         ← NEW: command class
├── queries/
│   ├── get-categories.query.ts            ← NEW: query class
│   └── get-category-by-id.query.ts        ← NEW: query class
├── handlers/
│   ├── create-category.handler.ts         ← NEW: @CommandHandler
│   ├── update-category.handler.ts         ← NEW: @CommandHandler
│   ├── delete-category.handler.ts         ← NEW: @CommandHandler
│   ├── get-categories.handler.ts          ← NEW: @QueryHandler
│   └── get-category-by-id.handler.ts      ← NEW: @QueryHandler
├── events/
│   ├── category-created.event.ts          ← NEW: event class
│   ├── category-updated.event.ts          ← NEW: event class
│   └── category-deleted.event.ts          ← NEW: event class
```

### Modified Files (2 files)

```
apps/api/src/modules/categories/
├── categories.controller.ts             ← MODIFIED: CQRS buses instead of service
├── categories.module.ts                 ← MODIFIED: CqrsModule + handler providers
└── dto/
    ├── create-category.dto.ts           ← MODIFIED: @IsNotEmpty, hex @Matches
    └── update-category.dto.ts           ← MODIFIED: @IsNotEmpty, hex @Matches
```

### Deleted Files (1 file)

```
apps/api/src/modules/categories/categories.service.ts  ← DELETED: replaced by CQRS handlers
```

### New Documentation (2 files)

```
apps/docs/src/
├── 02-api/categories.md              ← NEW: API endpoints reference
└── 03-modules/categories.md          ← NEW: module structure reference
```

## Password Recovery (Backend)

### New Files (2 files)

```
apps/api/src/modules/auth/dto/
├── forgot-password.dto.ts            ← NEW: @IsEmail email
└── reset-password.dto.ts             ← NEW: @IsString token, @IsString @MinLength(6) password
```

### Modified Files (2 files)

```
apps/api/src/modules/auth/
├── auth.controller.ts                ← MODIFIED: +forgotPassword, +resetPassword (both @Public)
└── auth.service.ts                   ← MODIFIED: +PrismaService, +forgotPassword(), +resetPassword()
```

### Modified Prisma Schema (1 file)

```
apps/api/prisma/schema.prisma         ← MODIFIED: +passwordResetToken String?, +passwordResetExpires DateTime?
```

### New Migration (1 file)

```
apps/api/prisma/migrations/
└── 20260720145122_add_password_reset_fields/
    └── migration.sql                 ← NEW: ALTER TABLE "User" ADD COLUMN
```

### New Shared Types (2 interfaces)

```
packages/shared/src/
├── types/user.types.ts               ← MODIFIED: +ForgotPasswordDto, +ResetPasswordDto
└── validation/user.schema.ts         ← MODIFIED: +forgotPasswordSchema, +resetPasswordSchema
```

## Auth Frontend

### New Dependencies (8 packages)

```
class-variance-authority              ← NEW: shadcn/ui button variants
clsx                                  ← NEW: conditional classes
tailwind-merge                        ← NEW: Tailwind class merging
lucide-react                          ← NEW: icons
@radix-ui/react-slot                  ← NEW: shadcn Button asChild
@radix-ui/react-label                 ← NEW: shadcn Label primitive
zustand                               ← NEW: auth state management
```

### New FSD Structure

```
apps/web/src/
├── shared/
│   ├── api/                          ← (future: api client with JWT)
│   ├── lib/
│   │   └── cn.ts                     ← NEW: clsx + tailwind-merge utility
│   └── ui/                           ← shadcn/ui components
│       ├── button.tsx                ← NEW: cva variants (primary, destructive, outline, ghost, link, secondary)
│       ├── input.tsx                 ← NEW: styled input with focus ring
│       ├── label.tsx                 ← NEW: @radix-ui/react-label wrapper
│       ├── card.tsx                  ← NEW: Card + CardHeader + CardContent + CardFooter + CardTitle + CardDescription
│       └── index.ts                  ← NEW: barrel export
├── entities/
│   └── auth/
│       └── (future: store.ts)        ← zustand auth store (pending)
├── features/
│   └── auth/
│       └── ui/                       ← (future: login/register/reset forms)
├── components/                       ← (legacy, migrating to shared/)
│   ├── layout/
│   └── ui/
└── styles/
    └── globals.css                   ← MODIFIED: shadcn theme variables (oklch), Tailwind v4 @theme
```

## New Dependency (1 package)

```
node_modules/@nestjs/cqrs             ← NEW: ^11.0.3
```
