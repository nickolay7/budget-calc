import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";

/**
 * Модуль конфигурации. Оборачивает Nest ConfigModule и загружает
 * переменные окружения из файла .env глобально для всего приложения.
 */
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
  ],
})
export class ConfigModule {}
