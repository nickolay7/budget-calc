import { Injectable, NotFoundException } from "@nestjs/common";
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
   * Возвращает счёт по его ID с проверкой владения пользователем.
   *
   * @param id - ID счёта
   * @param userId - ID пользователя для проверки владения
   * @returns Объект счёта
   * @throws NotFoundException если счёт не найден или не принадлежит пользователю
   */
  async findOne(id: string, userId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account || account.userId !== userId) {
      throw new NotFoundException("Account not found");
    }

    return account;
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
   * Обновляет счёт по ID с проверкой владения пользователем.
   *
   * @param id - ID счёта
   * @param userId - ID пользователя для проверки владения
   * @param dto - Поля для обновления (все опциональны)
   * @returns Обновлённый счёт
   * @throws NotFoundException если счёт не найден или не принадлежит пользователю
   */
  async update(id: string, userId: string, dto: UpdateAccountDto) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account || account.userId !== userId) {
      throw new NotFoundException("Account not found");
    }

    return this.prisma.account.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Удаляет счёт по ID с проверкой владения пользователем.
   *
   * @param id - ID счёта
   * @param userId - ID пользователя для проверки владения
   * @returns Удалённый объект счёта
   * @throws NotFoundException если счёт не найден или не принадлежит пользователю
   */
  async remove(id: string, userId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account || account.userId !== userId) {
      throw new NotFoundException("Account not found");
    }

    return this.prisma.account.delete({ where: { id } });
  }
}
