import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

/**
 * Глобальный модуль Prisma.
 * Предоставляет PrismaService как синглтон для всего приложения.
 * Экспортирует PrismaService для использования в других модулях.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
