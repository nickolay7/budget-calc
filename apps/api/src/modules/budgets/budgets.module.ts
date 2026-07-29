import { Module } from "@nestjs/common";
import { BudgetsController } from "./budgets.controller";
import { BudgetsService } from "./budgets.service";

/**
 * Модуль бюджетов.
 * Регистрирует BudgetsController и BudgetsService для управления
 * бюджетами пользователя и отслеживания прогресса по категориям.
 */
@Module({
  controllers: [BudgetsController],
  providers: [BudgetsService],
})
export class BudgetsModule {}
