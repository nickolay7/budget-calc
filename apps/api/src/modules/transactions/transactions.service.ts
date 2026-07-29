import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, TransactionType } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { QueryTransactionDto } from "./dto/query-transaction.dto";

/**
 * Сервис для работы с транзакциями пользователя.
 * Предоставляет методы CRUD и агрегированной статистики.
 * При создании, обновлении и удалении транзакций автоматически корректирует
 * балансы связанных счетов в транзакциях БД.
 */
@Injectable()
export class TransactionsService {
  /**
   * @param prisma - PrismaService для работы с БД
   */
  constructor(private prisma: PrismaService) {}

  /** Стандартный набор включений для связанных данных транзакции. */
  private readonly include = {
    category: true,
    account: true,
    toAccount: true,
  };

  /**
   * Возвращает список транзакций пользователя с фильтрацией и пагинацией.
   *
   * @param userId - ID пользователя
   * @param query - Параметры фильтрации (startDate, endDate, categoryId, accountId, type) и пагинации (page, limit)
   * @returns Объект с массивами data и мета-информацией meta
   */
  async findAll(userId: string, query: QueryTransactionDto) {
    const { startDate, endDate, categoryId, accountId, type, page, limit } =
      query;

    const where: Prisma.TransactionWhereInput = { userId };

    const dateFilter: Record<string, Date> = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.lte = end;
    }
    if (Object.keys(dateFilter).length > 0) {
      where.date = dateFilter;
    }
    if (categoryId) where.categoryId = categoryId;
    if (accountId) where.accountId = accountId;
    if (type) where.type = type;

    const skip = ((page ?? 1) - 1) * (limit ?? 20);
    const take = limit ?? 20;

