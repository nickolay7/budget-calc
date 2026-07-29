import { Controller, Get, Patch, Body } from "@nestjs/common";
import { QueryBus, CommandBus } from "@nestjs/cqrs";
import { GetUserByIdQuery } from "./queries/get-user-by-id.query";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";

/**
 * Контроллер пользователей.
 * Предоставляет endpoints для получения и обновления профиля текущего пользователя.
 * Все маршруты защищены JWT-аутентификацией.
 */
@Controller("users")
export class UsersController {
  /**
   * @param queryBus - Шина запросов CQRS для получения данных
   * @param commandBus - Шина команд CQRS (зарезервировано для обновления)
   */
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * Возвращает профиль текущего аутентифицированного пользователя.
   *
   * @param userId - ID пользователя из JWT-токена (через @CurrentUser("id"))
   * @returns Объект пользователя (id, email, name, createdAt)
   */
  @Get("me")
  getProfile(@CurrentUser("id") userId: string) {
    return this.queryBus.execute(new GetUserByIdQuery(userId));
  }

  /**
   * Обновляет профиль текущего пользователя.
   * В текущей реализации возвращает профиль без изменений (TODO).
   *
   * @param userId - ID пользователя из JWT-токена
   * @param _dto - Данные для обновления профиля
   * @returns Объект пользователя
   */
  @Patch("me")
  updateProfile(
    @CurrentUser("id") userId: string,
    @Body() _dto: UpdateUserDto,
  ) {
    // TODO: implement update via CQRS command
    return this.queryBus.execute(new GetUserByIdQuery(userId));
  }
}
