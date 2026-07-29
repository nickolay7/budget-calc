import { Module } from "@nestjs/common";
import { AccountsController } from "./accounts.controller";
import { AccountsService } from "./accounts.service";

/**
 * Модуль счетов (Accounts).
 * Регистрирует AccountsController и AccountsService для управления
 * финансовыми счетами пользователя.
 */
@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
