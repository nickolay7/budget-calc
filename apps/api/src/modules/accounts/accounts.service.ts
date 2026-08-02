import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";

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
   * Создаёт новый счёт для пользователя.
   *
   * Начальный баланс опционален (по умолчанию 0), валюта по умолчанию "USD"
   * задаётся на уровне схемы Prisma.
   *
   * @param userId - ID пользователя-владельца
   * @param dto - Данные нового счёта
   * @returns Созданный счёт
   */
  create(userId: string, dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: {
        name: dto.name,
        type: dto.type,
        balance: dto.balance ?? 0,
        userId,
      },
    });
  }

  /**
   * Обновляет счёт по ID.
   *
   * @param id - ID счёта
   * @param dto - Поля для обновления (все опциональны)
   * @returns Обновлённый счёт
   */
  update(id: string, dto: UpdateAccountDto) {
    return this.prisma.account.update({
      where: { id },
      data: dto,
    });
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
