import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { QueryTransactionDto } from "./dto/query-transaction.dto";

/**
 * Контроллер транзакций.
 * Предоставляет CRUD- endpoints для управления транзакциями,
 * а также endpoint для получения агрегированной статистики.
 * Все маршруты защищены JWT-аутентификацией.
 */
@Controller("transactions")
export class TransactionsController {
  /**
   * @param transactionsService - Сервис для работы с транзакциями
   */
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Возвращает список транзакций с пагинацией и фильтрацией.
   *
   * @param userId - ID пользователя из JWT-токена
   * @param query - Параметры фильтрации и пагинации (startDate, endDate, categoryId, accountId, type, page, limit)
   * @returns Объект с массивом data и мета-информацией meta (total, page, limit, totalPages)
   */
  @Get()
  findAll(
    @CurrentUser("id") userId: string,
    @Query() query: QueryTransactionDto,
  ) {
    return this.transactionsService.findAll(userId, query);
  }

  /**
   * Возвращает агрегированную статистику по транзакциям.
   * Включает суммы по типам, группировку по категориям и месяцам.
   *
   * @param userId - ID пользователя из JWT-токена
   * @param query - Параметры фильтрации (startDate, endDate, categoryId, accountId, type)
   * @returns Объект со статистикой (totalIncome, totalExpense, netAmount, byCategory, byMonth)
   */
  @Get("stats")
  getStats(
    @CurrentUser("id") userId: string,
    @Query() query: QueryTransactionDto,
  ) {
    return this.transactionsService.getStats(userId, query);
  }

  /**
   * Возвращает транзакцию по ID с проверкой принадлежности пользователю.
   *
   * @param id - ID транзакции
   * @param userId - ID пользователя из JWT-токена
   * @returns Объект транзакции с категорией, счётом и целевым счётом
   * @throws NotFoundException если транзакция не найдена или не принадлежит пользователю
   */
  @Get(":id")
  findOne(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.transactionsService.findOne(id, userId);
  }

  /**
   * Создаёт новую транзакцию и обновляет балансы счетов в одной транзакции БД.
   *
   * @param userId - ID пользователя из JWT-токена
   * @param dto - Данные транзакции (amount, type, accountId, опционально description, date, categoryId, toAccountId)
   * @returns Созданная транзакция с включением связанных данных
   */
  @Post()
  create(
    @CurrentUser("id") userId: string,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(userId, dto);
  }

  /**
   * Обновляет существующую транзакцию.
   * При изменении суммы, типа или счёта корректирует балансы счетов.
   *
   * @param id - ID транзакции
   * @param userId - ID пользователя из JWT-токена
   * @param dto - Данные для обновления (опциональные поля)
   * @returns Обновлённая транзакция с включением связанных данных
   * @throws NotFoundException если транзакция не найдена
   */
  @Patch(":id")
  update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(id, userId, dto);
  }

  /**
   * Удаляет транзакцию и отменяет её влияние на балансы счетов.
   *
   * @param id - ID транзакции
   * @param userId - ID пользователя из JWT-токена
   * @throws NotFoundException если транзакция не найдена
   */
  @Delete(":id")
  remove(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.transactionsService.remove(id, userId);
  }
}
