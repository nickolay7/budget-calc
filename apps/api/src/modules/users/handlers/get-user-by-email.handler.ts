import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { GetUserByEmailQuery } from "../queries/get-user-by-email.query";
import { PrismaService } from "../../../prisma/prisma.service";

/**
 * Обработчик запроса получения пользователя по email.
 * Возвращает полные данные пользователя, включая хеш пароля.
 */
@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
  implements IQueryHandler<GetUserByEmailQuery>
{
  /**
   * @param prisma - PrismaService для работы с БД
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Выполняет поиск пользователя по email.
   *
   * @param query - Запрос с email пользователя
   * @returns Объект пользователя или null, если не найден
   */
  async execute(query: GetUserByEmailQuery) {
    return this.prisma.user.findUnique({ where: { email: query.email } });
  }
}
