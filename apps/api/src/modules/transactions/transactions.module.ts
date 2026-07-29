import { Module } from "@nestjs/common";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";

/**
 * Модуль транзакций.
 * Регистрирует TransactionsController и TransactionsService для управления
 * финансовыми транзакциями и получения статистики.
 */
@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
