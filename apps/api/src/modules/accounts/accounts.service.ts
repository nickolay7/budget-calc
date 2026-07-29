import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

/**
 * Сервис для работы со счетами пользователя.
 * Предоставляет методы CRUD для финансовых счетов.
 */
@Injectable()
export class AccountsService {
  /**
   * @param prisma - PrismaService для работы с БД
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Возвращает все счета пользователя, отсортированные по дате создания (сначала новые).
   *
   * @param userId - ID пользователя
   * @returns Массив счетов
   */
  findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Возвращает счёт по его ID.
   *
   * @param id - ID счёта
   * @returns Объект счёта или null, если не найден
   */
  findOne(id: string) {
    return this.prisma.account.findUnique({ where: { id } });
  }

  /**
   * Создаёт новый счёт (заглушка — TODO).
   *
   * @param _userId - ID пользователя (не используется)
   * @param _dto - Данные нового счёта (не используются)
   * @returns Сообщение о создании
   */
  create(_userId: string, _dto: unknown) {
    // TODO: implement
    return { message: "created" };
  }

  /**
   * Обновляет существующий счёт (заглушка — TODO).
   *
   * @param _id - ID счёта (не используется)
   * @param _dto - Данные для обновления (не используются)
   * @returns Сообщение об обновлении
   */
  update(_id: string, _dto: unknown) {
    // TODO: implement
    return { message: "updated" };
  }

  /**
   * Удаляет счёт по ID.
   *
   * @param id - ID счёта
   * @returns Удалённый объект счёта
   */
  remove(id: string) {
    return this.prisma.account.delete({ where: { id } });
  }
}
