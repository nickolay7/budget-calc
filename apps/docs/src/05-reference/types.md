# Shared Types & Zod Schemas

> Located in `packages/shared/src/`

## Auth Types

```typescript
// types/user.types.ts — additions

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface LoginDto {
  email: string;
  password: string;
}
```

## Auth Zod Schema

```typescript
// validation/user.schema.ts — addition

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

## Existing User Types (unchanged)

```typescript
// types/user.types.ts — existing

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
}
```

## Existing User Zod Schema (unchanged)

```typescript
// validation/user.schema.ts — existing

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  password: z.string().min(6),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

## Backend DTOs (class-validator)

These mirror the shared Zod schemas but use `class-validator` decorators for NestJS's built-in `ValidationPipe`:

```typescript
// register.dto.ts
export class RegisterDto {
  @IsEmail()        email!: string;
  @IsString() @MinLength(3) name!: string;
  @IsString() @MinLength(6) password!: string;
}

// login.dto.ts
export class LoginDto {
  @IsEmail()        email!: string;
  @IsString()       password!: string;
}
```

## Dashboard/Stats Types

```typescript
// types/stats.types.ts — new

export interface CategoryStat {
  categoryId: string | null;
  categoryName: string;
  categoryIcon: string | null;
  total: number;
  count: number;
}

export interface MonthlyStat {
  month: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  total: number;
  count: number;
}

/** Returned by GET /api/transactions/stats */
export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  totalTransactions: number;
  byCategory: CategoryStat[];
  byMonth: MonthlyStat[];
}

/** Returned by GET /api/budgets/progress */
export interface BudgetProgressItem {
  budgetId: string;
  budgetName: string;
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentage: number;
  period: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string | null;
  categoryColor: string | null;
}
```

## Why Both Zod and class-validator?

| Layer | Validation | Reason |
|---|---|---|
| Backend (NestJS) | class-validator | Works with NestJS's built-in `ValidationPipe`, auto-transform |
| Shared (web+api) | Zod | Works everywhere, no decorators needed, good DX for forms |

The shared Zod schemas are used by the frontend for client-side validation. The backend uses class-validator DTOs for its `ValidationPipe`. Both should stay in sync.
