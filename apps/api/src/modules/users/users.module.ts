import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UsersController } from "./users.controller";
import { CreateUserHandler } from "./handlers/create-user.handler";
import { GetUserByEmailHandler } from "./handlers/get-user-by-email.handler";
import { GetUserByIdHandler } from "./handlers/get-user-by-id.handler";

/**
 * Модуль пользователей (CQRS).
 * Регистрирует UsersController и обработчики команд/запросов
 * для создания пользователей и получения профиля.
 */
@Module({
  imports: [CqrsModule],
  controllers: [UsersController],
  providers: [CreateUserHandler, GetUserByEmailHandler, GetUserByIdHandler],
})
export class UsersModule {}
