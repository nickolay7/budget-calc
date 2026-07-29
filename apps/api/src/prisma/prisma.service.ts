import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

/**
 * Сервис для работы с Prisma ORM.
 * Расширяет PrismaClient, автоматически подключаясь к базе при инициализации
 * модуля и отключаясь при завершении работы приложения.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Подключается к базе данных при инициализации модуля.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Отключается от базы данных при завершении работы приложения.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
