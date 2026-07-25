# Plan: Implement Transactions Module (Backend + Frontend)

## Context

The transactions module is the central feature of the budget tracker. The backend has well-defined DTOs and routes but `create`, `update`, and `getStats` are all TODO stubs. The controller types DTOs as `unknown` so NestJS validation doesn't apply. Account balances are never updated when transactions are created/updated/deleted. Ownership checks are missing on `findOne`/`remove`. The frontend pages show placeholder UI only. This plan implements full end-to-end CRUD + aggregation + account balance management.

## PrismaModule is global (`@Global()` decorator on `PrismaModule`) — no import needed in transactions module.

---

## 1. Backend: Fix Controller DTO Types

**File:** `apps/api/src/modules/transactions/transactions.controller.ts`

Replace `unknown` with actual DTO classes so NestJS `ValidationPipe` works:
- `findAll(@Query() query: QueryTransactionDto)`
- `create(@Body() dto: CreateTransactionDto)`
- `update(@Param("id") id: string, @Body() dto: UpdateTransactionDto)`
- `getStats(@Query() query: QueryTransactionDto)`

Also add `@CurrentUser("id") userId: string` param to `update` and `findOne` for ownership checks.

---

## 2. Backend: Implement Transactions Service

**File:** `apps/api/src/modules/transactions/transactions.service.ts`

### 2a. `findAll(userId, query)` — wire up real filtering

Currently returns all transactions unfiltered. Add:
- Filter by `type` (INCOME/EXPENSE/TRANSFER)
- Filter by `categoryId`
- Filter by `accountId`
- Date range filter via `startDate` / `endDate`
- Pagination via `page` / `limit` from `PaginationDto` (skip + take)
- Return shape: `{ data: Transaction[], meta: { total, page, limit, totalPages } }`

### 2b. `create(userId, dto)` — full implementation

- Create the transaction record with all fields
- For EXPENSE: `prisma.account.update({ where: { id: accountId }, data: { balance: { decrement: amount } } })`
- For INCOME: `prisma.account.update({ where: { id: accountId }, data: { balance: { increment: amount } } })`
- For TRANSFER: decrement source account, increment destination account
- Use a Prisma `$transaction` to ensure atomicity
- Return created transaction with `include: { category, account, toAccount }`

### 2c. `update(id, userId, dto)` — full implementation

- Ownership check: verify transaction belongs to user, throw `NotFoundException` if not
- Store current transaction (old amount, type, accountId)
- Reverse old account balance effects
- Apply new account balance effects
- Update transaction fields
- Use `$transaction` for atomicity
- Return updated transaction with includes

### 2d. `remove(id, userId)` — add ownership + balance reversal

- Ownership check first
- Reverse account balances before deleting (reverse create logic)
- Use `$transaction` for atomicity

### 2e. `getStats(userId, query)` — aggregation implementation

- Filter by date range (startDate/endDate from query)
- Use `prisma.transaction.groupBy` by month and type
- Return: `{ totalIncome, totalExpense, netAmount, byCategory: [...], byMonth: [...] }`
- Support optional filtering by `categoryId`, `accountId`, `type`

### 2f. `findOne(id, userId)` — add ownership check

- Verify transaction belongs to current user before returning

---

## 3. Backend: Shared Package Alignment

**File:** `packages/shared/src/validation/transaction.schema.ts`

- Relax `date` field from `z.string().datetime()` to `z.string()` since HTML date inputs send `YYYY-MM-DD` (not full ISO datetime)
- Add missing `accountId` to `updateTransactionSchema` (needed for account reassignment)

---

## 4. Frontend: Entity Store

**New file:** `apps/web/src/entities/transactions/index.ts`
**New file:** `apps/web/src/entities/transactions/store.ts`

Zustand store following auth store pattern:
```typescript
interface TransactionsState {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  stats: TransactionStats | null;
  isLoading: boolean;
  error: string | null;
  meta: PaginationMeta | null;

  fetchAll: (params?: TransactionQueryParams) => Promise<void>;
  fetchOne: (id: string) => Promise<void>;
  create: (dto: CreateTransactionDto) => Promise<Transaction>;
  update: (id: string, dto: UpdateTransactionDto) => Promise<Transaction>;
  remove: (id: string) => Promise<void>;
  fetchStats: (params?: TransactionQueryParams) => Promise<void>;
  clearError: () => void;
}
```

Uses `apiClient()` from `@/shared/api/api-client` for all requests.

---

## 5. Frontend: Feature Components

**New directory:** `apps/web/src/features/transactions/ui/`

### 5a. `TransactionForm.tsx`
- Shared form component for create and edit modes
- Props: `mode: "create" | "edit"`, `initialData?: Transaction`, `onSuccess: () => void`
- Fields: amount (number input), type (radio/select with INCOME/EXPENSE/TRANSFER), description (textarea), date (date input, default today), category (select), account (select), toAccount (select, visible only for TRANSFER)
- Fetches categories and accounts from their respective stores/API
- Zod validation using shared schema from `@budget-calc/shared`
- Loading/submitting states, per-field error display
- On submit: calls store.create() or store.update(), then onSuccess

### 5b. `TransactionList.tsx`
- Table with columns: date, type (colored badge), description, category, account, amount (colored by type)
- Loading skeleton (5-8 shimmer rows)
- Empty state fallback
- Error state with retry button
- Filter bar: date range (two date inputs), type select, category select, account select
- Pagination controls (prev/next, page info)
- Click row → navigate to `/transactions/:id`

### 5c. `TransactionDetail.tsx`
- Props: `transaction: Transaction`
- Shows: type badge, formatted amount, description, date, category name, account name, source/destination for transfers
- Edit and Delete action buttons
- Edit button: opens TransactionForm in edit mode (inline or modal)
- Delete button: confirmation dialog, calls store.remove(), navigates back

---

## 6. Frontend: Page Updates

**Files to modify:**

### 6a. `app/(dashboard)/transactions/page.tsx`
- Replaces static empty state with real `TransactionList` component
- Keeps the header and "New Transaction" button
- Wraps filter card + list in Suspense boundaries

### 6b. `app/(dashboard)/transactions/new/page.tsx`
- Replaces placeholder with `TransactionForm` in create mode
- onSuccess: `router.push("/transactions")`

### 6c. `app/(dashboard)/transactions/[id]/page.tsx`
- Convert from `async` server component to client component
- Fetch transaction on mount via `useParams()` + store.fetchOne()
- Show `TransactionDetail` component
- Loading/error states
- Edit mode toggles to `TransactionForm`

---

## 7. Verification

### Backend
1. `npm run dev -w @budget-calc/api` then use `curl` or the frontend:
   - `POST /api/transactions` with body → 201, account balance updated
   - `GET /api/transactions?type=EXPENSE&page=1&limit=10` → paginated filtered list
   - `GET /api/transactions/stats?startDate=2026-01-01&endDate=2026-12-31` → aggregation data
   - `PATCH /api/transactions/:id` with amount change → balance adjusted correctly
   - `DELETE /api/transactions/:id` → balance reversed, 200/204

### Frontend
1. `npm run dev` → navigate to `/transactions`
2. Create a transaction via `/transactions/new` → redirects to list, item appears
3. Click transaction → detail page shows full info
4. Edit transaction → changes persist
5. Delete transaction → removed from list
6. Filters narrow the list correctly
7. All states (loading, empty, error) render correctly
