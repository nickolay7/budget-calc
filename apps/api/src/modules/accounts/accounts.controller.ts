import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { AccountsService } from "./accounts.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

/**
 * Контроллер счетов.
 * Предоставляет CRUD- endpoints для управления финансовыми счетами.
 * Все маршруты защищены JWT-аутентификацией.
 */
@Controller("accounts")
export class AccountsController {
  /**
   * @param accountsService - Сервис для работы со счетами
   */
  constructor(private readonly accountsService: AccountsService) {}

  /**
   * Возвращает все счета текущего пользователя.
   *
   * @param userId - ID пользователя из JWT-токена
   * @returns Массив счетов
   */
  @Get()
  findAll(@CurrentUser("id") userId: string) {
    return this.accountsService.findAll(userId);
  }

  /**
   * Возвращает счет по ID.
   *
   * @param id - ID счета
   * @returns Объект счета или null
   */
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.accountsService.findOne(id);
  }

  /**
   * Создаёт новый счёт (заглушка — TODO).
   *
   * @param userId - ID пользователя
   * @param dto - Данные нового счёта
   * @returns Сообщение о создании
   */
  @Post()
  create(@CurrentUser("id") userId: string, @Body() dto: unknown) {
    return this.accountsService.create(userId, dto);
  }

  /**
   * Обновляет существующий счёт (заглушка — TODO).
   *
   * @param id - ID счёта
   * @param dto - Данные для обновления
   * @returns Сообщение об обновлении
   */
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: unknown) {
    return this.accountsService.update(id, dto);
  }

  /**
   * Удаляет счёт по ID.
   *
   * @param id - ID счёта
   * @returns Удалённый объект счёта
   */
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.accountsService.remove(id);
  }
}
