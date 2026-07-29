import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { BudgetsService } from "./budgets.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

/**
 * Контроллер бюджетов.
 * Предоставляет CRUD- endpoints для управления бюджетами,
 * а также endpoint для получения прогресса по категориям.
 * Все маршруты защищены JWT-аутентификацией.
 */
@Controller("budgets")
export class BudgetsController {
  /**
   * @param budgetsService - Сервис для работы с бюджетами
   */
  constructor(private readonly budgetsService: BudgetsService) {}

  /**
   * Возвращает все бюджеты текущего пользователя с включением категории.
   *
   * @param userId - ID пользователя из JWT-токена
   * @returns Массив бюджетов
   */
  @Get()
  findAll(@CurrentUser("id") userId: string) {
    return this.budgetsService.findAll(userId);
  }

  /**
   * Возвращает прогресс по всем бюджетам (фактические расходы vs запланированные суммы).
   *
   * @param userId - ID пользователя из JWT-токена
   * @returns Массив объектов с прогрессом по каждому бюджету
   */
  @Get("progress")
  getProgress(@CurrentUser("id") userId: string) {
    return this.budgetsService.getProgress(userId);
  }

  /**
   * Возвращает бюджет по ID.
   *
   * @param id - ID бюджета
   * @returns Объект бюджета с категорией или null
   */
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.budgetsService.findOne(id);
  }

  /**
   * Создаёт новый бюджет (заглушка — TODO).
   *
   * @param userId - ID пользователя
   * @param dto - Данные нового бюджета
   * @returns Сообщение о создании
   */
  @Post()
  create(@CurrentUser("id") userId: string, @Body() dto: unknown) {
    return this.budgetsService.create(userId, dto);
  }

  /**
   * Обновляет существующий бюджет (заглушка — TODO).
   *
   * @param id - ID бюджета
   * @param dto - Данные для обновления
   * @returns Сообщение об обновлении
   */
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: unknown) {
    return this.budgetsService.update(id, dto);
  }

  /**
   * Удаляет бюджет по ID.
   *
   * @param id - ID бюджета
   * @returns Удалённый объект бюджета
   */
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.budgetsService.remove(id);
  }
}
