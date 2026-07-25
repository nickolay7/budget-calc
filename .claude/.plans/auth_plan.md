# Auth Frontend + Password Recovery Plan

## Цель

Создать страницы авторизации (логин, регистрация), восстановление пароля на фронтенде и бэкенде. Использовать shadcn/ui, FSD-методологию, zustand для состояния.

---

## Чек-лист задач

### Шаг 1: Prisma — модель User (добавить поля для сброса пароля)
- [ ] `schema.prisma` — добавить `passwordResetToken String?` и `passwordResetExpiresAt DateTime?`
- [ ] `npm run db:migrate` — создать миграцию
- [ ] `npm run db:generate` — обновить Prisma Client

### Шаг 2: Бэкенд — forgot/reset password
- [ ] Создать `apps/api/src/modules/auth/dto/forgot-password.dto.ts`
- [ ] Создать `apps/api/src/modules/auth/dto/reset-password.dto.ts`
- [ ] Добавить `POST /auth/forgot-password` (генерирует `crypto.randomBytes(32).toString('hex')`, сохраняет в user, возвращает сообщение)
- [ ] Добавить `POST /auth/reset-password` (проверяет токен и срок, хэширует новый пароль)
- [ ] Добавить shared типы и Zod-схемы в `packages/shared/`
- [ ] `npm run build -w @budget-calc/api`

### Шаг 3: Установка shadcn/ui
- [ ] Установить зависимости: `tailwind-merge`, `clsx`, `class-variance-authority`, `lucide-react`, `@radix-ui/*` (нужные примитивы)
- [ ] Создать `src/lib/cn.ts` — `cn()` утилита (clsx + tailwind-merge)
- [ ] Создать конфигурацию CSS-переменных для shadcn (в globals.css)
- [ ] Создать компоненты shadcn в `src/shared/ui/`:
  - `button.tsx`
  - `input.tsx`
  - `label.tsx`
  - `card.tsx`
  - `form.tsx`

### Шаг 4: FSD-структура + Zustand
- [ ] Создать `src/shared/api/api-client.ts` — расширенный apiClient с Bearer-токеном, хранением токенов (localStorage), refresh-логикой
- [ ] Создать `src/shared/lib/cn.ts` — утилита cn()
- [ ] Создать `src/shared/lib/helpers.ts` — утилиты
- [ ] Создать `src/entities/auth/store.ts` — zustand-стор:
  - `user: UserProfile | null`
  - `accessToken: string | null`
  - `isAuthenticated: boolean`
  - `login(email, password)` — вызывает API, сохраняет токены
  - `register(email, name, password)` — вызывает API
  - `logout()`
  - `checkAuth()` — проверяет/восстанавливает сессию
- [ ] Создать barrel exports

### Шаг 5: features/auth — формы
- [ ] `src/features/auth/ui/LoginForm.tsx` — форма входа (email + password)
- [ ] `src/features/auth/ui/RegisterForm.tsx` — форма регистрации (email + name + password + confirm)
- [ ] `src/features/auth/ui/ForgotPasswordForm.tsx` — форма запроса сброса (email)
- [ ] `src/features/auth/ui/ResetPasswordForm.tsx` — форма нового пароля (password + confirm + token из URL)
- [ ] Валидация через Zod-схемы из `@budget-calc/shared`
- [ ] Обработка ошибок (неверные данные, пользователь существует и т.д.)

### Шаг 6: Страницы (Next.js App Router)
- [ ] `src/app/(auth)/login/page.tsx` — вёрстка с LoginForm
- [ ] `src/app/(auth)/register/page.tsx` — вёрстка с RegisterForm
- [ ] `src/app/(auth)/forgot-password/page.tsx` — вёрстка с ForgotPasswordForm
- [ ] `src/app/(auth)/reset-password/page.tsx` — достаёт `token` из query-параметров, рендерит ResetPasswordForm
- [ ] Ссылки между страницами ("нет аккаунта?", "забыли пароль?", "вернуться к логину")

### Шаг 7: AuthProvider + Layout
- [ ] `src/app/providers/AuthProvider.tsx` — инициализация auth-состояния на клиенте (checkAuth при монтировании)
- [ ] `src/app/layout.tsx` — обернуть в AuthProvider

### Шаг 8: Middleware — защита маршрутов
- [ ] `src/middleware.ts` — проверка accessToken в cookies/localStorage, редирект на /login
- [ ] Публичные маршруты: /login, /register, /forgot-password, /reset-password

### Шаг 9: AppShell + навигация
- [ ] Обновить `src/components/layout/app-shell.tsx` — показывать только если авторизован
- [ ] Обновить `src/components/layout/sidebar.tsx` — добавить кнопку logout

### Шаг 10: Обновление CLAUDE.md
- [ ] Добавить секцию FSD-структуры фронтенда
- [ ] Описать слои: shared, entities, features, widgets, app
- [ ] Указать используемые библиотеки (shadcn/ui, zustand, zod)

---

## Структура FSD

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Публичные auth-страницы
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── providers/
│   │   └── AuthProvider.tsx       # Zustand + hydration
│   ├── layout.tsx                 # Root layout с AuthProvider
│   ├── middleware.ts              # Route protection
│   └── ...
├── entities/
│   └── auth/
│       ├── store.ts               # Zustand store
│       └── index.ts
├── features/
│   └── auth/
│       └── ui/
│           ├── LoginForm.tsx
│           ├── RegisterForm.tsx
│           ├── ForgotPasswordForm.tsx
│           └── ResetPasswordForm.tsx
├── shared/
│   ├── api/
│   │   └── api-client.ts          # HttpClient with JWT
│   ├── lib/
│   │   ├── cn.ts                  # clsx + tailwind-merge
│   │   └── helpers.ts
│   └── ui/                        # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── card.tsx
│       └── form.tsx
└── components/                    # Старые компоненты (постепенный переход)
    ├── layout/
    └── ui/
```

## Валидация (Zod из @budget-calc/shared)

```typescript
// Уже есть:
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const createUserSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Нужно добавить:
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
```

## Structure of Auth Store (Zustand)

```typescript
interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
```

## API Endpoints (Backend)

| Method | Path | Auth | Body | Response |
|--------|------|------|------|----------|
| POST | /api/auth/forgot-password | Public | `{ email }` | `{ message }` |
| POST | /api/auth/reset-password | Public | `{ token, password }` | `{ message }` |
