import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetCategoriesQuery } from "../queries/get-categories.query";
import { PrismaService } from "../../../prisma/prisma.service";

/**
 * Обработчик запроса получения всех категорий пользователя.
 * Возвращает категории, отсортированные по имени по возрастанию.
 */
@QueryHandler(GetCategoriesQuery)
export class GetCategoriesHandler implements IQueryHandler<GetCategoriesQuery> {
  /**
   * @param prisma - PrismaService для работы с БД
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Выполняет получение категорий пользователя.
   *
   * @param query - Запрос с userId
   * @returns Массив категорий, отсортированных по имени
   */
  async execute(query: GetCategoriesQuery) {
    return this.prisma.category.findMany({
      where: { userId: query.userId },
      orderBy: { name: "asc" },
    });
  }
}
