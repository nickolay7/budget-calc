import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetUserByIdQuery } from "../queries/get-user-by-id.query";
import { PrismaService } from "../../../prisma/prisma.service";

/**
 * Обработчик запроса получения пользователя по ID.
 * Возвращает публичные данные (id, email, name, createdAt) без пароля.
 */
@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  /**
   * @param prisma - PrismaService для работы с БД
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Выполняет поиск пользователя по ID.
   *
   * @param query - Запрос с id пользователя
   * @returns Объект пользователя (id, email, name, createdAt) или null
   */
  async execute(query: GetUserByIdQuery) {
    return this.prisma.user.findUnique({
      where: { id: query.id },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }
}
