import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { QueryBus, CommandBus } from "@nestjs/cqrs";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { GetCategoriesQuery } from "./queries/get-categories.query";
import { GetCategoryByIdQuery } from "./queries/get-category-by-id.query";
import { CreateCategoryCommand } from "./commands/create-category.command";
import { UpdateCategoryCommand } from "./commands/update-category.command";
import { DeleteCategoryCommand } from "./commands/delete-category.command";

/**
 * Контроллер категорий.
 * Предоставляет CRUD- endpoints для управления категориями.
 * Все маршруты защищены JWT-аутентификацией, используют CQRS.
 */
@Controller("categories")
export class CategoriesController {
  /**
   * @param queryBus - Шина запросов CQRS
   * @param commandBus - Шина команд CQRS
   */
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * Возвращает все категории текущего пользователя, отсортированные по имени.
   *
   * @param userId - ID пользователя из JWT-токена
   * @returns Массив категорий
   */
  @Get()
  findAll(@CurrentUser("id") userId: string) {
    return this.queryBus.execute(new GetCategoriesQuery(userId));
  }

  /**
   * Возвращает категорию по ID с последними 10 транзакциями.
   *
   * @param id - ID категории
   * @param userId - ID пользователя из JWT-токена
   * @returns Объект категории с транзакциями
   * @throws NotFoundException если категория не найдена
   */
  @Get(":id")
  findOne(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.queryBus.execute(new GetCategoryByIdQuery(id, userId));
  }

  /**
   * Создаёт новую категорию.
   *
   * @param userId - ID пользователя из JWT-токена
   * @param dto - Данные новой категории (name, опционально icon, color)
   * @returns Созданная категория
   */
  @Post()
  create(@CurrentUser("id") userId: string, @Body() dto: CreateCategoryDto) {
    return this.commandBus.execute(
      new CreateCategoryCommand(userId, dto.name, dto.icon, dto.color),
    );
  }

  /**
   * Обновляет существующую категорию.
   *
   * @param id - ID категории
   * @param userId - ID пользователя из JWT-токена
   * @param dto - Данные для обновления (опциональные name, icon, color)
   * @returns Обновлённая категория
   * @throws NotFoundException если категория не найдена
   */
  @Patch(":id")
  update(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.commandBus.execute(
      new UpdateCategoryCommand(id, userId, dto.name, dto.icon, dto.color),
    );
  }

  /**
   * Удаляет категорию по ID (только если она принадлежит текущему пользователю).
   *
   * @param id - ID категории
   * @param userId - ID пользователя из JWT-токена
   * @throws NotFoundException если категория не найдена
   */
  @Delete(":id")
  remove(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.commandBus.execute(new DeleteCategoryCommand(id, userId));
  }
}
