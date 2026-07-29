import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

/**
 * Встроенная копия утилиты из @budget-calc/shared — избегает проблем
 * с разрешением .ts-файлов в среде выполнения Node.js.
 * Возвращает даты начала и конца периода относительно указанной даты.
 *
 * @param period - Тип периода: "MONTHLY", "WEEKLY", "YEARLY"
 * @param reference - Опорная дата (по умолчанию текущая)
 * @returns Объект с полями start и end
 */
function getPeriodDates(period: string, reference?: Date) {
  const now = reference ?? new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  switch (period) {
    case "MONTHLY":
      return {
        start: new Date(year, month, 1),
        end: new Date(year, month + 1, 0),
      };
    case "WEEKLY": {
      const dayOfWeek = now.getDay();
      const start = new Date(now);
      start.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return { start, end };
    }
    case "YEARLY":
      return {
        start: new Date(year, 0, 1),
        end: new Date(year, 11, 31),
      };
    default:
      return { start: new Date(0), end: new Date() };
  }
}

/**
 * Сервис для работы с бюджетами пользователя.
 * Предоставляет методы CRUD и расчёт прогресса (фактические расходы vs бюджет).
 */
@Injectable()
export class BudgetsService {
  /**
   * @param prisma - PrismaService для работы с БД
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Возвращает все бюджеты пользователя с включением категории,
   * отсортированные по дате создания (сначала новые).
   *
   * @param userId - ID пользователя
   * @returns Массив бюджетов с категориями
   */
  findAll(userId: string) {
    return this.prisma.budget.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Возвращает бюджет по ID с включением категории.
   *
   * @param id - ID бюджета
   * @returns Объект бюджета с категорией или null
   */
  findOne(id: string) {
    return this.prisma.budget.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  /**
   * Рассчитывает прогресс по всем бюджетам пользователя.
   * Группирует бюджеты по периодам для минимизации запросов к БД,
   * вычисляет сумму расходов по каждой категории за соответствующий период.
   *
   * @param userId - ID пользователя
   * @returns Массив объектов с прогрессом по каждому бюджету
   */
  async getProgress(userId: string) {
    const budgets = await this.prisma.budget.findMany({
      where: { userId },
      include: { category: true },
    });

    // Group budgets by period so we run at most 3 aggregate queries
    // instead of one per budget (N+1 → ~4 total queries)
    const byPeriod = new Map<string, typeof budgets>();
    for (const b of budgets) {
      const group = byPeriod.get(b.period) ?? [];
      group.push(b);
      byPeriod.set(b.period, group);
    }

    const now = new Date();
    const periodAggs = await Promise.all(
      Array.from(byPeriod.entries()).map(async ([period, group]) => {
        const { start, end } = getPeriodDates(period, now);
        const categoryIds = group.map((b) => b.categoryId);

        const rows = await this.prisma.transaction.groupBy({
          by: ["categoryId"],
          where: {
            userId,
            categoryId: { in: categoryIds },
            type: "EXPENSE",
            date: { gte: start, lte: end },
          },
          _sum: { amount: true },
        });

        const spentByCategory = new Map(
          rows.map((r) => [r.categoryId, Number(r._sum.amount ?? 0)]),
        );

        return group.map((budget) => {
          const spent = spentByCategory.get(budget.categoryId) ?? 0;
          const budgetAmount = Number(budget.amount);

          return {
            budgetId: budget.id,
            budgetName: budget.name,
            budgetAmount,
            spent,
            remaining: Math.max(budgetAmount - spent, 0),
            percentage:
              budgetAmount > 0
                ? Math.round((spent / budgetAmount) * 100)
                : 0,
            period: budget.period,
            categoryId: budget.categoryId,
            categoryName: budget.category.name,
            categoryIcon: budget.category.icon,
            categoryColor: budget.category.color,
          };
        });
      }),
    );

    return periodAggs.flat();
  }

  /**
   * Создаёт новый бюджет (заглушка — TODO).
   *
   * @param _userId - ID пользователя (не используется)
   * @param _dto - Данные нового бюджета (не используются)
   * @returns Сообщение о создании
   */
  create(_userId: string, _dto: unknown) {
    // TODO: implement
    return { message: "created" };
  }

  /**
   * Обновляет существующий бюджет (заглушка — TODO).
   *
   * @param _id - ID бюджета (не используется)
   * @param _dto - Данные для обновления (не используются)
   * @returns Сообщение об обновлении
   */
  update(_id: string, _dto: unknown) {
    // TODO: implement
    return { message: "updated" };
  }

  /**
   * Удаляет бюджет по ID.
   *
   * @param id - ID бюджета
   * @returns Удалённый объект бюджета
   */
  remove(id: string) {
    return this.prisma.budget.delete({ where: { id } });
  }
}
