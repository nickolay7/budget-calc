import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

/**
 * Точка входа в приложение NestJS.
 * Создаёт экземпляр приложения, настраивает CORS, глобальный префикс "api"
 * и ValidationPipe с whitelist/transform/forbidNonWhitelisted.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3001);
}

bootstrap();
