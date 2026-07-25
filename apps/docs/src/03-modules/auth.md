# Auth Module

> Location: `apps/api/src/modules/auth/`

## Purpose

Handle user authentication: registration, login, token refresh, and password recovery. Communicates with the Users module exclusively through CQRS buses.

## File Tree

```
auth/
├── auth.controller.ts        ← Route handlers
├── auth.module.ts            ← Module definition
├── auth.service.ts           ← Business logic (CQRS dispatch + Prisma for password reset)
├── dto/
│   ├── login.dto.ts          ← class-validator: email, password
│   ├── register.dto.ts       ← class-validator: email, name, password
│   ├── forgot-password.dto.ts ← class-validator: email
│   └── reset-password.dto.ts  ← class-validator: token, password
└── strategies/
    └── jwt.strategy.ts       ← Passport strategy: validates Bearer token
```

## Key Files

### auth.service.ts

The service orchestrates the entire auth flow without touching the user module directly:

```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto)  { /* CQRS dispatch */ }
  async login(dto: LoginDto)        { /* CQRS dispatch */ }
  async refresh(token: string)      { /* JWT re-issue */ }
  async forgotPassword(dto)         { /* crypto token → Prisma update */ }
  async resetPassword(dto)          { /* verify token → Prisma update */ }
}
```

### jwt.strategy.ts

Validates every JWT-protected request. Extracts the Bearer token, verifies the signature, looks up the user, and attaches `{ id, email, name }` to `req.user`:

```typescript
async validate(payload: { sub: string }) {
  const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw new UnauthorizedException();
  return { id: user.id, email: user.email, name: user.name };
}
```

### auth.module.ts

```typescript
@Module({
  imports: [
    CqrsModule,                                    // CommandBus/QueryBus injection
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: config.get("JWT_EXPIRATION") ?? "15m" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  // Note: NOT importing UsersModule
})
export class AuthModule {}
```

## AuthController Routes

| Method | Path | Auth | DTO |
|---|---|---|---|
| POST | /api/auth/register | @Public() | RegisterDto |
| POST | /api/auth/login | @Public() | LoginDto |
| POST | /api/auth/refresh | @Public() | body.refreshToken |
| POST | /api/auth/forgot-password | @Public() | ForgotPasswordDto |
| POST | /api/auth/reset-password | @Public() | ResetPasswordDto |

## Password Reset Flow

### forgotPassword

1. Looks up user by email via CQRS (`GetUserByEmailQuery`)
2. Always returns the same message (prevents email enumeration)
3. For existing users: generates `crypto.randomBytes(32)` token, stores in DB with 1-hour expiry
4. In dev mode, prints token to console; in production would send email

### resetPassword

1. Finds user by `passwordResetToken` where `passwordResetExpires > now`
2. Hashes new password with bcrypt (10 rounds)
3. Updates password and clears token fields (one-time use)
4. Returns success or `400 Bad Request` for invalid/expired tokens
