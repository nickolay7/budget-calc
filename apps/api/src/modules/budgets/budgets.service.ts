import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

/* Inlined from @budget-calc/shared — avoids Node.js .ts resolution issue */
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

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.budget.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  }

  findOne(id: string) {
    return this.prisma.budget.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async getProgress(userId: string) {
    const budgets = await this.prisma.budget.findMany({
      where: { userId },
      include: { category: true },
    });

    const now = new Date();
    const results = await Promise.all(
      budgets.map(async (budget) => {
        const { start, end } = getPeriodDates(budget.period, now);

        const agg = await this.prisma.transaction.aggregate({
          where: {
            userId,
            categoryId: budget.categoryId,
            type: "EXPENSE",
            date: { gte: start, lte: end },
          },
          _sum: { amount: true },
        });

        const spent = Number(agg._sum.amount ?? 0);
        const budgetAmount = Number(budget.amount);

        return {
          budgetId: budget.id,
          budgetName: budget.name,
          budgetAmount,
          spent,
          remaining: Math.max(budgetAmount - spent, 0),
          percentage:
            budgetAmount > 0
              ? Math.min(Math.round((spent / budgetAmount) * 100), 100)
              : 0,
          period: budget.period,
          categoryId: budget.categoryId,
          categoryName: budget.category.name,
          categoryIcon: budget.category.icon,
          categoryColor: budget.category.color,
        };
      }),
    );

    return results;
  }

  create(_userId: string, _dto: unknown) {
    // TODO: implement
    return { message: "created" };
  }

  update(_id: string, _dto: unknown) {
    // TODO: implement
    return { message: "updated" };
  }

  remove(id: string) {
    return this.prisma.budget.delete({ where: { id } });
  }
}
