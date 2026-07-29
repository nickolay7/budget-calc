import { NotFoundException } from "@nestjs/common";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetCategoryByIdQuery } from "../queries/get-category-by-id.query";
import { PrismaService } from "../../../prisma/prisma.service";

/**
 * Обработчик запроса получения категории по ID.
 * Возвращает категорию с последними 10 транзакциями.
 */
@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdHandler implements IQueryHandler<GetCategoryByIdQuery> {
  /**
   * @param prisma - PrismaService для работы с БД
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Выполняет поиск категории по ID с проверкой владельца.
   *
   * @param query - Запрос с id и userId
   * @returns Категория с последними 10 транзакциями
   * @throws NotFoundException если категория не найдена
   */
  async execute(query: GetCategoryByIdQuery) {
    const category = await this.prisma.category.findFirst({
      where: { id: query.id, userId: query.userId },
      include: { transactions: { take: 10, orderBy: { date: "desc" } } },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }
}