    const [data, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: this.include,
        orderBy: { date: "desc" },
        skip,
        take,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: page ?? 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  /**
   * Возвращает транзакцию по ID с проверкой принадлежности пользователю.
   *
   * @param id - ID транзакции
   * @param userId - ID пользователя для проверки владения
   * @returns Объект транзакции с включением связанных данных
   * @throws NotFoundException если транзакция не найдена или не принадлежит пользователю
   */
  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: this.include,
    });

    if (!transaction || transaction.userId !== userId) {
      throw new NotFoundException("Transaction not found");
    }

    return transaction;
  }

  /**
   * Создаёт новую транзакцию и обновляет балансы счетов в одной транзакции БД.
   * Для INCOME увеличивает баланс счёта, для EXPENSE уменьшает,
   * для TRANSFER уменьшает баланс источника и увеличивает баланс назначения.
   *
   * @param userId - ID пользователя
   * @param dto - Данные транзакции
   * @returns Созданная транзакция с включением связанных данных
   */
  async create(userId: string, dto: CreateTransactionDto) {
    const { accountId, toAccountId, amount, type, date, ...rest } = dto;

    return this.prisma.$transaction(async (tx) => {
      // Create the transaction record
      const transaction = await tx.transaction.create({
        data: {
          ...rest,
          amount,
          type,
          date: date ? new Date(date) : new Date(),
          accountId,
          toAccountId,
          userId,
        },
        include: this.include,
      });

      // Update account balances
      switch (type) {
        case TransactionType.INCOME:
          await tx.account.update({
            where: { id: accountId },
            data: { balance: { increment: amount } },
          });
          break;

        case TransactionType.EXPENSE:
          await tx.account.update({
            where: { id: accountId },
            data: { balance: { decrement: amount } },
          });
          break;

        case TransactionType.TRANSFER:
          await tx.account.update({
            where: { id: accountId },
            data: { balance: { decrement: amount } },
          });
          if (toAccountId) {
            await tx.account.update({
              where: { id: toAccountId },
              data: { balance: { increment: amount } },
            });
          }
          break;
      }

      return transaction;
    });
  }

  /**
   * Обновляет существующую транзакцию.
   * Если изменились сумма, тип или счёт — отменяет старые балансовые эффекты
   * и применяет новые в одной транзакции БД.
   *
   * @param id - ID транзакции
   * @param userId - ID пользователя для проверки владения
   * @param dto - Данные для обновления
   * @returns Обновлённая транзакция с включением связанных данных
   * @throws NotFoundException если транзакция не найдена
   */
  async update(id: string, userId: string, dto: UpdateTransactionDto) {
    // Verify ownership
    const existing = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      throw new NotFoundException("Transaction not found");
    }

    return this.prisma.$transaction(async (tx) => {
      // If amount, type, or accountId changed, reverse old balance effects
      // and apply new ones
      const amountChanged =
        dto.amount !== undefined && dto.amount !== Number(existing.amount);
      const typeChanged =
        dto.type !== undefined && dto.type !== existing.type;
      const accountChanged =
        dto.accountId !== undefined && dto.accountId !== existing.accountId;

      if (amountChanged || typeChanged || accountChanged) {
        // Reverse old transaction effects
        await this.reverseBalanceEffect(
          tx,
          existing.type,
          Number(existing.amount),
          existing.accountId,
          existing.toAccountId,
        );

        // Apply new effects
        const finalAmount = dto.amount ?? Number(existing.amount);
        const finalType = dto.type ?? existing.type;
        const finalAccountId = dto.accountId ?? existing.accountId;
        const finalToAccountId =
          dto.accountId && dto.accountId !== existing.accountId
            ? null
            : existing.toAccountId;

        await this.applyBalanceEffect(
          tx,
          finalType,
          finalAmount,
          finalAccountId,
          finalToAccountId,
        );
      }

      // Update transaction fields
      const transaction = await tx.transaction.update({
        where: { id },
        data: {
          ...(dto.amount !== undefined && { amount: dto.amount }),
          ...(dto.type !== undefined && { type: dto.type }),
          ...(dto.description !== undefined && { description: dto.description }),
          ...(dto.date !== undefined && { date: new Date(dto.date) }),
          ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
          ...(dto.accountId !== undefined && { accountId: dto.accountId }),
        },
        include: this.include,
      });

      return transaction;
    });
  }

  /**
   * Удаляет транзакцию и отменяет её влияние на балансы счетов.
   *
   * @param id - ID транзакции
   * @param userId - ID пользователя для проверки владения
   * @throws NotFoundException если транзакция не найдена
   */
  async remove(id: string, userId: string) {
    // Verify ownership
    const existing = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      throw new NotFoundException("Transaction not found");
    }

    await this.prisma.$transaction(async (tx) => {
      // Reverse balance effects before deleting
      await this.reverseBalanceEffect(
        tx,
        existing.type,
        Number(existing.amount),
        existing.accountId,
        existing.toAccountId,
      );

      await tx.transaction.delete({ where: { id } });
    });
  }

  /**
   * Возвращает агрегированную статистику по транзакциям пользователя.
   * Включает общие суммы доходов и расходов, группировку по категориям
   * и группировку по месяцам (через сырой SQL-запрос).
   *
   * @param userId - ID пользователя
   * @param query - Параметры фильтрации (startDate, endDate, categoryId, accountId, type)
   * @returns Объект со статистикой
   */
  async getStats(userId: string, query: QueryTransactionDto) {
    const { startDate, endDate, categoryId, accountId, type } = query;

    const where: Prisma.TransactionWhereInput = { userId };

    const dateFilter: Record<string, Date> = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.lte = end;
    }
    if (Object.keys(dateFilter).length > 0) {
      where.date = dateFilter;
    }
    if (categoryId) where.categoryId = categoryId;
    if (accountId) where.accountId = accountId;
    if (type) where.type = type;

    // Aggregate by type
    const aggregation = await this.prisma.transaction.aggregate({
      where,
      _sum: { amount: true },
      _count: true,
    });

    // Sum by type
    const incomeResult = await this.prisma.transaction.aggregate({
      where: { ...where, type: TransactionType.INCOME },
      _sum: { amount: true },
    });

    const expenseResult = await this.prisma.transaction.aggregate({
      where: { ...where, type: TransactionType.EXPENSE },
      _sum: { amount: true },
    });

    const totalIncome = Number(incomeResult._sum.amount ?? 0);
    const totalExpense = Number(expenseResult._sum.amount ?? 0);

    // By category
    const byCategory = await this.prisma.transaction.groupBy({
      by: ["categoryId"],
      where,
      _sum: { amount: true },
      _count: true,
    });

    // Fetch category names
    const categoryIds = byCategory
      .map((c) => c.categoryId)
      .filter(Boolean) as string[];
    const categories = categoryIds.length
      ? await this.prisma.category.findMany({
          where: { id: { in: categoryIds } },
          select: { id: true, name: true, icon: true, color: true },
        })
      : [];

    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    // By month (using raw date extraction)
    const byMonth = await this.prisma.$queryRaw<
      Array<{
        month: string;
        type: TransactionType;
        total: Prisma.Decimal;
        count: bigint;
      }>
    >`
      SELECT
        TO_CHAR(date, 'YYYY-MM') as month,
        type,
        SUM(amount) as total,
        COUNT(*)::int as count
      FROM "Transaction"
      WHERE "userId" = ${userId}
        ${startDate ? Prisma.sql`AND date >= ${new Date(startDate)}` : Prisma.empty}
        ${endDate ? Prisma.sql`AND date <= ${new Date(endDate)}` : Prisma.empty}
        ${categoryId ? Prisma.sql`AND "categoryId" = ${categoryId}` : Prisma.empty}
        ${accountId ? Prisma.sql`AND "accountId" = ${accountId}` : Prisma.empty}
        ${type ? Prisma.sql`AND type = ${type}` : Prisma.empty}
      GROUP BY month, type
      ORDER BY month ASC
    `;

    return {
      totalIncome,
      totalExpense,
      netAmount: totalIncome - totalExpense,
      totalTransactions: aggregation._count,
      byCategory: byCategory.map((c) => ({
        categoryId: c.categoryId,
        categoryName: c.categoryId
          ? categoryMap.get(c.categoryId)?.name ?? "Unknown"
          : "Uncategorized",
        categoryIcon: c.categoryId
          ? categoryMap.get(c.categoryId)?.icon ?? null
          : null,
        total: Number(c._sum.amount ?? 0),
        count: c._count,
      })),
      byMonth: byMonth.map((m) => ({
        month: m.month,
        type: m.type,
        total: Number(m.total),
        count: Number(m.count),
      })),
    };
  }

  // --- Private helpers ---

  /**
   * Отменяет влияние транзакции на балансы счетов (обратное действие).
   * Используется при обновлении и удалении транзакции.
   *
   * @param tx - Prisma-клиент для работы в транзакции БД
   * @param type - Тип транзакции
   * @param amount - Сумма транзакции
   * @param accountId - ID счёта
   * @param toAccountId - ID целевого счёта (для TRANSFER)
   */
  private async reverseBalanceEffect(
    tx: Prisma.TransactionClient,
    type: TransactionType,
    amount: number,
    accountId: string,
    toAccountId: string | null,
  ) {
    switch (type) {
      case TransactionType.INCOME:
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { decrement: amount } },
        });
        break;

      case TransactionType.EXPENSE:
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { increment: amount } },
        });
        break;

      case TransactionType.TRANSFER:
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { increment: amount } },
        });
        if (toAccountId) {
          await tx.account.update({
            where: { id: toAccountId },
            data: { balance: { decrement: amount } },
          });
        }
        break;
    }
  }

  /**
   * Применяет влияние транзакции на балансы счетов.
   * Используется при создании и обновлении транзакции.
   *
   * @param tx - Prisma-клиент для работы в транзакции БД
   * @param type - Тип транзакции
   * @param amount - Сумма транзакции
   * @param accountId - ID счёта
   * @param toAccountId - ID целевого счёта (для TRANSFER)
   */
  private async applyBalanceEffect(
    tx: Prisma.TransactionClient,
    type: TransactionType,
    amount: number,
    accountId: string,
    toAccountId: string | null,
  ) {
    switch (type) {
      case TransactionType.INCOME:
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { increment: amount } },
        });
        break;

      case TransactionType.EXPENSE:
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { decrement: amount } },
        });
        break;

      case TransactionType.TRANSFER:
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { decrement: amount } },
        });
        if (toAccountId) {
          await tx.account.update({
            where: { id: toAccountId },
            data: { balance: { increment: amount } },
          });
        }
        break;
    }
  }
}
